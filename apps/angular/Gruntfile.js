'use strict';


module.exports = function(grunt) {

    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt, {
        requireResolution: true
    });

    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    grunt.initConfig({

        // Project settings
        config: {
            // configurable paths
            styles: 'css',
            images: 'img',
            scripts: 'js',
            temp: '.tmp',
            dist: '../../wwws/angular'
        },

        watch: {
            gruntfile: {
                files: ['Gruntfile.js']
            },
            scripts: {
                files: [
                    '<%= config.styles %>/{,*/}*.css',
                    '<%= config.scripts %>/{,*/}*.js'
                ],
                tasks: ['jshint']
            }
        },

        // Make sure code styles are up to par and there are no obvious mistakes
        jshint: {
            options: {
                jshintrc: '../../.jshintrc',
                reporter: require('jshint-stylish')
            },
            all: [
                '<%= config.scripts %>/**/*.js'
            ]
        },

        // Empties folders to start fresh
        clean: {
            dist: {
                options: {
                    force: true
                },
                files: [{
                    dot: true,
                    src: [
                        '<%= config.temp %>',
                        '<%= config.dist %>'
                    ]
                }]
            }
        },

        concat: {
            css: {
                src: [
                    '<%= config.styles %>/{,*/}*.css'
                ],
                dest: '<%= config.temp %>/<%= config.styles %>/main.css'
            },
            js: {
                src: [
                    '<%= config.scripts %>/app-dist.js',
                    '<%= config.scripts %>/*/*.js'
                ],
                dest: '<%= config.temp %>/<%= config.scripts %>/main.js'
            }
        },

        cssmin: {
            dist: {
                files: {
                    '<%= config.dist %>/<%= config.styles %>/style.css': [
                        '<%= config.temp %>/<%= config.styles %>/main.css'
                    ]
                }
            }
        },
        uglify: {
            dist: {
                files: {
                    '<%= config.dist %>/<%= config.scripts %>/app.js': [
                        '<%= config.temp %>/<%= config.scripts %>/main.js'
                    ]
                }
            }
        },

        // Copies remaining files to places other tasks can use
        copy: {
            resources: {
                expand: true,
                dot: true,
                cwd: '<%= config.app %>',
                dest: '<%= config.dist %>',
                src: [
                    '*.{png,jpg,jpeg,gif}',
                    '<%= config.images %>/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
                    'tpls/{,*/}*.html',
                    'lib/**/*',
                ]
            }
        }
    });

    grunt.registerTask('release', [
        'clean',
        'jshint',
        'concat',
        'cssmin',
        'uglify',
        'copy:resources'
    ]);

    grunt.registerTask('default', ['release']);
};
