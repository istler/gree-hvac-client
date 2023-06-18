//const Gree = require('gree-hvac-client');
const Gree = require ('../src/client.js');
const mqtt = require('mqtt');

const mqttHost = 'localhost';
const url = 'mqtt://' + mqttHost + ':1883/mqtt';
const topic = 'home/bedroom/temperature';

const hosts = [
    '10.0.0.2',     // 0 fanSpeed medLow K Office
    '10.0.0.103',   // 1 fanSpeed auto
    '10.0.0.143',   // 2 fanSpeed auto
    '10.0.0.173',   // 3 fanSpeed auto  // timeout
    '10.0.0.198'    // 4 fanSpeed high  // 
];

const myHost = hosts[0];

const client = new Gree.Client({
    host: myHost,
    debug: false,
});

// for each hosts, create a new client



// Create an MQTT client instance
/*
const options = {
  clean: true,
  connectTimeout: 4000,
}
const mqttClient  = mqtt.connect(url, options);
mqttClient.on('connect', function () {
  console.log('Connected to mqtt');
  /*
  mqttClient.subscribe(topic, function (err) {
    console.log('publish on connect');
    if (!err) {
      mqttClient.publish(topic, 'Hello mqtt');
    }
  });
});
*/

// Receive messages
/*
mqttClient.on('message', function (topic, message) {
    // message is Buffer
    console.log("Got message", topic, JSON.stringify(message), message.toString());
    mqttClient.end()
  });
mqttClient.on('error', function (error) {
    console.log('mqttClient error', error);
  });
*/

// for (var i = 0; i<hosts.length; i++) {
//   const client = new Gree.Client({
//         host: hosts[i],
//         debug: false,
//     });


client.on('connect', client => {
    console.log(client.getHost(), 'connected to', client.getDeviceId());
});

client.on('update', (updatedProperties, properties) => {
    if (updatedProperties.currentTemperature > properties.temperature) {
        console.log(client.getHost(), "current:", updatedProperties.currentTemperature, "target:",  properties.temperature);
    } else {
        console.log(client.getHost(), "current:", updatedProperties.currentTemperature);
    }

//    client.disconnect();
    /*
    const opts = {
        qos: 0,
        retain: true
    };
    mqttClient.publish(topic, updatedProperties.currentTemperature + '', opts);
    console.log(updatedProperties);
    */
});
// }

/*
client.on('disconnect', () => {
    console.log('disconnect');
});
client.on('no_response', () => {
    console.log('no_response');
});
client.on('error', error => {
    console.error(error);
});
*/
