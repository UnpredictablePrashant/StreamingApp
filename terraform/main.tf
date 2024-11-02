terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

# Configure the AWS Provider
provider "aws" {
  region = var.aws_region
}

# Create a VPC
resource "aws_vpc" "main" {
  cidr_block = "10.0.0.0/16"
  tags = {
    Name = "${var.project}-vpc"
    Description= "travel_memory"
  }  
}


# configure subnets
resource "aws_subnet" "public_subnet" {
  count = length(var.public_subnet_cidrs)  
  vpc_id     = aws_vpc.main.id
  cidr_block = var.public_subnet_cidrs[count.index]
  availability_zone = element(var.az, count.index)
  map_public_ip_on_launch = true

  tags = {
    Name = "${var.project}-public_subnet-${count.index + 1}"
  }
}

resource "aws_subnet" "private_subnet" {
  count = length(var.private_subnet_cidrs)  
  vpc_id     = aws_vpc.main.id
  cidr_block = var.private_subnet_cidrs[count.index]
  availability_zone = element(var.az, count.index)

  tags = {
    Name = "${var.project}-private_subnet-${count.index + 1}"
  }
}

# Create Internet Gateway for Public Subnets
resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name = "${var.project}-igw"
  }
}

# Create Route Table for Public Subnet
resource "aws_route_table" "public_route_table" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw.id
  }

  tags = {
    Name = "${var.project}-public-route-table"
  }
}

# Associate Route Table with Public Subnets
resource "aws_route_table_association" "public_route_table_assoc" {
  count          = length(var.public_subnet_cidrs)
  subnet_id      = aws_subnet.public_subnet[count.index].id
  route_table_id = aws_route_table.public_route_table.id
}


# Create Elastic IP for NAT Gateway
resource "aws_eip" "nat_eip" {
  domain = "vpc"
  tags = {
    Name = "${var.project}-nat-eip"
  }
}

# Create NAT Gateway in the Public Subnet
resource "aws_nat_gateway" "nat_gw" {
  allocation_id = aws_eip.nat_eip.id
  subnet_id     = aws_subnet.public_subnet[0].id

  tags = {
    Name = "${var.project}-nat-gw"
  }
}

# Create Route Table for Private Subnet
resource "aws_route_table" "private_route_table" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.nat_gw.id
  }

  tags = {
    Name = "${var.project}-private-route-table"
  }
}

# Associate Private Route Table with Private Subnets
resource "aws_route_table_association" "private_route_table_assoc" {
  count          = length(var.private_subnet_cidrs)
  subnet_id      = aws_subnet.private_subnet[count.index].id
  route_table_id = aws_route_table.private_route_table.id
}



# security group for ec2 and asg
resource "aws_security_group" "security_groups" {
#   vpc_id = module.vpc.vpc_id
  vpc_id = aws_vpc.main.id
  name = "${var.project}-sg"
  ingress {
    from_port = 22
    to_port = 22
    protocol = "tcp"
    cidr_blocks = [ "0.0.0.0/0" ]
  }
  ingress {
    from_port = 80
    to_port = 80
    protocol = "tcp"
    cidr_blocks = [ "0.0.0.0/0" ]
  }
  ingress {
    from_port = 443
    to_port = 443
    protocol = "tcp"
    cidr_blocks = [ "0.0.0.0/0" ]
  }
  ingress {
    from_port = 3000
    to_port = 3000
    protocol = "tcp"
    cidr_blocks = [ "0.0.0.0/0" ]
  }
  ingress {
    from_port = 3001
    to_port = 3001
    protocol = "tcp"
    cidr_blocks = [ "0.0.0.0/0" ]
  }
  ingress {
    from_port = 27017
    to_port = 27017
    protocol = "tcp"
    cidr_blocks = [ "0.0.0.0/0" ]
  }
  egress {
    from_port = 0
    to_port = 0
    protocol = -1
    cidr_blocks = [ "0.0.0.0/0" ]
  }
  tags = {
    name = "${var.project}-sg"
  }
}

