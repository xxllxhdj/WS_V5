
const path = require('path');
const fs = require('fs');
const gulp = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');
const del = require('del');
const stylish = require('jshint-stylish');
const zip = require('gulp-zip');
const runSequence = require('run-sequence');

const $ = gulpLoadPlugins({
    rename: {
        'gulp-angular-filesort': 'fileSort'
    }
});

const relativePath = '../../WorkStation/apps';
const appid = 'ionic';

const config = {
    styles: 'css',
    images: 'img',
    scripts: 'js',
    tpls: 'tpls',
    lib: 'lib',
    dist: relativePath + '/' + appid
};

var dev = true;

gulp.task('makeLibDir', function () {
    return fs.mkdir(config.lib, function (err) {
        if (err && err.code !== 'EEXIST') {
            console.error(err);
        }
    });
});

gulp.task('injectfile', () => {
    var libInjectOptions = {
        starttag: '//--inject:lib--//',
        endtag: '//--endinject--//',
        transform: function (filepath, file, i, length) {
            return 'workStation.getFullPath(\'' + filepath + '\', \'ionic\')' + ((dev || i + 1 < length) ? ',' : '');
        },
        addRootSlash: false
    };
    var jsInjectOptions = {
        starttag: '//--inject:js--//',
        endtag: '//--endinject--//',
        transform: function (filepath, file, i, length) {
            return 'workStation.getFullPath(\'' + filepath + '\', \'ionic\')' + (i + 1 < length ? ',' : '');
        },
        addRootSlash: false
    };

    return gulp.src(path.join(config.scripts, '/app.js'))
        .pipe($.inject(gulp.src(require('main-bower-files')('**/*.{css,js}'), {read: true, base: config.lib}), libInjectOptions))
        .pipe($.if(dev, $.inject(gulp.src(path.join(config.scripts, '/*/*.js')).pipe($.fileSort()), jsInjectOptions)))
        .pipe(gulp.dest(path.join(config.dist, 'js')));
});

gulp.task('lint', function() {
  return gulp.src(path.join(config.scripts, '/**/*.js'))
    .pipe($.jshint())
    .pipe($.jshint.reporter(stylish))
    .pipe($.if(dev, gulp.dest(path.join(config.dist, 'js'))));
});

gulp.task('clean', del.bind(null, [config.dist], { force: true }));

gulp.task('styles', () => {
    if (dev) {
        return gulp.src(path.join(config.styles, '/**/*.css'))
          .pipe(gulp.dest(path.join(config.dist, 'css')));
    } else {
        return gulp.src(path.join(config.styles, '/**/*.css'))
            .pipe($.concat('style.css'))
            .pipe($.cssnano({ safe: true, autoprefixer: false }))
            .pipe(gulp.dest(path.join(config.dist, config.styles)));
    }
});

gulp.task('images', () => {
    return gulp.src(path.join(config.images, '/**/*'))
        .pipe($.cache($.imagemin()))
        .pipe(gulp.dest(path.join(config.dist, config.images)));
});

gulp.task('scripts', () => {
    return gulp.src([
            path.join(config.scripts, '/*/*.js'),
            path.join(config.dist, config.scripts + '/app.js')
        ])
        .pipe($.fileSort())
        .pipe($.concat('app.js'))
        .pipe($.uglify())
        .pipe(gulp.dest(path.join(config.dist, config.scripts)));
});

gulp.task('lib', () => {
    return gulp.src(require('main-bower-files')(), {read: true, base: 'lib'})
        .pipe(gulp.dest(path.join(config.dist, config.lib)));
});

gulp.task('tpls', () => {
    return gulp.src(path.join(config.tpls, '/**/*.html'))
        .pipe($.htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest(path.join(config.dist, config.tpls)));
});

gulp.task('extras', () => {
    return gulp.src([
        'app.json',
        '*.{png,jpg,jpeg,gif}'
    ], {
        dot: true
    }).pipe(gulp.dest(config.dist));
});

gulp.task('config', () => {
    return gulp.src('../config.json').pipe(gulp.dest(relativePath));
});

gulp.task('build', ['styles', 'images', 'scripts', 'lib', 'tpls', 'extras', 'config'], () => {
    return gulp.src(path.join(config.dist, '/**/*')).pipe($.size({ title: 'build', gzip: true }));
});

gulp.task('zip', () => {
    return gulp.src(path.join(config.dist, '/**/*'), { base: relativePath })
        .pipe(zip(appid + '.zip'))
        .pipe(gulp.dest(relativePath));
});

gulp.task('default', () => {
    runSequence(['clean', 'makeLibDir'], ['styles', 'lint', 'images', 'lib', 'tpls', 'extras', 'config'], 'injectfile', () => {
        gulp.watch('css/**/*.css', ['styles']);
        gulp.watch('js/**/*.js', ['lint', 'injectfile']);
        gulp.watch('img/**/*', ['images']);
        gulp.watch('tpls/**/*.html', ['tpls']);
        gulp.watch('app.json', ['extras']);
        gulp.watch('bower.json', ['lib', 'injectfile']);
        gulp.watch('*.{png,jpg,jpeg,gif}', ['extras']);
        gulp.watch('../config.json', ['config']);
    });
});

gulp.task('dist', () => {
    return new Promise(resolve => {
        dev = false;
        runSequence(['clean', 'lint', 'makeLibDir'], 'injectfile', 'build', 'zip', resolve);
    });
});
