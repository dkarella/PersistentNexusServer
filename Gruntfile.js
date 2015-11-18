/*
 Dependencies before running this grunt file:
 1. Update the system, 'yum update'
 2. Install Node.js and Docker
 3. Install dependencies: 'npm install'
 4. Install grunt cli: 'npm install -g grunt-cli'
 */

module.exports = function(grunt) {
    //Grunt init
    grunt.initConfig({
        // configure exec commands
        exec: {
            create_nexus_data:      'docker run -v /sonatype-work/ --name nexus-data sonatype/nexus ' +
                                    'echo "data-only container for Nexus"',
            create_nexus:           'docker create -p 8081:8081 --name=nexus-master --volumes-from=nexus-data ' +
                                    'sonatype/nexus:oss',
            start_nexus:            'docker start nexus-master',
            stop_nexus:             'docker stop nexus-master',
            export_data:            'docker run --volumes-from=nexus-data -v $(pwd)/nexus-data:/data ubuntu ' +
                                    'tar cvf /data/data.tar /sonatype-work/',
            load_data:              'docker run --volumes-from=nexus-data -v $(pwd)/nexus-data:/data ubuntu ' +
                                    'tar xvf /data/data.tar -C /'

        }
    });

    // Load the grunt-exec
    grunt.loadNpmTasks('grunt-exec');

    //My Tasks
    grunt.registerTask('init', [
        'exec:create_nexus_data',
        'exec:load_data',
        'exec:create_nexus'
    ]);

    grunt.registerTask('start', [
        'exec:start_nexus'
    ]);

    grunt.registerTask('stop', [
        'exec:stop_nexus'
    ]);

    grunt.registerTask('export-data', ['exec:export_data']);
};
