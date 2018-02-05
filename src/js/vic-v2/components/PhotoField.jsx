import React from 'react';
import Cropper from 'react-cropper';
import Dropzone from 'react-dropzone';
import classNames from 'classnames';
import ErrorableFileInput from '../../common/components/form-elements/ErrorableFileInput';
import ProgressBar from '../../common/components/ProgressBar';
import environment from '../../common/helpers/environment';

const MIN_SIZE = 350;
const MIN_RATIO = 0.2;
const MAX_RATIO = 1.7;
const WARN_RATIO = 1.3;
const LARGE_SCREEN = 1201;
const MAX_DIMENSION = 1024;

function isSmallScreen(width) {
  return  width < LARGE_SCREEN;
}

function isValidFileType(fileName, fileTypes) {
  return fileTypes.some(type => fileName.toLowerCase().endsWith(type));
}

function getImageUrl(cropResult, guid) {
  if (cropResult) {
    return cropResult.src;
  }
  let host;
  if (environment.name === 'production') {
    host = 'dsva-vetsgov-prod';
  } else if (environment.name === 'staging') {
    host = 'dsva-vetsgov-staging';
  } else {
    host = 'dsva-vetsgov-dev';
  }

  return `https://${host}-vic.s3-us-gov-west-1.amazonaws.com/profile_photo_attachments/${guid}`;
}

