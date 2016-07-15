let watchify = require('gulp-watchify');
let gulp = require('gulp');
let rename=require('gulp-rename');

gulp.task('js:index',buildScript({
  src:'src/index.js',
  dest:'build/index.js',
  watch:true
}));

function buildScript(options) {
  return watchify(function (watchify) {
    let bundle = gulp.src(options.src)
      .pipe(watchify({
        watch: !!options.watch,
        setup(bundle){
          process.env.BABEL_ENV = options.BABEL_ENV || 'development';
          bundle.transform('babelify');
        }
      }));
    if (options.rename !== false) {
      bundle.pipe(rename(options.dest)).pipe(gulp.dest('./'));
    }
    else {
      bundle.pipe(gulp.dest(options.dest));
    }
    return bundle;
  })
}