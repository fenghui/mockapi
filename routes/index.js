var express = require('express');
var router = express.Router();
var db = require('./db');
var fs = require('fs');
var multer = require('multer');
var upload = multer({dest: 'upload_tmp/'});

db.createSite();

/* GET home page. */
router.get('/', function(req, res, next) {
  //get list
  let apiList = [];
  db.findAll({
    success: function(result) {
      res.render('index', { apiList: result });
    },
    error: function(msg) {
      console.error('db.findAll', msg);
      res.render('index', { apiList: apiList });
    }
  });
  
});

router.get('/add', function(req, res, next) {
  res.render('add');
});

router.post('/doAdd', upload.any(), function(req, res, next) {
  console.log(req.files);
  let title = req.body['title'];
  let template = req.body['template'];
  let type = req.body['dataType'];

  if(type == 0) {
    db.insert({title: title, template: template, type: type}, {
      success: function() {
        res.redirect('/');
      },
      error: function(msg) {
        console.error('db.insert', msg);
        res.redirect('/');
      }
    });
  } else {
    var fileName = new Date().getTime() + '_' + req.files[0].originalname;
    var des_file =  "./public/upload/" + fileName;
    fs.readFile( req.files[0].path, function (err, data) {
         fs.writeFile(des_file, data, function (err) {
          if( err ) {
               console.log( err );
               res.redirect('/');
          } else {
           db.insert({title: title, template: fileName, type: type}, {
            success: function() {
              fs.unlink(req.files[0].path, function() {});
              res.redirect('/');
            },
            error: function(msg) {
              console.error('db.insert', msg);
              res.redirect('/');
            }
           }); 
          }
        });
    });
  }
});

router.get('/edit/:id', function(req, res, next) {
  let id = req.params.id;
  db.find(id, {
    success: function(data) {
      res.render('edit', data);
    },
    error: function(msg) {
      console.error('db.find', msg);
      res.redirect('/');
    }
  });
});

router.post('/doEdit', function(req, res, next) {
  let userInfo = {
    id: req.body['id'],
    title: req.body['title'],
    template: req.body['template']
  };
  db.update(userInfo, {
    success: function() {
      res.redirect('/');
    },
    error: function(msg) {
      console.error('db.update', msg);
      res.redirect('/');
    }
  });
});

router.get('/doDel/:id', function(req, res, next) {
  let id = req.params.id;

  db.find(id, {
    success: function(data) {
      if(data.type == 1) {
        let filepath = `./public/upload/${data.template}`;
        console.log(filepath);
        fs.unlink(filepath, function() {});
      }
      db.delete(id, {
        success: function() {
          res.redirect('/');
        },
        error: function(msg) {
          console.error('db.delete', msg);
          res.redirect('/');
        }
      });
    },
    error: function(msg) {
      console.error('db.find', msg);
      res.redirect('/');
    }
  });
});

router.get('/api/:id', function(req, res, next) {
  let id = req.params.id;
  db.find(id, {
    success: function(data) {
      if(data.type == 1) {
        let filepath = `/upload/${data.template}`;
        res.redirect(filepath);
      } else {
        try {
          let result = JSON.parse(data.template);
          res.json(result);
        } catch(exception) {
          res.end(data.template);
          console.error('JSON.parse Error', data.template);
        }
      }
    },
    error: function(msg) {
      console.error('db.find', msg);
      res.redirect('/');
    }
  });
});


module.exports = router;
