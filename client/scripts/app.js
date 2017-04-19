

var app = {

  server: 'http://127.0.0.1:3000/classes/messages',
  friends: {},
  rooms: {},

  init: function() {
    console.log('Init runs');
  },

  send: function(message) {

    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: this.server,
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',

      success: function (data) {
        console.log('chatterbox: Message sent');
        app.fetch();
      },

      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message', data);
      }

    });
  },

  fetch: function(roomname) {

    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: this.server,
      type: 'GET',
      dataType: 'json',
      // data: {'order': '-createdAt', 'limit': 1000},
      contentType: 'json',

      success: function (data, status) {
        console.log('chatterbox: fetch success');
        console.log(data.results, status);
        var chats = data.results;

        for (var i = 0; i < chats.length; i++) {
              // app.renderMessage(chats[i]);
          //render all messages
          if (!roomname || roomname === 'All rooms') {
            app.renderMessage(chats[i]);
          } else if (roomname === chats[i].roomname) {
            app.renderMessage(chats[i]);
          }

          //check if the room exists and if not, add to rooms object and call render rooms
          if (!app.rooms[chats[i].roomname]) {
            app.renderRoom(chats[i].roomname);
            app.rooms[chats[i].roomname] = chats[i].roomname;
          }

        }
        app.renderFriends();       
      },

      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to fetch messages', data);
      }

    });

  },

  clearMessages: function() {
    $('#chats').empty();
  },


//changing text to message!!!!!!!!!!!!!!!!!!!!!!!!

  renderMessage: function(message) {
    console.log('render message: ', message);
    var $chatDiv = $('#chats');
    var $newChat = $('<div></div>');
    if (message.text && message.text.includes('<script>')) {

      $newChat.text('DANGER!!!!!!!!!!!! Message deleted');
      console.log('script found');
      $chatDiv.append($newChat);
    } else if (message.text && message.username) {
      $newChat.text('[' + message.roomname + '] ' + message.username + ': ' + message.text);
      $newDelete = $('<div class="deleteMe">Delete User</div>');
      $newDelete.attr('user', message.username);
      $newChat.addClass('chat');
      $newChat.addClass('messages');
      $newChat.addClass('username');
      $newChat.attr('user', message.username);
      $chatDiv.append($newChat);
      $chatDiv.append($newDelete);
    }
  },

  clearFriends: function() {
    $('#friends').empty();
  },

  clearRooms: function() {
    $('#roomSelect').empty();
    $('#roomSelect').append('<option>All rooms</option>');
  },

  addFriend: function(friend) {
    app.friends[friend] = friend;
    app.renderFriends();
  },


  renderFriends: function() {
    app.clearFriends();
    for (var friend in app.friends) {
      var $newFriendP = $('<p></p>');
      $newFriendP.text(friend);
      $('#friends').append($newFriendP);
      console.log(friend);
    }
    for (var friend in app.friends) {
      $(`.chat[user="${friend}"]`).css('font-weight', '900');
      $(`.chat[user="${friend}"]`).addClass('friend');
      console.log(friend);
    }
  },

  //this renders a single room
  renderRoom: function(room) {

    if (room && !room.includes('<script>')) {
      var $roomSelect = $('#roomSelect');
      var $newRoom = $('<option></option>');
      $newRoom.attr('value', room);
      $newRoom.text(room);
      $roomSelect.append($newRoom);
    }
  },

  handleUsernameClick: function(friend) {
    console.log(friend);
    app.addFriend(friend);
  },

  handleSubmit: function() {
    console.log('handleSubmit runs');
    var message = {
      username: $('#username').val(),
      text: $('#message').val(),
      roomname: $('#new-room').val(),
    };

    console.log(message);
    this.send(message);

  }

}; // end app


var getUrlParameter = function getUrlParameter(sParam) {
  var sPageURL = decodeURIComponent(window.location.search.substring(1));
  var sURLVariables = sPageURL.split('&');
  var sParameterName;
  var i = 0;

  for (i = 0; i < sURLVariables.length; i++) {
    sParameterName = sURLVariables[i].split('=');

    if (sParameterName[0] === sParam) {
      return sParameterName[1] === undefined ? true : sParameterName[1];
    }
  }
};

$(document).on('ready', function() {

  app.init();
  app.fetch();

  $('#username').val(getUrlParameter('username'));

  $('#send .submit').on('click', function() {
    app.handleSubmit();
  });

  // $('#send .submit').trigger('click');

  $('#clearChats').on('click', function() {
    app.clearMessages();
  });

  $('#chats').on('click', '.username', function() {
    app.handleUsernameClick($(this).attr('user'));
  });

  $('#refresh').on('click', function() {
    app.clearMessages();
    app.fetch($('#roomSelect').val());
    // setTimeout(function() {
    //   app.renderFriends();
    // }, 500);

  });

  $('#roomSelect').on('change', function() {
    app.clearMessages();
    app.fetch($(this).val());
    ($('#roomSelect').val() === 'All rooms') ? $('#new-room').val('Lobby') : $('#new-room').val($('#roomSelect').val());
    // setTimeout(function() {
    //   app.renderFriends();
    // }, 500);
  });

  $('#submitchangeMessages').on('click', function() {
    prependAll($('#prependAll').val());
    // app.clearMessages();
    // app.fetch($('#roomSelect').val());    
  });

  $('#chats').on('click', '.deleteMe', function() {
    console.log('clicked');
    var user = $(this).attr('user');
    deleteUser(user);

  });

  $('#selectFloor').on('change', function() {

    if (+$('#selectFloor').val() === 6) {
      console.log('** CHANGE TO 6 **');
      setFilter6();
      URL = URL6;
      app.server = URL6;
    } else {
      console.log('** CHANGE TO 8 **'); 
      setFilter8();
      URL = URL8;
      app.server = URL8;
    }  

    console.log(app.rooms);

    app.rooms = {};
    app.clearRooms();
    app.clearMessages();
    app.fetch($('#roomSelect').val());
  });  

});





