var gulp = require('gulp');
var del = require('del');
var nodeRoot = './node_modules/';

gulp.task('clean', function () {
    return del(["dist/**"]);
});

gulp.task('default', function () {
    gulp.src("src/**/*").pipe(gulp.dest("dest"));
})