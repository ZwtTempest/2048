var RN=4,CN= 4,
    data=null,//保存2048所有格子的数字
    score= 0, //保存游戏得分
    status= 0,//保存游戏状态
    RUNNING= 1,//表示游戏运行中
    GAMEOVER= 0//表示游戏结束
    ;
//启动游戏
function start(){
    status=RUNNING;
    score=0;
    //创建RNxCN个元素的二维数组保存在data中
    data=[];
    for(var r=0;r<RN;r++){
        data[r]=[];//添加每行的空数组
        for(var c=0;c<CN;c++){
            data[r][c]=0;//向每行中加0
        }
    }
    //随机生成2个2或4
    randomNum(); randomNum();
    //更新页面
    updateView();
    //事件: 用户手动触发的或浏览器自己触发的页面/鼠标/键盘状态的改变
    //事件处理函数: 当事件发生时自动执行的函数
    //添加事件处理函数: 为网页的指定事件属性，提前赋值一个函数
    document.onkeydown=function(e){
        switch(e.keyCode){
            case 37://左
                moveLeft();
                break;
            case 38://上
                moveUp();
                break;
            case 39://右
                moveRight();
                break;
            case 40://下
                moveDown();
                break;

        }
    }
}
//随机生成2或4
function randomNum(){
    do{
        var r=parseInt(Math.random()*RN);
        var c=parseInt(Math.random()*CN);
        //只有rc位置为空时，才放入值并退出循环
        if(data[r][c]==0){
            data[r][c]=Math.random()<0.5?2:4;
            break;
        }//否则，就继续算新位置，再判断
    }while(true);
}
//更新页面
function updateView(){
    //遍历data
    for(var r=0;r<RN;r++){
        for(var c=0;c<CN;c++){
            //找到id为cXX的div
            var div=
                document.getElementById(
                    "c"+r+c
                );
            //如果r行c列不是0
            if(data[r][c]!=0){
                //设置div的内容为r行c列的值
                div.innerHTML=data[r][c];
                //设置div的class为cell n?
                div.className=
                    "cell n"+data[r][c];
            }else{//否则，就清空div的内容
                div.innerHTML="";
                //设置div的class为cell
                div.className="cell";
            }
        }
    }
    //显示得分
    document.getElementById("score")
        .innerHTML=score;
    //控制状态
    var div=document.getElementById("gameover");
    if(status==GAMEOVER){
        document.getElementById("final")
            .innerHTML=score;
        div.style.display="block";
    }else{
        div.style.display="none";
    }
}
//左移所有行
function moveLeft(){
    var before=String(data);//拍照
    //遍历data中每一行
    for(var r=0;r<RN;r++){
        moveLeftInRow(r);//左移第r行
    }
    var after=String(data);//拍照
    //只有发生了变化时
    if(before!=after){
        randomNum();//随机生成数
        //是否游戏结束
        if(isGAMEOVER()){
            //修改游戏的状态
            status=GAMEOVER;
        }
        updateView();//更新页面
    }
}
//左移第r行
function moveLeftInRow(r){
    //遍历第r行中每个格
    for(var c=0;c<CN-1;c++){
        //找c位置右侧下一个不为0的位置
        var nextc=getNextInRow(r,c);
        if(nextc==-1){//如果没找到
            break;//就退出循环
        }else{
            //如果c位置是0
            if(data[r][c]==0){
                //将nextc位置的值赋值给c位置
                data[r][c]=data[r][nextc];
                //将nextc位置归0
                data[r][nextc]=0;
                c--;//将c留在原地
            }else if(data[r][c]
                ==data[r][nextc]){
            //否则如果c位置的值等于nextc位置的值
                //将c位置的值*2
                data[r][c]*=2;
                score+=data[r][c];
                //将nextc位置的值归0
                data[r][nextc]=0;
            }
        }
    }
}
//查找r行c位置右侧下一个不为0的位置
function getNextInRow(r,c){
    //nextc从c+1开始向后遍历
    for(var nextc=c+1;nextc<CN;nextc++){
        if(data[r][nextc]!=0){
            return nextc;
        }
    }
    return -1;
}
//右移所有行
function moveRight(){
    var before=String(data);//拍照
    //遍历每一行
    for(var r=0;r<RN;r++){
        //右移第r行
        moveRightInRow(r);
    }
    var after=String(data);//拍照
    if(before!=after){//如果有变化
        randomNum();//随机生成数
        //是否游戏结束
        if(isGAMEOVER()){
            //修改游戏的状态
            status=GAMEOVER;
        }
        updateView();//更新页面
    }
}
//右移第r行
function moveRightInRow(r){
    //c从CN-1开始，反向遍历，到>0结束
    for(var c=CN-1;c>0;c--){
        //找c位置左侧前一个不为0的位置prevc
        var prevc=getPrevInRow(r,c);
        //如果没找到，就退出循环
        if(prevc==-1){ break;}
        else{//否则
            //如果c位置的值等于0
            if(data[r][c]==0){
                //将prevc位置的值赋值给c位置
                data[r][c]=data[r][prevc];
                //将prevc位置的值归0
                data[r][prevc]=0;
                c++;//c留在原地
            }else if(data[r][c]
                ==data[r][prevc]){
            //否则如果c位置的值等于prevc位置的值
                //将c位置*2
                data[r][c]*=2;
                score+=data[r][c];
                //将prevc位置的值归0
                data[r][prevc]=0;
            }
        }
    }
}
//查找r行c列左侧前一个不为0的位置
function getPrevInRow(r,c){
    //prevc从c-1开始，反向遍历 nextc=c+1;nextc<CN;nextc++
    for(var prevc=c-1;prevc>=0;prevc--){
        //如果prevc位置的值不等于0
        if(data[r][prevc]!=0){
            //就返回prevc
            return prevc;
        }
    }//(循环退出)
    return -1;//返回-1
}
//上移所有列
function moveUp(){
    var before=String(data);//拍照
    //遍历每一列
    for(var c=0;c<CN;c++){
        //上移第c列
        moveUpInCol(c);
        
    }
    var after=String(data);//拍照
    //如果有变化
    if(before!=after){
        //随机生成数
        randomNum();
				//是否游戏结束
        if(isGAMEOVER()){
            //修改游戏的状态
            status=GAMEOVER;
        }
        //更新页面
        updateView();
    }
}
//上移第c列
function moveUpInCol(c){
    //r从0开始，遍历每一行，到<RN-1
    for(var r=0;r<RN-1;r++){
        //找r行下方下一个不为0的位置nextr
        var nextr=getNextInCol(r,c);
        //如果没找到，就退出循环
        if(nextr==-1){break;}
        else{//否则
            //如果r行的值为0
            if(data[r][c]==0){
                //将nextr行的值赋值给r行
                data[r][c]=data[nextr][c];
                //将nextr行的值归0
                data[nextr][c]=0;
                r--;//r留在原地
            }else if(data[r][c]
                ==data[nextr][c]){
            //否则如果r行的值等于nextr行的值
                //将r行的值*2
                data[r][c]*=2;
                score+=data[r][c];
                //将nextr行的值归0
                data[nextr][c]=0;
            }
        }
    }
}
//找r行c列下方下一个不为0的位置
function getNextInCol(r,c){
    //nextr从r+1开始遍历，到<RN结束
    for(var nextr=r+1;nextr<RN;nextr++){
        //如果nextr行c列的值不等于0
        if(data[nextr][c]!=0){
            return nextr;//返回nextr
        }
    }//(循环退出)
    return -1;//返回-1
}
//判断游戏是否结束
function isGAMEOVER(){
    //遍历data
    for(var r=0;r<RN;r++){
        for(var c=CN-1;c>=0;c--){
            if(data[r][c]==0){
                return false;
            }else if(c<CN-1 && data[r][c]==data[r][c+1]){
                return false;
            }else if(r<RN-1 && data[r][c]==data[r+1][c]){
                return false;
            }
        }
    }
    return true;
}

function moveDown(){
	var before=String(data)
	for(var c=0;c<CN;c++){
		moveDownInCol(c);
		
  }
	var after=String(data);
	if(before!=after){
			randomNum();
			if(isGAMEOVER()){
				status=GAMEOVER;
		}
			updateView();
	}
}
function moveDownInCol(c){
	for(var r=RN-1;r>0;r--){
		var prevr=getPrevInCol(r,c);
		if(prevr==-1){break;}
		else{
			if(data[r][c]==0){
					data[r][c]=data[prevr][c];
					data[prevr][c]=0;
					r++;
			}else if(data[r][c]
					==data[prevr][c]){
					data[r][c]*=2;
					score+=data[r][c];
					data[prevr][c]=0;
			}
		}
    }
}
function getPrevInCol(r,c){
    for(var prevr=r-1;prevr>=0;prevr--){
        if(data[prevr][c]!=0){
            return prevr;
        }
    }
    return -1;
}

start();//启动游戏
