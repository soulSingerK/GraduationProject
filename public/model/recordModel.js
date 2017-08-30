/**
 * Created by dreamIt on 2017/4/24.
 */
var mongoose = require('./mongoose');

var RecordModel = new mongoose.Schema({
    userId: Number,
    borrowRecords: [{
        bookId: Number,
        borrowTime: Number,
        returnTime: Number,
        count: Number,
        recordId: Number,
        overdue: {   // 是否逾期，默认为0，代表未逾期，大于0 表示逾期多少天
            type: Number,
            default: 0
        },
        laterRefresh: {
            type: Number, // 最近一次刷新的时间，默认为0 ，还未刷新过
            default: 0
        }
    }]
})

var record = mongoose.model('Record',RecordModel);
module.exports = record;