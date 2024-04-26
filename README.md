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

How to push docker:
PS D:\UNI\EA\bankitos-backend> docker tag node-docker robertguarneros/bankitos-backend:latest
PS D:\UNI\EA\bankitos-backend> docker login
Authenticating with existing credentials...
Login Succeeded
PS D:\UNI\EA\bankitos-backend> docker push robertguarneros/bankitos-backend:latest
The push refers to repository [docker.io/robertguarneros/bankitos-backend]
e6e8c382868f: Pushed
f09954ec66bf: Pushed
f21b272c0b00: Pushed
95643afb27f1: Pushed
f0fec2114a50: Pushed
953a0a283e4b: Pushed
b5ecc10400bc: Pushed
6309473771d3: Pushed
83db175c22e2: Pushed
c5d13b2949a2: Pushed
7e43f593c900: Pushed
072686bcd3db: Pushed
latest: digest: sha256:ac2f3f40859fe5616005f30a2face2694610b31ebe3975ffc87edcaedcf5c4ef size: 2841
PS D:\UNI\EA\bankitos-backend>

docker pull robertguarneros/bankitos-backend
docker run -d -p 3000:3000 robertguarneros/bankitos-backend:latest
