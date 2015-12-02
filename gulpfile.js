var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var watchify = require('watchify');
var babel = require('babelify');
var debowerify = require('debowerify');
var connect = require('gulp-connect');
var rollup = require('gulp-rollup');

// Build CSS into dist dir
gulp.task("css", function() {
  // currently just a straight copy
  return gulp.src("src/styles.css")
    .pipe(gulp.dest("dist"));    
});

// Bundle ES6 modules into a single file
gulp.task('bundle', function(){
  return gulp.src('./src/GuacaMarkdownEditor.js', {read: false})
    .pipe(rollup({
        // any option supported by rollup can be set here, including sourceMap
        // https://github.com/rollup/rollup/wiki/JavaScript-API
        format: 'es6',
        sourceMap: true
    }))
    .pipe(sourcemaps.write(".")) // this only works if the sourceMap option is true
    .pipe(gulp.dest('./dist'));
});

// Builds the example application (ES6 transpiling etc)
gulp.task('example', function() {  
  var extensions = ['.js','.json','.es6'];
  
  var bundler = watchify(
      browserify('./example/main.js', { debug: true, extensions: extensions })
      .transform(babel.configure({
        extensions: extensions
      }))
      .transform(debowerify)
    );

  function rebundle() {
    bundler.bundle()
      .on('error', function(err) { console.error(err); this.emit('end'); })
      .pipe(source('example.js'))
      .pipe(buffer())
      .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('./example/'));
  }

  bundler.on('update', function() {
    console.log('-> bundling...');
    rebundle();
  });

  rebundle();
});

// rerun tasks when soruce files change
gulp.task("watch", function() {
  gulp.watch('src/*.js', ['bundle']);
  gulp.watch('src/*.css', ['css']);
})

gulp.task('build', ['bundle', 'css']);
gulp.task('connect', function() { connect.server();} );
gulp.task('default', ['build', 'watch', 'example', 'connect']);