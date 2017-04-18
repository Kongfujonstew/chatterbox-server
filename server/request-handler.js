var bodyParser = require('body-parser');


/*************************************************************

You should implement your req handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/
var messages = {
  lobby: [{
    username: 'Jono',
    message: 'Do my bidding!',
    roomname: 'lobby'
  }]
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
    var room = req.url.slice(18);
    //console.log('this is roomname in request-handler: ', room);
    //find the room by slicing req.method

  //MOVE lines 74 75________________________________________________________

    //ask if the room exists
    //add in functionality to check if messages.room exists.  if not create it if so add message to that room
    var statusCode = 201;
    var body = [];
    req.on('data', function(chunk) {
      body.push(chunk);
      //body = Buffer.concat(body).toString();
      messages.lobby.push(JSON.parse(body));
      //console.log(req.client["_events"].data)
    });//.on('end', function() {
    //});
    res.writeHead(statusCode, headers);
    res.end('Post complete');  
  };
  //console.log(messages)

  var handleError = (req, res) => {
    var statusCode = 404;
    res.writeHead(statusCode, headers);
    res.end('ERROR!');
  };


  // if (req.url === '/classes/messages/lobby') {
  //   handlePostRequest(req, res);
  // }

  //console.log('here is the url: ', req.url);

  if (req.url !== '/classes/messages') {
    handleError(req, res);
  }


  if (req.method === 'OPTIONS' || req.method === 'GET') {
    console.log('handleGetRequest fired');
    handleGetRequest(req, res);
  } else if (req.method === 'POST') {
    handlePostRequest(req, res);
  }




//redo messages array, including get request so that it returns lobby by default

  // req and res come from node's http module.
  //
  // They include information about both the incoming req, such as
  // headers and URL, and about the outgoing res, such as its status
  // and content.
  //
  // Documentation for both req and res can be found in the HTTP section at
  // http://nodejs.org/documentation/api/

  // Do some basic logging.
  //
  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray
  // console.logs in your code.

  // The outgoing status.

  // See the note below about CORS headers.

  // Tell the client we are sending them plain text.
  //
  // You will need to change this if you are sending something
  // other than plain text, like JSON or HTML.

  // .writeHead() writes to the req line and headers of the res,
  // which includes the status and all headers.

  // Make sure to always call res.end() - Node may not send
  // anything back to the client until you do. The string you pass to
  // res.end() will be the body of the res - i.e. what shows
  // up in the browser.
  //
  // Calling .end "flushes" the res's internal buffer, forcing
  // node to actually send all the data over to the client.
};

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.

module.exports.requestHandler = requestHandler;

