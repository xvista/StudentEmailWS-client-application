var soap = require('soap');
var http = require('http');
var fs = require('fs');
var deasync = require('deasync');

var service = {
  StudentEmailWS: {
    production: {
      getStudentEmail: function(args) {
        var name = args.name;
        var univ = args.univ;
        var country = null;

        var doneClient = false;
        var url = 'http://www.oorsprong.org/websamples.countryinfo/CountryInfoService.wso?WSDL';
        soap.createClient(url, function (err, client) {
          var doneResult = false;
          client.CountryISOCode({ sCountryName: args.country }, function(err, result) {
            country = result.CountryISOCodeResult;
            doneResult = true;
          });
          deasync.loopWhile(function () { return !doneResult });
          doneClient = true;
        });
        deasync.loopWhile(function () { return !doneClient });
        
        if (country === 'No country found by that name') {
          return { error: country };
        }
        return { email: name + '@student.' + univ + '.ac.' + country.toLowerCase() };
      }
    }
  }
};

var xml = fs.readFileSync('service.wsdl', 'utf8');
var server = http.createServer(function(request, response) {
      response.end('404: Not Found: ' + request.url);
    });

server.listen(8888);
soap.listen(server, '/wsdl', service, xml);