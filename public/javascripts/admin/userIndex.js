/**
 * Created by dreamIt on 2017/4/28.
 */
/*
* 刷新用户信用度
* */
$('.refresh-btn').on('click',function(){
    var left = $(document).width() - $('.refresh-part').width();
    var top = $(document).height() - $('.refresh-part').height();

    $('.refresh-part').show().css('left',parseInt(left/2,10)).css('top',parseInt(top/3,10));
    $('#mask').show();
    var step = 0;
    var t = setInterval(function(){
        step +=10;
        if(step>360){
            step = 0;
        }
        $('.refresh-img').css('transform',"rotate("+step+"deg)");
    },50);

    $.get('/admin/refresh',null,function(data){
        if(data.flag){
            clearInterval(t);
            $('#mask').hide();
            $('.refresh-part').hide();
            alert('刷新成功！');
        }
    })

})

/*
* 处理借书
* */
$('.borrow-btn').on('click',function(data){
    var studentId = $(this).parents('form').find('input[name="studentId"]').val();
    $.get('/admin/borrowHandle',{studentId:studentId},function(json){
        console.log(json)
        if(json.emptys){
            alert("没有该同学的借书记录")
        }else if(json.data){
            var records = json.data,
                html = '';
            html+= "<table class='table table-hover'><tr><th>学号</th><th>书名</th><th>借书数量</th><th>借书时间</th><th>操作</th></tr>";
            for(var i = 0; i<records.length;i++){
                var time = new Date(records[i].borrowTime);
                var timeStr = time.getFullYear() + ' - ' + (time.getMonth()+1)+' - ' +time.getDate()+ '  '+time.getHours()+':'+time.getMinutes();
                html+= "<tr><td>"+records[i].studentId+"</td><td>"+records[i].bookName+"</td><td>"+records[i].borrowCount+"</td><td>"+timeStr+"</td><td><a href='javascript:void(0)' data-d = "+records[i].B_id+" class='borrow-do'>处理</a></td></tr>"
            }
            html+= "</table>"
            $('.show-results').show().html(html);
        }
    })
})

$('.show-results').on('click','.borrow-do',function(){
    var B_id = $(this).data('d');
    $.get('/admin/alreadyDo',{B_id: B_id},function(json){
        if(json.flag){
            alert("处理成功");
            location.href = '/admin/userIndex';
        }
    })
})


/*
* 处理还书
* */
$('.return-btn').on('click',function(data){
    var studentId = $(this).parents('form').find('input[name="studentId"]').val();
    $.get('/admin/returnHandle',{studentId:studentId},function(json){
        console.log(json)
        if(json.emptys){
            alert("没有该同学的还书记录")
        }else if(json.data){
            var records = json.data,
                html = '';
            html+= "<table class='table table-hover'><tr><th>学号</th><th>书名</th><th>还书数量</th><th>还书时间</th><th>操作</th></tr>";
            for(var i = 0; i<records.length;i++){
                var time = new Date(records[i].returnTime);
                var timeStr = time.getFullYear() + ' - ' + (time.getMonth()+1)+' - ' +time.getDate()+ '  '+time.getHours()+':'+time.getMinutes();
                html+= "<tr><td>"+records[i].studentId+"</td><td>"+records[i].bookName+"</td><td>"+records[i].returnCount+"</td><td>"+timeStr+"</td><td><a href='javascript:void(0)' data-d = "+records[i].B_id+" class='return-do'>处理</a></td></tr>"
            }
            html+= "</table>"
            $('.show-results').show().html(html);
        }
    })
})

$('.show-results').on('click','.return-do',function(){
    var B_id = $(this).data('d');
    $.get('/admin/alreadyDo2',{B_id: B_id},function(json){
        if(json.flag){
            alert("处理成功");
            location.href = '/admin/userIndex';
        }
    })
})