'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');


module.exports = function(options) {
  gulp.task('watch', ['scripts:watch', 'markups', 'inject'], function () {

    gulp.watch([options.src + '/*.html', 'bower.json'], ['inject']);

    gulp.watch([
      options.src + '/{app,components}/**/*.css',
      options.src + '/{app,components}/**/*.scss',
      options.src + '/{app,components}/**/*.sass'
    ],['styles', 'inject']);


    gulp.watch(options.src + '/{app,components}/**/*.jade', ['markups']);

    gulp.watch(options.src + '/{app,components}/**/*.html', function(event) {
      browserSync.reload(event.path);
    });
  });
};
