/*
* 切换搜索条件
* */


$('.pull-right li').on('click',function(){
    var kind = $(this).find('a').text();
    var name = $(this).data('kind');
    if(name == 'bookKind'){
        $('.JDefault').hide();
        $('.Jselect').show();
    }else{
        $('.JDefault').show();
        $('.Jselect').hide();
        $('.Jshow-kind').text(kind);
        $('.Jinput').attr('name',name);
    }

})

/*
* 提交搜索
* */
$('.submit-btn').on('click',function(){
    if($('.Jselect').css('display')!='none'){
        var attrKind = 'bookKind';
        var val = $('select[name="bookKind"]').val();
    }else{
        var attrKind = $('.Jinput').attr('name');
        var val = $('.Jinput').val();
    }

    handle(attrKind,val);
})
// data-url='/admin/addStock?bookId="+book.bookId+"'
/*
*  增加库存
* */
$('.show-results').on('click','.addStock',function(){
    var left = $(window).width() - $('.addStock-part').width();
    var top = $(window).height() - $('.addStock-part').height();
    var bookName = $(this).parents('tr').find('.J-bookName').text();
    var bookId = $(this).parents('tr').find('.J-bookId').text();
    $('.addStock-part').show();
    $('#mask').show();
    $('.addStock-part').css('left',parseInt(left/2,10)).css('top',parseInt(top/3,10));
    $('.JBookName').val(bookName);
    $('.JBookId').val(bookId);
})

$('.add-btn').on('click',function(){
    var bookId = $('.JBookId').val();
    var count = $('input[name="stock1"]').val();
    $('.addStock-part').hide();
    $('#mask').hide();
    $.get('/admin/addStock',{bookId: bookId,count: count},function(json){
        if(json.flag){
            alert('入库成功！');
            var attrKind = $('.Jinput').attr('name');
            var val = $('.Jinput').val();
            handle(attrKind,val);
        }
    })
})
/*
*  下架操作
* */
$('.show-results').on('click','.deleteBook',function(){
    if(confirm("该操作执行后不可更改，是否继续？")){
        var url = $(this).data('url');
        $.get(url,null,function(json){
            if(json.flag){
                alert("下架成功");
                var attrKind = $('.Jinput').attr('name');
                var val = $('.Jinput').val();
                handle(attrKind,val);
            }
        })
    }
})

/*
* 添加新书
* */
$('.addBook-btn').on('click',function(){
    var left = $(window).width() - $('.addBook-part').width();
    $('.addBook-part').show();
    $('#mask').show();
    $('.addBook-part').css('left',parseInt(left/2,10)).css('top',20);
})

$('.addNew-btn').on('click',function(){
    $('.addBookForm').submit();
})

/*
* 关闭
* */
$('.close').on('click',function(){
    $('.addStock-part').hide();
    $('#mask').hide();
    $('.addBook-part').hide();
})
/*
* 检查书籍编号
* */
$('input[name="bookId"]').on('blur',function(){
    var bookId = $(this).val();
    if(bookId){
        $.get('/admin/checkId',{bookId: bookId},function(json){
            var flag = json.flag;
            if(flag){
                alert("此编号已经存在！");
            }
        })
    }

})

//搜索结果处理
function handle(attrKind,val){
    $.get('/admin/bookSearch',{attrKind: attrKind,val: val},function(json){
        if(json.error){
            alert("没有该关键词的记录")
        }else{
            var books = json.data,
                html = '';
            html +="<table class='table table-hover'><tr><th>编号</th><th>书名</th><th>作者</th><th>出版社</th><th>价格</th><th>分类</th><th>库存</th><th>借阅量</th><th>操作</th></tr>"
            for(var i = 0; i< books.length;i++){
                var book = books[i];
                var dos = "<td><a href='javascript: void(0)' class='addStock'>增加库存</a>|<a href='javascript: void(0)' data-url='/admin/deleteBook?bookId="+book.bookId+"' class='deleteBook'>下架</a></td>"
                html+= "<tr><td class='J-bookId'>"+book.bookId+"</td><td class='J-bookName'>"+book.bookName+"</td><td>"+book.author+"</td><td>"+book.publish+"</td><td>"+book.price+"</td><td>"+book.bookKind+"</td><td>"+book.stock+"</td><td>"+book.borrowCount+"</td>"+dos+"</tr>";
            }
            html += '</table>';
            $('.show-later').hide();
            $('.show-results').show().html(html);
        }
    })
}