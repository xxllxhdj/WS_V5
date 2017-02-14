const gulp = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');
const browserSync = require('browser-sync').create();
const del = require('del');
const wiredep = require('wiredep').stream;
const runSequence = require('run-sequence');

const $ = gulpLoadPlugins({
    rename: {
        'gulp-angular-templatecache': 'templateCache',
        'gulp-angular-filesort': 'fileSort'
    }
});
const reload = browserSync.reload;

// CSS linting task
gulp.task('csslint', function() {
    return gulp.src('app/css/**/*.css')
        .pipe($.csslint('.csslintrc'))
        .pipe($.csslint.formatter());
    // Don't fail CSS issues yet
    // .pipe(plugins.csslint.failFormatter());
});

// ESLint JS linting task
gulp.task('eslint', function() {
    return gulp.src('app/js/**/*.js')
        .pipe($.eslint())
        .pipe($.eslint.format());
});

gulp.task('html', () => {
    var partialsInjectFile = gulp.src('.tmp/templates.js', { read: false });
    var partialsInjectOptions = {
        starttag: '<!-- inject:templates -->',
        ignorePath: '.tmp',
        addRootSlash: false
    };

    return gulp.src('app/*.html')
        .pipe($.inject(partialsInjectFile, partialsInjectOptions))
        .pipe($.useref())
        .pipe($.if('*.js', $.uglify()))
        .pipe($.if('*.css', $.cssnano({ safe: true, autoprefixer: false })))
        .pipe($.if('*.html', $.htmlmin({ collapseWhitespace: true })))
        .pipe(gulp.dest('www'));
});

gulp.task('images', () => {
    return gulp.src('app/img/**/*')
        .pipe($.cache($.imagemin()))
        .pipe(gulp.dest('www/img'));
});

gulp.task('fonts', function() {
    return gulp.src(require('main-bower-files')('**/*.{eot,svg,ttf,woff,woff2}', function(err) {}))
        .pipe(gulp.dest('www/fonts'));
});

// Angular template cache task
gulp.task('templatecache', function() {
    return gulp.src('app/tpls/**/*.html')
        .pipe($.templateCache('templates.js', {
            root: 'tpls/',
            module: 'WorkStation'
        }))
        .pipe(gulp.dest('.tmp'));
});

gulp.task('extras', () => {
    return gulp.src([
        'apps/config.txt'
    ], {
        dot: true
    }).pipe(gulp.dest('wwws'));
});

gulp.task('clean', del.bind(null, ['.tmp', 'www']));

gulp.task('serve', () => {
    runSequence(['clean', 'wiredep', 'injectjs'], () => {
        browserSync.init({
            notify: false,
            port: 9000,
            server: {
                baseDir: ['app'],
                routes: {
                    '/bower_components': 'bower_components',
                    '/apps': './apps'
                }
            }
        });

        gulp.watch([
            'app/css/**/*.css',
            'app/js/**/*.js',
            'app/lib/**/**/*.js',
            'app/tpls/**/*.html',
            'app/*.html',
            'app/img/**/*'
        ]).on('change', reload);

        gulp.watch('app/css/**/*.css', ['csslint']);
        gulp.watch('app/js/**/*.js', ['eslint']);
        gulp.watch('app/lib/**/**/*.js', ['eslint']);
        gulp.watch('bower.json', ['wiredep']);
    });
});

gulp.task('serve:dist', ['default'], () => {
    browserSync.init({
        notify: false,
        port: 9000,
        server: {
            baseDir: ['www'],
            routes: {
                '/apps': './wwws'
            }
        }
    });
});

// inject bower components
gulp.task('wiredep', () => {
    gulp.src('app/*.html')
        .pipe(wiredep({
            exclude: ['bootstrap.js'],
            ignorePath: /^(\.\.\/)*\.\./
        }))
        .pipe(gulp.dest('app'));
});

gulp.task('injectjs', () => {
    var partialsInjectOptions = {
        starttag: '<!-- inject:js -->',
        ignorePath: 'app',
        addRootSlash: false
    };

    return gulp.src('app/*.html')
        .pipe($.inject(gulp.src(['app/js/**/*.js']).pipe($.fileSort()), partialsInjectOptions))
        .pipe(gulp.dest('app'));
});

// Lint CSS and JavaScript files.
gulp.task('lint', function(done) {
    runSequence(['csslint', 'eslint'], done);
});

gulp.task('build', ['lint', 'html', 'images', 'fonts', 'extras'], () => {
    return gulp.src('www/**/*').pipe($.size({ title: 'build', gzip: true }));
});

gulp.task('default', () => {
    return new Promise(resolve => {
        runSequence(['clean', 'wiredep', 'templatecache', 'injectjs'], 'build', resolve);
    });
});