// If any of the image dimensions are greater than the max specified,
// resize it down to that dimension while keeping the aspect ratio
// intact
function resizeIfAboveMaxDimension(img, mimeType, maxDimension) {
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
      zoomValue: 0.4,
      errorMessage: null,
      warningMessage: null,
      progress: 0
    };
  }

  componentWillMount() {
    this.detectDrag();
    this.detectWidth();
  }

  componentDidMount() {
    window.addEventListener('resize', this.detectWidth);
  }

  componentWillReceiveProps(newProps) {
    const newFile = newProps.formData || {};
    const file = this.props.formData || {};
    const isUploading = newFile.uploading;
    const wasUploading = file.uploading;
    if (isUploading && !wasUploading) {
      this.setState({ progress: 0 });
    }
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
    this.setState({ progress: 0, warningMessage: null });
  }

  onDone = () => {
    const filePath = this.props.idSchema.$id.split('_').slice(1);
    this.refs.cropper.getCroppedCanvas().toBlob(blob => {
      const file = blob;
      file.lastModifiedDate = new Date();
      file.name = this.state.fileName;
      this.props.formContext.uploadFile(
        file,
        filePath,
        this.props.uiSchema['ui:options'],
        this.updateProgress
      ).catch(() => {
        // rather not use the promise here, but seems better than trying to pass
        // a blur function
        // this.props.onBlur(`${this.props.idSchema.$id}_${idx}`);
      });

      this.setState({ warningMessage: null });
    });
  }

  onChangeNoCropping = (files) => {
    const file = files[0];
    const filePath = this.props.idSchema.$id.split('_').slice(1);
    this.props.formContext.uploadFile(
      file,
      filePath,
      this.props.uiSchema['ui:options'],
      this.updateProgress,
    ).catch(() => {
      // rather not use the promise here, but seems better than trying to pass
      // a blur function
      // this.props.onBlur(`${this.props.idSchema.$id}_${idx}`);
    });
  }

  onChange = (files) => {
    const fileTypes = this.props.uiSchema['ui:options'].fileTypes;
    if (files && files[0]) {
      const file = files[0];
      const fileName = file.name;
      if (file.preview) {
        // dropzone recommendation
        window.URL.revokeObjectURL(file.preview);
      }
      if (!isValidFileType(fileName, fileTypes)) {
        this.setState({
          src: null,
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
                  cropResult: null,
                  errorMessage: 'The file you selected is smaller than the 350px minimum file width or height and could not be added.'
                });
              } else {
                this.setState({
                  src: resizeIfAboveMaxDimension(img, file.type, MAX_DIMENSION),
                  fileName,
                  cropResult: null,
                  errorMessage: null
                });
              }
            })
            .catch(() => {
              this.setState({
                src: null,
                fileType: null,
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

  updateProgress = (progress) => {
    this.setState({ progress });
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
    const file = this.props.formData || {};
    const errorMessage = file.errorMessage || this.state.errorMessage;
    const smallScreen = isSmallScreen(this.state.windowWidth);
    const fileTypes = this.props.uiSchema['ui:options'].fileTypes;
    const isDone = !!file.confirmationCode;
    const progressBarContainerClass = classNames('schemaform-file-uploading', 'progress-bar-container');
    const showCropper = !isDone && this.state.src;
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
    if (!isDone) {
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

    if (isDone) description = <p>Success! This photo will be printed on your Veteran ID card.</p>;

    return (
      <div>
        {!smallScreen && <h3>Upload a digital photo<span className="form-required-span">(*Required)</span></h3>}
        {errorMessage && <span className="usa-input-error-message">{errorMessage}</span>}
        <div className={errorMessage ? 'error-box' : 'border-box'}>
          <div style={{ margin: '1em 1em 4em' }}>
            {smallScreen && <h3>Photo upload <span className="form-required-span">(Required)*</span></h3>}
            {instruction}
            {description}
            {this.state.warningMessage && <div className="photo-warning">{this.state.warningMessage}</div>}
            {isDone && <img className="photo-preview" src={getImageUrl(this.state.cropResult, file.confirmationCode)} alt="cropped"/>}
          </div>
          {file.uploading && <div className={progressBarContainerClass}>
            <span>{this.state.fileName}</span><br/>
            <ProgressBar percent={this.state.progress}/>
          </div>}
          {!isDone && this.state.src && <div className="cropper-container-outer">
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
              <div className="cropper-control-row">
                {smallScreen && <button className="cropper-control cropper-control-label-container va-button va-button-link" type="button" onClick={this.zoomOut}>
                  <span className="cropper-control-label">Make smaller</span>
                </button>}
                {smallScreen && <button className="cropper-control cropper-control-label-container va-button va-button-link" type="button" onClick={this.zoomIn}>
                  <span className="cropper-control-label">Make larger</span>
                </button>}
              </div>
              {[
                [{
                  labelText: 'Move up',
                  className: 'fa fa-arrow-up',
                  onClick: this.moveUp
                }, {
                  labelText: 'Move down',
                  className: 'fa fa-arrow-down',
                  onClick: this.moveDown
                }],
                [{
                  labelText: 'Move left',
                  className: 'fa fa-arrow-left',
                  onClick: this.moveLeft
                }, {
                  labelText: 'Move right',
                  className: 'fa fa-arrow-right',
                  onClick: this.moveright
                }]
              ].map((row, index) => (
                <div className="cropper-control-row" key={index}>
                  {row.map((button) => (
                    <button className={moveControlClass} type="button" onClick={button.onClick} key={button.className}>
                      <span className="cropper-control-label">{button.labelText}<i className={button.className}></i></span>
                    </button>))
                  }
                </div>))
              }
            </div>
            <div className="crop-button-container">
              <button type="button" className="usa-button-primary" onClick={this.onDone}>
                I’m done
              </button>
            </div>
          </div>
          }
          {!this.state.src && !isDone && <div className="drop-target-container">
            <Dropzone className="drop-target" onDrop={this.onChange} accept="image/jpeg, image/jpg, image/png, image/tiff, image/tif, image/bmp">
              <img alt="placeholder" src="/img/photo-placeholder.png"/>
            </Dropzone>
          </div>}
          <div className={isDone ? 'photo-input-container photo-input-container-left' : 'photo-input-container'}>
            {isDone && <button className="photo-edit-button usa-button" onClick={this.onEdit}>Edit Your Photo</button>}
            <ErrorableFileInput
              accept={fileTypes.map(type => `.${type}`).join(',')}
              onChange={this.onChange}
              buttonText={uploadMessage}
              name="fileUpload"/>
            {!isDone && !showCropper && <ErrorableFileInput
              accept={fileTypes.map(type => `.${type}`).join(',')}
              onChange={this.onChangeNoCropping}
              buttonText="Screen reader friendly photo upload tool"
              triggerClass="va-button-link"
              name="screenReaderFileUpload"/>}
          </div>
        </div>
      </div>
    );
  }
}
