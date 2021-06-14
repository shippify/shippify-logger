const cloudLogger = require('./../libs/cloudWatch');

class Logger {
    constructor(config = {}) {
        // By default It created 
        const { 
            serviceName
        } = config;

        if(Logger.serviceName && serviceName && `${Logger.serviceName}` === `${serviceName}`){
            console.warn('[Shippify-Logger]" serviceName" can defined once ')
        } else {
            Logger.serviceName = process.env.SERVICE_NAME ? process.env.SERVICE_NAME: serviceName? serviceName: 'Unknow-Service';
        }
    
    }


    middleware(req, res, next) {
        const { write, end } = res;
        const chunks = [];
        const rawBody = req.body ? JSON.parse(JSON.stringify(req.body)) : {};
      
        res.write = function newWrite(chunk) {
          chunks.push(chunk);
          write.apply(res, arguments);
        };
      
        res.end = function newEnd(chunk) {
          if (chunk) chunks.push(chunk);
          end.apply(res, arguments);
        };
      
        res.once('finish', () => {
          const response = Buffer.concat(chunks).toString('utf8');
      
          const log = {
            method: req.method,
            path: req.originalUrl,
            headers: req.headers,
            statusCode: res.statusCode,
            body: rawBody
          };
      
          try {
            log.response = JSON.parse(response);
          } catch (err) {
            console.log(JSON.stringify(err));
          }
      
          cloudLogger(Logger.serviceName, 'requests', log);
        });
      
        next();
    }

    log(options) {

        const {
         group, 
         log,
         level = 'info' /** It can be 'info', 'warn', 'error' */
        } = options;
    
        cloudLogger(Logger.serviceName, group, log, level);
    }

}

module.exports = Logger;
  