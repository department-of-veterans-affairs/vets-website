import React from 'react';
import Cropper from 'react-cropper';
import Dropzone from 'react-dropzone';
import ErrorableFileInput from '../../common/components/form-elements/ErrorableFileInput';

const PhotoDescription = (
  <div className="feature">
    <h3>What makes a good photo?</h3>
    <div>
      <p>To meet the requirements for a Veteran ID Card, your photo should follow the guidance listed below. It must:</p>
      <ul>
        <li>Show a full front view of your face and neck, (with no hat, head covering, or headphones covering or casting shadows on your hairline or face), <strong>and</strong></li>
        <li>Be cropped from your shoulders up (much like a passport photo), <strong>and</strong></li>
        <li>Show you with your eyes open and a neutral expression, <strong>and</strong></li>
        <li>Be a square size and have a white or plain-color background (with no scenery or other people in the photo)</li>
        <li>Be uploaded as a .jpeg, .png, .bmp, or .tiff file</li>
      </ul>
      <h3>Examples of good ID photos</h3>
      <img className="example-photo" alt="placeholder" src="/img/example-photo-1.png"/>
      <img className="example-photo" alt="placeholder" src="/img/example-photo-2.png"/>
    </div>
  </div>);

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

function isValidFileType(fileName) {
  return FILE_TYPES.some(type => fileName.toLowerCase().endsWith(type));
}

function isValidImageSize(result) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = result;
    img.onerror = (e) => reject(e);
    img.onload = () => {
      const isValidSize = img.width >= MIN_SIZE && img.height >= MIN_SIZE;
      resolve(isValidSize);
    };
  });
}

function isValidImage(result, fileName) {
  return new Promise((resolve, reject) => {
    isValidImageSize(result)
      .then(isValidSize => {
        const isValidType = isValidFileType(fileName);
        resolve(isValidSize && isValidType);
      })
      .catch((e) => reject(e));
  });
}


