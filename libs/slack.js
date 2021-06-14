
const AWS = require('aws-sdk');
const sns = new AWS.SNS();


AWS.config.update({
    accessKeyId: process.env.SHIPPIFY_AMAZON_ACCESS_KEY_ID,
    secretAccessKey: process.env.SHIPPIFY_AMAZON_SECRET_ACCESS_KEY,
    region: process.env.SHIPPIFY_AMAZON_REGION|| 'sa-east-1'
});
 
module.exports = (options) => {

    const {
        channel = '#shippify-logger', 
        type = 'CloudWatch Error from Shippify Logger',
        description = 'Look the next description to see the error caught:',
        payload = 'Unknow Error, you forgot to include the payload'
    } = options;

    const message = {
      priority: 1,
      channel,
      type,
      description,
      payload
    };
  
    const params = {
      Message: JSON.stringify(message),
      TopicArn: 'arn:aws:sns:sa-east-1:878623218037:urgentDevInnerNotifications'
    };

    sns.publish(params, (err) => {
        if (err) console.log('[Shippify-Logger Error!] => ', err);
    });
};
