import React from 'react';
import Cropper from 'react-cropper';
import Dropzone from 'react-dropzone';
import classNames from 'classnames';

import environment from '../../common/helpers/environment';
import ErrorableFileInput from '../../common/components/form-elements/ErrorableFileInput';
import ProgressBar from '../../common/components/ProgressBar';
import { scrollAndFocus } from '../../common/utils/helpers';
import { PhotoReviewDescription } from '../helpers.jsx';
import _ from 'lodash/fp';

const MIN_SIZE = 350;
const SMALL_CROP_BOX_SIZE = 240;
const LARGE_CROP_BOX_SIZE = 300;
const WARN_RATIO = 1.3;
const LARGE_SCREEN = 1201;

function getCanvasDataForDefaultPosition({ canvasData, cropBoxData, containerWidth }) {
  // use the cropbox dimensions to force canvas into default position
  const { height: cropBoxHeight, width: cropBoxWidth, left: cropBoxLeft } =  cropBoxData;
  const { width: oldCanvasWidth, height: oldCanvasHeight, naturalHeight, naturalWidth } = canvasData;
  // wide images are centered and set to the height of the crop box
  if (naturalHeight < naturalWidth) {
    return {
      height: cropBoxHeight,
      top: 0,
      left: (containerWidth - (cropBoxHeight / oldCanvasHeight * oldCanvasWidth)) / 2,
      bottomBoundaryMet: true,
      topBoundaryMet: true,
      leftBoundaryMet: false,
      rightBoundaryMet: false
    };
  }

  // narrow images are move to the top and set to the width of the cropbox
  return {
    width: cropBoxWidth,
    left: cropBoxLeft,
    top: 0,
    bottomBoundaryMet: false,
    topBoundaryMet: true,
    leftBoundaryMet: true,
    rightBoundaryMet: true
  };
}


