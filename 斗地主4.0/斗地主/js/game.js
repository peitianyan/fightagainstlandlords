/**
 * 初始化玩家数据
 */

let player = [
    {
        name:'alex',
        img:'',
        gold:10000,
        poker:[]
    },
    {
        name:'jack',
        img:'',
        gold:10000,
        poker:[]
    },
    {
        name:'tom',
        img:'',
        gold:10000,
        poker:[]
    },
];


 /**
  * 用于保存当局游戏的数据
  */
let gameData = {
    boss:null,     //当前哪位玩家是地主
    play:null,     //当前到哪位玩家出牌
     
    //  当前玩家选择中的的牌的数据
    select:{       
        type:0,        //选中排队的牌型
        poker:[],      //选中牌的数据
        max:0          //选中牌的牌型中用于判断大小的值
    },

    //当前桌面牌组的数据
    desktop:{
    type:0,         //选中排队的牌型
    poker:[],       //选中牌的数据
    max:0           //选中牌的牌型中用于判断大小的值
    },

    multiple:1       //本局游戏结算的倍数

}


/**
 * jQuery函数
 */
$(function(){               //window.onload
    
    //初始化牌组和初始化牌组的HTML代码
    let poker_html = '';
    for(let i=0; i<54; i++){
        poker_html += '<li class="back" style="top:-'+i+'px"></li>';        // 通过循环得到牌组的HTML代码
    }
    $(".all_poker").html(poker_html);       // 把牌组的HTML代码放入页面对应的元素中


    //初始化牌组数据
    let all_poker = [];

    //将普通牌放入数据中
    for(let i=1; i<=13; i++){
        for(let j=0; j<4; j++){
            all_poker.push({num:i, color:j})
        }
    }
    // 将大小王放入数据中
    all_poker.push({num:14, color:0});
    all_poker.push({num:14, color:1});


    let click = 0;      //点击牌组的次数

    // 绑定洗牌事件
    /**
     * .all_poker li是通过点击事件新增的元素，然后再点击.all_poker li元素的话就要把它通过父级来绑定on()方法：
     * 由于绑定事件的元素在洗牌的过程中会删除所以绑定的事件失效(虽然一样，却不再是同一个了)
     * 这种情况，我们需要使用侦听绑定或者叫做监听绑定
     * 通过父级元素来绑定事件
     */ 
    $(".mid_top").on("click", ".all_poker li", function(){
        //如果点击次数为0，则执行洗牌事件
        if(click == 0){
            //调用洗牌动画
            clearPoker();
        }
        if(click == 1){
            //发牌动画
            dealPoker(function(){
                $(".mid_top").off();
                getBoss();  //当发牌动画执行完后，执行抢地主，若函数并列的话就会一起执行
            })
        }

    })

    //洗牌动画函数
    function clearPoker(){
        //把初始牌组数据的顺序打乱,想乱一些，i的值可以设置更大一些
        for(let i=0; i<10; i++){
            all_poker.sort(function(x,y){
                return Math.random() -0.5;
            })
        }

        //洗牌的动画
        //保存原牌组的代码以便于恢复
        let poker_html = $(".mid_top").html();
        //删除原牌组
        $(".all_poker").remove();

        // 调用洗牌函数
        animation();
      
        // 4、恢复原牌组
        setTimeout(function(){
            $('.mid_top').html(poker_html)
            click++;
            // console.log(all_poker)
            
        }, 12000)
    }
    
    // 发牌的动画
    function dealPoker(callBack){
        let num = 0;
        let poker_html = '';
        $('.music2').attr({src:'../music/fapai.mp3'});
        function go(){
            // 给左边家这发牌
            $(".all_poker li:last").animate({left:"-600px", top:"250px"},100, function(){
                $(".all_poker li:last").remove();
                player[0].poker.push(all_poker.pop());
                poker_html = makePoker(player[0].poker[player[0].poker.length - 1]);       // 生成对应数据的牌页面
                $(".play_1").append(poker_html);
                $(".play_1 li:last").css({top:num*20 +'px'});

                // 给中间玩家发牌
                $(".all_poker li:last").animate({ top:"600px"},100, function(){
                    $(".all_poker li:last").remove();
                    player[1].poker.push(all_poker.pop());
                    poker_html = makePoker(player[1].poker[player[1].poker.length - 1]);       // 生成对应数据的牌页面
                    $(".play_2").append(poker_html);
                    $(".play_2 li:last").css({left:num*25 +'px'})
                    // $(".play_2").css({left:-num*9 +'px'})

                    // 给右边玩家发牌
                    $(".all_poker li:last").animate({left:"600px", top:"250px"},100, function(){
                        $(".all_poker li:last").remove();
                        player[2].poker.push(all_poker.pop());
                        poker_html = makePoker(player[2].poker[player[2].poker.length - 1]);       // 生成对应数据的牌页面
                        $(".play_3").append(poker_html);
                        $(".play_3 li:last").css({top:num*20 +'px'})

                        
                        if(++num <= 16){
                            go();
                        }else{
                            $('.music2').attr({src:''}).removeAttr('loop');
                            // console.log(player)
                            // 把所有玩家的有手牌进行排序
                            sortPoker(player[0].poker)
                            sortPoker(player[1].poker)
                            sortPoker(player[2].poker)
                            console.log(player)

                            setTimeout(()=>{
                                $(".play_1 li").css({"background":''}).addClass("back")     // 把牌背重新生成
                                $(".play_2 li").css({"background":''}).addClass("back")     // 把牌背重新生成
                                $(".play_3 li").css({"background":''}).addClass("back")     // 把牌背重新生成
                                
                                setTimeout(()=>{
                                    $('.play_1 li').remove()
                                    $('.play_2 li').remove()
                                    $('.play_3 li').remove()
                                    // poker_html = ''
                                    // 按已经排序好的数据重新生成牌面
                                    for(let i=0; i<player[1].poker.length; i++){
                                        $('.play_1').append(makePoker(player[0].poker[i]))
                                        $('.play_1 li:last').css({top: i*20+'px'})

                                        // poker_html = makePoker(player[1].poker[i])
                                        $('.play_2').append(makePoker(player[1].poker[i]))
                                        $('.play_2 li:last').css({left: i*25+'px'})

                                        $('.play_3').append(makePoker(player[2].poker[i]))
                                        $('.play_3 li:last').css({top: i*20+'px'})
                                    }
                                    // $('.play_2').html(poker_html)

                                    /* 
                                        发牌已经结束，进入抢地主阶段
                                        调用抢地主的函数
                                    */
                                    // getBoss()
                                    callBack()
                                }, 500)
                            }, 500)
                        }
                    });
                });
            });
        }
        
        go();


        click++;

        /**
         * 等待组员的函数
         */
    }


    let flag=0;
    // 抢地主函数
    function getBoss(get, num, get_data){
        // 设置参数的默认值
        if(get == undefined){
            // 随机点名一个玩家开始抢地主
            get = Math.floor(Math.random()*3)
        }
        num =  num == undefined? 0: num;
        get_data = get_data == undefined? [null, null, null]: get_data;
        
        // 如果当前玩家已经不抢地主了，所以跳过他再下一个去抢地主
        if(get_data[get] === 0 && num != 3){
            get = ++get > 2 ?0: get;
            getBoss(get, num, get_data);
            return false;
        }

        // 可以通过num的值来判断第已经选择了几次
        if(num == 3&&flag==0){
            // 如果三个玩家都不抢地主的情况
            if(get_data[0] == get_data[1] && get_data[1] == get_data[2] ){
                if(get_data[0] == 0){
                    // alert("本局无人抢地主，流局！！");
                    $(".popup").css({"display":"block"});
                    $(".popup .txt").html("本局无人抢地主，流局");
                    $(".popup .confirm").one("click",()=>{
                        window.location.href = window.location.href;
                    });
                   
                }
            }else{
                if(get_data[0] == 1 && get_data[1] == 0 && get_data[2] == 0){
                    setBoss(0);
                }else if(get_data[0] == 0 && get_data[1] == 1 && get_data[2] == 0){
                    setBoss(1);
                }else if(get_data[0] == 0 && get_data[1] == 0 && get_data[2] == 1){
                    setBoss(2);
                }else if(get_data[0] == 1 && get_data[1] == 1 && get_data[2] == 0){
                    //num++;
                    flag=1;
                    getBoss(get, num, get_data);
                    return false;
                }else if(get_data[0] == 1 && get_data[1] == 0 && get_data[2] == 1){
                   //num++;
                   flag=1;
                    getBoss(get, num, get_data);
                    return false;
                }else if(get_data[0] == 0 && get_data[1] == 1 && get_data[2] == 1){
                   // num++;
                   flag=1;
                    getBoss(get, num, get_data);
                    return false;
                }else if( get_data[0] == 1 && get_date[1] == 1 && get_data[2]==1){
                    flag=2;
                    getBoss(get, num, get_data);
                }
            }
        }
        else{
            
            // 所有的组件先隐藏
            $(".get-boss").hide();

            // 把对应选择权的玩家的组件显示
            $(".get-boss").eq(get).show()

            // 解绑事件
            $(".get-boss .get").off()       // 把目标 元素上的所有事件解除
            $(".get-boss .cancel").off()

            // 动态绑定抢地主跟不抢的事件
            $(".get-boss").eq(get).find(".get").on("click",()=>{

                $('.music2').attr({src:'../music/qiang.mp3'});
                get_data[get] = 1;      // 设置当前玩的选择
                num++
                // 如果当前玩家抢地主是第四轮抢的话就肯定能抢到地主了
                
                if(num == 4||num==5){
                    
                    setBoss(get);
                    return;
                }
                get = ++get > 2 ?0: get;
                getBoss(get, num, get_data)
            })

            $(".get-boss").eq(get).find(".cancel").on("click",()=>{
                
                $('.music2').attr({src:'../music/buqiang.mp3'});
                // alert("不抢")
                get_data[get] = 0;      // 设置当前玩的选择
                num++
                let boss;
                

            
                // 第四次选择不抢的话也能得到谁是地主了
                if(num == 4){
                    let pre_get = get-1 < 0? 2: get-1;

                    console.log(get_data[pre_get])
                    if(get_data[pre_get] == 1){
                        boss = pre_get;
                    }else{
                        boss = pre_get-1 <0? 2: pre_get-1;
                    }
                    setBoss(boss)
                }else{
                    get = ++get > 2 ?0: get;
                    getBoss(get, num, get_data);
                }
            })
        }
    }



    // 设置当前哪个玩家为地主的函数
    function setBoss(boss){
        console.log('BOSS:'+boss)
        // 隐藏与解绑所有抢地主相关的元素
        $('.get-boss').hide();
        $('.get-boss .get').off();
        $('.get-boss .cancel').off();

        // 设置当前地主玩家
        gameData.boss = boss;

        /* 把桌面的三张牌使用动画方法翻开 */
        $('.all_poker li').eq(0).css({'animation':'run-2-0 1s ease 1','animation-fill-mode':'forwards','animation-delay':'2s'})
        $('.all_poker li').eq(2).css({'animation':'run-2-1 1s ease 1','animation-fill-mode':'forwards','animation-delay':'2s'})
        $('.all_poker li').eq(1).css({'animation':'run-2-2 1s ease 1','animation-fill-mode':'forwards','animation-delay':'2s'});
           setTimeout(function(){ 
        // $('.all_poker li').eq(0).animate({"left":"-300px"})
        // $('.all_poker li').eq(1).animate({"left":"300px"}, ()=>{
            // 最后三张牌的数据放到地主玩家挡手牌中
            player[gameData.boss].poker.push(all_poker[0], all_poker[1], all_poker[2])
            sortPoker(player[gameData.boss].poker);
            console.log(player[gameData.boss].poker)
            // 动画与页面
            $('.all_poker li').remove()
            for(let i=0; i<all_poker.length; i++){
                $('.all_poker').append(makePoker(all_poker[i]))
                if(i==0){
                    $('.all_poker li:last').css({left:"-300px"})
                }else if( i == 2){
                    $('.all_poker li:last').css({left:"300px"})
                }
            }
            $('.all_poker li').animate({top:"-100px"}, 1000);

            if(boss == 0){
                $('.all_poker li').css({'transform':'rotate(45deg)','transition':'transform 0.5s'})
                $('.all_poker li').animate({left:"-600px",top:"200px"},500,function(){
                    $('.all_poker li').remove()
                })
                
            }
            else if(boss == 1){
                $('.all_poker li').css({'transform':'rotate(45deg)','transition':'transform 0.5s'})
                $('.all_poker li').animate({top:"400px"},500,function(){
                    $('.all_poker li').remove()
                })
            }else{
                $('.all_poker li').css({'transform':'rotate(45deg)','transition':'transform 0.5s'})
                $('.all_poker li').animate({left:"600px",top:"200px"},500,function(){
                    $('.all_poker li').remove()
                })
            }

            // 玩家重新排序手牌的动画
            
            $(".play_"+(boss+1)).find("li").remove()
            if(boss==0){
                for(let i=0; i<player[boss].poker.length; i++){
                    $(".play_"+(boss+1)).append('<li class="back" style="top:'+i*20+'px"></li>')
                }
                $(".play_"+(boss+1)).css({top:+20+'px'})
                setTimeout(()=>{
                    $(".play_"+(boss+1)).find("li").remove()
                    for(let i=0; i<player[boss].poker.length; i++){
                        $(".play_"+(boss+1)).append(makePoker(player[0].poker[i]));
                        $(".play_"+(boss+1)+' li:last').css({top:i*20+'px'})
                    }
                    // 调用出牌阶段方法
                    gameData.play = boss;       // 设置当前出牌的玩家
                    playPoker(0)
                }, 2000)
            }else if(boss==1){
                for(let i=0; i<player[boss].poker.length; i++){
                    $(".play_"+(boss+1)).append('<li class="back" style="left:'+i*25+'px"></li>')
                }
                // $(".play_"+(boss+1)).css({left:'-'+20*9+'px'})
                setTimeout(()=>{
                    $(".play_"+(boss+1)).find("li").remove()
                    for(let i=0; i<player[boss].poker.length; i++){
                        $(".play_"+(boss+1)).append(makePoker(player[1].poker[i]));
                        $(".play_"+(boss+1)+' li:last').css({left:i*25+'px'})
                    }
                    // 调用出牌阶段方法
                    gameData.play = boss;       // 设置当前出牌的玩家
                    playPoker(0)
                }, 2000)
            }else if(boss==2){
                for(let i=0; i<player[boss].poker.length; i++){
                    $(".play_"+(boss+1)).append('<li class="back" style="top:'+i*20+'px"></li>')
                }
                $(".play_"+(boss+1)).css({top:20+'px'})
                setTimeout(()=>{
                    $(".play_"+(boss+1)).find("li").remove()
                    for(let i=0; i<player[boss].poker.length; i++){
                        $(".play_"+(boss+1)).append(makePoker(player[2].poker[i]));
                        $(".play_"+(boss+1)+' li:last').css({top:i*20+'px'})
                    }
                    // 调用出牌阶段方法
                    gameData.play = boss;       // 设置当前出牌的玩家
                    playPoker(0)
                }, 2000)
            }
        },3000)

    }
 
    
    // 出牌阶段
    function playPoker(pass){
        console.log(pass);
        console.log(gameData);
        // 隐藏所有玩家出牌的组件
        $('.play-btn').hide();
        // 隐藏倒计时组件
        $('.time-item').hide();

        // 当前玩家的出牌组件显示
        $('.play-btn').eq(gameData.play).show();
        // 当前玩家的出牌倒计时组件显示
        $('.time-item').eq(gameData.play).show();
        timer(time);

        // 通过pass值的判断等于2，相当就是有两位玩家跳过出牌。这时桌面牌应该清空
        if(pass == 2){
            gameData.desktop.type = 0;
            gameData.desktop.poker = [];
            gameData.desktop.max = 0;
        }

        // 解绑事件
        // $('.play_'+(gameData.play+1)+' li').off();
        $("li").off();
        // $(".play-btn .play").off();
        $(".play-btn .cancel").off();


        // 绑定选牌事件
        $('.play_'+(gameData.play+1)+' li').on('click', function(){
            // 判断当前元素是否有被选中的样式判断该元素是否补选中
            if($(this).hasClass("on")){
                // 去掉被选中的样式
                $(this).removeClass("on");


            // [{num:1, color:2}, {num:2, color:3}]      poker = {num:2, color:3}

                let poker =  {};
                poker.num = $(this).attr("data-num");
                poker.color = $(this).attr("data-color");

                // 通过循环得到选中元素的下标
                for(let i=0; i<gameData.select.poker.length; i++){
                    // if(gameData.select.poker[i] == poker){        // 对象是不能直接进行比较相等的
                    if(gameData.select.poker[i].num == poker.num && gameData.select.poker[i].color == poker.color){

                        gameData.select.poker.splice(i, 1);       // 通过下标删除数组中对应的元素

                         

                        break;
                    }
                }
                console.log(gameData.select.poker);


            }else{
                // 把选择中牌变成被选中的样式
                $(this).addClass("on");
                // 把选中的牌的数据放入，选择的牌组数据中
                let poker =  {};
                poker.num = $(this).attr("data-num");
                poker.color = $(this).attr("data-color");
                gameData.select.poker.push(poker);
                console.log(gameData.select.poker);
            }
            
        })

        // 绑定出牌事件
        $(".play-btn").eq(gameData.play).off("click").on("click", '.play', function(){
            // alert("出牌")
            // 检查出的牌是否符合规则
            if(!checkPoker(gameData.select)){
                alert("不符合规则");
                gameData.select.poker = [];
                $('.play_'+ (gameData.play+1)+' li').removeClass('on');
            }else{
                console.log(gameData.select)
                // 判断手牌能不能打出
                if(checkVS()){
                    // 1、删除玩家手牌对应出牌的数据
                    /* 
                        seletc => [{num:1,color:2}, {num:1, color:3}]
                        play => [{num:1,color:2}, {num:1, color:3}, {num:2, color:3}]

                        需要注意在循环遍历时有可能遍历的数组会发生变化，如果有这样的可以需要小心处理。
                        1、尽可能不要直接在遍历时进行变化
                        2、或者等遍历完之再作处理
                        3、需要变的值可以通过临时变量来复制等操作来完成
                     */
                    playVoice(gameData.select);                                                                                                                                            
                    console.log("当前出牌人为："+(gameData.play+1));
                    console.log("牌的长度为："+player[gameData.play].poker.length);
                    for(let i=0; i<gameData.select.poker.length; i++){
                        
                        for(let j=0; j<player[gameData.play].poker.length; j++){
                            if( gameData.select.poker[i].num == player[gameData.play].poker[j].num  && 
                                gameData.select.poker[i].color == player[gameData.play].poker[j].color
                            ){
                                    player[gameData.play].poker.splice(j, 1);
                                    break;
                            }
                            
                            
                        }
                    }

                    // 出牌的动画
                    $(".play_"+ (gameData.play+1) +" li").remove();

                    for (let i = 0; i < player[gameData.play].poker.length; i++) {
                        $(".play_"+(gameData.play+1)).append(makePoker(player[gameData.play].poker[i]));
                        if(gameData.play == 1){
                            $(".play_"+(gameData.play+1) +" li:last").css({ left: i * 25 + "px" });
                            // $(".play_" + (gameData.play + 1)).css({ left: -i * 10 + 'px' })
                        }else{
                            $(".play_"+(gameData.play+1) +" li:last").css({ top: i * 25 + "px" });
                            // $(".play_" + (gameData.play + 1)).css({ top: -i * 16 + 'px' })
                        }
                        
                    }
                    // 把牌显示到桌面
                    $(".all_poker").html('');
                    for (let i = 0; i <gameData.select.poker.length; i++) {
                        $(".all_poker").append(makePoker(gameData.select.poker[i]));
                        $('.all_poker li:last').css({ left: i * 36 + 'px' })
                        $('.all_poker').css({ left: -i * 20 + 'px' })
                    }
                    
                    if(player[gameData.play].poker.length == 2){
                        $('.music2').attr({src: '../music/liangzhangpai.mp3'});
                      }
                    if(player[gameData.play].poker.length == 1){
                        $('.music2').attr({src: '../music/yizhangpai.mp3'});
                      }
          
                    if(gameData.select.type == 4 || gameData.select.type == 14){
                        console.log("翻倍了");
                        gameData.multiple *= 2;
                    }
                        
                   
                    
                    console.log("动画后的玩家是:"+(gameData.play+1))
                    console.log(player[gameData.play]);
                    // 玩家手牌数据删除后，有可能玩家就已经没有手牌了。所以每一次出牌都应该先进行本局游戏的胜负
                    if(player[gameData.play].poker.length == 0){
                        // 进入结算阶段
                        gameClose()

                        return false;
                    }


                    // 1、如果能出的话，首选需要把手牌的数据替换掉桌面的数据
                    // gameData.desktop = gameData.select  // 由于数据是对象直接进行赋值的话是引用赋值，所以不能直接进行赋值
                    gameData.desktop.type = gameData.select.type;
                    gameData.desktop.max = gameData.select.max;
                    // 由于数组也是引用赋值，所以数组的拷贝需要使用循环进行遍历
                    gameData.desktop.poker =[];
                    for(let i=0; i<gameData.select.poker.length; i++){
                        gameData.desktop.poker[i] = {};
                        gameData.desktop.poker[i].num = gameData.select.poker[i].num;
                        gameData.desktop.poker[i].color = gameData.select.poker[i].color;
                    }

                    // 2、选中的牌组数据要清空
                    gameData.select.type = 0;
                    gameData.select.poker = [];
                    gameData.select.max = 0;

                    gameData.play = ++gameData.play>2? 0:gameData.play;     // 设置下一个出牌的玩家

                    // 使用自调函数让下一个玩家出牌
                    playPoker(0)

                }else{
                    alert("不符合规则")
                    gameData.select.poker = [];
                    $('.play_'+ (gameData.play+1)+' li').removeClass('on');
                }
            }

        })

        // 绑定过牌事件
        $(".play-btn").eq(gameData.play).find('.cancel').click( function(){
            if(gameData.desktop.type == 0){
                alert("你必须出牌")
            }else{
                // alert("过")
                $('.music2').attr({src: '../music/buyao4.mp3'});
                gameData.select.poker = [];
                $('.play_'+ (gameData.play+1)+' li').removeClass('on');
                gameData.play = ++gameData.play>2? 0:gameData.play;     // 设置下一个出牌的玩家
                // 使用自调函数让下一个玩家出
                playPoker(++pass)
            }
        })
    }

    // 结算阶段函数
  function gameClose() {
    let count = gameData.multiple * 100;

    // 隐藏所有玩家出牌的组件
    $('.play-btn').hide();
    // 隐藏倒计时组件
    $('.time-item').hide();
    //结算页面显示
    $(".end").show();

    // 本局是地主赢了还是农民赢了
    if (gameData.boss == gameData.play) {
        //在结算页面输出数据
        $(".end .result").html("地主赢了");
       
        
      console.log("地主胜利");
      // 除了地主外其它玩家都进行减分
      for (let i = 0; i < 3; i++) {
        if (i != gameData.boss) {
            player[i].gold -= count;
            
            // 农民金豆的情况
            $(".end .info span").eq(i).html(player[i].name+"-"+count+"="+player[i].gold);
          
        }
      }
      // 地主玩家加分
      player[gameData.boss].gold += count * 2;

      //地主金豆的情况
      $(".end .info span").eq(gameData.boss).html(player[gameData.boss].name+"+"+(count*2)+"="+player[gameData.boss].gold);
      
    } else {
      //在结算页面输出数据
      $(".end .result").html("农民赢了");
      console.log("农民胜利");
      // 地主玩家减分
      player[gameData.boss].gold -= count;
      // 地主金豆的情况
      $(".end .info span").eq(gameData.boss).html(player[gameData.boss].name+"-"+count+"="+player[gameData.boss].gold);

      // 除了地主外其它玩家都进行加分
      for (let i = 0; i < 3; i++) {
        if (i != gameData.boss) {
          player[i] += count / 2;
          // 农民金豆的情况
          $(".end .info span").eq(i).html(player[i].name+"+"+(count/2)+"="+player[i].gold);
        }
      }
    }
    // 在结束页面输出倍数
    $(".end .multinfo").html("倍数："+multiple+"倍");
    // 结束按钮的点击事件
    $(".end .goback").one("click")
  }


    // 时间倒计时提醒
    let time = parseInt(15);//倒计时总秒数量
    function timer(time){
        window.setInterval(function(){
            let day=0,
                hour=0,
                minute=0,
                second=0;//时间默认值        
            if(time > 0){
                day = Math.floor(time / (60 * 60 * 24));
                hour = Math.floor(time / (60 * 60)) - (day * 24);
                minute = Math.floor(time / 60) - (day * 24 * 60) - (hour * 60);
                second = Math.floor(time) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
            }
            $('.second_show').html('<s></s>'+second+'秒');
            time--;
        }, 1000);
    } 




})