podTemplate(label: 'mypod', containers: [
    containerTemplate(name: 'node', image: 'node:8.2.1', command: 'cat', ttyEnabled: true)
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
            sh "npm run build"
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
