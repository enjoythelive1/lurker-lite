const restAPI = require('./rest-API');

const server = restAPI.listen(process.env.PORT || 8080, () => {
  console.log(`Serving on port ${server.address().port}`);
});
