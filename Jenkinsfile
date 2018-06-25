podTemplate(label: 'mypod', containers: [
    containerTemplate(name: 'node', image: 'node:8.7.0', command: 'cat', ttyEnabled: true)
  ],
  volumes: [
    hostPathVolume(mountPath: '/var/run/docker.sock', hostPath: '/var/run/docker.sock'),
  ]) {
    node('mypod') {
      stage('checkout') {
        checkout scm
      }

      container('node') {
        stage ('build') {
          withNPM(npmrcConfig: 'custom-artifactory') {
            sh "npm install"
            }
        }

        if (env.BRANCH_NAME == 'master') {
          stage ('publish') {
            withNPM(npmrcConfig: 'custom-artifactory') {
              sh "./scripts/publish.sh"
            }
          }
        }
      }
    }
  }
