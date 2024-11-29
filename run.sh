#!/bin/bash

# Variables
# TERRAFORM_DIR="/mnt/c/Users/Ravik/Desktop/CapstoneProj/terraform"          # Update this path to your Terraform directory
TERRAFORM_DIR="./CapstoneProj/terraform"
LOCAL_FILE="/home/ravikishans/publicVPC.pem"            # Update this path to the local file to copy
REMOTE_DEST="/home/ubuntu"                # Destination on the remote instance
ANSIBLE_HOSTS_FILE="./CapstoneProj/ansible/hosts.ini"     # Update this path to your hosts.ini file
PEM_FILE="/home/ravikishans/publicVPC.pem"                   # Update this to your PEM file path
ANSIBLE_PLAYBOOK="./CapstoneProj/ansible/playbook.yml"

# # Step 1: Run Terraform provisioning
cd $TERRAFORM_DIR
terraform init
terraform plan
terraform apply -auto-approve
terraform output

# Step 2: Get instance details (adjust depending on your output variables)
# Assuming Terraform outputs the public and private IPs
public_ip_monitoring=$(terraform output -raw instance_public_ip_monitoring)

# Step 3: SSH into the frontend instance and copy the local file
echo "Copying file to monitoring instance..."
scp -i "$PEM_FILE" "$LOCAL_FILE" "ubuntu@$public_ip_monitoring:$REMOTE_DEST"


# Step 4: Update hosts.ini file
echo "Updating hosts.ini file..."
cat <<EOL > $ANSIBLE_HOSTS_FILE
[monitoring]
monitoring ansible_host=$public_ip_monitoring ansible_user=ubuntu ansible_ssh_private_key_file=$PEM_FILE

EOL

ansible all -m ping -i $ANSIBLE_HOSTS_FILE
# Step 5: Run Ansible playbook to configure instances
echo "Running Ansible playbook..."
ansible-playbook -i $ANSIBLE_HOSTS_FILE $ANSIBLE_PLAYBOOK

# # Done
echo "Provisioning completed."
