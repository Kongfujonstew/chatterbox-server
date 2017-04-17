var URL = 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages';

var URL6 = 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages';

var URL8 = 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages';

var messages = [];

var fetch = function() {
  $.ajax({
    url: URL,
    type: 'GET',
    data: {order: '-createdAt', limit: 3000},
    contentType: 'application/json',
    success: function (data) {
      data.results.forEach(function(element) {
        messages.push(element.objectId);
      });
    },
    error: function (data) {
      console.error('chatterbox: Failed to send message', data);
    }
  });
};

var fetchField = function() {

  var fields = ['objectId'];
  for (var i = 0; i < arguments.length; i++) {
    fields.push(arguments[i]);
  }

  $.ajax({
    url: URL,
    type: 'GET',
    data: {order: '-createdAt', limit: 3000},
    contentType: 'application/json',
    success: function (data) {
      data.results.forEach(function(element) {
        var object = {};
        fields.forEach(x => object[x] = element[x]);
        messages.push(object);
      });
    },
    error: function (data) {
      console.error('chatterbox: Failed to send message', data);
    }
  });
};

var deleteMessage = function(contentKey) {
  $.ajax({
    url: URL + '/' + contentKey,
    type: 'DELETE',
    success: function() {console.log('Deleted');},
    error: function(){console.log('Failed');}
  });
};

var updateMessage = function(message) {

  console.log(message);

  $.ajax({
    url: URL + '/' + message.objectId,
    data: message,
    type: 'PUT',
    success: function(){console.log('Updated');},
    error: function(){console.log('Failed');}
  });
};

var errorMessage = {
  username: 'System Message: 95g89dehf_adminParseAPI',
  text: 'GET 403 ERROR: Invalid API key',
  roomname: 'ParseAPI',
};

var deleteDB = function() {

  fetch();

  setTimeout(function() {
    messages.forEach(function(objID) {
      if (objID) {deleteMessage(objID);}
    });
    messages = [];
    sendMessage(errorMessage);
  }, 2000);

};

var deleteUser = function(user) {
  messages = [];

  fetchField('username');

  setTimeout(function() {
    messages = messages.filter(x => x.username === user);
    messages.forEach(msg => deleteMessage(msg.objectId));
  }, 3000);

};

var deleteRoom = function(room) {
  messages = [];

  fetchField('roomname');

  setTimeout(function() {
    messages = messages.filter(x => x.roomname === name);
    messages.forEach(msg => deleteMessage(msg.objectId));
  }, 3000);

};


var prependAll = function(string) {
  messages = [];
  fetchField('username', 'text', 'roomname');

  setTimeout(function() {
    messages.forEach(x => x.text = string + x.text);
    messages.forEach(x => updateMessage(x)); 
  }, 3000);

};

var sendMessage = function(message) {

  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: URL,
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',

    success: function (data) {
      console.log('chatterbox: Message sent');
    },

    error: function (data) {
    // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message', data);
    }

  });
};

var message = {
  username: 'joneric',
  text: 'hello',
  roomname: 'lobby',
};





