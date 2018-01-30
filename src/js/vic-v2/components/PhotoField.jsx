import React from 'react';
import Cropper from 'react-cropper';
import Dropzone from 'react-dropzone';
import classNames from 'classnames';
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
const MIN_RATIO = 0.2;
const MAX_RATIO = 1.7;
const WARN_RATIO = 1.3;
const LARGE_SCREEN = 1201;
const MAX_DIMENSION = 1024;

function isSmallScreen(width) {
  return  width < LARGE_SCREEN;
}

function isValidFileType(fileName) {
  return FILE_TYPES.some(type => fileName.toLowerCase().endsWith(type));
}

// data urls start with data:image/jpg; and we need to pull out the
// image/jpg part so canvas doesn't change the file type
function getMimeType(dataUrl) {
  // limit to 2 so we don't try to split a giant data url string
  const prefix = dataUrl.split(';', 2)[0];
  return prefix.replace('data:', '');
}

// If any of the image dimensions are greater than the max specified, 
// resize it down to that dimension while keeping the aspect ratio
// intact
function resizeToMaxDimension(img, mimeType, maxDimension) {
  const oc = document.createElement('canvas');
  const octx = oc.getContext('2d');
  let height = img.height;
  let width = img.width;

  if (Math.max(img.width, img.height) > maxDimension) {
    if (img.width > img.height) {
      height = (height / width) * maxDimension;
      width = maxDimension;
    } else {
      width = (width / height) * maxDimension;
      height = maxDimension;
    }

    oc.width = width;
    oc.height = height;
    octx.drawImage(img, 0, 0, oc.width, oc.height);

    return oc.toDataURL(mimeType);
  }

  return img.src;
}

function isValidImageSize(img) {
  return img.width >= MIN_SIZE && img.height >= MIN_SIZE;
}

