import React from 'react';
import Cropper from 'react-cropper';
import Dropzone from 'react-dropzone';
import classNames from 'classnames';
import ErrorableFileInput from '../../common/components/form-elements/ErrorableFileInput';
import ProgressBar from '../../common/components/ProgressBar';

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

const MIN_SIZE = 350;
const WARN_RATIO = 1.3;
const LARGE_SCREEN = 1201;
const MAX_DIMENSION = 1024;

function makeMovedCanvasData({ canvasData, cropBoxData, moveX, moveY }) {
  const { left: canvasLeft, top: canvasTop, width: canvasWidth, height: canvasHeight } =  canvasData;
  const { left: cropBoxLeft, top: cropBoxTop, width: cropBoxWidth, height: cropBoxHeight } =  cropBoxData;

  const boundaries = {
    leftMin: cropBoxLeft + cropBoxWidth - canvasWidth,
    leftMax: cropBoxLeft,
    topMin: cropBoxTop + cropBoxHeight - canvasHeight,
    topMax: cropBoxTop
  };

  const newCanvasData = {
    left: moveX ? moveX + canvasLeft : canvasLeft,
    top: moveY ? moveY + canvasTop : canvasTop,
    bottomBoundaryMet: false,
    topBoundaryMet: false,
    leftBoundaryMet: false,
    rightBoundaryMet: false
  };

  if (boundaries.topMin === boundaries.topMax) {
    newCanvasData.top = boundaries.topMin;
    newCanvasData.topBoundaryMet = true;
    newCanvasData.bottomBoundaryMet = true;
  } else if (newCanvasData.top > boundaries.topMax) {
    newCanvasData.top = boundaries.topMax;
    newCanvasData.topBoundaryMet = true;
  } else if (newCanvasData.top  < boundaries.topMin) {
    newCanvasData.top = boundaries.topMin;
    newCanvasData.bottomBoundaryMet = true;
  }

  if (boundaries.leftMin === boundaries.leftMax) {
    newCanvasData.left = boundaries.leftMin;
    newCanvasData.leftBoundaryMet = true;
    newCanvasData.rightBoundaryMet = true;
  } else if (newCanvasData.left > boundaries.leftMax) {
    newCanvasData.left = boundaries.leftMax;
    newCanvasData.leftBoundaryMet = true;
  } else if (newCanvasData.left < boundaries.leftMin) {
    newCanvasData.left = boundaries.leftMin;
    newCanvasData.rightBoundaryMet = true;
  }

  return newCanvasData;
}

function isSmallScreen(width) {
  return  width < LARGE_SCREEN;
}

function isValidFileType(fileName, fileTypes) {
  return fileTypes.some(type => fileName.toLowerCase().endsWith(type));
}

function getBoundaryEdgeWarningDirection({ topBoundaryMet, bottomBoundaryMet, rightBoundaryMet, leftBoundaryMet }) {
  let direction = '';
  if (topBoundaryMet) {
    direction = 'down';
  }

  if (bottomBoundaryMet) {
    direction = 'up';
  }

  if (leftBoundaryMet) {
    direction = 'right';
  }

  if (rightBoundaryMet) {
    direction = 'left';
  }

  return direction;
}

function makeBoundaryEdgeWarning(direction) {
  return direction ?
    `You have reached the edge of your photo and can't move it any farther ${direction}. To continue to edit your photo, click on the other arrows to move it or to make it larger.` :
    '';
}

function hasParallelBoundariesMet({ topBoundaryMet, bottomBoundaryMet, leftBoundaryMet, rightBoundaryMet }) {
  return (topBoundaryMet && bottomBoundaryMet) || (leftBoundaryMet && rightBoundaryMet);
}

function makeCropBoundaryWarningMessage({ zoomWarn = false, ...boundariesMet }) {
  if (zoomWarn) {
    return 'If you zoom in this close, your ID photo will be less clear.';
  } else if (hasParallelBoundariesMet(boundariesMet)) {
    return 'Your photo currently fits within the square frame. If you’d like to adjust the position of your photo, click Make larger.';
  }

  return makeBoundaryEdgeWarning(getBoundaryEdgeWarningDirection(boundariesMet));
}

