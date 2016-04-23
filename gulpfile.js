const path = require("path");
var gulp = require('gulp');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var changed = require('gulp-changed');
var order = require('gulp-order');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var eslint = require('gulp-eslint');
var mocha = require('gulp-spawn-mocha');
var gutil = require('gulp-util');
var child_process = require('child_process');

var SourcesWithOut$ = [
  path.normalize(__dirname + '/src/Object/common.js'),
  path.normalize(__dirname + '/src/**/*.js'),
];
var outputDEST = __dirname + '/build';
var build_file_name = "jScope";

var Sources = [
  path.normalize(__dirname + '/../../helpers/encapsulate.begin.js'),
  path.normalize(__dirname + '/../$.js'), // 代码压缩库
  path.normalize(outputDEST + `/${build_file_name}.no$.js`),
  path.normalize(__dirname + '/../../helpers/encapsulate.end.js'),
];

var TestSource = [
  'test/**/*.js'
];

// as_child_module: 是作为其它库的子模块一起编译使用，与其它库共享一个代码压缩模块
gulp.task('build-as_child_module-dev', function () {
  return gulp.src(SourcesWithOut$)
    .pipe(order(
      SourcesWithOut$.map(filepath => path.basename(filepath))
    ))
    .pipe(concat(`${build_file_name}.no$.js`))
    .pipe(changed(outputDEST))
    .pipe(gulp.dest(outputDEST));
});
gulp.task('build-dev', ['build-as_child_module-dev'], function () {
  return gulp.src(Sources)
    .pipe(
    order(
      Sources.map(filepath => path.basename(filepath))
    )
    )
    .pipe(concat(`${build_file_name}.js`))
    .pipe(changed(outputDEST))
    .pipe(gulp.dest(outputDEST));
});

gulp.task('build', ['build-dev'], function () {
  return gulp.src(outputDEST + `/${build_file_name}.js`)
    .pipe(rename(`${build_file_name}.min.js`))
    .pipe(changed(outputDEST))
    .pipe(sourcemaps.init({
      loadMaps: true
    }))
    .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(outputDEST));
});


var WatchSource = SourcesWithOut$.concat(Sources).filter(filepath => filepath.indexOf(`${build_file_name}.no$.js`) === -1)
gulp.task('watch', ['build'], function () {
  gulp.watch(WatchSource, ['build']);
});

gulp.task('watch-dev', ['build-dev'], function () {
  gulp.watch(WatchSource, ['build-dev']);
});

// gulp.task('lint-tests', function() {
//   gulp.src(TestSource)
//     .pipe(eslint())
//     .pipe(eslint.formatEach('compact', process.stderr))
//     .pipe(eslint.failAfterError());
// });

// gulp.task('lint', ['lint-tests']);

var _is_by_killed = false;

gulp.task('test', ['test-kill', 'build'], function () {
  gulp.src(TestSource, {
    read: false
  }).pipe(mocha({
    reporter: 'spec',
    debug: "=5859"
  })).on("error", function (err) {
    if (!_is_by_killed) {
      gutil.log(err)
    } else {
      gutil.log(gutil.colors.green("RESTART Mocha."));
    }
    _is_by_killed = false;
  });
});

gulp.task('test-kill', function (done) {

  child_process.exec('netstat -ano', function (err, stdout, stderr) {
    if (err) {
      done(err)
    } else {
      var infos = stdout.split('\n')
        .filter(netinfo => netinfo.indexOf('0.0.0.0:5859') !== -1)
        .map(netinfo => netinfo.trim().split(/\s{1,}/g));

      if (infos[0]) {
        var pid = infos[0].slice().pop();
        gutil.log("kill Debugger port:5859. PID:", pid);
        _is_by_killed = true;
        process.kill(pid);
      }
      done()
    }
  })
});

gulp.task('test-watch', ['watch', 'test'], function () {
  gulp.watch(TestSource.concat([
    path.normalize(outputDEST + `/${build_file_name}.js`)
  ]), ['test']);
});

// gulp.task('test-debug', ['watch-dev'], function(done) {
//   new karma.Server({
//     configFile: __dirname + '/karma.conf.js',
//     browsers: ['PhantomJSCustom', 'Chrome'],
//     preprocessors: {},
//     reporters: ['progress'],
//     debug: true
//   }, done).start();
// });

gulp.task('default', ['watch']);