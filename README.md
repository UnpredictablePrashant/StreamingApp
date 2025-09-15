# StreamingApp
Collaborative Streaming application

## Backend

### AuthService
`.env` file for the Authentication Service.

```sh
PORT=3001
MONGO_URI="yourMongoDB_URIwithDatabaseName"
JWT_SECRET="writesomerandomsecrets"
AWS_KEY_ID='asfdasdfasfasf'
AWS_SECRET_KEY='adsafsasfdafs'
AWS_REGION='ap-south-1'
AWS_S3_BUCKET='streamingappservice'
```

In the streamingService create a `.env` file:

```bash
PORT=3002
AWS_KEY_ID='asfefa'
AWS_SECRET_KEY='addasfasdf'
AWS_REGION='us-east-1'
AWS_S3_BUCKET='streamingappservicepk'
```
