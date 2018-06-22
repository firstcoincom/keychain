import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import QRCode from 'qrcode-react';
 
class ConfigGenerator extends Component {

  state = {
    walletName: '',
    entropy: '',
    numShares: '',
    threshold: '',
    fileName: '',
    qrCodeValue: '',
  }

  handleInput = (event) => {
    this.setState({ [event.target.name]: event.target.value})
  }

  generateQrCode = () => {
    console.log(this.state)
    const qrCodeString = 
`{"type":"config","walletName":"${this.state.walletName}","entropy":"${this.state.entropy}","numShares":${this.state.numShares},"threshold":${this.state.threshold}}`
    this.setState({qrCodeValue: qrCodeString})
  }

  render() {
    return (
      <div>
        <div>
          <Input
            placeholder="file name"
            name="fileName"
            onChange={this.handleInput}
            inputProps={{
              'aria-label': 'Description',
            }}
          />
          <Input
            placeholder="wallet name"
            name="walletName"
            onChange={this.handleInput}
            inputProps={{
              'aria-label': 'Description',
            }}
          />
          <Input
            placeholder="entropy"
            name="entropy"
            onChange={this.handleInput}
            inputProps={{
              'aria-label': 'Description',
            }}
          />
          <Input
            placeholder="num shares"
            name="numShares"
            onChange={this.handleInput}
            type="number"
            inputProps={{
              'aria-label': 'Description',
            }}
          />
          <Input
            placeholder="threshold"
            name="threshold"
            onChange={this.handleInput}
            type="number"
            inputProps={{
              'aria-label': 'Description',
            }}
          />

          <Button 
            color="primary"
            onClick={this.generateQrCode}
          >
            click me
          </Button>
        </div>

        <QRCode
          size={256}
          value={this.state.qrCodeValue} 
        />
      </div>
    );
  }
}

export default ConfigGenerator;
