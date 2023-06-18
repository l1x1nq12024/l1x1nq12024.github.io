var Engine=Matter.Engine,
	Render=Matter.Render,
	Runner=Matter.Runner,
	Constraint=Matter.Constraint,
	MouseConstraint=Matter.MouseConstraint,
	Mouse=Matter.Mouse,
	Composite=Matter.Composite,
	Bodies=Matter.Bodies,
	Body=Matter.Body,
	Common=Matter.Common;

var engine=Engine.create(),world=engine.world;
var render=Render.create({
	element:document.body,
	engine:engine,
	options:{
		width:800,
		height:600,
		wireframes:false,
		showVelocity:true
	}
});
Render.run(render);
var runner=Runner.create();
Runner.run(runner,engine);

Composite.add(world,[
	Bodies.rectangle(400,20,780,20,{isStatic:true}),
	Bodies.rectangle(400,580,780,20,{isStatic:true}),
	Bodies.rectangle(780,300,20,580,{isStatic:true}),
	Bodies.rectangle(20,300,20,580,{isStatic:true}),
	Bodies.rectangle(400,300,400,20,{isStatic:true})
]);
Composite.add(world,[
	doll(400,100,0.5)
]);

var mouse=Mouse.create(render.canvas);
var mouseConstraint=MouseConstraint.create(engine,{
	mouse:mouse,
	constraint:{
		stiffness:0.2,
		render:{
			visible:false
		}
	}
});
Composite.add(world,mouseConstraint);
render.mouse=mouse;
Render.lookAt(render,{
	min:{x:0,y:0},
	max:{x:800,y:600}
});
function doll(x,y,scale,options) {
	scale=typeof scale==='undefined'?1:scale;

	var headOptions=Common.extend({
		label:'head',
		collisionFilter:{group:Body.nextGroup(true)},
		render:{fillStyle:'#FFBC42'}
	},options);
	var chestOptions=Common.extend({
		label:'chest',
		collisionFilter:{group:Body.nextGroup(true)},
		chamfer:{radius:[10*scale,10*scale,10*scale,10*scale]},
		render:{fillStyle:'#E0A423'}
	},options);
	var leftArmOptions=Common.extend({
		label:'left-arm',
		collisionFilter:{group:Body.nextGroup(true)},
		chamfer:{radius:10*scale},
		render:{fillStyle:'#FFBC42'}
	},options);
	var leftLowerArmOptions=Common.extend({},leftArmOptions,{
		render:{fillStyle:'#E59B12'}
	});
	var rightArmOptions=Common.extend({
		label:'right-arm',
		collisionFilter:{group:Body.nextGroup(true)},
		chamfer:{radius:10*scale},
		render:{fillStyle:'#FFBC42'}
	},options);
	var rightLowerArmOptions=Common.extend({},rightArmOptions,{
		render:{fillStyle:'#E59B12'}
	});
	var leftLegOptions=Common.extend({
		label:'left-leg',
		collisionFilter:{group:Body.nextGroup(true)},
		chamfer:{radius:10*scale},
		render:{fillStyle:'#FFBC42'}
	},options);
	var leftLowerLegOptions=Common.extend({},leftLegOptions,{
		render:{fillStyle:'#E59B12'}
	});
	var rightLegOptions=Common.extend({
		label:'right-leg',
		collisionFilter:{group:Body.nextGroup(true)},
		chamfer:{radius:10*scale},
		render:{fillStyle:'#FFBC42'}
	},options);
	var rightLowerLegOptions=Common.extend({},rightLegOptions,{
		render:{fillStyle:'#E59B12'}
	});

	var head=Bodies.circle(x,y-60*scale,60*scale,headOptions);
	var chest=Bodies.rectangle(x,y,20*scale,80*scale,chestOptions);
	var rightUpperArm=Bodies.rectangle(x+20*scale,y-15*scale,20*scale,40*scale,rightArmOptions);
	var rightLowerArm=Bodies.rectangle(x+25*scale,y+25*scale,20*scale,60*scale,rightLowerArmOptions);
	var leftUpperArm=Bodies.rectangle(x-20*scale,y-15*scale,20*scale,40*scale,leftArmOptions);
	var leftLowerArm=Bodies.rectangle(x-25*scale,y+25*scale,20*scale,60*scale,leftLowerArmOptions);
	var leftUpperLeg=Bodies.rectangle(x-20*scale,y+57*scale,20*scale,40*scale,leftLegOptions);
	var leftLowerLeg=Bodies.rectangle(x-20*scale,y+97*scale,20*scale,60*scale,leftLowerLegOptions);
	var rightUpperLeg=Bodies.rectangle(x+20*scale,y+57*scale,20*scale,40*scale,rightLegOptions);
	var rightLowerLeg=Bodies.rectangle(x+20*scale,y+97*scale,20*scale,60*scale,rightLowerLegOptions);

	var chestToRightUpperArm=Constraint.create({
		bodyA:chest,
		pointA:{x:8*scale,y:-23*scale},
		pointB:{x:0,y:-8*scale},
		bodyB:rightUpperArm,
		stiffness:0.6,
		render:{visible:false}
	});
	var chestToLeftUpperArm=Constraint.create({
		bodyA:chest,
		pointA:{x:-8*scale,y:-23*scale},
		pointB:{x:0,y:-8*scale},
		bodyB:leftUpperArm,
		stiffness:0.6,
		render:{visible:false}
	});
	var chestToLeftUpperLeg=Constraint.create({
		bodyA:chest,
		pointA:{x:-10*scale,y:30*scale},
		pointB:{x:0,y:-10*scale},
		bodyB:leftUpperLeg,
		stiffness:0.6,
		render:{visible:false}
	});
	var chestToRightUpperLeg=Constraint.create({
		bodyA:chest,
		pointA:{x:10*scale,y:30*scale},
		pointB:{x:0,y:-10*scale},
		bodyB:rightUpperLeg,
		stiffness:0.6,
		render:{visible:false}
	});
	var upperToLowerRightArm=Constraint.create({
		bodyA:rightUpperArm,
		bodyB:rightLowerArm,
		pointA:{x:0,y:15*scale},
		pointB:{x:0,y:-25*scale},
		stiffness:0.6,
		render:{visible:false}
	});
	var upperToLowerLeftArm=Constraint.create({
		bodyA:leftUpperArm,
		bodyB:leftLowerArm,
		pointA:{x:0,y:15*scale},
		pointB:{x:0,y:-25*scale},
		stiffness:0.6,
		render:{visible:false}
	});
	var upperToLowerLeftLeg=Constraint.create({
		bodyA:leftUpperLeg,
		bodyB:leftLowerLeg,
		pointA:{x:0,y:20*scale},
		pointB:{x:0,y:-20*scale},
		stiffness:0.6,
		render:{visible:false}
	});
	var upperToLowerRightLeg=Constraint.create({
		bodyA:rightUpperLeg,
		bodyB:rightLowerLeg,
		pointA:{x:0,y:20*scale},
		pointB:{x:0,y:-20*scale},
		stiffness:0.6,
		render:{visible:false}
	});
	var headContraint=Constraint.create({
		bodyA:head,
		pointA:{x:0,y:45*scale},
		pointB:{x:0,y:-35*scale},
		bodyB:chest,
		stiffness:0.6,
		render:{visible:false}
	});

	var person=Composite.create({
		bodies:[
			chest,head,leftLowerArm,leftUpperArm,
			rightLowerArm,rightUpperArm,leftLowerLeg,
			rightLowerLeg,leftUpperLeg,rightUpperLeg
		],
		constraints:[
			upperToLowerLeftArm,upperToLowerRightArm,chestToLeftUpperArm,
			chestToRightUpperArm,headContraint,upperToLowerLeftLeg,
			upperToLowerRightLeg,chestToLeftUpperLeg,chestToRightUpperLeg,
		]
	});

	return person;
};