# Backend EC2 Instance
resource "aws_instance" "backend_server" {
  ami                    = var.aws_ami
  instance_type          = var.instance_type
  key_name               = "raviAWS"
  subnet_id              = aws_subnet.private_subnet[0].id
  vpc_security_group_ids = [aws_security_group.security_groups.id]
  tags = {
    Name = "${var.project}-backend"
  }
}  

# database EC2 Instance
resource "aws_instance" "data_base" {
  ami                    = var.aws_ami
  instance_type          = var.instance_type
  key_name               = "raviAWS"
  subnet_id              = aws_subnet.private_subnet[0].id
  vpc_security_group_ids = [aws_security_group.security_groups.id]
  tags = {
    Name = "${var.project}-database"
  }
} 

# Frontend EC2 Instance
resource "aws_instance" "frontend_server" {
  ami                    = var.aws_ami
  instance_type          = var.instance_type
  key_name               = "raviAWS"
  subnet_id              = aws_subnet.public_subnet[1].id
  vpc_security_group_ids = [aws_security_group.security_groups.id]

  tags = {
    Name = "${var.project}-frontend"
  }
}

# Define the target group for frontend
resource "aws_lb_target_group" "frontend_tg" {
  name     = "${var.project}-frontend-tg"
  port     = 3000
  protocol = "HTTP"
  vpc_id   = aws_vpc.main.id

  health_check {
    path                = "/"
    interval            = 30
    timeout             = 5
    healthy_threshold   = 2
    unhealthy_threshold = 2
  }
  tags = {
    Name = "${var.project}-frontend-tg"
  }
}
# Associate frontend instance with the frontend target group
resource "aws_lb_target_group_attachment" "frontend_attachment" {
  target_group_arn = aws_lb_target_group.frontend_tg.arn
  target_id        = aws_instance.frontend_server.id
}

# Define the target group for backend
resource "aws_lb_target_group" "backend_tg" {
  name     = "${var.project}-backend-tg"
  port     = 3001
  protocol = "HTTP"
  vpc_id   = aws_vpc.main.id

  health_check {
    path                = "/hello"
    interval            = 30
    timeout             = 5
    healthy_threshold   = 2
    unhealthy_threshold = 2
  }
  tags = {
    Name = "${var.project}-backend-tg"
  }
}

# Associate backend instance with the database target group
resource "aws_lb_target_group_attachment" "backend_attachment" {
  target_group_arn = aws_lb_target_group.backend_tg.arn
  target_id        = aws_instance.backend_server.id
}

# Associate database instance with the database target group
resource "aws_lb_target_group_attachment" "database_attachment" {
  target_group_arn = aws_lb_target_group.databse_tg.arn
  target_id        = aws_instance.data_base.id
}

# Define the target group for backend
resource "aws_lb_target_group" "databse_tg" {
  name     = "${var.project}-database-tg"
  port     = 27017
  protocol = "HTTP"
  vpc_id   = aws_vpc.main.id

  health_check {
    path                = "/db"
    interval            = 30
    timeout             = 5
    healthy_threshold   = 2
    unhealthy_threshold = 2
  }

  tags = {
    Name = "${var.project}-database-tg"
  }
}



# ELB creation
resource "aws_lb" "alb" {
  name               = "${var.project}-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.security_groups.id]
  subnets            = [for subnet in aws_subnet.public_subnet : subnet.id]
  

  enable_deletion_protection = false

  # access_logs {
  #   bucket  = aws_s3_bucket.lb_logs.id
  #   prefix  = "test-lb"
  #   enabled = true
  # }

  tags = {
    Environment = "production"
  }
}


# Define the listener for HTTP
resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.alb.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type = "fixed-response"
    fixed_response {
      content_type = "text/plain"
      message_body = "Welcome to the Load Balancer!"
      status_code  = "200"
    }
  }
}
resource "aws_lb_listener_rule" "api_rule" {
  listener_arn = aws_lb_listener.http.arn
  priority     = 1

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.backend_tg.arn
  }

  condition {
    path_pattern {
      values = ["/hello/*"]
    }
  }
}

resource "aws_lb_listener_rule" "default_rule" {
  listener_arn = aws_lb_listener.http.arn
  priority     = 2

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.frontend_tg.arn
  }

  condition {
    path_pattern {
      values = ["/*"]
    }
  }
}

