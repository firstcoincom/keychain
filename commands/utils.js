const getUsbBasePath = () => {
  switch(process.platform) {
    case 'darwin': //osx
      return '/Volumes';
    case 'linux': //raspbian
      return '/media/pi';
  }
}

module.exports = {
  getUsbBasePath,
}
