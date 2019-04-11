var gulp = require('gulp'),
    browserSync = require('browser-sync').create(),
    nodemon = require('gulp-nodemon');

// gulp.task('browserSync', function() {
//     browserSync.init({
//       proxy: 'http://localhost:3000',
//       notify: false,
//       port: 4001
//     })
// });

// gulp.task('watch', function() {
//     gulp.watch(['./public/**/*.css'], browserSync.reload);
//     gulp.watch(['./public/**/*.js'], browserSync.reload);
//     gulp.watch(['./views/**/*.*'], browserSync.reload);
// });

gulp.task('node', function(cb) {
  nodemon({
    script: './bin/www',
    ext: 'js html ejs',
    env: {
        'NODE_ENV': 'development'
    }
  })
});



gulp.task('default', gulp.parallel('node', function(callback) {
   //这的文件只需要监听前端的，一般后端开发不需要刷新页面
    var files = [
        './public/**/*.css',
        './public/**/*.js',
        './views/**/*.*'
    ];
 
    //gulp.run(["node"]);
    browserSync.init({
        proxy: 'http://localhost:3000',
        notify: false,
        port: 3001 //这个是browserSync对http://localhost:3000实现的代理端口
    });
 
    gulp.watch(files).on("change", browserSync.reload);
}));