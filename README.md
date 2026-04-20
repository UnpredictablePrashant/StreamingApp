# Project on Orchestration and Scaling
# COMPLETE EXECUTION ROADMAP
# User → Frontend (React)
      ↓
# Backend (Node.js API)
      ↓
# MongoDB

# All running in Kubernetes (EKS)
# Images stored in ECR
# Built via Jenkins

# STEP 1: Git Setup (Forked & Synced)
 https://github.com/UnpredictablePrashant/StreamingApp
# Then Cloned my fork:
git clone https://github.com/fancy1505/StreamingApp.git
cd StreamingApp
# 	Added upstream (VERY IMPORTANT for syncing):
git remote add upstream https://github.com/UnpredictablePrashant/StreamingApp.git
# 	Sync when needed:
	git pull upstream main

# STEP 2: Containerize MERN App
 First created Backend Dockerfile
 <img width="940" height="729" alt="image" src="https://github.com/user-attachments/assets/8123991c-a1b4-44e5-857f-c26525c8a31c" />
 <img width="940" height="588" alt="image" src="https://github.com/user-attachments/assets/4157b5db-2ed7-4a28-9b1c-4d5e98814615" />
 <img width="940" height="654" alt="image" src="https://github.com/user-attachments/assets/530a0560-ec0f-48ef-bfdd-5b005c0ad143" />
 <img width="940" height="437" alt="image" src="https://github.com/user-attachments/assets/0101fbc5-09b3-4dd2-abeb-ce7cce9fc5c2" />
# There was a issue connecting mongodb and network so resolved the issue while changing the mongo URI
<img width="940" height="456" alt="image" src="https://github.com/user-attachments/assets/b89209cc-e1e2-4131-819b-a67a358bf71f" />
<img width="940" height="443" alt="image" src="https://github.com/user-attachments/assets/0654a295-e270-41a7-93a5-9411dde034c7" />
# Now we have created Frontend Docker file
<img width="940" height="622" alt="image" src="https://github.com/user-attachments/assets/4d9f84b9-6d25-40d2-955f-4012cd3a859e" />
<img width="940" height="172" alt="image" src="https://github.com/user-attachments/assets/1c5ff07c-676f-40f7-9daf-a8df6f8eeefc" />

# EXPECTED OUTPUT from frontent
<img width="940" height="571" alt="image" src="https://github.com/user-attachments/assets/a85b64ea-eadd-48b9-a07f-d856c89c321b" />

# Till now we have completed 
# Backend Docker ✅
# MongoDB connection ✅
# Docker networking ✅
# Frontend Docker ✅
# Full MERN app running locally ✅

# Step 3: AWS ECR configuration
# 1.Created ECR repos
# 2: Login Docker to AWS
# 3: Pushed images
So to proceed with ECR  first I have created IAM user and assigned security credential to login via Aws CLI
<img width="940" height="259" alt="image" src="https://github.com/user-attachments/assets/137b881d-eed4-48fb-a0f7-167438919e25" />
# Created ECR Repositories
We’ll create 2 repos (as per assignment)
Frontent
Backend
<img width="940" height="236" alt="image" src="https://github.com/user-attachments/assets/6ea31e50-9086-436e-a46f-a383d74a554c" />
<img width="940" height="264" alt="image" src="https://github.com/user-attachments/assets/0cda2fff-5234-40d0-9c73-448eebbfe52e" />
# NEXT STEP: LOGIN DOCKER TO Amazon Web Services
<img width="940" height="200" alt="image" src="https://github.com/user-attachments/assets/d03e7242-f29b-4972-b5e8-49cd1d746386" />
<img width="940" height="234" alt="image" src="https://github.com/user-attachments/assets/41e67361-8dec-41c0-8188-adc55bc8a775" />

# STEP: TAGGING MY IMAGES
 Tagging = renaming image for ECR
# TAG BACKEND
<img width="940" height="299" alt="image" src="https://github.com/user-attachments/assets/9a4cafb5-2923-415e-b8c1-2e9206a6521d" />

# TAG FRONTEND
<img width="940" height="129" alt="image" src="https://github.com/user-attachments/assets/91c2b427-93da-4b8b-93c2-9b432830ee1c" />

# STEP 2: PUSH IMAGES TO ECR
 # PUSH BACKEND
 <img width="940" height="442" alt="image" src="https://github.com/user-attachments/assets/811fc58c-1fb5-4c80-9c18-db03f9f412b2" />
 # PUSH FRONTEND
<img width="940" height="400" alt="image" src="https://github.com/user-attachments/assets/15e6cb99-bbc0-43e0-b7a3-2deaad40c674" />
# Verifying in AWS CONSOLE
# Checking ECR → Repositories
Click:
•	streaming-backend 
•	streaming-frontend

<img width="940" height="267" alt="image" src="https://github.com/user-attachments/assets/bc0d96da-535d-4c33-b24d-a02ccdbb68b6" />
<img width="940" height="357" alt="image" src="https://github.com/user-attachments/assets/63c9d13f-c06a-45f9-b362-2002cfb49428" />
<img width="940" height="361" alt="image" src="https://github.com/user-attachments/assets/d6427a05-d7f6-4a33-97e9-b2188ccc11e3" />


















