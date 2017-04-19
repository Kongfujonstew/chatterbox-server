var bodyParser = require('body-parser');

var messages = {
  lobby: []
};

var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10 // Seconds.
};

var requestHandler = function(req, res) {
  console.log('Serving req type ' + req.method + ' for url ' + req.url);



  var headers = defaultCorsHeaders;
  headers['Content-Type'] = 'application/json';

  var handleGetRequest = (req, res) => {
    //parse the url string and ask what room, and return only that room's messages

    var messageObj = {
      results: messages.lobby 
    };
    var statusCode = 200;
    //console.log(messageObj);
    var messageBody = JSON.stringify(messageObj);
    res.writeHead(statusCode, headers);
    res.end(messageBody);

  };

  var handlePostRequest = (req, res) => {
    var room = req.url.slice(18) || 'lobby';

    var statusCode = 201;
    var body = [];
    req.on('data', function(chunk) {
      body.push(chunk);
      console.log('hello from handlePostRequest, body = ', body);
      messages[room].push(JSON.parse(body));
    });
    res.writeHead(statusCode, headers);
    res.end(JSON.stringify(messages[room]));  
  };

  var handleError = (req, res) => {
    var statusCode = 404;
    res.writeHead(statusCode, headers);
    res.end('error');
  };


  if (req.url !== '/classes/messages') {
    handleError(req, res);
  } else if (req.method === 'OPTIONS' || req.method === 'GET') {
    handleGetRequest(req, res);
  } else if (req.method === 'POST') {
    handlePostRequest(req, res);
  }

};


module.exports.requestHandler = requestHandler;

