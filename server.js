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
server.nid=0;
server.devid=0;
var ss=[];
io.on('connection',function(socket){
	console.log('user '+socket.id+' connected');
	server.nid++;
	if(server.devid==0)
		server.devid=socket.id;
	socket.emit('yourid',server.nid);
	socket.on('newplayer',function(){
		socket.player={
			id:server.nid,
			x:Math.floor(Math.random()*800),
			y:400
		};
		ss.push(socket);
		socket.emit('allplayers',GetAllPlayers());
		socket.broadcast.emit('newplayer',socket.player);
	});
	socket.on('sendkey',function(n,key){
		// console.log(socket.id+':'+key);
		io.to(server.devid).emit('keyevent',socket.player.id,n,key);
	});
	socket.on('update',function(id,str){
		socket.broadcast.emit('setnew',id,str);
	});
	socket.on('disconnect',function(){
		console.log('user '+socket.id+' disconnected');
		// console.log(socket.player);
		if(socket.id!=server.devid)
			io.emit('removeplayer',socket.player.id);
		delete ss[ss.indexOf(socket)];
	});
});
function GetAllPlayers(){
    var players=[];
    Object.keys(ss).forEach(function(socketID){
        var player=ss[socketID].player;
        if(player)players.push(player);
    });
    return players;
}
server.listen(8081,function(){
	console.log(`Listening on ${server.address().port}`);
});