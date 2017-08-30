/**
 * Created by dreamIt on 2017/4/24.
 */

/*
* 遮罩处理
*
* */
$('#mask').height($('body').height());

/*
* 借阅
* 关闭
* */
$('.books-show').on('click','.book-borrow',function(){
    if(!$(this).hasClass('no-stock')){
        var height = $(document).height();
        var width = $(document).width();
        $('#mask').height(height).width(width).show();
        var left = width - $('.borrow-part').width();
        var top = height - $('.borrow-part').height();
        $('.borrow-part').css('left',parseInt(left/2,10)).css('top',parseInt(top/2,10)).show();
        //  借阅书名
        var bookName = $(this).parent('.book-item').find('input[name="bookname"]').val();
        $('.borrow-part input[name="bookName"]').val(bookName);

        // 书名id绑定
        var bookId = $(this).parent('.book-item').find('input[name="bookid"]').val();
        $('input[name="bookId"]').val(bookId);
    }

})

$('.borrow-close').on('click',function(){
    $('#mask').hide();
    $('.borrow-part').hide();
})
// 借阅操作

$('.borrow-btn').on('click',function(){

    var bookId =  $('input[name="bookId"]').val();
    var bookName = $('input[name="bookName"]').val();
    var count = $('input[name="count"]').val();
    var time = $('input[name="time"]').val();
    if(bookId&&bookName&&count&&time){
        $('.borrow-form').submit();
    }

})

/*
* 如果时间选择不正确
* */
$('.Wdate').on('focus',function(){
    var time = new Date($(this).val()).getTime();
    if(time<Date.now()){
        alert("不是有效的日期，请重新选择！");
        $(this).val(null);
    }
})

/*
* 禁止出现滚动条
* */
/*$('.Wdate').on('focus',function(){
    $('body').addClass('no-scroll');
})*/


/*$('input[name="start"]').calendar({
    zIndex: 999,
    width: 500,
    height: 500,
    selectedRang: [new Date(), null],
    onSelected: function(view, date, data) {
        var cc = date.format('yyyy-mm-dd');
        $("#start").html(cc);
        $("input[name=start]").val(cc);
    },
    onClose: function(view, date, data) {}
})*/
