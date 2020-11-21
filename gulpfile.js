const {src, dest, watch, parallel, series} = require('gulp');
const browserSync = require('browser-sync').create();
const cleanCSS = require('gulp-clean-css');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const htmlmin = require('gulp-htmlmin');
const tinypng = require('gulp-tinypng-compress');

function bs() {
  serveSass();
  browserSync.init({
    server: {
      baseDir: "./src"
    }
  });

  watch("./src/*.html").on('change', browserSync.reload);
  watch("./src/sass/**/*.sass", serveSass);
  watch("./src/sass/**/*.scss", serveSass);
};

function serveSass() {
  return src("./src/sass/**/*.sass", "./src/sass/**/*.scss")
    .pipe(sass({
      outputStyle: 'nested',
    }))
    .pipe(autoprefixer({
      cascade: false
    }))
    .pipe(dest("./src/css"))
    .pipe(browserSync.stream());
};

function buildCSS(done){
  src('./src/css/**/**.css')
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(dest('./dist/css/'));
  done();
}

function html(done) {
  src('./src/**.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(dest('./dist/'));
  done();
}

function fonts(done) {
  src('./src/fonts/**/**')
    .pipe(dest('./dist/fonts/'));
  done();
}

function imagemin(done) {
  src('src/img/**/*.{png,jpg,jpeg}')
    .pipe(tinypng({key: '14F03sDB2snqDn4L9fZtwgDwxdxVGS75',}))
    .pipe(dest('./dist/img/'))
  src('src/img/**/*.svg')
    .pipe(dest('./dist/img/'))
  done();
}

exports.serve = bs;
exports.build = series(buildCSS, html, fonts, imagemin);