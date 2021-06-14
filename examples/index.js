const dotenv = require('dotenv');
dotenv.config();
const Logger = require('./../index');

/**
 * Simple logger 
 */

const log = new Logger({ serviceName: 'Example-Service'});

log.log({group: 'DataPipeline', log: { something: 'A thing that you want to log' }});
log.log({group: 'DataPipeline', log: { something: 'A thing that you want to log 2' }});
log.log({group: 'DataPipeline', log: { something: 'A thing that you want to log 3' }});
