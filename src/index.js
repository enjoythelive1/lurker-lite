const schedule = require('node-schedule');
const restAPI = require('./rest-API');
const sendNewsletter = require('./services/send-newsletter');

const server = restAPI.listen(process.env.PORT || 8080, () => {
  console.log(`Serving on port ${server.address().port}`);
  schedule.scheduleJob('00 00 08 * * * ', sendNewsletter);
});
