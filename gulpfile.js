const gulp  = require('gulp');
const babel = require('gulp-babel');
const sass  = require('gulp-sass');

gulp.task('es6', () => {
    return gulp.src('src/js/**/*.js')
        .pipe(babel({
            presets: ['es2015'],
            plugins: ['transform-object-assign']
        }))
        .pipe(gulp.dest('public/js'));
});

gulp.task('sass', () => {
    return gulp.src('src/scss/main.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('public/css'));
});

gulp.task('default', ['es6', 'sass'], () => {
    gulp.watch('src/js/**/*.js', ['es6']);
    gulp.watch('src/scss/**/*.scss', ['sass']);
});
