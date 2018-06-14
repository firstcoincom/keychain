var QRCode = require('qrcode');
const getUsbBasePath = () => {
  switch(process.platform) {
    case 'darwin': //osx
      return '/Volumes';
    case 'linux': //raspbian
      return '/media/pi';
  }
}

const genQRCode = input => {
  QRCode.toDataURL(input, function (err, url) {
    console.log(url)
    var fs = require('fs');
    const fileName = ("home/pi/qrCode")
    fs.writeFile(fileName, url, function(err) {
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




