# shippify-logger
This is a logger library for registering logs on Cloud Watch.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.


### Installing

This is a Node.js module available through to include in your package.json file. 

```json 
....
"dependencies": {
    .....
    "shippify-logger": "git+https://github.com/shippify/shippify-logger.git"
    ....
}
....
```

Installation is done using the npm install command:

```
npm install
```
### Environment variables

You need to set up these variables to use this library:

```
SERVER_ENV=production
SHIPPIFY_AMAZON_ACCESS_KEY_ID=
SHIPPIFY_AMAZON_SECRET_ACCESS_KEY=
SHIPPIFY_AMAZON_REGION=

```

How to use this library? Look this example.

```

const Logger = require('shippify-logger');

// Simple  

const log = new Logger({ serviceName: 'Example-Service'});

log.log({group: 'DataPipeline', log: { something: 'A thing that you want to log' }});

```

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/your/project/tags). 

## Authors

* **Leonardo Larrea** - *A Developer*

See also the list of [contributors](https://github.com/shippify/shippify-logger/graphs/contributors) who participated in this project.

