module.exports = function(grunt) {

  grunt.initConfig({
    cssmin: {
      target: {
        files: [{
          expand: true,
          cwd: 'app/components/css/',
          src: ['*.css', '!*.min.css'],
          dest: 'app/components/css/public/',
          ext: '.min.css'
        }]
      }
    },
    concat_css: {
      options: {
      },
      all: {
        src: [
          "app/components/css/public/*.css",
          '!app/components/css/public/public.min.css'
        ],
        dest: "app/components/css/public/public.min.css"
      }
    },
    uglify: {
      options: {
        mangle: false
      },
      my_target: {
        files: {
          'app/components/jspublic/resources.min.js': [
            'app/components/services/ApiModule.js',
            'app/components/controllers/app.js'
          ]
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-concat-css');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('default', ['cssmin', 'concat_css', 'uglify']);

};