function getBoundedCanvasPositionData({ canvasData, cropBoxData, moveX, moveY }) {
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

function onReviewPage(pageTitle) {
  return pageTitle === 'Review your photo';
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

function isSquareImage(img) {
  return img.width === img.height;
}

function getImageUrl({ serverPath, serverName } = {}) {
  if (serverName) {
    return `${environment.API_URL}/content/vic/${serverPath}/${serverName}`;
  }

  return null;
}

export default class PhotoField extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      minRatio: 0.2,
      maxRatio: 1.7,
      progress: 0,
      src: null,
      warningMessage: null,
      zoomValue: 0.4,
      isCropping: false
    };

    this.screenReaderPath = false;
  }

  componentWillMount() {
    this.detectDrag();
    this.detectWidth();
  }

  componentDidMount() {
    if (!onReviewPage(this.props.formContext.pageTitle)) {
      window.addEventListener('resize', this.detectWidth);
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

  componentDidUpdate(prevProps, prevState) {
    const newFile = this.props.formData || {};
    const oldFile = prevProps.formData || {};
    const newState = this.state;
    if (newFile.errorMessage && oldFile.errorMessage !== newFile.errorMessage) {
      scrollAndFocus(document.querySelector('.usa-input-error-message'));
    } else if (prevState.isCropping !== newState.isCropping) {
      scrollAndFocus(document.querySelector('.border-box'));
    } else if (typeof this.props.formData === 'undefined' && this.props.formData !== prevProps.formData) {
      scrollAndFocus(document.querySelector('.border-box'));
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.detectWidth);
  }

  onEdit = () => {
    this.setState({
      isCropping: true,
      fileName: this.props.formData.name,
      src: getImageUrl(this.props.formData),
      warningMessage: null
    });
  }

  onDone = () => {
    const filePath = this.props.idSchema.$id.split('_').slice(1);

    this.setState({ isCropping: false, progress: 0, warningMessage: null });

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
        this.props.onBlur(this.props.idSchema.$id);
      });
    });
  }

  onChangeScreenReader = (files) => {
    const file = files[0];
    const filePath = this.props.idSchema.$id.split('_').slice(1);

    this.screenReaderPath = true;

    const fileTypes = this.props.uiSchema['ui:options'].fileTypes;
    if (!isValidFileType(file.name, fileTypes)) {
      this.props.onChange({
        errorMessage: 'We weren’t able to upload your file. Please make sure the file you’re uploading is a jpeg, .png, .tiff,  or .bmp file and try again.'
      });
    } else {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        loadImage(reader.result)
          .then((img) => {
            if (!isSquareImage(img)) {
              this.props.onChange({
                errorMessage: 'The photo you uploaded isn’t a square photo. Please upload a new one that fits the requirements.'
              });
            } else if (!isValidImageSize(img)) {
              this.props.onChange({
                errorMessage: 'The file you selected is smaller than the 350-pixel minimum file width or height and couldn’t be uploaded. Please try to upload a different photo.'
              });
            } else {
              this.setState({ progress: 0, warningMessage: null });
              this.props.formContext.uploadFile(
                file,
                filePath,
                this.props.uiSchema['ui:options'],
                this.updateProgress,
              ).catch(() => {
                // rather not use the promise here, but seems better than trying to pass
                // a blur function
                this.props.onBlur(this.props.idSchema.$id);
              });
            }
          });
      };
    }
  }

  onChange = (files) => {
    this.screenReaderPath = false;
    this.setState({ dragActive: false });

    const fileTypes = this.props.uiSchema['ui:options'].fileTypes;
    if (files && files[0]) {
      const file = files[0];
      const fileName = file.name;
      if (file.preview) {
        // dropzone recommendation
        window.URL.revokeObjectURL(file.preview);
      }
      if (!isValidFileType(fileName, fileTypes)) {
        this.props.onChange({
          errorMessage: 'We weren’t able to upload your file. Please make sure the file you’re uploading is a jpeg, .png, .tiff,  or .bmp file and try again.'
        });
      } else {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          loadImage(reader.result)
            .then((img) => {
              if (!isValidImageSize(img)) {
                this.props.onChange({
                  errorMessage: 'The file you selected is smaller than the 350-pixel minimum file width or height and couldn’t be uploaded. Please try to upload a different photo.'
                });
              } else {
                // Clear any error messages
                this.props.onChange();
                this.setState({
                  src: img.src,
                  fileName,
                  isCropping: true
                });
              }
            })
            .catch(() => {
              this.props.onChange({
                errorMessage: 'Sorry, we weren’t able to load the image you selected.'
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

  onZoomMouseMove = (e) => {
    if (this.mouseDown) {
      this.onZoomSliderChange(e);
    }
  }

  onZoomMouseDown = (e) => {
    this.mouseDown = true;
    if (e.target.value !== this.state.zoomValue) {
      this.onZoomSliderChange(e);
    }
  }

  onZoomMouseUp = () => {
    this.mouseDown = false;
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

    // at this point, the onZoom event has not resized the canvas-
    // this forces the canvas back into move bounds if the zoom pulls a canvas edge into the cropBox
    //   after the canvas has rendered with new width values
    this.moveCanvasWithinBounds({}, zoomValue);
  }

  setCropBox = () => {
    window.requestAnimationFrame(() => {
      // sometimes this callback is called before the new cropper has mounted
      // check if the cropper instance has canvasData before setting its values
      if (!_.isEmpty(this.refs.cropper.getCanvasData())) {
        // center the cropbox using container width
        const containerWidth = this.refs.cropper.getContainerData().width;
        const smallScreen = isSmallScreen(this.state.windowWidth) || onReviewPage(this.props.formContext.pageTitle);
        const left = smallScreen ? (containerWidth / 2) - 120 : (containerWidth / 2) - 150;
        this.refs.cropper.setCropBoxData({
          top: 0,
          left,
          height: smallScreen ? SMALL_CROP_BOX_SIZE : LARGE_CROP_BOX_SIZE,
          width: smallScreen ? SMALL_CROP_BOX_SIZE : LARGE_CROP_BOX_SIZE
        });

        this.moveCanvasToDefaultPosition();
      }
    });
  }

  setZoomToDefaultRatio = () => {
    window.requestAnimationFrame(() => {
      // with the canvas resized, use its dimensions to determine the min zoom ratio
      const { width: canvasWidth, naturalWidth } = this.refs.cropper.getCanvasData();
      const minRatio = canvasWidth / naturalWidth;
      const slider = this.refs.slider;
      slider.value = minRatio;

      this.setState({
        zoomValue: minRatio,
        minRatio
      });
    });
  }

  moveCanvasToDefaultPosition = () => {
    window.requestAnimationFrame(() => {

      const containerWidth = this.refs.cropper.getContainerData().width;
      const defaultCanvasData = getCanvasDataForDefaultPosition({
        canvasData: this.refs.cropper.getCanvasData(),
        cropBoxData: this.refs.cropper.getCropBoxData(),
        containerWidth
      });

      this.refs.cropper.setCanvasData(defaultCanvasData);

      this.setZoomToDefaultRatio();

      this.updateBoundaryWarningAndButtonStates(defaultCanvasData);
    });
  }
  moveCanvasWithinBounds = (moveData, zoomValue = null) => {
    window.requestAnimationFrame(() => {
      const boundedCanvasData = getBoundedCanvasPositionData({
        canvasData: this.refs.cropper.getCanvasData(),
        cropBoxData: this.refs.cropper.getCropBoxData(),
        ...moveData
      });
      this.refs.cropper.setCanvasData(boundedCanvasData);

      const currentZoomValue = zoomValue || this.state.zoomValue;
      const zoomWarn = this.refs.cropper.getData().width < MIN_SIZE
      || currentZoomValue > WARN_RATIO;
      this.updateBoundaryWarningAndButtonStates(boundedCanvasData, zoomWarn);
    });
  }

  rotateCanvas = (moveData) => {
    // rotate
    this.refs.cropper.rotate(moveData.moveDegree);
  }

  resetFile = () => {
    this.props.onChange();
    this.setState({ isCropping: false });
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
    this.moveCanvasWithinBounds();
  }

  handleCropstart = (e) => {
    const action = e.detail.action;
    const allowedActions = ['crop', 'move', 'zoom', 'all'];

    if (!allowedActions.includes(action)) {
      e.preventDefault();
    }
  }

  handleMoveOrRotate = (direction) => {
    let moveData;
    switch (direction) {
      case 'Move up':
        moveData = { moveX: 0, moveY: -5 };
        break;
      case 'Move down':
        moveData = { moveX: 0, moveY: 5 };
        break;
      case 'Move right':
        moveData = { moveX: 5, moveY: 0 };
        break;
      case 'Move left':
        moveData = { moveX: -5, moveY: 0 };
        break;
      case 'Rotate left':
        moveData = { moveDegree: -90 };
        break;
      case 'Rotate right':
        moveData = { moveDegree: 90 };
        break;
      default:
        moveData = {};
    }

    if ('moveDegree' in moveData) {
      this.rotateCanvas(moveData);
      this.moveCanvasToDefaultPosition();
    } else {
      this.moveCanvasWithinBounds(moveData);
    }
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

  handleDrag(dragActive) {
    this.setState(dragActive);
  }

  render() {
    const { formData, formContext } = this.props;
    const file = formData || {};
    const onReview = formContext.reviewMode;

    if (onReview) return <PhotoReviewDescription url={getImageUrl(file)}/>;

    const { isCropping } = this.state;
    const hasFile = !!file.confirmationCode;
    const errorMessage = file.errorMessage;
    const screenReaderError = this.screenReaderPath && !!errorMessage;
    const label = this.props.uiSchema['ui:title'];
    const smallScreen = isSmallScreen(this.state.windowWidth) || onReviewPage(this.props.formContext.pageTitle);
    const moveControlClass = ['cropper-control', 'cropper-control-label-container', 'va-button-link'];
    const fileTypes = this.props.uiSchema['ui:options'].fileTypes;
    const progressBarContainerClass = classNames('schemaform-file-uploading', 'progress-bar-container');

    let fieldView;
    if (file.uploading) {
      fieldView = 'progress';
    } else if (isCropping) {
      fieldView = 'cropper';
    } else if (screenReaderError) {
      fieldView = 'error';
    } else if (hasFile && !isCropping) {
      fieldView = 'preview';
    } else if (!isCropping && !hasFile) {
      fieldView = 'initial';
    }

    let uploadMessage;
    if (smallScreen) {
      uploadMessage = <span>Upload <i className="fa fa-upload"></i></span>;
    } else if (fieldView === 'cropper') {
      uploadMessage = 'Upload a New Photo';
    } else {
      uploadMessage = 'Upload Your Photo';
    }

    let instruction;
    if (fieldView === 'cropper') {
      instruction = <span><strong>Step 2 of 2:</strong> Fit your head and shoulders in the frame.</span>;
    } else if (fieldView === 'initial') {
      instruction = <span><strong>Step 1 of 2:</strong> Upload a digital photo.</span>;
    }

    let description;
    if (fieldView === 'cropper') {
      description = <p>Move and resize your photo, so your head and shoulders fit in the square frame below. Click and drag, or use the arrow and magnifying buttons to help.</p>;
    } else if (fieldView === 'preview') {
      description = <div>Success! This photo will be printed on your Veteran ID card.</div>;
    } else if (fieldView === 'initial' && this.state.dragAndDropSupported) {
      description = <p>Drag and drop your image into the square or click the upload button.</p>;
    }

    const uploadControlClass = classNames(
      'photo-input-container',
      {
        'photo-input-container-left': fieldView === 'error' || fieldView === 'preview',
      }
    );

    return (
      <fieldset>
        <legend className="schemaform-label photo-label">{label}<span className="form-required-span">(*Required)</span></legend>
        <div className={errorMessage ? 'error-box' : 'border-box'}>
          {fieldView === 'cropper' && <span className="sr-only">
            This is a photo editing tool that requires sight to use. If you're using a screen reader <button type="button" onClick={this.resetFile}>go back one step to upload your photo without cropping.</button>
          </span>}
          <div>
            {errorMessage && <div role="alert" className="usa-input-error-message photo-error-message">
              We’ve run into a problem.
              <p>{errorMessage}</p>
            </div>}
            {instruction}
            {description}
            {fieldView === 'preview' && hasFile && <img
              className="photo-preview"
              src={getImageUrl(file)}
              alt="Photograph of you that will be displayed on the ID card"/>
            }
          </div>
          {fieldView === 'progress' && <div className={progressBarContainerClass}>
            <span>{this.state.fileName}</span><br/>
            <ProgressBar percent={this.state.progress}/>
          </div>}
          {fieldView === 'cropper' && <div className="cropper-container-outer">
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
              minContainerHeight={smallScreen ? SMALL_CROP_BOX_SIZE : LARGE_CROP_BOX_SIZE}
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
                onMouseDown={this.onZoomMouseDown}
                onMouseUp={this.onZoomMouseUp}
                onMouseMove={this.onZoomMouseMove}
                onChange={this.onZoomSliderChange}/>
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
                  action: 'Move',
                  icon: 'arrow',
                  direction: 'up',
                  disabled: this.state.moveUpDisabled
                }, {
                  action: 'Move',
                  icon: 'arrow',
                  direction: 'down',
                  disabled: this.state.moveDownDisabled
                }],
                [{
                  action: 'Move',
                  icon: 'arrow',
                  direction: 'left',
                  disabled: this.state.moveLeftDisabled
                }, {
                  action: 'Move',
                  icon: 'arrow',
                  direction: 'right',
                  disabled: this.state.moveRightDisabled
                }],
                [{
                  action: 'Rotate',
                  icon: 'rotate',
                  direction: 'left',
                  disabled: false
                }, {
                  action: 'Rotate',
                  icon: 'rotate',
                  direction: 'right',
                  disabled: false
                }]
              ].map((row, index) => (
                <div className="cropper-control-row" key={index}>
                  {row.map((button) => (
                    <button className={classNames(moveControlClass, { disabled: button.disabled })} type="button" onClick={() => this.handleMoveOrRotate(`${button.action} ${button.direction}`)} key={button.direction}>
                      <span className="cropper-control-label">{`${button.action} ${button.direction}`}<i className={`fa fa-${button.icon}-${button.direction}`}></i></span>
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
          {fieldView === 'initial' && <div className="drop-target-container">
            <Dropzone
              className={`drop-target ${this.state.dragActive && 'drag-active'}`}
              onDragEnter={() => this.handleDrag({ dragActive: true })}
              onDragLeave={() => this.handleDrag({ dragActive: false })}
              onDrop={this.onChange}
              accept="image/jpeg, image/jpg, image/png, image/tiff, image/tif, image/bmp">
              {this.state.dragActive ?
                <div className="drag-active-text"><span>DROP PHOTO</span></div> :
                <img alt="placeholder" src="/img/photo-placeholder.png"/>}
            </Dropzone>
          </div>}
          <div className={uploadControlClass}>
            {fieldView === 'preview' && <button
              className="photo-preview-link va-button-link"
              type="button"
              onClick={this.resetFile}>
              Go back and change your photo
            </button>}
            {fieldView === 'preview' && <button
              className="photo-preview-link va-button-link"
              type="button"
              aria-describedby="editButtonDescription"
              onClick={this.onEdit}>
              Edit your photo
            </button>}
            {(fieldView === 'initial' || fieldView === 'cropper') && <ErrorableFileInput
              accept={fileTypes.map(type => `.${type}`).join(',')}
              onChange={this.onChange}
              buttonText={uploadMessage}
              aria-describedby="croppingToolDescription"
              name="fileUpload"/>}
            {fieldView === 'initial' && <ErrorableFileInput
              accept={fileTypes.map(type => `.${type}`).join(',')}
              onChange={this.onChangeScreenReader}
              buttonText="Screen reader friendly photo upload tool"
              aria-describedby="screenReaderPathDescription"
              triggerClass="va-button-link"
              name="screenReaderFileUpload"/>}
            {fieldView === 'error' && <ErrorableFileInput
              accept={fileTypes.map(type => `.${type}`).join(',')}
              onChange={this.onChangeScreenReader}
              buttonText="Upload Photo Again"
              name="screenReaderFileUpload"/>}
          </div>
          <span className="sr-only" id="croppingToolDescription">This button will take you to a photo cropping tool which requires sight to use. The recommended path for screen readers is to use the screen-reader friendly upload tool button.</span>
          <span className="sr-only" id="editButtonDescription">This button will take you into a photo cropping tool, which requires sight to use. This button is not recommended if you are using a screen reader.</span>
          <span className="sr-only" id="screenReaderPathDescription">This is the recommended path if you are using a screen reader. It will allow you to upload your photo without having to crop, as long as you have a photo that is square and at least 350 pixels wide.</span>
        </div>
      </fieldset>
    );
  }
}
