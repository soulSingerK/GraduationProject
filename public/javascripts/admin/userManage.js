/**
 * Created by dreamIt on 2017/4/26.
 */
$('.btn-default').on('click',function(){
    var userClass = $("#className").val();
    var studentId = $('#studentId').val();
    var obj = {};
    if(userClass){
        obj.userClass = userClass;
    }
    if(studentId){
        obj.studentId = studentId;
    }
    $.get('/admin/searchByClass',{obj: obj},function(json){
        var html = "",
            credit,
            dos,
            creditStr,
            freezeUrl,
            unfreezeUrl;
        html += "<table class='table table-striped'><tr><th>姓名</th><th>学号</th><th>班级</th><th>联系电话</th><th>邮箱</th><th>信誉度</th><th>是否冻结</th><th>操作</th></tr>";
        for(var i = 0;i<json.data.length;i++){
            var user = json.data[i];
            freezeUrl = '/admin/freeze?userId='+ user.userId;
            unfreezeUrl = '/admin/unfreeze?userId='+ user.userId;
            if(!user.freeze){
                credit = '否';
                creditStr = "<td class='green'>"+user.credit+"</td>";
                dos = "<a href='javascript:void(0)' data-url="+freezeUrl+" class='can-do'>冻结</a>|<a href='javascript: void(0)' data-url ="+unfreezeUrl+" class='no-do'>解冻</a>"
            }else{
                credit = '是';
                creditStr = "<td class='red'>"+user.credit+"</td>";
                dos = "<a href='javascript:void(0)' data-url="+freezeUrl+" class='no-do'>冻结</a>|<a href='javascript: void(0)' data-url ="+unfreezeUrl+" class='can-do'>解冻</a>"
            }
            html += "<tr><td>"+user.username+"</td><td>"+user.studentId+"</td><td>"+user.userClass+"</td><td>"+user.telephone+"</td><td>"+user.email+"</td>"+creditStr+"<td>"+credit+"</td><td>"+dos+"</td></tr>";
        }
        html +="</table>"
        $('.users-show').html(html);
    })
})

/*
* 对can-do 做处理
* */
$('.users-show').on('click','.can-do',function(){
    if(confirm("确定此操作")){
        var url = $(this).data('url');
        $.get(url,null,function(data){
            if(data.flag){
                alert(data.message);
            }
        })
    }
})