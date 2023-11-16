const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const port = 443;
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const router = require("express").Router();

app.use(express.json({ limit: "50mb" }));

app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));

/// MACHINE 1
/////////////
var triggerCounter = 0;
var triggerTimeList = [];
var triggeredClients = [];

var trigger = false;

var email = '';
var deviceType = '';
var name = '';

app.post("/checkTrigger", (req, res) => {
  res.setHeader("Content-Type", "application/json");

  let billboardType = req.body.billboard;
  var result = false;
  if (billboardType == "1") {
    result = trigger;
  } else if (billboardType == "2") {
    result = trigger2;
  }
  res.json({
    status: result,
    email: email,
    name: name,
    deviceType: deviceType
  });
});

app.post("/trigger", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  console.log('triggered');
  let clientID = Math.floor(Math.random() * 999999);
  let clientData = {
    id: clientID,
    status: true,
  }
  console.log(triggeredClients);
  // if (triggeredClients.map((id) => id).includes(clientID) == false) {
  //  triggeredClients.push(clientData);
  // }
  triggerCounter = triggerCounter + 1;
  let ts = Date.now();
  let date_ob = new Date(ts);
  let date = date_ob.getDate();
  let month = date_ob.getMonth() + 1;
  let year = date_ob.getFullYear();
  let hours = date_ob.getHours();
  let minutes = date_ob.getMinutes();
  let seconds = date_ob.getSeconds();
  triggerTimeList[triggerTimeList.length] = `${year}/${month}/${date} ${hours}:${minutes}:${seconds}`

  let billboardType = req.body.billboard;
  email = req.body.email;
  name = req.body.name;
  deviceType = req.body.deviceType;
  if (billboardType == "1") {
    trigger = true;
  } else if (billboardType == "2") {
    trigger2 = true;
  }

  console.log('triggerCount : ' + triggerCounter);
  console.log(`triggered in : ${triggerTimeList[triggerTimeList.length - 1]}`);
  console.log(trigger);
});

app.post("/resetTrigger", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  let billboardType = req.body.billboard;
  if (billboardType == "1") {
    trigger = false;
    email = '';
    name = '';
    deviceType = '';
  } else if (billboardType == "2") {
    trigger2 = false;
  }
  console.log('reset Trigger');
  console.log(trigger);
});
/////////////

/// MACHINE 2
var trigger2 = false;

var email2 = '';
var deviceType2 = '';
var name2 = '';
var triggerTimeList2 = [];
app.post("/checkTrigger2", (req, res) => {
  res.setHeader("Content-Type", "application/json");

  let billboardType = req.body.billboard;
  var result = false;
  if (billboardType == "1") {
    result = trigger2;
  } else if (billboardType == "2") {
    result = trigger2;
  }
  res.json({
    status: result,
    email: email2,
    name: name2,
    deviceType: deviceType2
  });
});

app.post("/trigger2", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  try {
    console.log('triggered');
    let clientID = Math.floor(Math.random() * 999999);
    let clientData = {
      id: clientID,
      status: true,
    }
    console.log(triggeredClients);
    // if (triggeredClients.map((id) => id).includes(clientID) == false) {
    //  triggeredClients.push(clientData);
    // }
    triggerCounter = triggerCounter + 1;
    let ts = Date.now();
    let date_ob = new Date(ts);
    let date = date_ob.getDate();
    let month = date_ob.getMonth() + 1;
    let year = date_ob.getFullYear();
    let hours = date_ob.getHours();
    let minutes = date_ob.getMinutes();
    let seconds = date_ob.getSeconds();
    triggerTimeList2[triggerTimeList2.length] = `${year}/${month}/${date} ${hours}:${minutes}:${seconds}`

    let billboardType = req.body.billboard;
    email2 = req.body.email;
    name2 = req.body.name;
    deviceType2 = req.body.deviceType;
    if (billboardType == "1") {
      trigger2 = true;
    } else if (billboardType == "2") {
      trigger2 = true;
    }

    console.log('triggerCount : ' + triggerCounter);
    console.log(`triggered in : ${triggerTimeList2[triggerTimeList2.length - 1]}`);
    console.log(trigger2);
  }
  catch (err) {
    console.log(err);
  }
});

app.post("/resetTrigger2", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  let billboardType = req.body.billboard;
  if (billboardType == "1") {
    trigger2 = false;
    email2 = '';
    name2 = '';
    deviceType2 = '';
  } else if (billboardType == "2") {
    trigger2 = false;
  }
  console.log('reset Trigger');
  console.log(trigger2);
});
////////////

app.listen(port, () =>
  console.log(`Listening calculationRouter on port ${port}`)
);
