'use strict';

const gulp = require('gulp');
const plumber = require("gulp-plumber");
const less = require('gulp-less');
const sourcemaps = require('gulp-sourcemaps');
const debug = require('gulp-debug');
const gulpIf = require('gulp-if');
const del = require('del');
const browserSync = require('browser-sync').create();
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const mqpacker = require("css-mqpacker");

const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == 'development';

gulp.task('style', function() {

  return gulp.src('less/style.less')
    .pipe(gulpIf(isDevelopment, sourcemaps.init()))
    .pipe(plumber())
    .pipe(less())
    .pipe(gulpIf(isDevelopment, sourcemaps.write()))
    .pipe(postcss([
      autoprefixer({browsers: [
        "last 1 version",
        "last 2 Chrome versions",
        "last 2 Firefox versions",
        "last 2 Opera versions",
        "last 2 Edge versions"
      ]}),
      mqpacker({
        sort: false
      })
    ]))
    .pipe(gulp.dest('build/css'))
});

gulp.task('clean', function() {
  return del('build')
});

gulp.task('copy', function(){
  return gulp.src([
    'fonts/**/*.{woff,woff2}',
    'img/**',
    'js/**',
    '*.html'
  ], {
    base: '.'
  })
  .pipe(gulp.dest('build'))
});

gulp.task('build', gulp.series(
  'clean',
  gulp.parallel('style', 'copy'))
);

gulp.task('watch', function() {
  gulp.watch('less/**/*.less', gulp.series('style'));

  gulp.watch([
    'fonts/**/*.{woff,woff2}',
    'img/**',
    'js/**',
    '*.html'
  ],
   gulp.series('copy'));
});

gulp.task('serve', function() {
  browserSync.init({
    server: 'build'
  });

  browserSync.watch('build/**/*.*').on('change', browserSync.reload);
});

gulp.task('dev',
  gulp.series('build', gulp.parallel('watch', 'serve'))
);
