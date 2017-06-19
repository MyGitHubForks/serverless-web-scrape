const launchChrome = require('@serverless-chrome/lambda');
const CDP = require('chrome-remote-interface');
const axios = require('axios');

const getErrorJSON = function(error, message='') {
  return {
    statusCode: 500,
    body: JSON.stringify({
      error: error,
      message: message
    })
  };
}

module.exports.chrome = (event, context, callback) => {
  let sourceURL = event.sourceURL;
  let destURL = event.destURL;
  console.log(sourceURL, destURL);

  if(!sourceURL || !destURL){
    const msg = 'Missing arguments';
    console.error(msg);
    callback(null, getErrorJSON('', msg));
    return;
  }
  
  console.log('launching headless Chrome');
  launchChrome({
    flags: ['--window-size=1280x1696', '--hide-scrollbars']
  })
  .then((chrome) => {
    // Chrome is now running on localhost:9222
    console.log('Chrome is now running on localhost:9222')
    CDP((client) => {
      const {DOM, Page} = client;
      let data = {};
      
      Page.enable().then(()=>{
        return Page.navigate({url: sourceURL});
      }).then(()=>{
        return Page.loadEventFired(()=>{
          DOM.getDocument()
          .then((document) => {
            return DOM.getOuterHTML({nodeId: 1});
          }).then((data) => {
            return axios.post(destURL, {
              page: data
            });
          }).then(() => {
            console.log('called endpoint');
            return client.close().then(() => {
              callback(null, {
                statusCode: 200,
                  body: JSON.stringify({
                  message: 'Command successfully!'
                  })
              });
            });
          }).catch((error) => {
            console.error(error);
            callback(null, getErrorJSON(error, ''));
          });
        });
      }).catch((error) => {
        console.error(error);
        callback(null, getErrorJSON(error, ''));
      });
    }).on('error', (error) => {
      console.error(error);
      callback(null, getErrorJSON(error, ''));
    });
  })
  .catch((error) => {
    console.error("Chrome didn't launch correctly", error);
    callback(null, getErrorJSON(error, "Chrome didn't launch correctly"));
  });
};
