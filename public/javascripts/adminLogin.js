/**
 * Created by dreamIt on 2017/4/26.
 */
/*
* ����Ա��¼
* */

$('.submit-btn').on('click',function(){
    var name = $('input[name="name"]').val();
    var password= $('input[name="password"]').val();
    if(name&&password){
        $('.form-horizontal').submit();
    }
})
