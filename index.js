/* Code based on Tom Igoe's Simple Serial Server -
   GitHub Project: https://github.com/ITPNYU/physcomp/tree/master/labs2014/Node%20Serial%20Lab    
   Blog/Tutorial: https://itp.nyu.edu/physcomp/labs/labs-serial-communication/lab-serial-communication-with-node-js/ 
*/
var SerialPort = require('serialport');
var Express = require('express');

var serialPortName = process.argv[2];
var myPort = new SerialPort(serialPortName, 9600);
var Readline = SerialPort.parsers.Readline;
var parser = new Readline();

myPort.pipe(parser);

myPort.open('open', showPortOpen);
myPort.open()