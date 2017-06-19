##Installation
```
$ npm install -g serverless
$ npm install
```

##Credentials
Go through [setup steps][1] to create a user in AWS console 
[1]: https://serverless.com/framework/docs/providers/aws/guide/credentials#creating-aws-access-keys

##Deploy
`$ serverless deploy -v`

##Calling function from command line
`sourceURL` is the page that the html will be grabbed from
`destURL` is the endpoint to call the HTT POST call with JSON object {page: '<HTML>'} 

`$ node script.js --sourceURL=https://sourcepage.com --destURL=https://endpoint.com/api/`