'use strict';

module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        // Metadata.
        pkg: grunt.file.readJSON('package.json'),
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
        ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
        // Task configuration.
        uglify: {
            options: {
                banner: '<%= banner %>'
            },
            js: {
                src: 'public/zjmy.upload/zjmy.upload.js',
                dest: 'public/zjmy.upload/dest/zjmy.upload.min.js'
            },

        },
        cssmin: {
            css:{
                src: 'public/zjmy.upload/zjmy.upload.css',
                dest:'public/zjmy.upload/dest/zjmy.upload.min.css'
            }

        },
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            gruntfile: {
                src: 'Gruntfile.js'
            },
            upload: {
                src: ['public/zjmy.upload/zjmy.upload.js','public/zjmy.upload/zjmy.upload.css']
            }
        },
        watch: {
            gruntfile: {
                files: ['<%= jshint.gruntfile.src %>','<%= jshint.upload.src %>'],
                tasks: ['jshint:gruntfile', 'uglify','cssmin']
            },
            upload: {
                files: 'public/zjmy.upload/zjmy.upload.js'
            }
        },
    })
    ;

// These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-css');
    grunt.loadNpmTasks('grunt-contrib-watch');

// Default task
    grunt.registerTask('default', ['jshint', 'uglify','cssmin']);

}
;
