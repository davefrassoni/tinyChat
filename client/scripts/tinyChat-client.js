$(document).ready(function() {
	var socket = io.connect('http://localhost:8080/');
	
	var chatOpener = $("#chatOpener");
	var chatToggler = $("#chatToggler");
	var chatCloser = $("#chatCloser");
	var chatContent = $("#chatContent");
	var chatInput = $('#chatInput');
	var chatNick = $('#chatNick');
	var chatPeople = $('#chatPeople');
	
	socket.on('connect', function ()
	{
		chatInput.removeAttr('disabled');
		chatNick.removeAttr('disabled');
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
		chatPeople.text('');
		for(var i in users)
		{
			chatPeople.append('<span style="color:' + users[i].color + '">' + users[i].nick + '</span> - ');
		}
	});
	
	socket.on('nickChange', function (user)
	{
		chatContent.append('<p><span style="color:' + user.color + '">' + user.oldNick + '</span> changed his nick to <span style="color:' + user.color + '">' + user.newNick + '</span></p>');
		
		chatScrollDown();
	});
	
	chatOpener.click(function () {
		$('#chatToggler').toggle("slide", { direction: "down" }, 1000);
	});
	
	chatCloser.click(function () {
		$('#chatToggler').toggle("slide", { direction: "down" }, 1000);
	});
	
	function chatScrollDown()
	{
		var objChatContent = document.getElementById("chatContent");
		objChatContent.scrollTop = objChatContent.scrollHeight;
	};
});