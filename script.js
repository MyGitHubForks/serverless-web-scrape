const fs = require('fs');
const { exec } = require('child_process');
const argv = require('yargs').argv;

const paramArray = argv._;
let sourceURL = argv.hasOwnProperty('sourceURL') ? argv.sourceURL : undefined;
let destURL = argv.hasOwnProperty('destURL') ? argv.destURL : undefined;

console.log(paramArray, sourceURL, destURL);

if(!sourceURL || !destURL) {
  if(paramArray.length !== 2) {
    console.error('script accepts two parameters sourceURL and destURL');
  }else{
    console.log('check array');
  }
}else{
  const data = {
    sourceURL: sourceURL,
    destURL: destURL
  };

  fs.writeFileSync('./data.json', JSON.stringify(data) , 'utf-8'); 
  exec('serverless invoke --function chrome --log -p ./data.json', (err, stdout, stderr) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(stdout);
  });
}
