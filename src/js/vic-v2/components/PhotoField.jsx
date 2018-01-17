import React from 'react';
import Cropper from 'react-cropper';
import Dropzone from 'react-dropzone';
import ErrorableFileInput from '../../common/components/form-elements/ErrorableFileInput';

const FILE_TYPES = [
  'png',
  'tiff',
  'tif',
  'jpeg',
  'jpg',
  'bmp'
];
const MIN_SIZE = 350;

function detectDragAndDrop() {
  const div = document.createElement('div');
  const supportsDragAndDrop = ('draggable' in div) || ('ondragstart' in div && 'ondrop' in div);
  const iOS = !!navigator.userAgent.match('iPhone OS') || !!navigator.userAgent.match('iPad');
  const dragAndDropDetected = supportsDragAndDrop && window.FileReader;
  return dragAndDropDetected && !iOS;
}

function isValidFileType(file) {
  return FILE_TYPES.some(type => file.name.toLowerCase().endsWith(type));
}

function isValidImageSize(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const img = new Image();
      img.src = reader.result;
      img.onerror = (e) => reject(e);
      img.onload = () => {
        const isValidSize = img.width >= MIN_SIZE && img.height >= MIN_SIZE;
        resolve(isValidSize);
      };
    };
  });
}

function isValidImage(file) {
  return new Promise((resolve, reject) => {
    isValidImageSize(file)
      .then(isValidSize => {
        const isValidType = isValidFileType(file);
        resolve(isValidSize && isValidType);
      })
      .catch((e) => reject(e));
  });
}


export default class PhotoField extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cropResult: null,
      done: false,
      zoomValue: 2,
      errorMessage: null
    };
  }

  onDone = () => {
    this.setState({ src: null, done: true });
  }

  onChange = (files) => {
    if (files && files[0]) {
      const file = files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        isValidImage(file)
          .then((isValid) => {
            if (isValid) {
              this.setState({
                src: reader.result,
                done: false,
                cropResult: null,
                errorMessage: null
              });
            } else if (!isValidFileType(file)) {
              this.setState({
                src: null,
                done: false,
                cropResult: null,
                errorMessage: 'Please choose a file from one of the accepted types.'
              });
            } else if (isValidFileType(file)) {
              this.setState({
                src: null,
                done: false,
                cropResult: null,
                errorMessage: 'The file you selected is smaller than the 350px minimum file width or height and could not be added.'
              });
            }
          });
      };
    }
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

  getErrorMessage = () => {
    return this.state.errorMessage;
  }

  moveUp = () => {
    this.refs.cropper.move(0, 5);
  }

  moveDown = () => {
    this.refs.cropper.move(0, -5);
  }

  moveRight = () => {
    this.refs.cropper.move(5, 0);
  }

  moveLeft = () => {
    this.refs.cropper.move(-5, 0);
  }

  zoom = (e) => {
    this.refs.cropper.zoomTo(e.target.value);
  }

  zoomIn = () => {
    this.refs.cropper.zoom(0.1);
  }

  zoomOut = () => {
    this.refs.cropper.zoom(-0.1);
  }

  cropImage = () => {
    const cropResult = this.refs.cropper.getCroppedCanvas().toDataURL();
    this.setState({ cropResult });
  }

  render() {
    const dragAndDropSupported = detectDragAndDrop();
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
            cropBoxMovable={false}
            toggleDragModeOnDblclick={false}
            dragMode="move"
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
          <button type="button" onClick={this.zoomIn} style={{ 'float': 'right' }}>
            Move In
          </button>
          <button type="button" onClick={this.zoomOut} style={{ 'float': 'right' }}>
            Move Out
          </button>
          <button type="button" onClick={this.moveUp} style={{ 'float': 'right' }}>
            Up
          </button>
          <button type="button" onClick={this.moveDown} style={{ 'float': 'right' }}>
            Down
          </button>
          <button type="button" onClick={this.moveRight} style={{ 'float': 'right' }}>
            Right
          </button>
          <button type="button" onClick={this.moveLeft} style={{ 'float': 'right' }}>
            Left
          </button>
          <button type="button" onClick={this.onDone} style={{ 'float': 'right' }}>
             I'm done
          </button>
        </div>
        }
        {!this.state.src && !this.state.done && <Dropzone onDrop={this.onChange} accept="image/jpeg, image/png"/>}
        <ErrorableFileInput
          errorMessage={this.getErrorMessage()}
          label={dragAndDropSupported && <span className="claims-upload-input-title">Drag & drop your image into the square or upload.</span>}
          accept={FILE_TYPES.map(type => `.${type}`).join(',')}
          onChange={this.onChange}
          buttonText="Upload"
          name="fileUpload"
          additionalErrorClass="claims-upload-input-error-message"/>
      </div>
    );
  }
}
