var express = require('express');
var router = express.Router();
var crypto = require('crypto');

var User = require('./../public/model/userModel');
var Book = require('./../public/model/bookModel');
var Record = require('./../public/model/recordModel');
var B_borrow = require('./../public/model/B_borrowR');
var B_return = require('./../public/model/B_returnB');

/* GET home page. */
router.get('/', function(req, res, next) {
  var session = req.session;
  if(session.user){
    res.render('index', { title: '图书管理系统',username: session.user.username });
  }else{
    res.render('index',{title: '图书馆管理系统'});
  }

})
router.get('/register',function(req,res,next){
  res.render('register',{title: '注册'});
})

router.get('/results',function(req,res,next){
  var session = req.session;
  if(req.session.books.length>0){
    res.render('search_results',{title: "查询结果",books: session.books,username: session.user.username})
  }else{
    res.render('search_results',{title: "查询结果",username: session.user.username})
  }

})

/*
* 个人信息
*
* */
router.get('/personI',function(req,res){
  var session = req.session;

  res.render('person',{title: "个人信息",user: session.user});
})

/*
 * 还书页面
 * */
router.get('/return',function(req,res){
  var session = req.session;
  Record.findOne({userId: session.user.userId},function(err,docs){
    if(err){}
    if(docs){
      if(docs.borrowRecords.length>0){
        var result = [];
        for(var i = 0 ; i < docs.borrowRecords.length ; i++){
          (function(i){
            var record = docs.borrowRecords[i];
            Book.findOne({bookId: record.bookId},function(err,book){
              record.bookImg = book.bookImg;
              record.bookName = book.bookName;
              record.introduce = book.introduce;
              result.push(record);
              if(result.length == docs.borrowRecords.length){
                return res.render('return',{title: "还书",user: session.user,records: result});
              }
            })
          })(i)

        }

      }else{
        return res.render('return',{title: "还书",user: session.user});
      }
    }else{
      return res.render('return',{title: "还书",user: session.user});
    }

  })
})

/*
* 还书操作
* */
router.get('/doReturn',function(req,res){
  var session = req.session;
  var recordId = req.query.recordId;
  var bookId = req.query.bookId;
  var count = req.query.count;


  var obj = new B_return();
  obj.studentId = session.user.studentId;
  obj.returnCount = count;
  obj.returnTime = Date.now();
  obj.B_id = Date.now();
  Book.findOne({bookId: bookId},function(err,book){
    if(err){}
    obj.bookName = book.bookName;
    obj.save(function(err){
      if(err){
        console.log('添加失败');
      }
      console.log("添加成功");
    })
  })

  Record.update({userId: session.user.userId},{$pull: {borrowRecords: {recordId: recordId}}},function(err){
    if(err){}

    Book.findOne({bookId: bookId},function(err,book){
      if(err){}
      book.stock += +count;
      book.save(function(err){
        if(err){}
        return res.redirect('/return');
      })
    })
  })
  /*Record.findOne({userId: session.user.username},function(err,record){e
    if(err){}

  })*/
})

/*
* 旧密码确认
* */
router.get('/oldPwd',function(req,res){
  var oldPwd = MD5(req.query.oldPwd);
  var session = req.session;
  if(oldPwd === session.user.password){
    return res.json({flag: true});
  }else{
    return res.json({flag: false});
  }
})

/*
* 修改信息
* */
router.post('/modifyP',function(req,res){
  var session = req.session;
  User.findOne({userId: session.user.userId},function(err,person){
    if(err){
      return res.render('error',{error: err});
    }
    person.username = req.body.username;
    person.userClass = req.body.userClass;
    person.studentId = req.body.studentId;
    person.telephone = req.body.telephone;
    person.email = req.body.email;
    person.password = MD5(req.body.newPwd);

    person.save(function(err){
      if(err){
        return res.render('err',{error: err});
      }
      return res.json({flag: true});
    })
  })
})


/*
* 登录
* */
router.post('/doLogin',function(req,res){
  var session = req.session;
  var user = {};
  user.studentId = req.body.studentId;
  user.password = MD5(req.body.password);
  User.findOne(user,function(err,user){
    if(err){
      res.render('error',{errors: err});
    }
    if(user){
      if(!user.freeze){
        session.user = user;
        return res.json({flag: true});
      }else{
        return res.json({errorMessage: "该用户已经冻结，请找管理员进行解冻操作"})
      }
    }else{
      return res.json({errorMessage: "用户或密码错误!"})
    }

  })
})

