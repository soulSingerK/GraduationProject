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
    credit: {               //  设置用户的信用度，  默认值是1000
        type: Number,
        default: 1000
    },
    freeze:{               //该用户是否冻结  1 代表已冻结  不能登录该系统  0代表没有冻结
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