var express=require('express');
var app=express();
var server=require('http').Server(app);
var io=require('socket.io')(server);
app.use('/script',express.static(__dirname+'/client/script'));
app.use('/assets',express.static(__dirname+'/client/assets'));
app.use('/build',express.static(__dirname+'/client/build'));
app.get('/',function(req,res)
{
	res.sendFile(__dirname+'/client/index.html');
});
server.lastid=0;
server.devid;
var ss=[];
io.on('connection',function(socket){
	console.log('user '+socket.id+' connected');
	socket.on('newplayer',function(){
		if(server.lastid==0)
			server.devid=socket.id;
		console.log(server.devid);
		socket.player=
		{
			id:++server.lastid,
			x:Math.floor(Math.random()*800),
			y:Math.floor(Math.random()*400)+200
		};
		// console.log(socket.player);
		ss.push(socket);
		socket.emit('yourid',server.lastid);
		socket.emit('allplayers',GetAllPlayers());
		socket.broadcast.emit('newplayer',socket.player);
	});
	socket.on('changeanims',function(id,str){
		io.emit('playanims',id,str);
	});
	socket.on('changepic',function(id,str){
		io.emit('playpic',id,str);
	});
	socket.on('changev',function(id,k,s){
		io.to(server.devid).emit('setv',id,k,s);
	});
	socket.on('changep',function(id,x,y){
		Object.keys(ss).forEach(function(socketID){
			var s=ss[socketID];
			if(s.player)
			{
				if(s.id!=server.devid)
					s.emit('setp',id,x,y);
			}
		});
	});
	socket.on('sendtd',function(id,k){
		Object.keys(ss).forEach(function(socketID){
			var s=ss[socketID];
			if(s.player.id==id)
				s.emit('gettd',k);
		});
	});
	socket.on('disconnect',function(){
		console.log('user '+socket.id+' disconnected');
		io.emit('removeplayer',socket.player.id);
		delete ss[ss.indexOf(socket)];
	});
});
function GetAllPlayers(){
    var players=[];
	// console.log(ss);
    Object.keys(ss).forEach(function(socketID){
        var player=ss[socketID].player;
        if(player)players.push(player);
    });
    return players;
}
server.listen(8081,function(){
	console.log(`Listening on ${server.address().port}`);
});