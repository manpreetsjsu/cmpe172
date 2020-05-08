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

1) Create file 'Dockerfile' and place in project root
2) Paste the following into the 'Dockerfile':
    FROM node:version
    container .

    WORKDIR /app

    COPY . /app

    RUN npm install

    CMD npm start

    EXPOSE 3000
2) Replace 'version' with installed version of node.js (can be found using node -v in cli)
3) Create '.dockerignore' file and place in project root
4) Paste the following into the '.dockerignore' file:
    node_modules
    npm-debug.log
5) Build Docker using:
    *Using terminal or command line, CD into project root directory*
    docker build -t <ContainerName> .
    (replace <ContainerName> with the name of the container you would like to create)
6) Run Docker to test if container works:
    docker run -it -p 8081:3000 <ContainerName>

7) Elastic Beanstalk steps
    Install Elastic Beanstalk CLI: https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/eb-cli3-install.html#eb-cli3-install.scripts
    *Requires python to be installed*
 8) Initialize EB
    eb init
    *say no to CodeCommit, ssh options and Spot Feelt options*
9) create EB environment
    eb create
    select defaults
10) Depoloy EB
    eb deploy
    *if no environment selected error shows up:*
        eb use <environmentName>
        (Default environment is set to <DirectoryName-Dev>)
            *replace DirectoryName with the name of your current Directory*
11) Confirm EB is deployed:
    eb open