/**
 * Created by dreamIt on 2017/4/26.
 */
/*
* ²Ëµ¥ÇÐ»»
* */
$('.menu-li').on('click',function(){
    if(!$(this).hasClass('selected')){
        $(".menu-li").removeClass('selected');
        $(this).addClass('selected');
    }
    var src = $(this).find('a').data('url');
    $('.show-page').attr('src',src);
})
