variable "project" {
  description = "travelmem"
  type = string
}


variable "aws_region" {
  description = "this will define the aws region"
  type = string
  default = "ap-northeast-2"
}

variable "aws_ami" {
  description = "this will tell aws ami for ubuntu"
  type = string
  default = "ami-05d2438ca66594916"
}

# Public Subnet CIDRs
variable "public_subnet_cidrs" {
  description = "List of CIDR blocks for public subnets"
  type        = list(string)
  default     = ["10.0.1.0/24", "10.0.2.0/24"]  # Add more as needed
}

# Private Subnet CIDRs
variable "private_subnet_cidrs" {
  description = "List of CIDR blocks for private subnets"
  type        = list(string)
  default     = ["10.0.3.0/24", "10.0.4.0/24"]  # Add more as needed
}

variable "az" {
  description = "List of az"
  type = list(string)
  default = [ "ap-northeast-2a", "ap-northeast-2b" ]
}

variable "instance_type" {
  description = "EC2 Instance Type"
  default     = "t3.micro"
}