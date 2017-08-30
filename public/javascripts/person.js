/**
 * Created by dreamIt on 2017/4/25.
 */
/*
* 修改信息
* */

$('.modify-information').on('click',function(){
    $('.show-person').hide();
    $('.modify-information').hide();
    $('.return').show();
    $('.modify-person').show();
})
$('.return').on('click',function(){
    $('.show-person').show();
    $('.modify-information').show();
    $('.return').hide();
    $('.modify-person').hide();
})
// 旧密码确认
$('input[name="laterPwd"]').on('blur',function(){
    var oldPwd = $(this).val();
    $.get('/oldPwd',{oldPwd: oldPwd},function(data){
        if(!data.flag){
            alert('旧密码错误');
        }
    })
})
// 新密码确认
$('input[name="newPwdAgain"]').on('blur',function(){
    var newPwd = $('input[name="newPwd"]').val();
    var newPwdAgain = $(this).val();
    if(newPwd != newPwdAgain){
        alert('确认密码错误')
    }
})

$('.modify-btn').on('click',function(){
    var data = {};
    data.username = $('input[name="username"]').val();
    data.userClass = $('input[name="userClass"]').val();
    data.studentId = $('input[name="studentId"]').val();
    data.telephone = $('input[name="telephone"]').val();
    data.email = $('input[name="email"]').val();
    data.laterPwd = $('input[name="laterPwd"]').val();
    data.newPwd = $('input[name="newPwd"]').val();
    data.newPwdAgain = $('input[name="newPwdAgain"]').val();


    if(data.username&&data.userClass&&data.studentId&&data.telephone&&data.email&&data.laterPwd&&data.newPwd&&data.newPwdAgain){
        $.post('/modifyP',data,function(data){
            if(data.flag){
                alert('修改成功');
            }
        })
    }

})

