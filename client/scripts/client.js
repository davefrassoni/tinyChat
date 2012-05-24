$(document).ready(function() {
	var socket = io.connect('http://localhost:8080');
	
	var status = $("#status");
	var chatContent = $("#chatContent");
	var chatInput = $('#chatInput');
	var chatNick = $('#chatNick');
	var people = $('#people');
	
	socket.on('connect', function ()
	{
		status.text('status: online');
		chatInput.removeAttr('disabled');
		chatNick.removeAttr('disabled');
		document.getElementById("chatInput").focus();
	});
	
	chatInput.keydown(function(e)
	{
		if (e.keyCode === 13) {
			var msg = chatInput.val();
			if (!msg) {
				return;
			}
			if(msg == 'cls' | msg == 'clear') {
				chatContent.text('');
				chatInput.val('');
				return;
			}
			
			socket.emit('message', { text: chatInput.val() });
			chatInput.val('');
		}
	});
	
	chatNick.keydown(function(e)
	{
		if (e.keyCode === 13) {
			var msg = chatNick.val();
			if (!msg) {
				return;
			}
			
			socket.emit('nickChange', { nick: chatNick.val() });
		}
	});
	
	socket.on('message', function(msg)
	{
		chatContent.append('<p><span style="color:' + msg.color + '">' + msg.nick + '</span>: ' + msg.text + '</p>');
		
		chatScrollDown();
	});
	
	socket.on('userJoined', function (user)
	{
		chatContent.append('<p>&raquo; <span style="color:' + user.color + '">' + user.nick + '</span> joined.</p>');
		
		chatScrollDown();
	});
	
	socket.on('userLeft', function (user)
	{
		chatContent.append('<p>&raquo; <span style="color:' + user.color + '">' + user.nick + '</span> left.</p>');
		
		chatScrollDown();
	});
	
	socket.on('users', function (users)
	{
		people.text('');
		for(var i in users)
		{
			people.append('<p><span style="color:' + users[i].color + '">' + users[i].nick + '</span></p>');
		}
	});
	
	socket.on('nickChange', function (user)
	{
		chatContent.append('<p><span style="color:' + user.color + '">' + user.oldNick + '</span> changed his nick to <span style="color:' + user.color + '">' + user.newNick + '</span></p>');
		
		chatScrollDown();
	});

	function chatScrollDown()
	{
		var objChatContent = document.getElementById("chatContent");
		objChatContent.scrollTop = objChatContent.scrollHeight;
	};
});