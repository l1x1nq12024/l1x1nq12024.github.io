var oq=[];
var ground;
var leftk={},rightk={},upk={};
var mineid=-1,isdev=0;
const ndt=100;
var last_dx=1;
var jj=0,ds=0,jkd=0;
var aliveid=[];
var istd=0;
class Game extends Phaser.Scene{
	constructor() {
        super({key:'Game'});
    }
	preload()
	{
		this.load.spritesheet('dt','/assets/pl.png',{frameWidth:16,frameHeight:16});
		this.load.spritesheet('g1','/assets/g1.png',{frameWidth:16,frameHeight:16});
		this.load.image('bg','/assets/bg.png');
		this.load.image('gr','/assets/gr.png');
		this.load.image('tp','/assets/top.png');
		this.load.image('si','/assets/side.png');
		this.load.image('gg1','/assets/gg1.png');
		this.load.spritesheet('bu','/assets/bu.png',{frameWidth:3,frameHeight:3});
	}
	create()
	{
		Client.AskNewPlayer();
		this.add.image(400,300,'bg');
		ground=this.physics.add.staticGroup();
		ground.create(400,595,'gr');
		ground.create(400,900,'bg');
		ground.create(400,0,'tp');
		ground.create(0,300,'si');
		ground.create(799,300,'si');
		ground.create(-400,300,'bg');
		ground.create(1200,300,'bg');
		ground.create(400,-300,'bg');
		this.anims.create({
			key:'left',
			frames:this.anims.generateFrameNumbers('dt',{start:0,end:5}),
			frameRate:12,
			repeat:-1
		});
		this.anims.create({
			key:'right',
			frames:this.anims.generateFrameNumbers('dt',{start:8,end:13}),
			frameRate:12,
			repeat:-1
		});
		this.anims.create({
			key:'lstop',
			frames:[{key:'dt',frame:0}],
			frameRate:1,
		});
		this.anims.create({
			key:'rstop',
			frames:[{key:'dt',frame:8}],
			frameRate:1,
		});
		this.anims.create({
			key:'ljump',
			frames:this.anims.generateFrameNumbers('dt',{start:6,end:7}),
			frameRate:6,
			repeat:0
		});
		this.anims.create({
			key:'rjump',
			frames:this.anims.generateFrameNumbers('dt',{start:14,end:15}),
			frameRate:6,
			repeat:0
		});
		upk=this.input.keyboard.addKey("W");
		leftk=this.input.keyboard.addKey("A");
		rightk=this.input.keyboard.addKey("D");
	}
	update()
	{
		while(oq.length)
		{
			// console.log(oq.length);
			var oo=oq.pop();
			console.log(oo);
			aliveid.push(oo.id);
			// console.log('pushed'+oo.id);
			if(isdev==1)
			{
				playerMap[oo.id]=this.physics.add.sprite(oo.x,oo.y,'dt');
				this.physics.world.enable(playerMap[oo.id]);
				this.physics.add.collider(playerMap[oo.id],ground);
				var tp=this.physics;
				aliveid.forEach(function(iid){
					if(iid&&iid!=oo.id)
						console.log('iid:'+iid+' oo.id'+oo.id);
						tp.add.collider(playerMap[iid],playerMap[oo.id]);
				});
			}
			else
			{
				playerMap[oo.id]=this.add.sprite(oo.x,oo.y,'dt');
			}
		}
		if(mineid==-1)return;
		var dx=0;
		if(leftk.isDown)dx-=1;
		if(rightk.isDown)dx+=1;
		if(dx<0)Client.ChangeV(0,-160);
		else if(dx>0)Client.ChangeV(0,160);
		else Client.ChangeV(0,0);
		// if(playerMap[mineid].body.touching.down)
		if(istd)
		{
			if(dx<0)
			{
				Client.ChangeAnims('left');
			}
			else if(dx>0)Client.ChangeAnims('right');
			else
			{
				if(last_dx<0)
					Client.ChangePic('lstop');
				else Client.ChangePic('rstop');
			}
		}
		if(upk.isDown)
		{
			if(istd)
			{
				if(jj==0)
					jj=10,ds=ndt-1,jkd=1;
			}
			else if(ds>0&&jkd==0)
			{
				if(jj==0)
					jj=10,ds--,jkd=1;
			}
		}
		else jkd=0;
		if(jj>0)
		{
			jj--;
			if(last_dx<0)
				Client.ChangeAnims('ljump');
			else Client.ChangeAnims('rjump');
			if(jj==0)
				Client.ChangeV(1,-400);
		}
		if(dx!=0)
			last_dx=dx;
		if(isdev==1)
		{
			aliveid.forEach(function(iid){
				Client.ChangeP(iid,playerMap[iid].x,playerMap[iid].y);
				Client.SendTD(iid,playerMap[iid].body.touching.down);
			});
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
var playerMap={};
function AddNewPlayer(id,x,y)
{
	oq.push({id:id,x:x,y:y});
}
function RemovePlayer(id)
{
	playerMap[id].destroy();
	delete playerMap[id];
	delete aliveid[aliveid.indexOf(id)];
}
function PlayAnims(id,anim)
{
	playerMap[id].anims.play(anim,true);
}
function PlayPic(id,anim)
{
	playerMap[id].anims.play(anim);
}
function SetV(id,k,s)
{
	if(k==0)
		playerMap[id].setVelocityX(s);
	else playerMap[id].setVelocityY(s);
}
function SetP(id,x,y)
{
	playerMap[id].x=x;
	playerMap[id].y=y;
}