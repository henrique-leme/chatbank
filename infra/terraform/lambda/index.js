import * as ecs from '@aws-sdk/client-ecs';
import { EC2Client, StartInstancesCommand, StopInstancesCommand } from "@aws-sdk/client-ec2";

const ECSClient = ecs.ECSClient;
const UpdateServiceCommand = ecs.UpdateServiceCommand;

const ec2Client = new EC2Client({ region: 'us-east-2' });

export async function handler(event) {
  const { httpMethod } = event;
  const { ECS_CLUSTER, ECS_SERVICE, EC2_INSTANCE_ID } = process.env;

  if (httpMethod === 'POST') {
    // Iniciar serviços
    await startServices(ECS_CLUSTER, ECS_SERVICE, EC2_INSTANCE_ID);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Serviços iniciados com sucesso!' }),
    };
  } else if (httpMethod === 'DELETE') {
    // Parar serviços
    await stopServices(ECS_CLUSTER, ECS_SERVICE, EC2_INSTANCE_ID);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Serviços parados com sucesso!' }),
    };
  } else {
  /**
   * Start services
   * @param {string} ECS_CLUSTER - The name of ECS cluster
   * @param {string} ECS_SERVICE - The name of ECS service
   * @param {string} EC2_INSTANCE_ID - The ID of EC2 instance
   * @returns {Promise<void>}
   */
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Método HTTP não permitido' }),
    };
  }
}

async function startServices(ECS_CLUSTER, ECS_SERVICE, EC2_INSTANCE_ID) {
  const ecsClient = new ECSClient({ region: 'us-east-2' });

  await ecsClient.send(new UpdateServiceCommand({
    cluster: ECS_CLUSTER,
    service: ECS_SERVICE,
    desiredCount: 1,
  }));

  await ec2Client.send(new StartInstancesCommand({
    InstanceIds: [EC2_INSTANCE_ID],
  }));
}

async function stopServices(ECS_CLUSTER, ECS_SERVICE, EC2_INSTANCE_ID) {
  const ecsClient = new ECSClient({ region: 'us-east-2' });

  await ecsClient.send(new UpdateServiceCommand({
    cluster: ECS_CLUSTER,
    service: ECS_SERVICE,
    desiredCount: 0,
  }));

  await ec2Client.send(new StopInstancesCommand({
    InstanceIds: [EC2_INSTANCE_ID],
  }));
}