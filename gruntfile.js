module.exports = function(grunt) {
    "use strict";
  
    grunt.initConfig({
      ts: {
        app: {
          files: [{
            src: ["src/**/*.ts"],
            dest: "bin/"
          }],
          options: {
            module: "commonjs",
            noLib: false,
            target: "es6",
            sourceMap: true,
            typeRoots: ["node_modules/@types", "typings"],
            rootDir: "./src"
          }
        }
      },
      watch: {
        ts: {
          files: ["src/**/*.ts"],
          tasks: ["ts"]
        },
        client: {
          files: ["src/**/*.css","src/**/*.js","src/**/*.html"],
          tasks: ["copy"]
        }
      },
      copy: {
        views: {
          expand: true,
          cwd: 'src/',
          src: '**/*.html',
          dest: 'bin/',
        },
        assets: {
          expand: true,
          cwd: 'src/assets',
          src: '**/*',
          dest: 'bin/assets/',
        },
      }
    });
  
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-ts");
  
    grunt.registerTask("default", [
      "ts",
      "copy"
    ]);
  
  };