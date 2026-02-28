import * as ecs from '@aws-sdk/client-ecs';
import { EC2Client, StartInstancesCommand, StopInstancesCommand, DescribeInstancesCommand } from "@aws-sdk/client-ec2";

const ECSClient = ecs.ECSClient;
const UpdateServiceCommand = ecs.UpdateServiceCommand;
const DescribeServicesCommand = ecs.DescribeServicesCommand;

const ec2Client = new EC2Client({ region: 'us-east-2' });

async function getEc2State(instanceId) {
  const res = await ec2Client.send(new DescribeInstancesCommand({ InstanceIds: [instanceId] }));
  return res.Reservations[0].Instances[0].State.Name;
}

async function waitForState(instanceId, targetState, maxWaitMs = 25000) {
  const start = Date.now();
  while (Date.now() - start < maxWaitMs) {
    const state = await getEc2State(instanceId);
    if (state === targetState) return state;
    await new Promise(r => setTimeout(r, 3000));
  }
  return await getEc2State(instanceId);
}

export async function handler(event) {
  const { httpMethod } = event;
  const { ECS_CLUSTER, ECS_SERVICE, EC2_INSTANCE_ID } = process.env;

  if (httpMethod === 'POST') {
    const result = await startServices(ECS_CLUSTER, ECS_SERVICE, EC2_INSTANCE_ID);
    return { statusCode: 200, body: JSON.stringify(result) };
  } else if (httpMethod === 'DELETE') {
    const result = await stopServices(ECS_CLUSTER, ECS_SERVICE, EC2_INSTANCE_ID);
    return { statusCode: 200, body: JSON.stringify(result) };
  } else if (httpMethod === 'GET') {
    const result = await getStatus(ECS_CLUSTER, ECS_SERVICE, EC2_INSTANCE_ID);
    return { statusCode: 200, body: JSON.stringify(result) };
  } else {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Metodo HTTP nao permitido. Use POST (ligar), DELETE (desligar) ou GET (status).' }),
    };
  }
}

async function startServices(ECS_CLUSTER, ECS_SERVICE, EC2_INSTANCE_ID) {
  const ecsClient = new ECSClient({ region: 'us-east-2' });
  const ec2State = await getEc2State(EC2_INSTANCE_ID);

  if (ec2State === 'running') {
    const svc = await ecsClient.send(new DescribeServicesCommand({ cluster: ECS_CLUSTER, services: [ECS_SERVICE] }));
    const desired = svc.services[0].desiredCount;
    if (desired >= 1) {
      return { message: 'Tudo ja esta ligado!' };
    }
    await ecsClient.send(new UpdateServiceCommand({ cluster: ECS_CLUSTER, service: ECS_SERVICE, desiredCount: 1 }));
    return { message: 'EC2 ja estava ligada. ECS iniciado.' };
  }

  if (ec2State === 'stopping') {
    await waitForState(EC2_INSTANCE_ID, 'stopped');
  }

  const finalState = await getEc2State(EC2_INSTANCE_ID);
  if (finalState !== 'stopped') {
    return { message: `EC2 em estado inesperado: ${finalState}. Tente novamente em alguns segundos.` };
  }

  await ecsClient.send(new UpdateServiceCommand({ cluster: ECS_CLUSTER, service: ECS_SERVICE, desiredCount: 1 }));
  await ec2Client.send(new StartInstancesCommand({ InstanceIds: [EC2_INSTANCE_ID] }));

  return { message: 'Servicos iniciados com sucesso! Aguarde 2-4 minutos para ficar online.' };
}

async function stopServices(ECS_CLUSTER, ECS_SERVICE, EC2_INSTANCE_ID) {
  const ecsClient = new ECSClient({ region: 'us-east-2' });

  await ecsClient.send(new UpdateServiceCommand({ cluster: ECS_CLUSTER, service: ECS_SERVICE, desiredCount: 0 }));

  const ec2State = await getEc2State(EC2_INSTANCE_ID);
  if (ec2State === 'stopped') {
    return { message: 'ECS parado. EC2 ja estava desligada.' };
  }
  if (ec2State === 'running' || ec2State === 'pending') {
    await ec2Client.send(new StopInstancesCommand({ InstanceIds: [EC2_INSTANCE_ID] }));
  }

  return { message: 'Servicos parados com sucesso!' };
}

async function getStatus(ECS_CLUSTER, ECS_SERVICE, EC2_INSTANCE_ID) {
  const ecsClient = new ECSClient({ region: 'us-east-2' });
  const ec2State = await getEc2State(EC2_INSTANCE_ID);
  const svc = await ecsClient.send(new DescribeServicesCommand({ cluster: ECS_CLUSTER, services: [ECS_SERVICE] }));
  const desired = svc.services[0].desiredCount;
  const running = svc.services[0].runningCount;

  return {
    ec2: ec2State,
    ecs: { desired, running },
    online: ec2State === 'running' && running >= 1,
  };
}