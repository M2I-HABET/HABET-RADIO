/* Code based on Tom Igoe's Simple Serial Server -
   GitHub Project: https://github.com/ITPNYU/physcomp/tree/master/labs2014/Node%20Serial%20Lab    
   Blog/Tutorial: https://itp.nyu.edu/physcomp/labs/labs-serial-communication/lab-serial-communication-with-node-js/ 
*/
var SerialPort = require('serialport');
var Express = require('express');

var Server = Express();	

// TODO Add a command argument checks here.

var portName = process.argv[2];
var myPort = new SerialPort(portName, 9600);
var Readline = SerialPort.parsers.Readline;
var parser = new Readline();

myPort.pipe(parser);

myPort.on('open', showPortOpen);
myPort.on('close', showPortClose);
myPort.on('error', showError);
parser.on('data', readSerialData);

Server.use('/', Express.static('www'));
Server.listen(8080);

function showPortOpen() {
    console.log('port open. data rate: ' + myPort.baudRate);
}

function showPortClose() {
    console.log('port closed.');
}

function showError(error) {
    console.log('Serial port error: ' + error);
}

function readSerialData(data) {
    console.log(data);
}