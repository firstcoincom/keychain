# keychain

This is a multisig-cold wallet for organizations and 

## Instructions for how to use the device.

1. Clone the code into the device (Rasperry Pi or Laptop)
2. Check the list of drives and shred the usb.

on Ubuntu:
```
sudo fdisk -l <-- this will list all of the drives
sudo shred -vvv -n20 -z /dev/<path> <--- path from the step above
```

On Mac:
```
diskutil list
brew install coreutils
sudo gshred -vvv -n20 -z /dev/<path>

```
note: if the device is busy, unmount it from Disk Utility.

![USB Shreding](https://preview.ibb.co/fk21zd/usb_key.jpg)
