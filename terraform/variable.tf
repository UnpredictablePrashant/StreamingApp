variable "project" {
<<<<<<< HEAD
  description = "streaming-app"
=======
  description = "travelmem"
>>>>>>> ae074c3cdfb0b166640ed121796a6b02c391efe8
  type = string
}


variable "aws_region" {
  description = "this will define the aws region"
  type = string
<<<<<<< HEAD
  default = "ap-south-1"
=======
  default = "ap-northeast-2"
}

variable "aws_ami" {
  description = "this will tell aws ami for ubuntu"
  type = string
  default = "ami-05d2438ca66594916"
>>>>>>> ae074c3cdfb0b166640ed121796a6b02c391efe8
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
<<<<<<< HEAD
  default = [ "ap-south-1a", "ap-south-1b" ]
}

# variable "instance_type" {
#   description = "EC2 Instance Type"
#   default     = "t3.micro"
# }
=======
  default = [ "ap-northeast-2a", "ap-northeast-2b" ]
}

variable "instance_type" {
  description = "EC2 Instance Type"
  default     = "t3.micro"
}
>>>>>>> ae074c3cdfb0b166640ed121796a6b02c391efe8
