'use strict';

var gulp = require('gulp');

var runSequence = require('run-sequence');

// auto reload browser on changes
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;

var paths = {
    scripts: ['index.js'],
    styles: ['index.css']
};

gulp.task('serve', function() {
    browserSync.init({
        server: {
            baseDir: './'
        }
    });
});

gulp.task('watch', function() {
    gulp.watch(paths.styles, { maxListeners: 999 }, [reload]);
    gulp.watch(paths.scripts, { maxListeners: 999 }, [reload]);
});

gulp.task('default', function() {
    runSequence(
        ['watch', 'serve']
    );
});
