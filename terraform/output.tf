# Output values
output "instance_public_ip_fe" {
  description = "Public IP of the frontend EC2 instance"
  value       = aws_instance.frontend_server.public_ip
}

output "instance_private_ip_database" {
  description = "Private IP of the datbase EC2 instance"
  value       = aws_instance.data_base.private_ip
}

output "instance_private_ip_be" {
  description = "Private IP of the backend EC2 instance"
  value       = aws_instance.backend_server.private_ip
}


output "elb_dns_name" {
  description = "DNS name of the ELB"
  value       = aws_lb.alb.dns_name
}

output "vpc_id" {
  description = "ID of the VPC"
  value       = aws_vpc.main.id
}

output "public_subnet_id" {
  description = "ID of the public subnet"
  value       = aws_subnet.public_subnet[*].id
}

output "elastic_ip" {
  value = aws_eip.nat_eip.public_ip
  description = "the public ip of elastic ip"
}