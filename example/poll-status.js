const Gree = require('gree-hvac-client');
const mqtt = require('mqtt');

const hosts = [
    '10.0.0.2',     // 0 fanSpeed medLow K Office
    '10.0.0.103',   // 1 fanSpeed auto
    '10.0.0.143',   // 2 fanSpeed auto
    '10.0.0.173',   // 3 fanSpeed auto
    '10.0.0.198'    // 4 fanSpeed high
];

const myHost = hosts[4];

const client = new Gree.Client({
    host: '192.168.7.60',
    debug: false,
});

client.on('connect', client => {
    console.log('connected to', client.getDeviceId());
});
client.on('update', (updatedProperties, properties) => {
    console.log(updatedProperties, properties);
});
client.on('disconnect', () => {
    console.log('disconnect');
});
client.on('no_response', () => {
    console.log('no_response');
});
client.on('error', error => {
    console.error(error);
});
