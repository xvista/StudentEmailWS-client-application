var argvList = [null, null, 'name', 'surname', 'id', 'university', 'country'];

function printUsage() {
  process.stdout.write('Usage: node client.js ');
  for (var i = 2; i < argvList.length; i++) {
    process.stdout.write('[' + argvList[i] + '] ');
  }
  process.stdout.write('\n');
}

for (var i = 2; i < argvList.length; i++) {
  if (process.argv[i] === undefined) {
    console.log('Error: `' + argvList[i] + '` argument is required.');
    printUsage();
    process.exit(1);
  }
}

var soap = require('soap');
var url = 'http://127.0.0.1:8888/wsdl?wsdl';
var args = {
  name: process.argv[2] + '.' + process.argv[3][0],
  univ: process.argv[5],
  country: process.argv[6]
};

soap.createClient(url, function(err, client) {
  client.getStudentEmail(args, function(err, result) {
    if (result.error) {
      console.log('Error: ' + result.error);
      process.exit(1);
    }
    console.log('Name: ' + process.argv[2] + ' ' + process.argv[3]);
    console.log('ID: ' + process.argv[4]);
    console.log('Email: ' + result.email);
  });
});