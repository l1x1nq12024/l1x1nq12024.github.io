var Client={};
Client.socket=io();
Client.AskNewPlayer=function(){
    Client.socket.emit('newplayer');
};
Client.socket.on('newplayer',function(data){
    AddNewPlayer(data.id,data.x,data.y);
});
Client.socket.on('allplayers',function(data){
    console.log(data);
    for(var i=0;i<data.length;i++){
        AddNewPlayer(data[i].id,data[i].x,data[i].y);
    }
});
Client.socket.on('removeplayer',function(id){
    RemovePlayer(id);
});
Client.socket.on('yourid',function(id){
    mineid=id;
    if(mineid==1)isdev=1;
});
Client.SendKey=function(n,key){
    Client.socket.emit('sendkey',n,key);
}
Client.socket.on('keyevent',function(id,n,key){
    // console.log(id+':'+n+' '+key);
    keys[id][key]=n;
});
Client.Update=function(id,p){
    var obj={x:p.x,y:p.y,an:p.anims.currentAnim.key,hx:p.hand.x,hy:p.hand.y};
    Client.socket.emit('update',id,JSON.stringify(obj));
};
Client.socket.on('setnew',function(id,str){
    SetNew(id,str);
});