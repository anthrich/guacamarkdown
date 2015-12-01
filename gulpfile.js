var gulp = require("gulp");
var babel = require("gulp-babel");
var webserver = require("gulp-webserver");

gulp.task("css", function() {
  return gulp.src("src/styles.css")
    .pipe(gulp.dest("dist"));
});

gulp.task("js", function() {
  return gulp.src("src/main.js")
    .pipe(babel())
    .pipe(gulp.dest("dist"));
});

gulp.task('html', function () {
  return gulp.src('src/*.html')
    .pipe(gulp.dest('dist'))
});

// serve the build dir
gulp.task('serve', function () {
  gulp.src('./')
    .pipe(webserver({
      open: "http://localhost:10101/src/",
      port: 10101,
      livereload: true
    }));
});

gulp.task("watch", function() {
  gulp.watch('src/*.js', ['js']);
  gulp.watch('src/*.css', ['css']);
  gulp.watch('src/*.html', ['html']);
})

gulp.task("dev", ['default', 'watch', 'serve']);
gulp.task("default", ['js', 'css', 'html']);