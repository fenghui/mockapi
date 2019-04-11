let MongoClient = require('mongodb').MongoClient;
let ObjectId = require('mongodb').ObjectId;
let url = "mongodb://localhost:27017/mockapi";

let db = {
  createDB: function() {
    MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
      if (err) throw err;
      db.close();
    });
  },

  createSite: function() {
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
      if (err) throw err;
      var dbase = db.db("mockapi");
      dbase.createCollection('site', function (err, res) {
          if (err) throw err;
          db.close();
      });
    });
  },

  insert: function(data, cb) {
    MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
      if (err) throw err;
      var dbo = db.db("mockapi");
      dbo.collection("site").insertOne(data, function(err, res) {
          if (err) { 
            cb.error(err.message);
            throw err;
          }
          db.close();
          cb.success();
      });
    });
  },

  findAll: function(cb) {
    MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
      if (err) throw err;
      var dbo = db.db("mockapi");
      dbo.collection("site"). find({}).toArray(function(err, result) { // 返回集合中所有数据
          if (err) { 
            cb.error(err.message);
            throw err;
          }
          db.close();
          cb.success(result);
      });
    });
  },

  find: function(id, cb) {
    MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
      if (err) throw err;
      var dbo = db.db("mockapi");
      dbo.collection("site"). find({"_id":  ObjectId(id)}).toArray(function(err, result) { // 返回集合中所有数据
          if (err) { 
            cb.error(err.message);
            throw err;
          }
          db.close();
          cb.success(result.length > 0 ? result[0] : {});
      });
    });
  },

  /**
   * 
   * @param {title:'title', template:'template', _id:'id'} data 
   */
  update: function(data, cb) {
    MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
      if (err) throw err;
      var dbo = db.db("mockapi");
      var whereStr = {"_id" : ObjectId(data.id)};  // 查询条件
      var updateStr = {$set: data};
      dbo.collection("site").updateOne(whereStr, updateStr, function(err, res) {
          if (err)  {
            throw err;
            cb.error(false);
          };
          db.close();
          cb.success(true)
      });
  });
  },

  delete: function(id, cb) {
    if(!id) {
      cb.error(`id is:${id}`);
      return;
    }
    MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
      if (err) throw err;
      var dbo = db.db("mockapi");
      var whereStr = {"_id": ObjectId(id)};  // 查询条件
      dbo.collection("site").deleteOne(whereStr, function(err, obj) {
          if (err) {
            throw err;
            cb.error(err.message);
          }
          db.close();
          cb.success();
      });
    });
  }
};

module.exports = db;