function makeMoveButtonsEnabledStates({ topBoundaryMet, bottomBoundaryMet, rightBoundaryMet, leftBoundaryMet }) {
  return {
    moveUpDisabled: bottomBoundaryMet,
    moveDownDisabled: topBoundaryMet,
    moveLeftDisabled: rightBoundaryMet,
    moveRightDisabled: leftBoundaryMet
  };
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
      cropResult: null,
      errorMessage: null,
      minRatio: 0.2,
      maxRatio: 1.7,
      progress: 0,
      src: null,
      warningMessage: null,
      zoomValue: 0.4
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
                  src: resizeIfAboveMaxDimension(img, file.type, MAX_DIMENSION),
                  fileName,
                  done: false,
                  cropResult: null,
                  errorMessage: null
                });
              }
            })
            .catch(() => {
              this.setState({
                src: null,
                fileType: null,
                done: false,
                cropResult: null,
                errorMessage: 'Sorry, we weren’t able to load the image you selected'
              });
            });
        };
      }
    }

    this.setState({ warningMessage: '' });
  }

  onZoomSliderChange = (e) => {
    this.refs.cropper.zoomTo(e.target.value);
  }

  onZoom = (e) => {
    // Cropper returns the attempted zoom value
    const zoomValue = e.detail.ratio;

    // check if zoom is out of bounds
    let zoomToBoundaryRatio;
    if (zoomValue < this.state.minRatio) {
      zoomToBoundaryRatio = this.state.minRatio;
    } else if (zoomValue > this.state.maxRatio) {
      zoomToBoundaryRatio = this.state.maxRatio;
    }

    // force zoom within zoom bounds
    if (zoomToBoundaryRatio) {
      this.refs.cropper.zoomTo(zoomToBoundaryRatio); // force zoom within constraints
      e.preventDefault(); // prevents bad zoom attempt
      return; // don't update state until the subsequent zoom attempt
    }

    // zoom value is good- update the state / messaging
    this.setState({ zoomValue });

    const zoomWarn = zoomValue >= WARN_RATIO;
    // at this point, the onZoom event has not resized the canvas-
    // this forces the canvas back into move bounds if the zoom pulls a canvas edge into the cropBox
    //   after the canvas has rendered with new width values
    window.requestAnimationFrame(this.maybeMoveCanvasWithinBounds.bind(this, {}, zoomWarn));
  }

  setCropBox = () => {
    // center the cropbox using container width
    const containerWidth = this.refs.cropper.getContainerData().width;
    const smallScreen = isSmallScreen(this.state.windowWidth);
    const left = smallScreen ? (containerWidth / 2) - 120 : (containerWidth / 2) - 150;
    this.refs.cropper.setCropBoxData({
      top: 0,
      left,
      height: smallScreen ? 240 : 300,
      width: smallScreen ? 240 : 300
    });

    // use the cropbox dimensions to force canvas into default position
    const { height: cropBoxHeight, width: cropBoxWidth, left: cropBoxLeft } = this.refs.cropper.getCropBoxData();
    const { width: oldCanvasWidth, height: oldCanvasHeight, naturalHeight, naturalWidth } = this.refs.cropper.getCanvasData();
    // tall images take the full width of the cropBox
    if (naturalHeight > naturalWidth) {
      this.refs.cropper.setCanvasData({
        width: cropBoxWidth,
        left: cropBoxLeft
      });
      // wide images take the full height of the cropBox
      // to center, uses the ratio of cropBoxHeight / cavasHeight
    } else {
      this.refs.cropper.setCanvasData({
        height: cropBoxHeight,
        top: 0,
        left: (containerWidth - (cropBoxHeight / oldCanvasHeight * oldCanvasWidth)) / 2
      });
    }

    // with the canvas resized, use its dimensions to determine the min zoom ratio
    const { width: newCanvasWidth } = this.refs.cropper.getCanvasData();
    const minRatio = newCanvasWidth / naturalWidth;
    const slider = this.refs.slider;
    slider.value = minRatio;

    this.setState({
      zoomValue: minRatio,
      minRatio
    });
  }

  maybeMoveCanvasWithinBounds = (moveData, zoomWarn = false) => {
    const newCanvasData = makeMovedCanvasData({
      canvasData: this.refs.cropper.getCanvasData(),
      cropBoxData: this.refs.cropper.getCropBoxData(),
      ...moveData
    });

    this.refs.cropper.setCanvasData(newCanvasData);

    this.updateBoundaryWarningAndButtonStates(newCanvasData, zoomWarn);
  }

  updateProgress = (progress) => {
    this.setState({ progress });
  }

  detectWidth = () => {
    const windowWidth = window.innerWidth;
    this.setState({ windowWidth });
  }

  detectDrag = () => {
    const div = document.createElement('div');
    const supportsDragAndDrop = ('draggable' in div) || ('ondragstart' in div && 'ondrop' in div);
    const iOS = !!navigator.userAgent.match('iPhone OS') || !!navigator.userAgent.match('iPad');
    const dragAndDropSupported = supportsDragAndDrop && window.FileReader;
    this.setState({ dragAndDropSupported: dragAndDropSupported && !iOS });
  }

  updateBoundaryWarningAndButtonStates = (moveBoundariesMet, zoomWarn = false) => {
    this.setState({
      warningMessage: makeCropBoundaryWarningMessage({ zoomWarn, ...moveBoundariesMet }),
      ...makeMoveButtonsEnabledStates(moveBoundariesMet)
    });
  }

  handleCropend = () => { // casing matches Cropper argument
    this.maybeMoveCanvasWithinBounds();
  }

  handleCropstart = (e) => {
    const action = e.detail.action;
    const allowedActions = ['crop', 'move', 'zoom', 'all'];

    if (!allowedActions.includes(action)) {
      e.preventDefault();
    }
  }

  handleMove = (direction) => {
    let moveData;
    switch (direction) {
      case 'up':
        moveData = { moveX: 0, moveY: -5 };
        break;
      case 'down':
        moveData = { moveX: 0, moveY: 5 };
        break;
      case 'right':
        moveData = { moveX: 5, moveY: 0 };
        break;
      case 'left':
        moveData = { moveX: -5, moveY: 0 };
        break;
      default:
    }
    this.maybeMoveCanvasWithinBounds(moveData);
  }

  handleZoomButtonClick = (direction) => {
    switch (direction) {
      case 'IN':
        if (this.state.zoomValue < this.state.maxRatio) {
          this.refs.cropper.zoom(0.1);
        }
        break;
      case 'OUT':
        if (this.state.zoomValue > this.state.minRatio) {
          this.refs.cropper.zoom(-0.1);
        }
        break;
      default:
    }
  }

  render() {
    const file = this.props.formData || {};
    const errorMessage = file.errorMessage || this.state.errorMessage;
    const smallScreen = isSmallScreen(this.state.windowWidth);
    const moveControlClass = ['cropper-control', 'cropper-control-label-container', 'va-button-link'];
    const fileTypes = this.props.uiSchema['ui:options'].fileTypes;
    const isDone = !!file.confirmationCode;
    const progressBarContainerClass = classNames('schemaform-file-uploading', 'progress-bar-container');
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
        {PhotoDescription}
        {!smallScreen && <h3>Upload a digital photo<span className="form-required-span">(Required)*</span></h3>}
        {errorMessage && <span className="usa-input-error-message">{errorMessage}</span>}
        <div className={errorMessage ? 'error-box' : 'border-box'}>
          <div style={{ margin: '1em 1em 4em' }}>
            {smallScreen && <h3>Photo upload <span className="form-required-span">(Required)*</span></h3>}
            {instruction}
            {description}
            {isDone && <img className="photo-preview" src={this.state.cropResult.src} alt="cropped"/>}
          </div>
          {file.uploading && <div className={progressBarContainerClass}>
            <span>{this.state.fileName}</span><br/>
            <ProgressBar percent={this.state.progress}/>
          </div>}
          {!isDone && this.state.src && <div className="cropper-container-outer">
            <Cropper
              ref="cropper"
              key={smallScreen ? 'smallScreen' : 'largeScreen'}
              ready={this.setCropBox}
              responsive
              src={this.state.src}
              aspectRatio={1}
              cropBoxMovable={false}
              cropstart={this.handleCropstart}
              cropend={this.handleCropend}
              cropmove={this.handleCropMove}
              minContainerHeight={smallScreen ? 240 : 300}
              toggleDragModeOnDblclick={false}
              dragMode="move"
              guides={false}
              viewMode={0}
              zoom={this.onZoom}/>
            <div className="cropper-zoom-container">
              {smallScreen && <button className="cropper-control cropper-control-zoom cropper-control-zoom-out va-button va-button-link" type="button" onClick={() => this.handleZoomButtonClick('OUT')}><i className="fa fa-search-minus"></i></button>}
              {!smallScreen && <button className="cropper-control cropper-control-zoom cropper-control-zoom-out va-button va-button-link" type="button" onClick={() => this.handleZoomButtonClick('OUT')}>
                <span className="cropper-control-label">Make smaller<i className="fa fa-search-minus"></i></span>
              </button>}
              <input type="range"
                ref="slider"
                className="cropper-zoom-slider"
                min={this.state.minRatio}
                max={this.state.maxRatio}
                defaultValue="0.4"
                step="0.01"
                aria-valuemin={this.state.minRatio}
                aria-valuemax={this.state.maxRatio}
                aria-valuenow={this.state.zoomValue}
                onInput={this.onZoomSliderChange}/>
              {smallScreen && <button className="cropper-control cropper-control-zoom cropper-control-zoom-in va-button va-button-link" type="button" onClick={() => this.handleZoomButtonClick('IN')}><i className="fa fa-search-plus"></i></button>}
              {!smallScreen && <button className="cropper-control cropper-control-zoom cropper-control-zoom-in va-button va-button-link" type="button" onClick={() => this.handleZoomButtonClick('IN')}>
                <span className="cropper-control-label">Make larger<i className="fa fa-search-plus"></i></span>
              </button>}
            </div>
            <div className="cropper-control-container">
              <div className="cropper-control-row">
                {smallScreen && <button className="cropper-control cropper-control-label-container va-button va-button-link" type="button" onClick={() => this.handleZoomButtonClick('OUT')}>
                  <span className="cropper-control-label">Make smaller</span>
                </button>}
                {smallScreen && <button className="cropper-control cropper-control-label-container va-button va-button-link" type="button" onClick={() => this.handleZoomButtonClick('IN')}>
                  <span className="cropper-control-label">Make larger</span>
                </button>}
              </div>
              {[
                [{
                  direction: 'up',
                  disabled: this.state.moveUpDisabled
                }, {
                  direction: 'down',
                  disabled: this.state.moveDownDisabled
                }],
                [{
                  direction: 'left',
                  disabled: this.state.moveLeftDisabled
                }, {
                  direction: 'right',
                  disabled: this.state.moveRightDisabled
                }]
              ].map((row, index) => (
                <div className="cropper-control-row" key={index}>
                  {row.map((button) => (
                    <button className={classNames(moveControlClass, { disabled: button.disabled })} type="button" onClick={() => this.handleMove(button.direction)} key={button.direction}>
                      <span className="cropper-control-label">{`Move ${button.direction}`}<i className={`fa fa-arrow-${button.direction}`}></i></span>
                    </button>))
                  }
                </div>))
              }
            </div>
            <div style={{ margin: '1em 1em 4em' }}>
              {this.state.warningMessage && <div className="photo-warning">{this.state.warningMessage}</div>}
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
              name="fileUpload"
              additionalErrorClass="claims-upload-input-error-message"/>
          </div>
        </div>
      </div>
    );
  }
}
