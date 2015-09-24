module.exports = function(grunt) {

    grunt.initConfig({
        typescript: {
            base: {
                src: ['client_src/**/*.ts'],
                dest: 'app/js/',
                options: {
                    module: 'amd', //or commonjs 
                    target: 'es5', //or es3 
                    sourceMap: true,
                    declaration: true
                }
            }
        },
        
        watch: {
            files: 'src/**/*.js',
            tasks: ['typescript']
        },

        connect: {
            server: {
                options: {
                    port: 8000,
                    hostname: '*',
                    base: 'app'
                }
            }
        }
    });

    
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-typescript');
    grunt.registerTask('default', ['typescript', 'watch']);
    grunt.registerTask('build', ['typescript', 'watch']);
    grunt.registerTask('serve', ['connect', 'watch']);

};
