const Gree = require ('../src/client.js');
const BuildingClimate = require ('./building-climate.js');
const mqtt = require('mqtt');

const mqttHost = 'localhost';
const url = 'mqtt://' + mqttHost + ':1883/mqtt';

const mqttOpts = {qos: 1, retain: true};

// const hosts = [ '10.0.0.2' ];

const hosts = [
    '10.0.0.2',     // 0    // Keith
    '10.0.0.103',   // 1    // Living
    // '10.0.0.127',   // 1      //
    '10.0.0.143',   // 2    // Bed or Irina?
    '10.0.0.173',   // 3    // Dining
    '10.0.0.198',   // 4    // Bed or Irina?
    // '10.0.0.227'    // 4     // 
];

const climates = new BuildingClimate.BuildingClimate();
climates.mapHostToRoom("10.0.0.2", "keith", "home/climate/keith");
climates.mapHostToRoom("10.0.0.143", "bedroom", "home/climate/bedroom");    // or irina
climates.mapHostToRoom("10.0.0.103", "living", "home/climate/living");
climates.mapHostToRoom("10.0.0.173", "dining", "home/climate/dining");
climates.mapHostToRoom("10.0.0.198", "irina", "home/climate/irina");        // or bedroom


const options = {
    clean: true,
    connectTimeout: 4000,
  };
const mqttClient  = mqtt.connect(url, options);

mqttClient.on('error', function (error) {
    console.log('mqttClient error', error);
  });

  mqttClient.on('connect', function () {
    mqttClient.subscribe("home/climate/living");
    mqttClient.subscribe("home/climate/dining");
  });

  mqttClient.on('message', function (topic, message) {
    console.log('mqttClient message', topic, message.toString());
  });

const envProps = {};

// Create a gree client for each host
const clients = hosts.map(host => {
    var opts = {
        host: host,
        debug: false,
        autoConnect: false
        };
    const g = new Gree.Client(opts);
    return g;
});

// Connect to each client then once listen to each message
clients.forEach(client => {
    client.on('error', (err) => {
        console.log(client.getHost(), "error", err);
    });

    client.connect().then(() => {
        client.on('update', (updatedProperties, properties) => {
            console.log(client.getHost(), "current:", updatedProperties.currentTemperature, "target:",  properties.temperature);
            const props = {
                power: updatedProperties.power,
                mode: updatedProperties.mode,
                currentTemperature: updatedProperties.currentTemperature,
                fanSpeed: updatedProperties.fanSpeed,
            };
            envProps[client.getHost()] = props;
            climates.setClimate(client.getHost(), props);

            const host = climates.getHost(client.getHost());

            console.log("publish to", host.topic);
            mqttClient.publish(host.topic, JSON.stringify(host.climate), mqttOpts);
        }
        );
    });
});
