function animation(){
    $('.all_poker').remove();
    $ul = $('<ul />');
    $ul.attr('class', 'all_poker');
 // 生成牌背
 for(let i = 0; i < 54; i++){
    $li = $('<li />');    //生成一个li标签
    $li.attr('class','back back'+i).css({'top': -i + 'px'});  //生成li的属性名和css的属性
    $ul.append($li);   //插入all_poker  div里面
}
$('.mid_top').append($ul); 


    for(let i = 0; i < 54; i++){
        if(i < 27){
            setTimeout(function(){},3000);
            for(let j = 0; j<27; j++){
                $('.back'+j).css({'animation':'run-1-0 9s linear '+ j/10 +'s 1'});
            }
        }else{
            for(let j = 27; j<54; j++){
                $('.back'+j).css({'animation':'run-1-1 6s linear '+ j/10 +'s 1'});
            }
        }
    }
    
}
// 飞机效果
function effect_1(){
    setTimeout(()=>{
        $('#airport').show();
        $('#airport').css({'animation':'run-4-1 3s linear 1','animation-fill-mode':'forwards'})

    },500)
}