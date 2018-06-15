var QRCode = require('qrcode');
const getUsbBasePath = () => {
  switch(process.platform) {
    case 'darwin': //osx
      return '/Volumes';
    case 'linux': //raspbian
      return '/media/pi';
  }
}

const genQRCode = (input, filePath)  => {
  QRCode.toDataURL(input, function (err, url) {
    console.log(url)
    var fs = require('fs');
    url.replace(/^data:image\/(png|jpg);base64,/, '');
    fs.writeFile(filePath, url, function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    });
  })
}

module.exports = {
  getUsbBasePath,
  genQRCode
}




