/**
 * Created by dreamIt on 2017/4/26.
 */
var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var async = require('async');

var util = require('util');
var fs = require('fs');
var multiparty = require('multiparty');

var User = require('./../public/model/userModel');
var Book = require('./../public/model/bookModel');
var Record = require('./../public/model/recordModel');
var Admin = require('./../public/model/admin');
var B_borrow = require('./../public/model/B_borrowR');
var B_return = require('./../public/model/B_returnB');

router.get('/',function(req,res){
    var errorInform = req.query.errorInform;
    if(errorInform){
        res.render('adminLogin',{title: '管理员登录',error: errorInform})
    }else{
        res.render('adminLogin',{title: '管理员登录'})
    }

});

router.get('/adminIndex',function(req,res){
   res.render('adminIndex',{title: '管理员首页'})
});

router.get('/userIndex',function(req,res){
    res.render('userIndex');
})

router.get('/userManage',function(req,res){
    res.render('userManage');
})

router.get('/bookManage',function(req,res){
    Book.find().sort({'time':-1}).exec(function(err,docs){
        if(err){}
        var index = 0;
        var results = [];
        for(var i = 0 ; i < docs.length ; i++){
            if(index<9){
                results.push(docs[i]);
            }else{
                break;
            }
            index++;
        }
        res.render('bookManage',{books: results});
    })

})
router.get('/statistics',function(req,res){
    res.render('statistics');
})
router.get('/exit',function(req,res){
    req.session.destroy();
    return res.redirect('/admin');
})

router.post('/validateAdmin',function(req,res){
    var session = req.session;
    var name = req.body.name;
    var password = MD5(req.body.password);
    Admin.findOne({name: name,password: password},function(err,admin){
        if(err){}
        session.admin = admin;
        if(admin){
            return res.redirect('/admin/adminIndex');
        }else{
            return res.redirect('/admin?errorInform=您的账号或者密码错误！')
        }
    })

})

/*
* 按班级查询学生
* 名字
* */
router.get('/searchByClass',function(req,res){
    //var userClass = req.query.userClass;
    var obj = req.query.obj;
    User.find(obj).sort({'credit': -1}).exec(function(err,docs){
        if(err){}
        if(docs.length>0){
            return res.json({data: docs})
        }
    })
})

/*
* 冻结学生账号
* */
router.get('/freeze',function(req,res){
    var userId = req.query.userId;
    User.findOne({userId: userId},function(err,user){
        if(err){}
        if(!user.freeze){
            user.freeze = 1;
            user.credit = 499;
            user.save(function(err){
                if(err){}
                res.json({flag: true,message:'冻结成功！请重新加载页面'});
            })
        }
    })
})

/*
* 解除学生冻结状态
* */
router.get('/unfreeze',function(req,res){
    var userId = req.query.userId;
    User.findOne({userId: userId},function(err,user){
        if(err){}
        if(user.freeze){
            user.freeze = 0;
            user.credit = 500;
            user.save(function(err){
                if(err){}
                res.json({flag: true,message:'解冻成功！请重新加载页面'});
            })
        }

    })
})

/*
* 搜索书籍
* */
router.get('/bookSearch',function(req,res){
    var obj = {};
    var attrKind = req.query.attrKind;
    var val = req.query.val;
    obj[attrKind] = val;
    Book.find(obj,function(err,docs){
        if(err){}
        if(docs.length>0){
            return res.json({data: docs});
        }else{
            return res.json({error: true});
        }

    })
})

/*
* 添加库存
* */
router.get('/addStock',function(req,res){
    var bookId = req.query.bookId;
    var count = +req.query.count;
    Book.findOne({bookId: bookId},function(err,book){
        if(err){}
        if(book){
            book.stock += count;
            book.save(function(err){
                if(err){}
                return res.json({flag: true});
            })
        }
    })
})

/*
* 删除书籍
* */
router.get('/deleteBook',function(req,res){
    var bookId = req.query.bookId;
    Book.remove({bookId: bookId},function(err,result){
        if(err){}
        return res.json({flag: true});
    })
})

