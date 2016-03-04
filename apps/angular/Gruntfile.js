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
            app: 'app',
            styles: 'css',
            images: 'img',
            scripts: 'js',
            temp: '.tmp',
            dist: 'angular'
        },

        watch: {
            gruntfile: {
                files: ['Gruntfile.js']
            },
            scripts: {
                files: [
                    '<%= config.app %>/<%= config.styles %>/{,*/}*.css',
                    '<%= config.app %>/<%= config.scripts %>/{,*/}*.js'
                ],
                tasks: ['jshint', 'copy:debug', 'copy:dfiles']
            },
            resources: {
                files: [
                    '<%= config.app %>/*.{png,jpg,jpeg,gif}',
                    '<%= config.app %>/<%= config.images %>/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
                    '<%= config.app %>/tpls/{,*/}*.html'
                ],
                tasks: ['copy:resources']
            }
        },

        // Make sure code styles are up to par and there are no obvious mistakes
        jshint: {
            options: {
                jshintrc: '../../.jshintrc',
                reporter: require('jshint-stylish')
            },
            all: [
                '<%= config.app %>/<%= config.scripts %>/**/*.js'
            ]
        },

        // Empties folders to start fresh
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '<%= config.temp %>',
                        '<%= config.dist %>/*'
                    ]
                }]
            }
        },

        concat: {
            css: {
                src: [
                    '<%= config.app %>/<%= config.styles %>/{,*/}*.css'
                ],
                dest: '<%= config.temp %>/<%= config.styles %>/main.css'
            },
            js: {
                src: [
                    '<%= config.app %>/<%= config.scripts %>/app.js',
                    '<%= config.app %>/<%= config.scripts %>/*/*.js'
                ],
                dest: '<%= config.temp %>/<%= config.scripts %>/main.js'
            }
        },

        uglify: {
            dist: {
                files: {
                    '<%= config.temp %>/<%= config.styles %>/main.css': 
                        ['<%= config.temp %>/<%= config.styles %>/main.css'],
                    '<%= config.temp %>/<%= config.scripts %>/main.js': 
                        ['<%= config.temp %>/<%= config.scripts %>/main.js']
                }
            }
        },

        // Copies remaining files to places other tasks can use
        copy: {
            jscss: {
                expand: true,
                dot: true,
                cwd: '<%= config.temp %>',
                dest: '<%= config.dist %>',
                src: [
                    '<%= config.styles %>/*',
                    '<%= config.scripts %>/*'
                ]
            },
            resources: {
                expand: true,
                dot: true,
                cwd: '<%= config.app %>',
                dest: '<%= config.dist %>',
                src: [
                    '*.{png,jpg,jpeg,gif}',
                    '<%= config.images %>/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
                    'tpls/{,*/}*.html'
                ]
            },
            debug: {
                files: [{
                    src: '<%= config.app %>/<%= config.scripts %>/app-dev.js',
                    dest: '<%= config.dist %>/<%= config.scripts %>/main.js'
                }, {
                    src: '<%= config.app %>/<%= config.styles %>/style.css',
                    dest: '<%= config.dist %>/<%= config.styles %>/main.css'
                }]
            },
            dfiles: {
                expand: true,
                dot: true,
                cwd: '<%= config.app %>',
                dest: '<%= config.dist %>',
                src: [
                    '<%= config.scripts %>/*/*'
                ]
            }
        }
    });

    grunt.registerTask('debug', [
        'clean',
        'jshint',
        'copy:debug',
        'copy:dfiles',
        'copy:resources',
        'watch'
    ]);

    grunt.registerTask('release', [
        'clean',
        'jshint',
        'concat',
        'uglify',
        'copy:jscss',
        'copy:resources'
    ]);

    grunt.registerTask('default', ['debug']);
};
