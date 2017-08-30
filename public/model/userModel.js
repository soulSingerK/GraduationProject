/**
 * Created by dreamIt on 2017/4/21.
 */
var mongoose = require('./mongoose');
var UserModel = new mongoose.Schema({
    username: String,
    password: String,
    userId: Number,
    userClass: String,
    telephone: Number,
    email: String,
    studentId: Number,
    credit: {               //  �����û������öȣ�  Ĭ��ֵ��1000
        type: Number,
        default: 1000
    },
    freeze:{               //���û��Ƿ񶳽�  1 �����Ѷ���  ���ܵ�¼��ϵͳ  0����û�ж���
        type: Number,
        default: 0
    }
});

/*UserModel.pre('save',function(next){
    var self = this;
    if(self.isNew){
        Sequence.increment('User',function(err,result){
            if(err){
                throw err;
            }
            self.id = result.next;
            next();
        })
    }else{
        next();
    }
})*/
var user = mongoose.model("User",UserModel);

module.exports = user;