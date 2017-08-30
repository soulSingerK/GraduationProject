/**
 * Created by dreamIt on 2017/4/20.
 */



/*
* 检索切换
*
* */

$('.change-search span').on('click',function(){
    if(!$(this).hasClass('search-select')){
        $('.search-select').removeClass('search-select');
        $(this).addClass('search-select');
    }
    if($(this).hasClass('quick-search')){
        $('.search-form').hide();
        $('.quick-search-form').show();
    }else{
        $('.search-form').hide();
        $('.better-search-form').show();
    }
})

/*
* 登录 注册
*
*
* */
$('.login').on('click',function(){
    $('.login-part').show();
    $('#mask').show();
    var left = $(document).width() - $('.login-part').width();
    var top = $(document).height() - $('.login-part').height();
    $('.login-part').css('left',parseInt(left/2,10)).css('top',parseInt(top/2,10));
})
$('.close-btn').on('click',function(){
    $('.login-part').hide();
    $('#mask').hide();
})

$('.login-btn').on('click',function(){
    var studentId = $('input[name="studentId"]').val();
    var password = $('input[name="password"]').val();
    if(studentId&&password){
        $.post('/doLogin',{studentId: studentId,password: password},function(data){
            if(data.flag){
                alert("登录成功!");
                location.href = '/';
            }
            if(data.errorMessage){
                alert(data.errorMessage);
            }
        })
    }
})

/*
*   搜索
*
* */
$('.search-submit').on('click',function(){
    if($('.welcome-back').length>0){
        var bookName = $('input[name="bookName"]').val();
        var author = $('input[name="author"]').val();
        var publish = $('input[name="publish"]').val();
        if($(this).hasClass('quick-btn')){
            if(bookName||author||publish){
                $('.quick-search-form').submit();
            }
        }else{
            var time = $('input[name="time"]').val();
            var bookKind = $('input[name="bookKind"]').val();
            if(bookName||author||publish||time||bookKind){
                $('.better-search-form').submit();
            }
        }
    }else{
        alert("请先登录");
        $('.login-part').show();
        $('#mask').show();
        var left = $(document).width() - $('.login-part').width();
        var top = $(document).height() - $('.login-part').height();
        $('.login-part').css('left',parseInt(left/2,10)).css('top',parseInt(top/2,10));
    }

})

/*
* 查看个人信息
* */
$('.person-information').on('click',function(){
    if($('.welcome-back').length>0){
        location.href = '/personI';
    }else{
        alert("请先登录");
        $('.login-part').show();
        $('#mask').show();
        var left = $(document).width() - $('.login-part').width();
        var top = $(document).height() - $('.login-part').height();
        $('.login-part').css('left',parseInt(left/2,10)).css('top',parseInt(top/2,10));
    }
})

/*
*   还书操作
* */
$('.return-book').on('click',function(){
    if($('.welcome-back').length>0){
        location.href = '/return';
    }else{
        alert("请先登录");
        $('.login-part').show();
        $('#mask').show();
        var left = $(document).width() - $('.login-part').width();
        var top = $(document).height() - $('.login-part').height();
        $('.login-part').css('left',parseInt(left/2,10)).css('top',parseInt(top/2,10));
    }
})