/*
* 添加书籍
* */
router.post('/addBook',function(req,res){
    var file = new multiparty.Form({uploadDir: './public/images/books/'});
    file.parse(req,function(err,fields,files){
        var filesTmp = JSON.stringify(files,null,2);
        if(err){

        }else{
            var inputFile = files.bookImg[0];
            var uploadedPath = inputFile.path;
            var pathArr = inputFile.originalFilename.split('.');
            var bookImg = pathArr[0] + Math.random().toFixed(3)*1000 + '.' + pathArr[1];
            var dstPath = './public/images/books/' + bookImg;
            fs.rename(uploadedPath,dstPath,function(err){
                if(err){}
                var book = new Book();
                book.bookId = fields.bookId[0];
                book.bookName = fields.bookName[0];
                book.author = fields.author[0];
                book.publish = fields.publish[0];
                book.price = fields.price[0];
                book.introduce = fields.introduce[0];
                book.bookKind = fields.bookKind[0];
                book.bookImg = bookImg;
                book.time = Date.now();
                book.stock = fields.stock[0];
                book.save(function(err){
                    if(err){}
                    return res.redirect('/admin/bookManage')
                })
            })
        }
    })
})

/*
* 刷新用户信用度
* */
router.get('/refresh',function(req,res){
    async.series([function(cb){
        Record.find({},function(err,docs){
            if(err){}
            var len = docs.length;
            for(var i = 0; i < len; i++){     // 循环每个用户
                for(var j = 0 ; j < docs[i].borrowRecords.length ; j++){ // 循环每个用户的借书记录
                    (function(i,j){
                        var record = docs[i];
                        var itemRecord = record.borrowRecords[j];
                        var nowTime = Date.now();
                        var returnTime = itemRecord.returnTime;
                        var leftTime = nowTime - returnTime;
                        var dayCount = 0;
                        var overdue = itemRecord.overdue;
                        if(leftTime > 0){      // 如果用户的某条记录已经逾期，扣除信用度
                            dayCount = Math.ceil(leftTime/(1000*60*60*24));
                            itemRecord.overdue = dayCount;
                            if(itemRecord.laterRefresh&&overdue){  // 如果该记录以前刷新过 就以最近的一此刷新记录的时间为准
                                dayCount = dayCount - overdue;
                            }
                            itemRecord.laterRefresh = 1;
                            record.save(function(err){
                                if(err){};
                                var userId = record.userId;
                                User.findOne({userId: userId},function(err,user){
                                    console.log(user.username)
                                    user.credit -= dayCount*10;
                                    if(user.credit < 500){
                                        if(!user.freeze){
                                            user.freeze = 1;
                                        }
                                    }
                                    user.save(function(err){
                                        if(err){}
                                    })
                                })
                            })
                        }
                    })(i,j)
                }
            }
        })
        cb(null,1);
    }],function(){
        return res.json({flag: true});
    })
})

/*
* 本月借阅量前十查询
* */
router.get('/monthSta',function(req,res){
    Book.find().sort({'borrowCount': -1}).exec(function(err,docs){
        if(err){};
        var index = 0;
        var results = [];
        for(var i = 0 ; i < docs.length ; i++){
            if(index<10&&docs[i].borrowCount>0){
                var book = {};
                book.name = docs[i].bookName;
                book.value = docs[i].borrowCount;
                results.push(book);
            }else{
                break;
            }
            index++;
        }
        return res.json({data: results});
    })
})

/*
* 借书处理
* */
router.get('/borrowHandle',function(req,res){
    var studentId = req.query.studentId;
    B_borrow.find({studentId: studentId},function(err,docs){
        if(err){}
        if(docs.length>0){
            return res.json({data: docs});
        }else{
            return res.json({emptys: true});
        }
    })
})
/*
* 删除记录
* */
router.get('/alreadyDo',function(req,res){
    var B_id = req.query.B_id;
    var studentId = req.query.studentId;
    B_borrow.remove({B_id: B_id},function(err){
        if(err){

        }
       return res.json({flag: true});
    })
})

/*
 * 还书处理
 * */
router.get('/returnHandle',function(req,res){
    var studentId = req.query.studentId;
    B_return.find({studentId: studentId},function(err,docs){
        if(err){}
        if(docs.length>0){
            return res.json({data: docs});
        }else{
            return res.json({emptys: true});
        }
    })
})

/*
 * 删除记录
 * */
router.get('/alreadyDo2',function(req,res){
    var B_id = req.query.B_id;
    var studentId = req.query.studentId;
    B_return.remove({B_id: B_id},function(err){
        if(err){

        }
        return res.json({flag: true});
    })
})

/*
* 检查书籍编号是否唯一
* */
router.get('/checkId',function(req,res){
    var bookId = req.query.bookId;
    Book.findOne({"bookId": bookId},function(err,book){
        if(err){}
        if(book){
            res.json({flag: true});
        }else{
            res.json({flag: false});
        }
    })
})


function MD5(text){
    return crypto.createHash('md5').update(text).digest('hex');
}
module.exports = router;