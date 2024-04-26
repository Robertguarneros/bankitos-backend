# Backend for bankitos app

Important to add Content-Type: application/json to the header for posting

Post json:
{
    "name": {
        "first_name": "String",
        "middle_name": "String",
        "last_name": "String"
    },
    "email": "String",
    "phone_number": "String",
    "gender": "String"
}

# How to build and push docker node:
docker tag node-docker robertguarneros/bankitos-backend:v0.0

docker build -t robertguarneros/bankitos-backend:v0.0 .

docker login

docker push robertguarneros/bankitos-backend:v0.0


docker pull robertguarneros/bankitos-backend

sudo docker run -d -p 3000:3000 --name backend robertguarneros/bankitos-backend:v0.0


# How to build and push docker mongo: 
## Dockerfile
FROM mongo:latest

docker build -t my-mongodb .

docker run -d -p 27017:27017 --name my-mongodb -v /my/mongodb/data:/data/db robertguarneros/mongodb:v0.0