export default class PhotoField extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      src: null,
      cropResult: null,
      done: false,
      zoomValue: 0.4,
      errorMessage: null
    };
  }

  componentDidUpdate(prevProps, prevState) {
    const newView = prevState.src !== this.state.src || !prevState.src || prevState.done;
    const cropper = this.refs.cropper;
    if (newView && cropper) {
      setTimeout(() => {
        const containerData = cropper.getContainerData();
        const containerWidth = containerData.width;
        const smallScreen = window.innerWidth < 768;
        const cropBoxSize = smallScreen ? 240 : 300;
        const cropBoxLeftOffset = (containerWidth - cropBoxSize) / 2;
        const cropBoxData = {
          left: cropBoxLeftOffset,
          top: 0,
          width: cropBoxSize,
          height: cropBoxSize
        };
        cropper.setCropBoxData(cropBoxData);
      }, 0);
    }
  }

  onEdit = () => {
    this.setState({ done: false });
  }

  onDone = () => {
    this.setState({ done: true });
  }

  onChange = (files) => {
    if (files && files[0]) {
      const file = files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const fileName = file.name;
        isValidImage(reader.result, fileName)
          .then((isValid) => {
            if (isValid) {
              this.setState({
                src: reader.result,
                done: false,
                cropResult: null,
                errorMessage: null
              });
            } else if (!isValidFileType(file.name)) {
              this.setState({
                src: null,
                done: false,
                cropResult: null,
                errorMessage: 'Please choose a file from one of the accepted types.'
              });
            } else if (isValidFileType(file.name)) {
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
    const smallScreen = window.innerWidth < 768;
    const dragAndDropSupported = detectDragAndDrop();
    let instruction = <p><strong>Step 1 of 2:</strong> Upload a digital photo.</p>;
    let description = 'Drag and drop your image into the square or click the upload button.';
    if (this.state.src) {
      instruction = <p><strong>Step 2 of 2:</strong> Fit your head and shoulders in the frame</p>;
      description = 'Move and resize your photo, so your head and shoulders fit in the square frame below. Click and drag, or use the arrow and magnifying buttons to help.';
    }
    if (this.state.done) description = 'Success! This photo will be printed on your Veteran ID card.';

    return (
      <div>
        {PhotoDescription}
        {!smallScreen && <h3>Upload a digital photo<span className="form-required-span">(Required)*</span></h3>}
        {this.state.errorMessage && <span className="usa-input-error-message">{this.state.errorMessage}</span>}
        <div className={this.state.errorMessage ? 'error-box' : 'border-box'}>
          <div style={{ margin: '1em 1em 4em' }}>
            {smallScreen && <h3>Photo upload <span className="form-required-span">(Required)*</span></h3>}
            {!this.state.done && instruction}
            {(dragAndDropSupported || this.state.src || this.state.done) && <p>{description}</p>}
            {this.state.done && <img className="photo-preview" src={this.state.cropResult} alt="cropped"/>}
          </div>
          {!this.state.done && this.state.src && <div className="cropper-container-outer">
            <Cropper
              ref="cropper"
              responsive={false}
              src={this.state.src}
              aspectRatio={1 / 1}
              cropBoxMovable={false}
              toggleDragModeOnDblclick={false}
              dragMode="move"
              guides={false}
              viewMode={1}
              zoom={this.onZoom}
              crop={this.cropImage}/>
            <div className="cropper-zoom-container">
              {smallScreen && <button className="cropper-control cropper-control-zoom cropper-control-zoom-out va-button va-button-link" type="button" onClick={this.zoomOut}><i className="fa fa-search-minus"></i></button>}
              {!smallScreen && <button className="cropper-control cropper-control-zoom cropper-control-zoom-out va-button va-button-link" type="button" onClick={this.zoomOut}>
                <span className="cropper-control-label">Make smaller<i className="fa fa-search-minus"></i></span>
              </button>}
              <input type="range"
                ref="slider"
                className="cropper-zoom-slider"
                min="0"
                max="1.5"
                defaultValue="0.4"
                step="0.01"
                aria-valuemin="0"
                aria-valuemax="1.5"
                aria-valuenow={this.state.zoomValue}
                onInput={this.zoom}/>
              {smallScreen && <button className="cropper-control cropper-control-zoom cropper-control-zoom-in va-button va-button-link" type="button" onClick={this.zoomIn}><i className="fa fa-search-plus"></i></button>}
              {!smallScreen && <button className="cropper-control cropper-control-zoom cropper-control-zoom-in va-button va-button-link" type="button" onClick={this.zoomIn}>
                <span className="cropper-control-label">Make larger<i className="fa fa-search-plus"></i></span>
              </button>}
            </div>
            <div className="cropper-control-container">
              <div className="cropper-control-column">
                {smallScreen && <button className="cropper-control cropper-control-label-container va-button va-button-link" type="button" onClick={this.zoomOut}>
                  <span className="cropper-control-label">Make smaller</span>
                </button>}
                <button className="cropper-control cropper-control-label-container  va-button-link" type="button" onClick={this.moveUp}>
                  <span className="cropper-control-label">Move up<i className="fa fa-arrow-up"></i></span>

                </button>
                <button className="cropper-control cropper-control-label-container va-button-link" type="button" onClick={this.moveLeft}>
                  <span className="cropper-control-label">Move left<i className="fa fa-arrow-left"></i></span>

                </button>
              </div>
              <div className="cropper-control-column">
                {smallScreen && <button className="cropper-control cropper-control-label-container va-button va-button-link" type="button" onClick={this.zoomIn}>
                  <span className="cropper-control-label">Make larger</span>
                </button>}
                <button className="cropper-control cropper-control-label-container va-button-link" type="button" onClick={this.moveDown}>
                  <span className="cropper-control-label">Move down<i className="fa fa-arrow-down"></i></span>

                </button>
                <button className="cropper-control cropper-control-label-container va-button-link" type="button" onClick={this.moveRight}>
                  <span className="cropper-control-label">Move right<i className="fa fa-arrow-right"></i></span>
                </button>
              </div>
            </div>
            <div className="crop-button-container">
              <button type="button" className="usa-button-primary" onClick={this.onDone}>
                I'm done
              </button>
            </div>
          </div>
          }
          {!this.state.src && !this.state.done && <div className="drop-target-container">
            <Dropzone className="drop-target" onDrop={this.onChange} accept="image/jpeg, image/jpg, image/png, image/tiff, image/tif, image/bmp">
              <img alt="placeholder" src="/img/photo-placeholder.png"/>
            </Dropzone>
          </div>}
          <div className={this.state.done ? 'photo-input-container photo-input-container-left' : 'photo-input-container'}>
            {this.state.done && <button className="photo-edit-button usa-button" onClick={this.onEdit}>Edit Your Photo</button>}
            <ErrorableFileInput
              accept={FILE_TYPES.map(type => `.${type}`).join(',')}
              onChange={this.onChange}
              buttonText={smallScreen ? <span>Upload <i className="fa fa-upload"></i></span> : 'Upload Your Photo'}
              name="fileUpload"
              additionalErrorClass="claims-upload-input-error-message"/>
          </div>
        </div>
      </div>
    );
  }
}
