/* HUIL game 版本:1.0*/
var cte; //画布
var cteWidth; //画布宽度
var cteHeight; //画布高度
var erval; //循环函数名
var speed = 0.6; //不变速度名 0.3正常
var bgW; //背景宽度
var bgH; //背景高度
var sgY = speed; //水果速度
var sgJg = 100; //水果间隔
var sgGs = 0; //捡到水果个数
var vita = 10; //生命
var pic = 0; //帧数
var gamev = false; //游戏状态
var rightnum = 0;  //答对数
var errornum = 0;  //答错数
var speednum = true;//加速次数一次
var men = new Image();
var bg = new Image();
var rightimg1 = new Image();
var rightimg2 = new Image(); 
var rightimg3 = new Image(); 
var rightimg4 = new Image(); 
var rightimg5 = new Image(); 
var errorimg1 = new Image();
var errorimg2 = new Image();
var errorimg3 = new Image();
var errorimg4 = new Image();
var errorimg5 = new Image();
var pan = new Image();
var fsb = new Image();
var xue = new Image();


function objGame(){
	this.x = 0;
	this.y = 0;
	this.image = null;
}
function Menn(){};
Menn.prototype = new objGame();
var menn = new Menn();
var pann = new Menn();

function Sg(){};
Sg.prototype = new objGame();
Sg.prototype.red = 0;
Sg.prototype.panS = false; //新建水果在盘上
Sg.prototype.hid = false; //新建水果是否隐藏
Sg.prototype.fs = 0;      //水果分数
Sg.prototype.judge = -1;      //1正确，0错误
Sg.prototype.panX = 0;       
var sgArr = new Array();   //水果数组
var sgj = 0;     //数组起始点

//接住正确音效
function CatchMusic(){
	document.getElementById("catch").play();
}
//接住错误音效
function ErrorMusic(){
	document.getElementById("error").play();
}
//开始音效
function StartMusic(){
	document.getElementById("start").play();
}
//开始音效
function WarnMusic(){
	document.getElementById("warn").play();
}
//绘制水果
function HzSg(){
	if(pic%sgJg==0){    //pic = 0;帧数  sgJg = 100;水果间隔
		var sgg = new Sg();
		sgg.x = Math.floor(Math.random()*(cteWidth-50-50+1)+50);  //最大值ctewidth-100,最小值100
		sgg.y = -Math.floor(Math.random()*(70-10+1)+10);  //-20,-60
		//判断是正确判断题还是错误判断题
		if(Math.random()*10>6){
			switch(parseInt(Math.random()*5+1)){
				case 1:	sgg.image = rightimg1;break;
				case 2: sgg.image = rightimg2;break;
				case 3: sgg.image = rightimg3;break;
				case 4: sgg.image = rightimg4;break;
				case 5: sgg.image = rightimg5;break;
			    default:sgg.image = rightimg1;break;
			}
			sgg.judge = 1;      //正确
		}else{
			switch(parseInt(Math.random()*5+1)){
				case 1:	sgg.image = errorimg1;break;
				case 2: sgg.image = errorimg2;break;
				case 3: sgg.image = errorimg3;break;
				case 4: sgg.image = errorimg4;break;
				case 5: sgg.image = errorimg5;break;
			    default:sgg.image = errorimg1;break;
		    }
			sgg.judge = 0;       //错误
		}
		sgArr[sgj] = sgg;
		sgj++;
	}
	for(var i =0; i<sgArr.length; i++){
		sgArr[i].y += sgY;   //sgY水果速度
		if(sgArr[i].y<cteHeight){  
			//判断是否接到水果
			if(crash(sgArr[i], pann, 10)){    //&&!sgArr[i].panS
				sgArr[i].x = -300; 
				sgArr[i].y = 1000; 
				sgArr[i].panS = true;  //新建水果在盘上
				sgGs++;                //捡到水果个数
				if(sgArr[i].judge==1){    //是正确的判断题
					rightnum += 1;
					CatchMusic();  //播放正确音乐
				}else if(sgArr[i].judge==0){
					errornum += 1;
					vita -= 2;
					ErrorMusic();    //播放错误音乐
				}
			}
			cte.save();  //将当前的绘图环境压入堆栈顶部
			if(sgArr[i].panS){
				if(sgGs%10==0){   //一盘要消失
					sgArr[i].hid = true;
				}
			}
			cte.translate(sgArr[i].x, sgArr[i].y);
			if(!sgArr[i].hid){cte.drawImage(sgArr[i].image,-(sgArr[i].image.width/2), -(sgArr[i].image.height/2));}
			cte.restore();//从栈顶部弹出的一组状态信息，并根据此恢复当前绘图环境的各个状态
	     }
	}
}

//游戏结束
function GameOver(){
	gamev = false;
	$("#play").hide();
	$("#result").show();
	clearInterval(erval);   //取消循环函数
}

