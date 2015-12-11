'use strict';

/*!
 * Inspired Gruntfile
 * Copyright 2015 Seth Warburton.
 * Version 1.01
 * Licensed under MIT (http://opensource.org/licenses/MIT)
 */

module.exports = function(grunt) {

// Time how long tasks take. A big help when optimizing build times ;)
require('time-grunt')(grunt);

    // Configurable paths
    var config = {
        app: 'src/', // The source directory
        dist: '' // The output directory
    };

    //Initializing the configuration object
    grunt.initConfig({

        // Project settings
        config: config,

        // Reload browser when watched files are changed and provide a url for device testing
        browserSync: {
            dev: {
                bsFiles: {
                    src : '<%= config.dist %>css/main.css'
                },
                options: {
                watchTask: true,
                    files: [
                        '<%= config.dist %>css/main.css',
                        '<%= config.dist %>js/**/*.js',
                        '<%= config.dist %>html/**/*.php', // Watch Joomla template overrides
                        'craft/templates/**/*.html', // Watch Craft CMS templates
                        '_site' // Watch Jekyll's build location
                    ],
                    // server: { // Using Jekyll? Uncomment this and comment out the proxy rule below
                    //    baseDir: '_site'
                    // }
                    // PHP site like Craft running on localhost? Comment out the
                    // server: line above and uncomment the following, setting
                    // it to match *your* localhost path.
                    //
                    // proxy: 'localhost:8888/mysite/'
                    proxy: 'localhost:8888/joomlanauts/'
                }
            }
        },

        // Empties destination and temp folders to start fresh
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '.sass-cache',
                        '.tmp',
                        '<%= config.dist %>css',
                        '<%= config.dist %>img',
                        '<%= config.dist %>js',
                        '<%= config.dist %>fonts'
                    ]
                }]
            },
        },

        // Combine and copy JS, without minification, for development. Because
        // JS uglify is very slow in comparison we only uglify on build.
        concat: {
                options: {
                stripBanners: false
            },
            dev: {
                files: {
                    '<%= config.dist %>js/plugins.js': ['<%= config.app %>js/plugins/*.js'],
                    '<%= config.dist %>js/main.js': ['<%= config.app %>js/main.js'],
                },
            },
        },

        // Copies any remaining files
        copy: {
            files: {
                cwd: '<%= config.app %>js/vendor/',
                src: '**/*',
                dest: '<%= config.dist %>js/vendor/',
                expand: true
            }
        },

        // Automatically generate .svg icons, with fallbacks, from svg files in
        //icons. See: http://www.grunticon.com/ for further details.
        grunticon: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '.tmp/svg-compressed',
                    src: ['*.svg', '*.png'],
                    dest: "<%= config.dist %>icons"
                }],
                options: {
                    defaultHeight: '16px',
                    defaultWidth: '16px',
                    enhanceSVG: true,
                    pngpath: "<%= config.dist %>icons/png"
                }
            }
        },

        // Process images to optimise filesizes for production
        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= config.app %>img',
                    src: '**/*.{gif,jpeg,jpg,png,svg}',
                    dest: '<%= config.dist %>img'
                }]
            }
        },

        // Jekyll site? Uncomment this task to autobuild your site.
        // jekyll: {
        //     build: {
        //         dest: '_site',
        //         baseurl: '/'
        //     }
        // },

        // Make sure code styles are up to par and there are no obvious mistakes
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            all: [
                '<%= config.app %>js/*.js'
            ]
        },

        postcss: {
            options: {
                processors: [
                    require('autoprefixer')({
                        browsers: 'last 1 version, > 5%' // add vendor prefixes
                    }),
                    require('cssnano')() // optimise and the minify the result
                ]
            },
            dist: {
                files: {
                    '<%= config.dist %>css/main.css': '<%= config.dist %>css/main.css'
                }
            }
        },

        // Compile Sass source files to CSS
        sass: {
            dist: {
                options: {
                    precision: '5',
                    sourceMap: true
                },
                files: {
                    '<%= config.dist %>css/main.css': '<%= config.app %>scss/main.scss'
                }
            }
        },

        scsslint: {
            allFiles: [
                '<%= config.app %>scss',
            ],
            options: {
                config: '<%= config.app %>scss/.scss-lint.yml',
                reporterOutput: 'scss-lint-report.xml'
            },
        },

        // Optimise SVGs
        svgmin: {
            options: {
                plugins: [
                    {
                        removeViewBox: false
                    }, {
                        removeUselessStrokeAndFill: false
                    }
                ]
            },
            // Optimise icon.svg files prior to the Grunticonn task
            icons: {
                files: [{
                    expand: true,
                    cwd: '<%= config.app %>icons',
                    src: '{,*/}*.svg',
                    dest: '.tmp/svg-compressed'
                }]
            }
        },

        // Compress JS files for production
        uglify: {
            dist: {
                files: {
                    '<%= config.dist %>js/plugins.js': '<%= config.app %>js/plugins/*.js',
                    '<%= config.dist %>js/main.js': '<%= config.app %>js/main.js'
                }
            }
        },

        // Watch files for changes and run tasks based on the changed files
        watch: {
            sass: {
                files: ['<%= config.app %>scss/**/*.scss'],
                tasks: ['styles']
            },
            js: {
                files: ['<%= config.app %>js/**/*.js'],
                tasks: ['concat:dev']
            },
            gruntfile: {
                files: ['Gruntfile.js']
            }
        }
    });

    // Just-in-time plugin, for loading plugins really quickly.
    require('jit-grunt')(grunt, {
        scsslint: 'grunt-scss-lint'
    });

    // Task registration
    grunt.registerTask('default', ['dev']);
    grunt.registerTask('build', ['dist']);
    grunt.registerTask('styles', []);
    grunt.registerTask('images', []);
    grunt.registerTask('test', []);

    // Primary Task definition
    grunt.registerTask('dev', ['clean','images','test','styles','concat:dev','copy','browserSync','watch']);
    grunt.registerTask('dist', ['clean','images','styles','uglify','copy']);

    // Sub-tasks, called by primary tasks, for better organisation.
    grunt.registerTask('images', ['imagemin','svgmin','grunticon']);
    grunt.registerTask('styles', ['sass','postcss']);
    grunt.registerTask('test', ['scsslint']);
};
