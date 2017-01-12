const gulp = require("gulp");
const browserSync = require("browser-sync").create();
const sass = require("gulp-sass");

gulp.task('serve', function() {
    browserSync.init({
        server: "./html"
    });
    
    gulp.watch("./html/sass/*.scss", ['sass']);
    gulp.watch("./html/*.html").on("change", browserSync.reload);
    gulp.watch("./html/js/*.js").on("change", browserSync.reload);
});

gulp.task("sass", function() {
    return gulp.src("html/sass/*.scss").pipe(sass()).pipe(gulp.dest("html/css")).pipe(browserSync.stream());
});

gulp.task("default", ['serve']);