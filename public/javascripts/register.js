/*
*   ע��
*   ���򵥵��ж�
* */

$('.reg-btn').on('click',function(){

    var username = $('input[name="username"]').val();
    var userClass = $('input[name="userClass"]').val();
    var telephone = $('input[name="telephone"]').val();
    var email = $('input[name="email"]').val();
    var password = $('input[name="password"]').val();
    var pwdAgain = $('input[name="pwdAgain"]').val();

    if(username&&userClass&&telephone&&email&&password&&pwdAgain){
        if(password===pwdAgain){
            $('.register-right form').submit();
        }else{
            $('.error-inform').show().html('前后两次密码不一致');
        }
    }else{
        $('.error-inform').show().html('请填写完整的信息');
    }

})