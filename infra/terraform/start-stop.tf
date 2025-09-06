data "aws_region" "current" {}

# Criação do papel de execução da Lambda
resource "aws_iam_role" "lambda_exec" {
  name        = "lambda-exec-role"
  description = "Papel de execução da Lambda"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
        Effect = "Allow"
      }
    ]
  })
}

# Criação da política de execução da Lambda
resource "aws_iam_policy" "lambda_exec_policy" {
  name        = "lambda-exec-policy"
  description = "Política de execução da Lambda"

  policy      = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents",
          "ecs:*",
          "ec2:*",
        ]
        Resource = "*"
        Effect    = "Allow"
      }
    ]
  })
}

# Anexação da política à função de execução da Lambda
resource "aws_iam_role_policy_attachment" "lambda_exec_attach" {
  role       = aws_iam_role.lambda_exec.name
  policy_arn = aws_iam_policy.lambda_exec_policy.arn
}

# Instalação das dependências
resource "null_resource" "install_dependencies" {
  provisioner "local-exec" {
    command = "npm install"
    working_dir = "${path.module}/lambda"
  }
}

# Criação do arquivo zip com o código da Lambda
data "archive_file" "lambda_code" {
  type        = "zip"
  source_dir  = "${path.module}/lambda"
  output_path = "${path.module}/lambda_function.zip"
}

# Criação da função Lambda
resource "aws_lambda_function" "start_stop_services" {
  filename      = "lambda_function.zip"
  function_name = "start-stop-services"
  handler       = "index.handler"
  runtime       = "nodejs22.x"
  role          = aws_iam_role.lambda_exec.arn
  environment {
    variables = {
      ECS_CLUSTER = var.aws_ecs_cluster_name
      ECS_SERVICE = var.aws_ecs_service_name
      EC2_INSTANCE_ID = var.aws_ec2_instance_id
    }
  }
  source_code_hash = filebase64sha256("lambda_function.zip")
}

# Criação do API Gateway
resource "aws_api_gateway_rest_api" "start_stop_services_api" {
  name        = "start-stop-services-api"
  description = "API para iniciar e parar serviços"
}

# Criação do recurso do API Gateway
resource "aws_api_gateway_resource" "start_stop_services_resource" {
  rest_api_id = aws_api_gateway_rest_api.start_stop_services_api.id
  parent_id   = aws_api_gateway_rest_api.start_stop_services_api.root_resource_id
  path_part   = "start-stop-services"
}

# Criação do método do API Gateway para iniciar serviços
resource "aws_api_gateway_method" "start_services_method" {
  rest_api_id = aws_api_gateway_rest_api.start_stop_services_api.id
  resource_id = aws_api_gateway_resource.start_stop_services_resource.id
  http_method = "POST"
  authorization = "NONE"
}

# Criação do método do API Gateway para parar serviços
resource "aws_api_gateway_method" "stop_services_method" {
  rest_api_id = aws_api_gateway_rest_api.start_stop_services_api.id
  resource_id = aws_api_gateway_resource.start_stop_services_resource.id
  http_method = "DELETE"
  authorization = "NONE"
}

# Criação da integração da Lambda com o API Gateway
resource "aws_api_gateway_integration" "start_services_integration" {
  rest_api_id = aws_api_gateway_rest_api.start_stop_services_api.id
  resource_id = aws_api_gateway_resource.start_stop_services_resource.id
  http_method = aws_api_gateway_method.start_services_method.http_method
  integration_http_method = "POST"
  type        = "AWS_PROXY"
  uri         = "arn:aws:apigateway:${data.aws_region.current.name}:lambda:path/2015-03-31/functions/${aws_lambda_function.start_stop_services.arn}/invocations"
  request_templates = {
    "application/json" = <<EOF
{
  "statusCode": 200
}
EOF
  }
}

