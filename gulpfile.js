"use strict";

var gulp = require("gulp");
var plumber = require("gulp-plumber");
var less = require("gulp-less");
var sourcemaps = require("gulp-sourcemaps");
var debug = require("gulp-debug");
var gulpIf = require("gulp-if"); // Для более лакончиной реализации isDevelopment
var del = require("del");
var browserSync = require("browser-sync").create();
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var mqpacker = require("css-mqpacker");
var rename = require("gulp-rename");
var mincss = require("gulp-csso");
var imagemin = require("gulp-imagemin");
var webp = require("gulp-webp");
var svgmin = require("gulp-svgmin");
var svgstore = require("gulp-svgstore");
var posthtml = require("gulp-posthtml");
var include = require("posthtml-include");
var minhtml = require("gulp-htmlmin");

var isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == "development"; // Узнает этап разработки для sourceMap "NODE_ENV=production gulp style"

gulp.task("style", function() {

  return gulp.src("less/style.less")
    .pipe(gulpIf(isDevelopment, sourcemaps.init())) // file.sourceMap
    .pipe(plumber())
    .pipe(less())
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
    .pipe(gulpIf(isDevelopment, sourcemaps.write()))
    .pipe(gulp.dest("build/css"))
    .pipe(mincss())
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("build/css"))
    .pipe(browserSync.reload({stream: true}));
});

gulp.task("images", function() {
  return gulp.src("build/img/**/*.{png,jpg}")
  .pipe(imagemin([
    imagemin.optipng({
      optimizationLevel: 3
    }),
    imagemin.jpegtran({
      progressive: true
    })
  ]))
  .pipe(gulp.dest("build/img"));
});

gulp.task("webp", function() {
  return gulp.src("build/img/**/*.{png,jpg}")
  .pipe(webp({quality: 90}))
  .pipe(gulp.dest("build/img"));
});

gulp.task("symbols", function() {
  return gulp.src("img/icons/*.svg")
    .pipe(svgmin())
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename("symbols.svg"))
    .pipe(gulp.dest("build/img"));
});

gulp.task("html", function(){
  return gulp.src("*.html")
    .pipe(posthtml([
      include()
    ]))
    .pipe(minhtml({ collapseWhitespace: true }))
    .pipe(gulp.dest("build"));
});

gulp.task("clean", function() {
  return del("build")
});

gulp.task("copy", function(){
  return gulp.src([
    "fonts/**/*.{woff,woff2}",
    "img/**",
    "js/**"
  ], {
    base: "."
  })
  .pipe(gulp.dest("build"))
});

gulp.task("build", gulp.series(
  "clean",
  "style",
  "symbols",
  "copy",
  "html",
  "images",
  "webp"
));

gulp.task("serve", function() {
  browserSync.init({
    server: "build"
  });

  gulp.watch("less/**/*.less", gulp.series("style"));

  gulp.watch("*.html", gulp.series("html")).on("change", browserSync.reload);

  gulp.watch([
    "fonts/**/*.{woff,woff2}",
    "img/**",
    "js/**"
  ],
   gulp.series("copy")).on("change", browserSync.reload);
});

gulp.task("dev",
  gulp.series("build", "serve")
);
