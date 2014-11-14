var gulp        = require('gulp');
var gutil       = require('gulp-util');
var plumber     = require('gulp-plumber');
var browserSync = require('browser-sync');
var reload      = browserSync.reload;
var harp        = require('harp');
var stylus      = require('gulp-stylus');
var source      = require('vinyl-source-stream');
var nib         = require('nib');
var watchify    = require('watchify');
var browserify  = require('browserify');
var imagemin    = require('gulp-imagemin');
var pngcrush    = require('imagemin-pngcrush');
var imageResize = require('gulp-image-resize');

// Compress Images Once
gulp.task('imagemin', function () {
    return gulp.src('./public/images/*')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngcrush()]
        }))
        .pipe(gulp.dest('./public/images/'));
});
gulp.task('resize', function () {
  gulp.src('./public/images/*')
    .pipe(imageResize({
      width : 600
    }))
    .pipe(gulp.dest('./public/images/thumbs'));
});
// Define Stylus Compilation task
gulp.task('styles', function () {
  return gulp.src('./public/styles/_stylus/main.styl')
    .pipe(plumber())
    .pipe(stylus({
      use: nib(),
      import: 'nib',
      compress: false
    }))
    .pipe(gulp.dest('./public/styles'));
});
gulp.task('reloadStyles', ['styles'], function() {
  reload('main.css', {stream: true});
});

gulp.task('browserify', function() {
  return browserify('./public/scripts/_src/main.js')
    .bundle()
    .pipe(plumber())
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('./public/scripts/'));
});

gulp.task('watchjs', function() {
  var bundler = watchify(browserify('./public/scripts/_src/main.js'));
  bundler.transform('debowerify');
  bundler.on('update', rebundle);

  function rebundle() {
    return bundler.bundle()
      .on('error', function(err){
        // print the error (can replace with gulp-util)
        console.log(err.message);
        // end this stream
        this.end();
      })
      .pipe(source('bundle.js'))
      .pipe(gulp.dest('./public/scripts/'));
  }

  return rebundle();
});

gulp.task('serve', ['watchjs'], function () {
  harp.server(__dirname, {
    port: 9000
  }, function () {
    browserSync({
      proxy: "localhost:9000",
      open: false,
      /* Hide the notification. It gets annoying */
      notify: {
        styles: ['opacity: 0', 'position: absolute']
      }
    });

    // Watch for scss changes, tell BrowserSync to refresh main.css

    gulp.watch('**/*.styl', ['reloadStyles']);

    // watch for js changes and bundle
    // Watch for all other changes, reload the whole page

    gulp.watch(['public/**/*.jade', './public/scripts/bundle.js', '.public/**/*.md', 'public/**/*.json', 'harp.json'], function () {
      reload();
    });
  });
});

/**
 * Default task, running `gulp` will fire up the Harp site,
 * launch BrowserSync & watch files.
 */
gulp.task('default', ['serve']);