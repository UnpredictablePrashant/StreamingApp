
# Complete Project on Orchestration and Scaling

Main Repository: https://github.com/UnpredictablePrashant/StreamingApp.git

Instructions to Sync Fork with Upstream: Pull updates from original GitHub repository into a fork

# VM Structure

<img width="976" height="318" alt="image" src="https://github.com/user-attachments/assets/8bab26af-21d0-4feb-bd90-cb1987a339a8" />

# Containerization Backend /Frontend

<img width="867" height="325" alt="image" src="https://github.com/user-attachments/assets/213c5b68-e40c-4972-ae58-13c57b7ed671" />

Docker File :

FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]

<img width="1047" height="287" alt="image" src="https://github.com/user-attachments/assets/26594e7d-0132-47be-87ae-1d7da6bbf423" />

Docker File :

FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]

# ECR Repositories Creations

<img width="1905" height="950" alt="image" src="https://github.com/user-attachments/assets/ad98b867-4ede-4d62-ad0c-bf268f6ef287" />

# Build and Push and ECR Image Pushed(AWS Console side Screenshot)

<img width="940" height="386" alt="image" src="https://github.com/user-attachments/assets/fdc0f7b1-641b-4e29-92a7-23cdab78542e" />

<img width="1908" height="947" alt="image" src="https://github.com/user-attachments/assets/1ad430c6-6302-446c-b582-d8dfae965726" />

<img width="940" height="502" alt="image" src="https://github.com/user-attachments/assets/816e627b-8c7f-4d73-9cf5-3754c742c2b7" />

<img width="940" height="222" alt="image" src="https://github.com/user-attachments/assets/beee22cd-d48b-4036-a3b3-faace70971f7" />

# Jenkins side Deployment

<img width="940" height="465" alt="image" src="https://github.com/user-attachments/assets/5b9ad717-303b-4297-afe8-5c6cb232ce15" />

<img width="940" height="470" alt="image" src="https://github.com/user-attachments/assets/402a6bdd-bd8b-489a-8824-64081b5583f3" />

<img width="940" height="480" alt="image" src="https://github.com/user-attachments/assets/850b5d33-581b-4599-bafd-93e721ad4300" />

# GitHub Webhook (Auto-trigger on Push)

<img width="940" height="476" alt="image" src="https://github.com/user-attachments/assets/984bd6fa-c38b-435c-bfa7-7d97e310f2bc" />

<img width="1067" height="78" alt="image" src="https://github.com/user-attachments/assets/76eb82ca-e5a5-401f-8c75-772586025410" />

<img width="1802" height="838" alt="image" src="https://github.com/user-attachments/assets/3e58d6c3-c571-4a12-bf11-370867b41fdc" />



