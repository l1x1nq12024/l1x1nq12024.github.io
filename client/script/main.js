var oq=[];
var players={};
var aliveid=[];
var isdev=0,mineid=0;
var keys=[];
var ground;
const ndt=100;
var wps=[{hand:1,nife:2},{gun:3,mgun:4}];
var cds=[0,30,50,20,10];
function bombed(h,p)
{
	if(h.hitted.indexOf(p.bl)!=-1)return;
	h.hitted.push(p.bl);
	// console.log(h.bl+' hitted '+p.bl);
	p.setVelocityX(h.dirx*400);
}
class Game extends Phaser.Scene{
	constructor()
	{
        super({key:'Game'});
    }
	preload()
	{
		this.load.spritesheet('pl','/assets/pl.png',{frameWidth:16,frameHeight:16});
		this.load.image('bg','/assets/bg.png');
		this.load.image('gr','/assets/gr.png');
		this.load.image('hand','/assets/hand.png');
	}
	create()
	{
		this.anims.create({
			key:'left',
			frames:this.anims.generateFrameNumbers('pl',{start:0,end:5}),
			frameRate:12,
			repeat:-1
		});
		this.anims.create({
			key:'right',
			frames:this.anims.generateFrameNumbers('pl',{start:8,end:13}),
			frameRate:12,
			repeat:-1
		});
		this.anims.create({
			key:'lstop',
			frames:[{key:'pl',frame:0}],
			frameRate:1,
		});
		this.anims.create({
			key:'rstop',
			frames:[{key:'pl',frame:8}],
			frameRate:1,
		});
		this.anims.create({
			key:'ljump',
			frames:this.anims.generateFrameNumbers('pl',{start:6,end:7}),
			frameRate:6,
			repeat:0
		});
		this.anims.create({
			key:'rjump',
			frames:this.anims.generateFrameNumbers('pl',{start:14,end:15}),
			frameRate:6,
			repeat:0
		});
		if(isdev==1)
		{
			this.add.sprite(400,300,'bg');
			ground=this.physics.add.staticGroup();
			ground.create(400,595,'gr');
			this.physics.world.enable(ground);
		}
		else
		{
			this.add.sprite(400,300,'bg');
			this.add.sprite(400,595,'gr');
			Client.AskNewPlayer();
			this.input.keyboard.on('keydown',keydownevents);
			this.input.keyboard.on('keyup',keyupevents);
		}
	}
	update()
	{
		if(isdev==1)
		{
			while(oq.length)
			{
				var t=oq.pop();
				aliveid.push(t.id);
				players[t.id]=this.physics.add.sprite(t.x,t.y,'pl');
				players[t.id].anims.play('rstop',true);
				// players[t.id].body.gravity.y=-gg;
				keys[t.id]=[];
				this.physics.world.enable(players[t.id]);
				this.physics.add.collider(players[t.id],ground);
				var tp=this.physics;
				aliveid.forEach(function(i){
					if(i!=t.id)
						tp.add.collider(players[i],players[t.id]);
				});
				players[t.id].setCollideWorldBounds(true);
				players[t.id].bl=t.id;
				players[t.id].jj=0;
				players[t.id].last_dx=0;
				players[t.id].jkd=0;
				players[t.id].ds=0;
				players[t.id].hand={};
				players[t.id].w=[wps[0].hand,0];
				players[t.id].cd=[0,0];
				players[t.id].act=[0,0];
				players[t.id].hand=this.physics.add.sprite(300,650,'hand');
				players[t.id].hand.body.gravity.y=-gg;
				players[t.id].hand.hitted=[];
				players[t.id].hand.dirx=0;
				this.physics.world.enable(players[t.id].hand);
				this.physics.add.collider(players[t.id].hand,ground);
				aliveid.forEach(function(i){
					if(i!=t.id)
					{
						tp.add.collider(players[t.id].hand,players[i],bombed);
						tp.add.collider(players[i].hand,players[t.id],bombed);
					}
				});
			}
			aliveid.forEach(function(i){
				var dx=0;
				if(keys[i]['a']==1)dx-=1;
				if(keys[i]['d']==1)dx+=1;
				if(dx<0)players[i].setVelocityX(-160);
				else if(dx>0)players[i].setVelocityX(160);
				else players[i].setVelocityX(0);
				if(players[i].body.touching.down)
				{
					if(dx<0)
					{
						players[i].anims.play('left',true);
					}
					else if(dx>0)players[i].anims.play('right',true);
					else
					{
						if(players[i].last_dx<0)
							players[i].anims.play('lstop',true);
						else players[i].anims.play('rstop',true);
					}
				}
				if(keys[i]['w']==1)
				{
					if(players[i].body.touching.down)
					{
						if(players[i].jj==0)
							players[i].jj=10,players[i].ds=ndt-1,players[i].jkd=1;
					}
					else if(players[i].ds>0&&players[i].jkd==0)
					{
						if(players[i].jj==0)
							players[i].jj=10,players[i].ds--,players[i].jkd=1;
					}
				}
				else players[i].jkd=0;
				if(players[i].jj>0)
				{
					players[i].jj--;
					if(players[i].last_dx<0)
						players[i].anims.play('ljump',true);
					else players[i].anims.play('rjump',true);
					if(players[i].jj==0)
						players[i].setVelocityY(-400);
				}

				if(keys[i]['j']==1)
				{
					if(players[i].cd[0]==0)
					{
						var tx=0;
						if(dx!=0)tx=dx;
						else tx=players[i].last_dx;
						players[i].act[0]=1;
						players[i].hand.dirx=tx;
						players[i].cd[0]=cds[players[i].w[0]];
					}
				}
				if(players[i].act[0]==1)
				{
					var tx=0;
					if(dx!=0)tx=dx;
					else tx=players[i].last_dx;
					players[i].hand.x=players[i].x+2*tx*Math.max(0,10-Math.abs((30-players[i].cd[0])-10));
					players[i].hand.y=players[i].y;
				}
				if(players[i].cd[0]>0)players[i].cd[0]--;
				if(players[i].cd[0]==0&&players[i].act[0]==1)
				{
					players[i].hand.dirx=0;
					players[i].act[0]=0;
					players[i].hand.x=300;
					players[i].hand.y=650;
					players[i].hand.hitted=[];
				}
				// console.log(players[i].hand.dx);

				if(dx!=0)
					players[i].last_dx=dx;
			});
			aliveid.forEach(function(i){
				Client.Update(i,players[i]);
			});
		}
		else
		{
			while(oq.length)
			{
				var t=oq.pop();
				players[t.id]=this.add.sprite(t.x,t.y,'pl');
				players[t.id].hand=this.add.sprite(300,650,'hand');
			}
		}
	}
};
const gg=1000;
const config={
	type:Phaser.AUTO,
	parent:"phaser-example",
	width:800,
	height:600,
	pixelArt:true,
	physics:
	{
		default:'arcade',
		arcade:{
			gravity:{y:gg},
		}
	},
	scene:[Game]
}
const game=new Phaser.Game(config);
function AddNewPlayer(id,x,y)
{
	oq.push({id:id,x:x,y:y});
}
function RemovePlayer(id)
{
	players[id].destroy();
	delete players[id];
	if(aliveid.indexOf(id)!=-1)
		delete aliveid[aliveid.indexOf(id)];
}
function keydownevents(ch)
{
	Client.SendKey(1,ch.key);
}
function keyupevents(ch)
{
	Client.SendKey(0,ch.key);
}
function SetNew(id,str)
{
	var obj=JSON.parse(str);
	if(!players[id])return;
	players[id].x=obj.x;
	players[id].y=obj.y;
	players[id].anims.play(obj.an,true);
	players[id].hand.x=obj.hx;
	players[id].hand.y=obj.hy;
}