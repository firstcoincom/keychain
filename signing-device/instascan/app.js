var app = new Vue({
  el: '#app',
  data: {
    scanner: null,
    activeCameraId: null,
    cameras: [],
    scans: [],
    isScanning: false,
    configson: null,
    isConfig: true,
    initial : true
  },
  mounted: function () {
    var self = this;
    self.scanner = new Instascan.Scanner({ video: document.getElementById('preview'), scanPeriod: 5 });
    self.scanner.addListener('scan', function (content, image) {
      self.scans.unshift({ date: +(Date.now()), content: content });
      alert(content);
      self.configJson = JSON.parse(content);
      console.log(self.configJson);

      if (self.configJson.type == null)
      {
        self.isConfig = false;
      }
      else{
        self.isConfig = true;
      }
      self.isScanning = false;
      self.initial = false;
    });
    Instascan.Camera.getCameras().then(function (cameras) {
      self.cameras = cameras;
      if (cameras.length > 0) {
        self.activeCameraId = cameras[0].id;
        self.scanner.start(cameras[0]);
      } else {
        console.error('No cameras found.');
      }
    }).catch(function (e) {
      console.error(e);
    });
  },
  methods: {
    formatName: function (name) {
      return name || '(unknown)';
    },
    selectCamera: function (camera) {
      this.activeCameraId = camera.id;
      this.scanner.start(camera);
    },
    openCamera: function () {
      this.isScanning = true;
    }, 
  }
});
