variable "aws_region" {
  type        = string
  description = "Região da AWS"
  default     = "us-east-2" # Substitua pela região desejada
}

variable "vpc_id" {
    type = string
    description = "ID da VPC"
    default = "vpc-0f1a6cf4187afb3ce"
}

variable "subnet_id" {
    type = string
    description = "ID da subrede privada"
    default = "subnet-0e3acb9b437b7b2fa"
}

variable "operating_system_family" {
    type = string
    description = "Sistma operacional da instância Fargate"
    default = "LINUX"
}

variable "cpu_architecture" {
    type = string
    description = "Arquitetura computacional da instância Fargate"
    default = "X86_64"
}

variable "aws_ecs_cluster_name" {
    type = string
    description = "Nome do cluster ECS"
    default = "conversafina-cluster"
}

variable "aws_ecs_service_name" {
    type = string
    description = "Nome do servico ECS"
    default = "conversafina-service"
}

variable "aws_ec2_instance_id" {
    type = string
    description = "Id da instância EC2"
    default = "i-01f7966513a387a9e"
}