variable "project" {
  description = "streaming-app"
  type = string
  default = "streamingapp"
}


variable "aws_region" {
  description = "this will define the aws region"
  type = string
  default = "ap-northeast-3"
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

  default = [ "ap-northeast-3a", "ap-northeast-3b" ]
}

# variable "instance_type" {
#   description = "EC2 Instance Type"
#   default     = "t3.micro"
# }

variable "aws_ami" {
  description = "this will tell aws ami for ubuntu"
  type = string
  default = "ami-0206f4f885421736f"
}
variable "instance_type" {
  description = "EC2 Instance Type"
  default     = "t3.micro"
}