//绘制分数和血
function DarwFsb(){
	cte.drawImage(fsb, cteWidth-152, 2);   
	cte.drawImage(xue, 2, 2);          //绘制血
	cte.font = "12pt Arial";
	cte.fillText(""+parseInt(rightnum), cteWidth-110, 23);      
	cte.fillText(""+parseInt(errornum), cteWidth-40, 23);       
	cte.save();
	if(vita>3){
		cte.fillStyle = "#12ff00";
	}else{
		cte.fillStyle = "red";
	}
	cte.fillRect(25, 8, vita*12, 18);
	cte.restore();
	if(vita<=0||rightnum>=10){
		GameOver();
		$(".ps").html("答对数："+parseInt(rightnum));
		$(".fs").html("答错数："+parseInt(errornum));
		switch(parseInt((rightnum/(rightnum+errornum))*10)){
			case 10:
			case 9:
			case 8: $(".text1").html("正确率达80%以上！！恭喜你，通过了测试！");break;
			case 7:
			case 6:
			case 5: $(".text1").html("正确率达50%以上！！还需要再接再厉！请观看学习视频:");
			$("#videobum").show();break;
			case 4:
			case 3:
			case 2:
			case 1: $(".text1").html("正确率较低！！还需要多加努力！请观看学习视频:");
			$("#videobum").show();break;
			default:$(".text1").html("恭喜你通过了测试");break;
		}	
	}
	if(speednum&&rightnum>=5){
		sgY = 1.0;
		//clearInterval(erval);            //取消循环函数
		WarnMusic();  //播放警告音乐
		$("#speed").show();
		setTimeout(function(){
			$("#speed").hide();
			//Sos();
        }, 1 * 3000);
		speednum = false;
	}
}
//游戏暂停或开始
function Sos(){
	gamev = !gamev;
	if(gamev){
		$("#play").hide();
		$("#rule").hide();
		erval = setInterval(HzFun, 5);  //每隔 5 毫秒调用 HzFun() 函数
	}else{
		clearInterval(erval);            //取消循环函数
	}
}

//物体之间碰撞
function crash(obj1, obj2, fewi){
	var A1 = obj1.x + fewi;
	var B1 = obj1.x + obj1.image.width - fewi;
	var C1 = obj1.y + fewi;
	var D1 = obj1.y + obj1.image.height - fewi;
	var A2 = obj2.x + fewi;
	var B2 = obj2.x + obj2.image.width - fewi;
	var C2 = obj2.y + fewi;
	var D2 = obj2.y + obj2.image.height - fewi;
	//判断X轴是否重叠
	if(((A1 > A2)&&(A1 < B2)) || ((B1 > A2)&&(B1 < B2))){
		//判断Y轴是否重叠
		if(((C1 > C2)&&(C1 < D2)) || ((D1 > C2)&&(D1 < D2))){
			return true;
		}	
	}
	return false;
}

function HzFun(){
	cte.clearRect(0,0,cteWidth,cteHeight);
	cte.drawImage(bg, 0, 0, bgW, bgH);
	cte.drawImage(menn.image, menn.x, menn.y);
	//绘制盘子
	pann.x = menn.x+100;
	pann.y = menn.y+50;
	cte.drawImage(pann.image, pann.x, pann.y);
	HzSg(); //绘制水果
	DarwFsb();//绘制分数
	zdY = speed;
	pic++;
}

function LoadImg(){
	men.src = "images/men.png";
	rightimg1.src = "images/right1.png";   
	rightimg2.src = "images/right2.png";   
	rightimg3.src = "images/right3.png";   
	rightimg4.src = "images/right4.png";   
	rightimg5.src = "images/right5.png";   
	errorimg1.src = "images/error1.png";
	errorimg2.src = "images/error2.png";
	errorimg3.src = "images/error3.png";
	errorimg4.src = "images/error4.png";
	errorimg5.src = "images/error5.png";
	pan.src = "images/pan1.png";
	fsb.src = "images/fsborder1.png";
	xue.src = "images/xue.png";
	bg.src = "images/border.jpg";
	menn.image = men;
	pann.image = pan;
	bg.onload = function(){HzFun();}  //初始化后
}

function Add(){
	document.getElementById("canvas").addEventListener('touchstart', youfun);
	document.getElementById("canvas").addEventListener('touchmove', youfun);
	document.getElementById("canvas").addEventListener('touchend', youfun);
	document.getElementById("canvas").onmousemove = function(e){ //pc获取鼠标坐标
		menn.x = e.x - menn.image.width/2;
	}
	function youfun(e){
		e.preventDefault();
		menn.x = e.targetTouches[0].pageX-100;   //安卓手机 要用 targetTouches[0].pageX 
	}
	$("#play").click(function(){
		StartMusic();  //开始音乐
		sgJg = 800; //水果间隔
		vita = 10; //生命
		pic = 0; //帧数
		sgj = 0; //水果j
		sgGs = 0; //捡到水果个数
		sgY = speed; //水果速度
		sgArr = [];
		Sos();
	});
	$("#videobum").click(function(){
		$("#result").hide();
		$("#video1").show();
		$("#video1").play();
	});
}
$(document).ready(function(){
	bgW = $(window).width();
	bgH = $(window).height();
	$("#content").css({width: bgW, height: bgH});
	$("#content").append("<canvas id=\"canvas\" width=\""+bgW+"\" height=\""+bgH+"\">您的浏览器不支持HTML5</canvas>"); //设置画布长高
	//$("#play").css({left: (bgW/2)-($("#play").width()/2), top: (bgH/2)-($("#play").height()/2)});
	//$("#rule").css({left: (bgW/2)-($("#rule").width()/2), top: (bgH/2)-($("#rule").height()/2)});
	$("#result").css({left: (bgW/2)-($("#result").width()/2), top: (bgH/2)-($("#result").height()/2)});
	Add();
	LoadImg();
	$("#result").hide();
	$("#videobum").hide();
	$("#video1").hide();
	$("#speed").hide();
	cte = document.getElementById("canvas").getContext("2d");
	cteWidth = parseInt($("#canvas").width());
	cteHeight = parseInt($("#canvas").height());
	menn.x = parseInt(cteWidth/2-100);
	menn.y = cteHeight-150;
});