- University Name - San Jose State University
- Course: Enterprise Software - CMPE172/ Spring 2020 
- Team Members - TeghBir Gill, Sarangpreet Singh Padda, Manpreet Singh
- Project Introduction 
> The current MYSJSU course selection tool is integrated into the overall MYSJSU webpage in a way that causes frequent problems in terms of performance and user experience. Refreshing the page, or going back to a previous page resets the user back to the homepage, instead of directing them to their previous view. In addition, the filtering system is slow and lacks flexibility. With this in mind, the goal for our team was to build an application that is more smooth and streamlined that will be easy to scale.

>This project aims to provide a faster and more flexible course registration system in order to improve user experience. Tools used in the implementaion of this project include AWS API Gateway, AWS Lambda, AWS Amplify, and AWS Cognito.   
>This project is deployed on Elastic Beanstalk using Docker. Application is available at : http://3-env.eba-2pirw3rt.us-west-1.elasticbeanstalk.com/   

- Demo Screenshots  

**Sign In With AWS Cognito**  
![SignIn](https://cmpe172-project.s3.amazonaws.com/imagesForReadMe/signIn.PNG)

**Set Up Multi Factor Authentication With One Time Access Password (OTAP)**  
![MFA](https://cmpe172-project.s3.amazonaws.com/imagesForReadMe/setupotp.PNG)

**Class Schedule**  
![Schedule](https://cmpe172-project.s3.amazonaws.com/imagesForReadMe/schedule.PNG)

**Add Classes**  
![Add Classes](https://cmpe172-project.s3.amazonaws.com/imagesForReadMe/addclasses.PNG)

**Check Out Cart**  
![Add Classes](https://cmpe172-project.s3.amazonaws.com/imagesForReadMe/cart.PNG)

## Pre-requisites for setup : Node 10 (https://nodejs.org/en/download/)  

##  Instructions on how to run the project locally.
```  
git clone https://github.com/manpreetsjsu/cmpe172.git    
npm install     //Install Dependencies  
npm start       //Start Server to Run App 
```   
Open (http://localhost:3000) to view it in the browser. 

## System/Architecture Diagram    
![Architecture](https://cmpe172-project.s3.amazonaws.com/imagesForReadMe/cmpe172+backend+(1).png)  

## Deploying with Docker

1) Create file **Dockerfile** and place in root directory of project

2) Paste the following into the 'Dockerfile':  
```  
FROM node:12.16.3 as build
RUN mkdir /usr/src/app
WORKDIR /usr/src/app
ENV PATH /usr/src/app/node_modules/.bin:$PATH
COPY package.json /usr/src/app/package.json
RUN npm install --silent
RUN npm install react-scripts -g --silent
COPY . /usr/src/app
RUN npm run build
FROM nginx:1.13.12-alpine
COPY --from=build /usr/src/app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```  

3) Replace **version** with installed version of node.js (can be found using node -v in cli)

4) Create **.dockerignore** file in root of the directory and paste these contents  
    ```  
    node_modules
    npm-debug.log
    .git
    .gitignore
    ```  

5) Build Docker using terminal or command line  
`docker build -t <ContainerName> <projectDirectory>`  

6) Run Docker to test if container works:  
`docker run -it -p 8081:3000 <ContainerName>`  


## Deploy React App to ElasticBeanStalk using image on DockerHub

1.  Deploy the docker image created with the **Dockerfile** to docker hub account
```
docker tag <ImageId> <dockerHubUsername>/<ImageName>:<TagName>
docker push <ImageId> <dockerHubUsername>/<ImageName>
```
![example Image on DockerHub](https://cmpe172-project.s3.amazonaws.com/imagesForReadMe/dockerHubCmpe172Image.PNG)
 
2.  Create **Dockerrun.aws.json** file in root directory of the project
**Put the following json code snippet in file**
```
{
"AWSEBDockerrunVersion": "1",
	"Image": {
		"Name": "<dockerUsername>/<image>:<tag>",
		"Update": "true"
	},
	"Authentication":{
		"Bucket": "cmpe172-s3-docker",
		"Key": "config.json"
	},
	"Ports": [
		{
			"ContainerPort": "80"
		}
	]
}
```
**To Understand the above code snippet, look for how to Using images from a private repository**

(https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/single-container-docker-configuration.html#single-container-docker-configuration.dockerrun)  

3.  In order to access the private repositry of docker hub, we have to give elastic bean credentials to access the image on the docker hub. In OS, Docker's **config.json** has docker credentials.
	```
	cd ~
	cd ./dockerfile
	cat config.json
	```  
    > For windows config.json can be found in ‘C:\Users<yourUsername>.docker’  

    > For MacOS config.json can be found in ‘/Users//.docker’  
    > (press command+shift+. To display hidden folders)  

4. Upload the **config.json** file to S3 bucket [create new bucket or existing bucket]

5. Create new AWS IAM Role to provide EC2 access of the S3 bucket created in above step. Create the IAM Role choosing EC2 service and provide S3 bucket access to EC2. (https://www.youtube.com/watch?v=pLw6MLqwmew)  

![Create New Role](https://cmpe172-project.s3.amazonaws.com/imagesForReadMe/createRoleForEc2.PNG)  

**Attach S3 Get Object Policy. We are attaching S3 Full Access for ease**   
![Attach Policy](https://cmpe172-project.s3.amazonaws.com/imagesForReadMe/attachPolicy.PNG)  

6. Create New Elastic Bean Application. Create New Environment by configuring these options:-    
![Choose these Config Options](https://cmpe172-project.s3.amazonaws.com/imagesForReadMe/ebCreateEnvSample.PNG)   
![Upload Dockerrun.aws.json file](https://cmpe172-project.s3.amazonaws.com/imagesForReadMe/ebUploadDockerFile.PNG)   

**Choose Configure More Option and Select this Option**  
![config Options](https://cmpe172-project.s3.amazonaws.com/imagesForReadMe/ebEC2IAMRole.PNG)    

**Choose the AWS IAM Role created in Step5**  
![IAM Role for giving Access to EC2](https://cmpe172-project.s3.amazonaws.com/imagesForReadMe/ebSelectIamRole.PNG)    

7. **Save & Create the Environment. Environment Creation Will take some time. If you encounter errors, please see the logs [Request Last 100 lines or download full logs] These will really help you to troubleshoot the problem**    
