### Express Typescript Grpc (Google Remote Procedure Call)

### Install Make GNU

- MacOs
 ```sh
  brew install make
 ```

- Linux
 ```sh
  apt-get install make
 ```
 
 - Windows
 ```sh
  choco install make
 ```

### Run Command

+ **Install Package**

  ```sh
  npm install && npm audit fix
  ```

+ **Production**

  ```sh
  make prod type=server or make prod type=client
  ```

+ **Development**

  ```sh
  make dev  type=server or make dev type=client
  ```
  
+ **Build Application**

  ```sh
  make build
  ```

### Generate Config

+ **windows**

  ```sh
  make grpcwin
  ```

+ **Linux/MacOS**

  ```sh
  make grpclinmac
  ```

### Route Endpoint

| Name            | Method   | Route               |
| --------------- | -------- | ------------------- |
| Create Student  | *POST*   | **/api/v1/mhs**     |
| Results Student | *GET*    | **/api/v1/mhs**     |
| Result Student  | *GET*    | **/api/v1/mhs/:id** |
| Delete Student  | *DELETE* | **/api/v1/mhs/:id** |
| Update Student  | *PUT*    | **/api/v1/mhs/:id** | 

### About GRPC

+ **[gRPC Adoption and Working Architecture](https://www.xenonstack.com/insights/what-is-grpc/)**
+ **[Understanding Protocol Buffers](https://medium.com/better-programming/understanding-protocol-buffers-43c5bced0d47)**
+ **[Getting Started with gRPC and JavaScript - Colin Ihrig, Joyent](https://www.youtube.com/watch?v=fl9AZieRUaw)**
+ **[What are Protocol Buffers & When to Use them | Protobuf vs JSON](https://www.youtube.com/watch?v=9fh-XdUH7qw)**
+ **[Protocol Buffers in gRPC](https://www.youtube.com/watch?v=yfZB2_rT_Pc)**
+ **[GRPC Tutorial Using module grpc](https://github.com/restuwahyu13/node-grpc-typescript)**
+ **[GRPC Tutorial Using module @grpc/grpc-js](https://github.com/restuwahyu13/express-grpc-rest-api)**
+ **[Creating a CRUD API with Node, Express, and gRPC](https://blog.logrocket.com/creating-a-crud-api-with-node-express-and-grpc/)**