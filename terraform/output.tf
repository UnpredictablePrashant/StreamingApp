<<<<<<< HEAD
=======
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

>>>>>>> ae074c3cdfb0b166640ed121796a6b02c391efe8
output "vpc_id" {
  description = "ID of the VPC"
  value       = aws_vpc.main.id
}

output "public_subnet_id" {
  description = "ID of the public subnet"
  value       = aws_subnet.public_subnet[*].id
}
<<<<<<< HEAD
output "private_subnet_id" {
  description = "ID of the private subnet"
  value       = aws_subnet.private_subnet[*].id
}
=======
>>>>>>> ae074c3cdfb0b166640ed121796a6b02c391efe8

output "elastic_ip" {
  value = aws_eip.nat_eip.public_ip
  description = "the public ip of elastic ip"
<<<<<<< HEAD
}

# Output the Cluster Information
output "eks_cluster_endpoint" {
  value = aws_eks_cluster.eks_cluster.endpoint
}

output "eks_cluster_name" {
  value = aws_eks_cluster.eks_cluster.name
}

output "node_group_name" {
  value = aws_eks_node_group.eks_node_group.node_group_name
=======
>>>>>>> ae074c3cdfb0b166640ed121796a6b02c391efe8
}