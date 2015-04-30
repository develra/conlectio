'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');
var browserify = require('browserify');
var $ = require('gulp-load-plugins')();

module.exports = function(options) {
  function webpack(watch, callback) {
    var webpackOptions = {
      watch: watch,
      module: {
        loaders: [{ test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader'}]
      },
      output: { filename: 'index.js' }
    };

    // -- suspisious code
    //if(watch) {
    //  webpackOptions.devtool = 'inline-source-map';
    //}

    var webpackChangeHandler = function(err, stats) {
      if(err) {
        options.errorHandler('Webpack')(err);
     }
      $.util.log(stats.toString({
        colors: $.util.colors.supportsColor,
        chunks: false,
        hash: false,
        version: false
      }));
      browserSync.reload();
      if(watch) {
        watch = false;
        callback();
      }
    };

    return gulp.src(options.src + '/app/index.js')
      .pipe($.webpack(webpackOptions, null, webpackChangeHandler))
      .pipe(gulp.dest(options.tmp + '/serve/app'));
  }

  gulp.task('scripts', function () {
    return webpack(false);
  });

  gulp.task('scripts:watch', function (callback) {
    return webpack(true, callback);
  });
};
