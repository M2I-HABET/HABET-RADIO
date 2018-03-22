/* Code based on Tom Igoe's Simple Serial Server -
   GitHub Project: https://github.com/ITPNYU/physcomp/tree/master/labs2014/Node%20Serial%20Lab    
   Blog/Tutorial: https://itp.nyu.edu/physcomp/labs/labs-serial-communication/lab-serial-communication-with-node-js/ 
*/
var SerialPort = require('serialport');
var WebSocketServer = require('ws').Server;

var SERVER_PORT = 8081;

var wss = new WebSocketServer({port: SERVER_PORT});
var connections = new Array;

// TODO Add a command argument checks here.
// if (process.argv.length === 2) {
//     console.log('Type -help to get a list of arguments.');
    
//     process.exit(-1);
// }

// if (process.argv === 3 && process.argv[2] == '-help') {
//     console.log("-help : Prints all the possible arguments. ");
//     console.log("-ports : Prints all available serial ports.");
//     console.log("<serialport> : connects to the supplied serial port.")
// }

var portName = process.argv[2];
var myPort = new SerialPort(portName, 9600);
var Readline = SerialPort.parsers.Readline;
var parser = new Readline();

myPort.pipe(parser);

myPort.on('open', showPortOpen);
myPort.on('close', showPortClose);
myPort.on('error', showError);
parser.on('data', readSerialData);

/* Gets a list of available ports on the system. */
function getSerialPorts() {
    SerialPort.list(function (error, ports) {
        ports.forEach(function (port) {
            console.log(port.comName);
        });
    });
}

/* A callback function for when a serial port is open. */
function showPortOpen() {
    console.log('Port open. data rate: ' + myPort.baudRate + ".");
}

/* A callback function for when a serial port is closed. */
function showPortClose() {
    console.log('Port closed.');
}

/* A callback function for when a serial port encounters and error. */
function showError(error) {
    console.log('Serial port error: ' + error + ".");
}

/* A callback function for reading data from a serial port.  */
function readSerialData(data) {
    console.log(data);

    if (connections.length > 0) {
        broadcast(data);
    }
}

/* Sends data to a serial port. */
function sendToSerial(data) {
    console.log("Sending to serial : " + data + ".");

    myPort.write(data);
}

wss.on('connection', handleConnection);

/* A callback function for when a new client connects to the socket. */
function handleConnection(client) {
    console.log("New connection.");

    connections.push(client);

    client.on('message', sendToSerial);

    client.on('close', function() {
        console.log("Connection closed.");

        var position = connections.indexOf(client);

        connections.splice(position, 1);
    });
}

/* Broadcasts messages to all connected clients. */
function broadcast(data) {
    for (c in connections) {
        connections[c].send(JSON.stringify(data));
    }
}