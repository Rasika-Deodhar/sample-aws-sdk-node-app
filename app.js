const express = require('express')
const app = express()
const path = require('path');
const port = process.env.port || 3000;

var AWS = require('aws-sdk');

var regions;
var VPCs;
var subnets;
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);

// Set the region 
// Put my accessKeyId and secretAccessKey
AWS.config.update({region:'us-east-1', accessKeyId: 'MY_ACCESS_KEY_ID', secretAccessKey: 'MY_SECRET_ACCESS_KEY'});

// Create EC2 service object
var ec2 = new AWS.EC2({apiVersion: '2016-11-15'});

var params = {};

// Retrieves all regions/endpoints that work with EC2
ec2.describeRegions(params, function(err, data) {
  if (err) {
    console.log("Error", err);
  } else {
    regions = data.Regions;
  }
});

// Retrieves VPCs only for region of the ec2 service object
ec2.describeVpcs(params, function(err, data) {
  if (err) {
    console.log("Error", err);
  } else {
    VPCs = data.Vpcs;
  }
});

// Retrieves Subnets only for VPCs of the ec2 service object
ec2.describeSubnets(params, function(err, data) {
  if (err) {
    console.log("Error", err);
  } else {
    subnets = data.Subnets;
  }
});

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/route1', (req, res) => {
    res.render(__dirname+'/route1.html', {regions:regions});
})
app.get('/route2', (req, res) => {
    res.render(__dirname+'/route2.html', {VPCs:VPCs});
})
app.get('/route3', (req, res) => {
    res.render(__dirname+'/route3.html', {subnets:subnets, VPC:VPCs[0].VpcId});
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})