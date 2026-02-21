data "aws_ecr_repository" "conversafina-backend" {
  name = "conversafina-backend"
}

data "aws_ecr_image" "conversafina-backend" {
  repository_name = data.aws_ecr_repository.conversafina-backend.name
  image_tag       = "1.0.0"
}

data "aws_ecr_repository" "conversafina-frontend" {
  name = "conversafina-frontend"
}

data "aws_ecr_image" "conversafina-frontend" {
  repository_name = data.aws_ecr_repository.conversafina-frontend.name
  image_tag       = "1.0.0"
}

data "aws_ecr_repository" "conversafina-nginx" {
  name = "conversafina-nginx"
}

data "aws_ecr_image" "conversafina-nginx" {
  repository_name = data.aws_ecr_repository.conversafina-nginx.name
  image_tag       = "1.0.0"
}

resource "aws_iam_policy" "conversafina" {
  name        = "conversafina-task-execution-policy"
  description = "Política de execução de tarefa para o ECS"

  policy      = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "ecr:GetAuthorizationToken",
          "ecr:BatchCheckLayerAvailability",
          "ecr:GetDownloadUrlForLayer",
          "ecr:BatchGetImage",
          "logs:CreateLogStream",
          "logs:CreateLogGroup",
          "logs:PutLogEvents"
        ]
        Resource = "*"
        Effect    = "Allow"
      }
    ]
  })
}

resource "aws_iam_role" "conversafina" {
  name        = "conversafina-task-execution-role"
  description = "Função de execução de tarefa para o ECS"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
        Effect = "Allow"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "conversafina" {
  role       = aws_iam_role.conversafina.name
  policy_arn = aws_iam_policy.conversafina.arn
}

resource "aws_ecs_task_definition" "conversafina" {
  family = "conversafina-task-definition"
  execution_role_arn = aws_iam_role.conversafina.arn
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  memory                   = "3072"
  cpu                      = "1024"
  runtime_platform {
    operating_system_family = var.operating_system_family
    cpu_architecture        = var.cpu_architecture
  }
  container_definitions = jsonencode([
    {
      name      = "conversafina-nginx"
      image     = data.aws_ecr_image.conversafina-nginx.image_uri
      cpu       = 341
      memory    = 1024
      essential = true
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-group         = "/ecs/conversafina-nginx"
          awslogs-stream-prefix = "ecs"
          awslogs-region        = "us-east-2"
          awslogs-create-group  = "true"
          mode                  = "non-blocking"
          max-buffer-size       = "25m" 
        }
      }
      portMappings = [
        {
          containerPort = 80
          hostPort      = 80
          protocol      = "tcp"
        },
        {
          containerPort = 443
          hostPort      = 443
          protocol      = "tcp"
        }
      ]
    },
    {
      name      = "conversafina-backend"
      image     = data.aws_ecr_image.conversafina-backend.image_uri
      cpu       = 341
      memory    = 1024
      essential = true
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-group         = "/ecs/conversafina-backend"
          awslogs-stream-prefix = "ecs"
          awslogs-region        = "us-east-2"
          awslogs-create-group  = "true"
          mode                  = "non-blocking"
          max-buffer-size       = "25m" 
        }
      }
      portMappings = [
        {
          containerPort = 8081
          hostPort      = 8081
          protocol      = "tcp"
        }
      ]
      healthCheck = {
        command     = ["CMD-SHELL", "wget -qO- http://localhost:8081/health || exit 1"]
        interval    = 30
        timeout     = 5
        retries     = 3
        startPeriod = 60
      }
    },
    {
      name      = "conversafina-frontend"
      image     = data.aws_ecr_image.conversafina-frontend.image_uri
      cpu       = 341
      memory    = 1024
      essential = true
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-group         = "/ecs/conversafina-frontend"
          awslogs-stream-prefix = "ecs"
          awslogs-region        = "us-east-2"
          awslogs-create-group  = "true"
          mode                  = "non-blocking"
          max-buffer-size       = "25m" 
        }
      }
      portMappings = [
        {
          containerPort = 8080
          hostPort      = 8080
          protocol      = "tcp"
        }
      ]
    }
  ])
}

resource "aws_ecs_cluster" "conversafina" {
  name = var.aws_ecs_cluster_name
}

data "aws_vpc" "conversafina" {
  id = var.vpc_id
}

data "aws_subnet" "conversafina" {
  id = var.subnet_id
}

resource "aws_security_group" "conversafina" {
  name        = "conversafina-sg"
  description = "Security group para o cluster conversafina"
  vpc_id      = data.aws_vpc.conversafina.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 8081
    to_port     = 8081
    protocol    = "tcp"
    cidr_blocks = [data.aws_subnet.conversafina.cidr_block]
  }

  ingress {
    from_port   = 8080
    to_port     = 8080
    protocol    = "tcp"
    cidr_blocks = [data.aws_subnet.conversafina.cidr_block]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_ecs_service" "conversafina" {
  name                 = var.aws_ecs_service_name
  cluster              = aws_ecs_cluster.conversafina.name
  task_definition      = aws_ecs_task_definition.conversafina.arn
  desired_count        = 1
  launch_type          = "FARGATE"
  force_new_deployment = true
  network_configuration {
    security_groups = [aws_security_group.conversafina.id]
    subnets         = [data.aws_subnet.conversafina.id]
    assign_public_ip = true
  }
}