function loadImage(dataUrl) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = dataUrl;
    img.onerror = (e) => reject(e);
    img.onload = () => {
      resolve(img);
    };
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
      errorMessage: null,
      warningMessage: null
    };
  }

  componentWillMount() {
    this.detectDrag();
    this.detectWidth();
  }

  componentDidMount() {
    window.addEventListener('resize', this.detectWidth);
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextState.windowWidth !== this.state.windowWidth) {
      const cropper = this.refs.cropper;
      if (cropper) {
        this.setCropBox();
      }
    }
    if (nextState.zoomValue !== this.state.zoomValue) {
      const slider = this.refs.slider;
      if (slider) {
        slider.value = nextState.zoomValue;
      }
    }
  }

  onEdit = () => {
    this.setState({ done: false, warningMessage: null });
  }

  onDone = () => {
    const cropResult = this.refs.cropper.getCroppedCanvas().toDataURL();
    this.setState({ cropResult, done: true, warningMessage: null });
  }

  onChange = (files) => {
    if (files && files[0]) {
      const file = files[0];
      if (file.preview) {
        // dropzone recommendation
        window.URL.revokeObjectURL(file.preview);
      }
      if (!isValidFileType(file.name)) {
        this.setState({
          src: null,
          done: false,
          cropResult: null,
          errorMessage: 'Please choose a file from one of the accepted types.'
        });
      } else {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          loadImage(reader.result)
            .then((img) => {
              if (!isValidImageSize(img)) {
                this.setState({
                  src: null,
                  done: false,
                  cropResult: null,
                  errorMessage: 'The file you selected is smaller than the 350px minimum file width or height and could not be added.'
                });
              } else {
                this.setState({
                  src: resizeToMaxDimension(img, getMimeType(reader.result), MAX_DIMENSION),
                  done: false,
                  cropResult: null,
                  errorMessage: null
                });
              }
            })
            .catch(() => {
              this.setState({
                src: null,
                done: false,
                cropResult: null,
                errorMessage: 'Sorry, we weren’t able to load the image you selected'
              });
            });
        };
      }
    }
  }

  onZoom = (e) => {
    const zoomValue = e.detail.ratio;
    if (zoomValue < MAX_RATIO && zoomValue > MIN_RATIO) {
      let warningMessage = null;
      if (zoomValue >= WARN_RATIO) {
        warningMessage = 'If you zoom in this close, your ID photo will be less clear.';
      }
      return this.setState({ zoomValue, warningMessage });
    }
    return e.preventDefault();
  }

  setCropBox = () => {
    const cropper = this.refs.cropper;
    const slider = this.refs.slider;
    const { width, naturalWidth } = this.refs.cropper.getImageData();
    slider.value = width / naturalWidth;
    const containerData = cropper.getContainerData();
    const containerWidth = containerData.width;
    const smallScreen = isSmallScreen(this.state.windowWidth);
    const cropBoxSize = smallScreen ? 240 : 300;
    const cropBoxLeftOffset = (containerWidth - cropBoxSize) / 2;
    const cropBoxData = {
      left: cropBoxLeftOffset,
      top: 0,
      width: cropBoxSize,
      height: cropBoxSize
    };
    cropper.setCropBoxData(cropBoxData);
  }

  getErrorMessage = () => {
    return this.state.errorMessage;
  }

  detectDrag = () => {
    const div = document.createElement('div');
    const supportsDragAndDrop = ('draggable' in div) || ('ondragstart' in div && 'ondrop' in div);
    const iOS = !!navigator.userAgent.match('iPhone OS') || !!navigator.userAgent.match('iPad');
    const dragAndDropSupported = supportsDragAndDrop && window.FileReader;
    this.setState({ dragAndDropSupported: dragAndDropSupported && !iOS });
  }

  detectWidth = () => {
    const windowWidth = window.innerWidth;
    this.setState({ windowWidth });
  }

  moveUp = () => {
    this.refs.cropper.move(0, -5);
  }

  moveDown = () => {
    this.refs.cropper.move(0, 5);
  }

  moveRight = () => {
    this.refs.cropper.move(-5, 0);
  }

  moveLeft = () => {
    this.refs.cropper.move(5, 0);
  }

  zoom = (e) => {
    if (e.target.value < MAX_RATIO && e.target.value > MIN_RATIO) {
      this.refs.cropper.zoomTo(e.target.value);
    }
  }

  zoomIn = () => {
    if (this.state.zoomValue < MAX_RATIO) {
      this.refs.cropper.zoom(0.1);
    }
  }

  zoomOut = () => {
    if (this.state.zoomValue > MIN_RATIO) {
      this.refs.cropper.zoom(-0.1);
    }
  }

  render() {
    const smallScreen = isSmallScreen(this.state.windowWidth);
    const moveControlClass = classNames('cropper-control', 'cropper-control-label-container', 'va-button-link');
    let uploadMessage;
    if (smallScreen) {
      uploadMessage = <span>Upload <i className="fa fa-upload"></i></span>;
    } else if (this.state.src) {
      uploadMessage = 'Upload a New Photo';
    } else {
      uploadMessage = 'Upload Your Photo';
    }
    let instruction;
    if (!this.state.done) {
      if (!this.state.src) {
        instruction = <p><strong>Step 1 of 2:</strong> Upload a digital photo.</p>;
      }
      if (this.state.src) {
        instruction = <p><strong>Step 2 of 2:</strong> Fit your head and shoulders in the frame</p>;
      }
    }
    let description;
    if (this.state.dragAndDropSupported) {
      description = <p>Drag and drop your image into the square or click the upload button.</p>;
    }
    if (this.state.src) {
      description = <p>Move and resize your photo, so your head and shoulders fit in the square frame below. Click and drag, or use the arrow and magnifying buttons to help.</p>;
    }
    if (this.state.done) description = <p>Success! This photo will be printed on your Veteran ID card.</p>;

    return (
      <div>
        {PhotoDescription}
        {!smallScreen && <h3>Upload a digital photo<span className="form-required-span">(Required)*</span></h3>}
        {this.state.errorMessage && <span className="usa-input-error-message">{this.state.errorMessage}</span>}
        <div className={this.state.errorMessage ? 'error-box' : 'border-box'}>
          <div style={{ margin: '1em 1em 4em' }}>
            {smallScreen && <h3>Photo upload <span className="form-required-span">(Required)*</span></h3>}
            {instruction}
            {description}
            {this.state.warningMessage && <div className="photo-warning">{this.state.warningMessage}</div>}
            {this.state.done && <img className="photo-preview" src={this.state.cropResult} alt="cropped"/>}
          </div>
          {!this.state.done && this.state.src && <div className="cropper-container-outer">
            <Cropper
              ref="cropper"
              ready={this.setCropBox}
              responsive
              src={this.state.src}
              aspectRatio={1}
              cropBoxMovable={false}
              toggleDragModeOnDblclick={false}
              dragMode="move"
              guides={false}
              viewMode={1}
              zoom={this.onZoom}/>
            <div className="cropper-zoom-container">
              {smallScreen && <button className="cropper-control cropper-control-zoom cropper-control-zoom-out va-button va-button-link" type="button" onClick={this.zoomOut}><i className="fa fa-search-minus"></i></button>}
              {!smallScreen && <button className="cropper-control cropper-control-zoom cropper-control-zoom-out va-button va-button-link" type="button" onClick={this.zoomOut}>
                <span className="cropper-control-label">Make smaller<i className="fa fa-search-minus"></i></span>
              </button>}
              <input type="range"
                ref="slider"
                className="cropper-zoom-slider"
                min={MIN_RATIO}
                max={MAX_RATIO}
                defaultValue="0.4"
                step="0.01"
                aria-valuemin={MIN_RATIO}
                aria-valuemax={MAX_RATIO}
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
                <button className={moveControlClass} type="button" onClick={this.moveUp}>
                  <span className="cropper-control-label">Move up<i className="fa fa-arrow-up"></i></span>

                </button>
                <button className={moveControlClass} type="button" onClick={this.moveLeft}>
                  <span className="cropper-control-label">Move left<i className="fa fa-arrow-left"></i></span>

                </button>
              </div>
              <div className="cropper-control-column">
                {smallScreen && <button className="cropper-control cropper-control-label-container va-button va-button-link" type="button" onClick={this.zoomIn}>
                  <span className="cropper-control-label">Make larger</span>
                </button>}
                <button className={moveControlClass} type="button" onClick={this.moveDown}>
                  <span className="cropper-control-label">Move down<i className="fa fa-arrow-down"></i></span>

                </button>
                <button className={moveControlClass} type="button" onClick={this.moveRight}>
                  <span className="cropper-control-label">Move right<i className="fa fa-arrow-right"></i></span>
                </button>
              </div>
            </div>
            <div className="crop-button-container">
              <button type="button" className="usa-button-primary" onClick={this.onDone}>
                I’m done
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
              buttonText={uploadMessage}
              name="fileUpload"
              additionalErrorClass="claims-upload-input-error-message"/>
          </div>
        </div>
      </div>
    );
  }
}
