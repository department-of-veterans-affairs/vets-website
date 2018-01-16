import React from 'react';
import Cropper from 'react-cropper';
import Dropzone from 'react-dropzone';

export default class PhotoField extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cropResult: null,
      done: false,
      zoomValue: 2
    };
  }

  onDone = () => {
    this.setState({ src: null, done: true });
  }

  onChange = (e) => {
    e.preventDefault();
    let files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }
    const reader = new FileReader();
    reader.onload = () => {
      this.setState({ src: reader.result, done: false, cropResult: null });
    };
    reader.readAsDataURL(files[0]);
  }

  onDrop = (files) => {
    this.setState({ src: files[0].preview });
  }

  onZoom = (e) => {
    const newZoomValue = e.detail.ratio;
    this.setState({ zoomValue: newZoomValue }, () => {
      this.refs.slider.value = this.state.zoomValue;
    });
  }

  moveUp = (e) => {
    e.preventDefault();
    this.refs.cropper.move(0, 5);
  }

  moveDown = (e) => {
    e.preventDefault();
    this.refs.cropper.move(0, -5);
  }

  moveRight = (e) => {
    e.preventDefault();
    this.refs.cropper.move(5, 0);
  }

  moveLeft = (e) => {
    e.preventDefault();
    this.refs.cropper.move(-5, 0);
  }

  zoom = (e) => {
    e.preventDefault();
    this.refs.cropper.zoomTo(e.target.value);
  }

  zoomIn = (e) => {
    e.preventDefault();
    this.refs.cropper.zoom(0.1);
  }

  zoomOut = (e) => {
    e.preventDefault();
    this.refs.cropper.zoom(-0.1);
  }

  cropImage = (e) => {
    e.preventDefault();
    const cropResult = this.refs.cropper.getCroppedCanvas().toDataURL();
    this.setState({ cropResult });
  }

  render() {
    let instruction = 'Step 1 of 2: Upload a digital photo.';
    let description = 'Move and resize your photo, so your head and shoulders fit in the square frame below. Click and drag, or use the arrow and magnifying buttons to help.';
    if (this.state.src) instruction = 'Step 2 of 2: Fit your head and shoulders in the frame';
    if (this.state.done) description = 'Success! This photo will be printed on your Veteran ID card.';
    return (
      <div>
        {!this.state.done && <h4>{instruction}</h4>}
        {(this.state.src || this.state.done) && <p>{description}</p>}
        {this.state.done && <img style={{ width: '100%' }} src={this.state.cropResult} alt="cropped"/>}
        {this.state.src && <div>
          <Cropper
            ref="cropper"
            src={this.state.src}
            style={{ height: 400, width: '100%' }}
            aspectRatio={1 / 1}
            guides={false}
            viewMode={1}
            zoom={this.onZoom}
            crop={this.cropImage}/>
          <input type="range"
            ref="slider"
            min="2"
            max="10"
            defaultValue="1"
            step="0.1"
            aria-valuemin="2"
            aria-valuemax="10"
            aria-valuenow={this.state.zoomValue}
            onInput={this.zoom}/>
          <button onClick={this.zoomIn} style={{ 'float': 'right' }}>
            Move In
          </button>
          <button onClick={this.zoomOut} style={{ 'float': 'right' }}>
            Move Out
          </button>
          <button onClick={this.moveUp} style={{ 'float': 'right' }}>
            Up
          </button>
          <button onClick={this.moveDown} style={{ 'float': 'right' }}>
            Down
          </button>
          <button onClick={this.moveRight} style={{ 'float': 'right' }}>
            Right
          </button>
          <button onClick={this.moveLeft} style={{ 'float': 'right' }}>
            Left
          </button>
          <button onClick={this.onDone} style={{ 'float': 'right' }}>
             I'm done
          </button>
        </div>
        }
        {!this.state.src && !this.state.done && <Dropzone onDrop={this.onDrop} accept="image/jpeg, image/png"/>}
        <input type="file" onChange={this.onChange}/>
      </div>
    );
  }
}
