const fs = require('fs');
const gulp = require('gulp');
const htmlmin = require('gulp-htmlmin');
const path = require('path');
const pug = require('gulp-pug');
const webpack = require('webpack-stream');
const webpackConfig = require('./webpack.config.js');
const webserver = require('gulp-webserver');

const dist = 'dist2';

gulp.task('default', ['html', 'webserver', 'watch']);

gulp.task('build', ['js', 'html', 'lib', 'textures']);

gulp.task('js', () => {
  return gulp.src('src/index.js')
    .pipe(webpack(webpackConfig))
    .pipe(gulp.dest(dist));
});

gulp.task('html', () => {
  return gulp.src('index.pug')
    .pipe(pug({}))
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest(dist));
});

gulp.task('lib', () => {
  return gulp.src('lib/**.js').pipe(gulp.dest(dist))
});

gulp.task('textures', () => {
  return gulp.src('src/textures/**/*')
  .pipe(gulp.dest(path.join(dist, 'textures')));
});

gulp.task('webserver', () => {
  const port = parseInt(process.env.port || '8080', 10);
  return gulp.src(dist)
    .pipe(webserver({ livereload: true, open: true, port, host: '0.0.0.0' }));
});

gulp.task('watch', () => {
  return gulp.watch(['index.pug', 'src/**/*.js'], ['html']);
});