/*
* 退出
* */
router.get('/exit',function(req,res){
  req.session.destroy();
  return res.redirect('/');
})

/*
*   注册
* */
router.post('/doRegister',function(req,res,next){
  var user = new User();
  user.userId = Date.now();
  user.password = MD5(req.body.password);
  user.username = req.body.username;
  user.userClass = req.body.userClass;
  user.telephone = req.body.telephone;
  user.email = req.body.email;
  user.studentId = req.body.studentId;
  user.save(function(err){
    if(err){
      return res.render('error',{error: err});
    }else{
      var session = req.session;
      session.user = user;
      return res.redirect('/')
    }
  })
})

/*
*   借书
* */

router.post('/borrow',function(req,res){

  //var record = new Record();
  var session = req.session;
  var bookId = req.body.bookId;
  var count = req.body.count;
  var returnTime = new Date(req.body.time).getTime();
  var borrowTime = Date.now();

  var obj = new B_borrow();
  obj.studentId = session.user.studentId;
  obj.borrowCount = count;
  obj.borrowTime = borrowTime;
  obj.B_id = borrowTime;
  Book.findOne({bookId: bookId},function(err,book){
    if(err){}
    obj.bookName = book.bookName;
    obj.save(function(err){
      if(err){
        console.log('添加失败');
      }
      console.log("添加成功");
    })
  })



  Record.findOne({userId: session.user.userId},function(err,person){
    if(err){
      return res.render('error',{error: err});
    }
    //  如果 该用户已经借过书
    if(person){
      var bookRecord = {};
      bookRecord.bookId = bookId;
      bookRecord.borrowTime = borrowTime;
      bookRecord.returnTime = returnTime;
      bookRecord.count = count;
      bookRecord.recordId = Date.now();
      person.borrowRecords.push(bookRecord);
      person.save(function(err){
        if(err){
          return res.render('error',{error: err});
        }
        Book.findOne({"bookId": bookId},function(err,book){
          if(err){
            return res.render('error',{error: err});
          }
          if(book){
            book.stock -= count;
            book.borrowCount += +count;
            book.save(function(err){
              if(err){}
              return res.redirect('/');
            })
          }
        })
      })
    }else{
      var record = new Record();
      var bookRecord = {};
      bookRecord.bookId = bookId;
      bookRecord.borrowTime = borrowTime;
      bookRecord.returnTime = returnTime;
      bookRecord.count = count;
      bookRecord.recordId = Date.now();
      record.userId = session.user.userId;
      record.borrowRecords.push(bookRecord);

      record.save(function(err){
        if(err){}
        Book.findOne({"bookId": bookId},function(err,book){
          if(err){
            return res.render('error',{error: err});
          }
          if(book){
            book.stock -= count;
            book.borrowCount += +count;
            book.save(function(err){
              if(err){}
              return res.redirect('/');
            })
          }
        })
      })
    }

  })



})


/*
*  搜索
* */
router.post('/quick_search',function(req,res){
  var book = {};
  var session = req.session;
  if(req.body.bookName){
    book.bookName = req.body.bookName;
  }
  if(req.body.author){
    book.author = req.body.author;
  }
  if(req.body.publish){
    book.publish = req.body.publish;
  }
  Book.find(book,function(err,docs){
    if(err){
      res.render('error',{error: err});
    }
    session.books = docs;
    return res.redirect('/results')
  })

})

router.post('/better_search',function(req,res){
  var book = {};
  var session = req.session;
  if(req.body.bookName){
    book.bookName = req.body.bookName;
  }
  if(req.body.author){
    book.author = req.body.author;
  }
  if(req.body.publish){
    book.publish = req.body.publish;
  }
  if(req.body.time){
    book.time = req.body.time;
  }
  if(req.body.bookKind){
    book.bookKind = req.body.bookKind;
  }
  Book.find(book,function(err,docs){
    if(err){
      res.render('error',{error: err});
    }
    session.books = docs;
    return res.redirect('/results')
  })
})

function MD5(text){
  return crypto.createHash('md5').update(text).digest('hex');
}
module.exports = router;