resource "aws_api_gateway_integration" "stop_services_integration" {
  rest_api_id = aws_api_gateway_rest_api.start_stop_services_api.id
  resource_id = aws_api_gateway_resource.start_stop_services_resource.id
  http_method = aws_api_gateway_method.stop_services_method.http_method
  integration_http_method = "DELETE"
  type        = "AWS_PROXY"
  uri         = "arn:aws:apigateway:${data.aws_region.current.name}:lambda:path/2015-03-31/functions/${aws_lambda_function.start_stop_services.arn}/invocations"
  request_templates = {
    "application/json" = <<EOF
{
  "statusCode": 200
}
EOF
  }
}

# Criação da resposta da integração da Lambda com o API Gateway
resource "aws_api_gateway_integration_response" "start_services_integration_response" {
  rest_api_id = aws_api_gateway_rest_api.start_stop_services_api.id
  resource_id = aws_api_gateway_resource.start_stop_services_resource.id
  http_method = aws_api_gateway_method.start_services_method.http_method
  status_code = 200
  depends_on = [aws_api_gateway_integration.start_services_integration] 
}

resource "aws_api_gateway_integration_response" "stop_services_integration_response" {
  rest_api_id = aws_api_gateway_rest_api.start_stop_services_api.id
  resource_id = aws_api_gateway_resource.start_stop_services_resource.id
  http_method = aws_api_gateway_method.stop_services_method.http_method
  status_code = 200
  depends_on = [aws_api_gateway_integration.stop_services_integration]
}

# Criação do deploy da API Gateway
resource "aws_api_gateway_deployment" "start_stop_services_deployment" {
  depends_on = [aws_api_gateway_integration.start_services_integration, aws_api_gateway_integration.stop_services_integration]
  rest_api_id = aws_api_gateway_rest_api.start_stop_services_api.id
}



# Criação do stage da API Gateway
resource "aws_api_gateway_stage" "start_stop_services_stage" {
  stage_name    = "prod"
  rest_api_id   = aws_api_gateway_rest_api.start_stop_services_api.id
  deployment_id = aws_api_gateway_deployment.start_stop_services_deployment.id
  # access_log_settings {
  #   destination_arn = aws_cloudwatch_log_group.start_stop_services_stage.arn
  #   format          = "$context.identity.sourceIp - - [$context.requestTime] \"$context.httpMethod $context.resourcePath $context.protocol\" $context.status $context.responseLength $context.requestId"
  # }
}

# resource "aws_cloudwatch_log_group" "start_stop_services_stage" {
#   name              = "api-gateway-logs"
#   retention_in_days = 1
# }

# Criação da permissão para o API Gateway
resource "aws_lambda_permission" "allow_api_gateway" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.start_stop_services.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.start_stop_services_api.execution_arn}/*/*"
}

# resource "aws_iam_role" "api_gateway_role" {
#   name        = "api_gateway_role"
#   description = "Papel para o API Gateway"

#   assume_role_policy = jsonencode({
#     Version = "2012-10-17"
#     Statement = [
#       {
#         Action = "sts:AssumeRole"
#         Principal = {
#           Service = "apigateway.amazonaws.com"
#         }
#         Effect = "Allow"
#       }
#     ]
#   })
# }

# resource "aws_iam_policy" "api_gateway_policy" {
#   name        = "api_gateway_policy"
#   description = "Política para o API Gateway"

#   policy      = jsonencode({
#     Version = "2012-10-17"
#     Statement = [
#       {
#         Action = [
#           "logs:CreateLogGroup",
#           "logs:CreateLogStream",
#           "logs:PutLogEvents",
#         ]
#         Resource = "*"
#         Effect    = "Allow"
#       }
#     ]
#   })
# }

# resource "aws_iam_role_policy_attachment" "cloudwatch_logs_attach" {
#   role       = aws_iam_role.api_gateway_role.name
#   policy_arn = aws_iam_policy.api_gateway_policy.arn
# }

# resource "aws_api_gateway_account" "main" {
#   cloudwatch_role_arn = aws_iam_role.api_gateway_role.arn
# }