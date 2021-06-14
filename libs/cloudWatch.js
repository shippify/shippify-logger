const AWS = require('aws-sdk');
const crypto = require('crypto');
const winston = require('winston');
const WinstonCloudWatch = require('winston-cloudwatch');
const { serializeError } = require('serialize-error');
const slackNotification = require('./slack');
const env = process.env.SERVER_ENV;

AWS.config.update({
  accessKeyId: process.env.SHIPPIFY_AMAZON_ACCESS_KEY_ID,
  secretAccessKey: process.env.SHIPPIFY_AMAZON_SECRET_ACCESS_KEY,
  region: process.env.SHIPPIFY_AMAZON_REGION|| 'sa-east-1'
});

const cloudWatchLogs = new AWS.CloudWatchLogs();
const startTime = new Date().toISOString();
const loggers = {};

const cloudWatchLogger = (serviceName = 'shippify-logger', logGroup, log, level = 'info') => {
  if (env === 'production') {
    try {
      if (!loggers[logGroup]) {
        loggers[logGroup] = winston.createLogger({
          transports: [
            new WinstonCloudWatch({
              cloudWatchLogs,
              logGroupName: `/${serviceName.replace(' ')}/${logGroup}`,
              logStreamName: () => {
                const date = new Date().toISOString().split('T')[0];
                const hash = crypto.createHash('md5').update(startTime).digest('hex');
                return `${date}/${hash}`;
              },
              retentionInDays: 90,
              jsonMessage: true,
              errorHandler: (err) => {
                if (err) console.log('[Shippify-Logger Error!] => ', err);
                slackNotification({
                  channel: '#cloudwatch-notifications',
                  type: `CloudWatch Error from ${serviceName}`,
                  description: 'Look the next description to see the error caught:',
                  payload: err
                });
              }
            })
          ]
        });
      }
      loggers[logGroup].log({
        level,
        message: log
      });
    } catch (err) {
      if (err) console.log('[Shippify-Logger Error!] => ', err);
      slackNotification({
        channel: '#cloudwatch-notifications',
        type: `CloudWatch Error from ${serviceName}`,
        description: 'Look the next description to see the error caught:',
        payload: serializeError(err)
      });
    }
  } else {
    console.log(`[Shippify-Logger Error!] =>  [Shippify-Logger is disabled, SERVER_ENV = 'production' is required] => ` , log);
  }
};

module.exports = cloudWatchLogger;
