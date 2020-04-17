# S4S Supplemental Service

Services supplements IV to enable the functionality of S4S Supply View UI and potentially APP Integration

## Use cases

1. An API user gets a supplier's contact information by supplier name or id
2. An API user gets a supplier's location information by supplier name or id
3. An API user gets the list of items in S4S and items' category information
4. An administrator create, read, update, delete a supplier contact information
5. An administrator create, read, update, delete a supplier location information
6. An administrator create, read, update, delete a item and its category information
7. Multi tenant support: Each tenant can maintain their independent catalog and supply chain network of supplier and its locations
8. The clients can retrieve the current unexpired IV token or fetch a new one.

## Platform

- MongoDB
- Node.js

## Build and Deployment process

The continuous delivery process for build and deployment on dev is configured by a toolchain.

Here are the steps to deploy this service on the cloud.

1. Commit/merge your changes to the master branch of the git repo (https://github.ibm.com/wcelab/s4s-supplement-service.git)
2. Toolchain has been configured that will automatically pull the latest code from git master branch and start building the artifacts.
3. The built artifacts will be deployed on cloud foundry under the app name of 's4s-supplement-service-dev'.
4. Verify that the version is updated at https://s4s-supplement-service-dev.mybluemix.net/s4s/info after the new container is deployed with the latest code. (Version needs to be incremented with every commit under the file /src/router/info.js)
