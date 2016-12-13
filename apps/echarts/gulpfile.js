
const path = require('path');
const gulp = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');
const del = require('del');
const runSequence = require('run-sequence');

const $ = gulpLoadPlugins();

const config = {
    styles: 'css',
    images: 'img',
    scripts: 'js',
    tpls: 'tpls',
    dist: '../../wwws/echarts'
};

// CSS linting task
gulp.task('csslint', function() {
    return gulp.src(path.join(config.styles, '/**/*.css'))
        .pipe($.csslint('../../.csslintrc'))
        .pipe($.csslint.formatter());
    // Don't fail CSS issues yet
    // .pipe(plugins.csslint.failFormatter());
});

// ESLint JS linting task
gulp.task('eslint', function() {
    return gulp.src(path.join(config.scripts, '/**/*.js'))
        .pipe($.eslint('../../.eslintrc.js'))
        .pipe($.eslint.format());
});

gulp.task('clean', del.bind(null, [config.dist], { force: true }));

// Lint CSS and JavaScript files.
gulp.task('lint', function(done) {
    runSequence(['csslint', 'eslint'], done);
});

gulp.task('styles', () => {
    return gulp.src(path.join(config.styles, '/**/*.css'))
        .pipe($.concat('style.css'))
        .pipe($.cssnano({ safe: true, autoprefixer: false }))
        .pipe(gulp.dest(path.join(config.dist, config.styles)));
});

gulp.task('images', () => {
    return gulp.src(path.join(config.images, '/**/*'))
        .pipe($.cache($.imagemin()))
        .pipe(gulp.dest(path.join(config.dist, config.images)));
});

gulp.task('scripts', () => {
    return gulp.src([
            path.join(config.scripts, 'app-dist.js'),
            path.join(config.scripts, '/*/*.js')
        ]).pipe($.concat('app.js'))
        .pipe($.uglify())
        .pipe(gulp.dest(path.join(config.dist, config.scripts)));
});

gulp.task('lib', () => {
    return gulp.src(path.join('lib', 'echarts/dist/echarts.js'))
        .pipe(gulp.dest(path.join(config.dist, 'lib/echarts/dist')));
});

gulp.task('tpls', () => {
    return gulp.src(path.join(config.tpls, '/**/*.html'))
        .pipe($.htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest(path.join(config.dist, config.tpls)));
});

gulp.task('extras', () => {
    return gulp.src([
        '*.{png,jpg,jpeg,gif}'
    ], {
        dot: true
    }).pipe(gulp.dest(config.dist));
});

gulp.task('build', ['styles', 'images', 'scripts', 'lib', 'tpls', 'extras'], () => {
    return gulp.src(path.join(config.dist, '/**/*')).pipe($.size({ title: 'build', gzip: true }));
});

gulp.task('dist', () => {
    return new Promise(resolve => {
        runSequence('clean', 'lint', 'build', resolve);
    });
});

gulp.task('default', () => {
    runSequence('clean', () => {
        gulp.watch('css/**/*.css', ['csslint']);
        gulp.watch('js/**/*.js', ['eslint']);
    });
});
