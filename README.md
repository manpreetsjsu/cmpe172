This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `npm run build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify


### Deploying to docker and Elastic Beanstalk
## Docker/Docker Hub

**Prerequisites: A Docker Account, Installation of Docker**

**Create Dockerfile in project root directory with the following:**

Change the node version to match the version installed on your machine

`FROM node:12.16.3  as build  `
 
`RUN mkdir /usr/src/app  `
 
`WORKDIR /usr/src/app  `
 
`ENV PATH /usr/src/app/node_modules/.bin:$PATH  `
 
`COPY package.json /usr/src/app/package.json  `
 
`RUN npm install --silent  `
 
`RUN npm install react-scripts -g --silent  `
 
`COPY . /usr/src/app  `
 
`RUN npm run build  `
 
`FROM nginx:1.13.12-alpine  `
 
`COPY --from=build /usr/src/app/build /usr/share/nginx/html  `
 
`EXPOSE <portNumber>  `
 
`CMD ["nginx", "-g", "daemon off;"]`


  

**Create .dockerignore file in the root directory with the following:**

  

`node_modules`
`npm-debug.log  `
`.git  `
`.gitignore`

**Build Docker using terminal or command line:**

`docker build -t <ContainerName> <projectDirectory>`

**Run docker to test if the container works:**

`docker run -it -p 8081:<portNumber> <ContainerName>`

  
  
  
  
  
**Push docker image to Docker Hub**

Log into [https://hub.docker.com/](https://hub.docker.com/) and then click ‘create repository’

**Log in to Docker from terminal or command line**

`docker login --username=yourHubUsername --email=youremail@company.com`

  

**Find docker Image with the previously set container name**

  

`docker images`

  
  

**Tag the Image**

`Docker tag <IMAGE ID> <yourHubUsername>/<repositoryName>:<yourTag>`

**Push image to docker**

  

`docker push <yourHubUsername>/<dockerHubRepository>`

  

## AWS IAM

Create a new AWS IAM Role to provide EC2 access to the above S3 bucket. Create the IAM role for the EC2 Use case and provide AmazonS3FullAccess ([https://www.youtube.com/watch?v=pLw6MLqwmew](https://www.youtube.com/watch?v=pLw6MLqwmew))

  

![](https://lh4.googleusercontent.com/5CHFxM6ahvUsPrpifx5ZMSsaQvAtlrvDI1FF_16eh3rX_rJ1qANTwvnSA5FhC_wiHe0dPYkf2rPl48S3KL8YGA6hsshVqShzxdZNxdj3HYasWrDfmrf0Zs0bXysDZUPzgBlBtsV4)

  

![](https://lh6.googleusercontent.com/KlJ-PZf_bwmQIZxu64tlyKUSFjGVvWHTsbuOOZIWRK0i9GuWxscZhMAY3LJ8SL1RYi6yeUGgDzrfTEq2NW2vWS9CfNLlzmUsocvNaYih3hm0jCJAPhUSHsL86YEnlhvlqB6tpqSk)

  

## AWS Elastic Beanstalk

  
  

Create ‘Dockerrun.aws.json’ file in project root directory with the following:

  

`{`

`"AWSEBDockerrunVersion": "1",`

`"Image": {`

`"Name": "<dockerUsername>/<repositoryName>:<tag>",`

`"Update": "true"`

`},`

`"Authentication":{`

`"Bucket": "<nameOfS3Bucket>",`

`"Key": "config.json"`

`},`

`"Ports": [`

`{`

`"ContainerPort": "80"`

`}`

`]`

`}`

  
  

**Find the config.json file in the .docker directory and upload to S3 bucket [create a new bucket or use an existing one]**

*For windows config.json can be found in ‘C:\Users\<yourUsername>\.docker’*

*For MacOS config.json can be found in ‘/Users/<yourUsername>/.docker’*

*(press command+shift+. To display hidden folders)*

  

**Create a new Elastic Beanstalk Application**

-   Enter an Application name
    
-   Pick Docker as the Platform
    
-   Select ‘Upload your code’
    
-   Upload the Dockerrun.aws.json file
    
-   Select ‘Configure more options’
    
-   Edit Security
    
-   Add the previously created IAM Role in the IAM instance profile option under the Virtual Machine permissions section
    
-   Click ‘Save’
    
-   Click ‘Create environment’