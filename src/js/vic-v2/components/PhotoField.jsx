import React from 'react';
import Cropper from 'react-cropper';
import Dropzone from 'react-dropzone';
import classNames from 'classnames';
import ErrorableFileInput from '../../common/components/form-elements/ErrorableFileInput';
import ProgressBar from '../../common/components/ProgressBar';
import { scrollAndFocus } from '../../common/utils/helpers';

const MIN_SIZE = 350;
const MIN_RATIO = 0.2;
const MAX_RATIO = 1.7;
const WARN_RATIO = 1.3;
const LARGE_SCREEN = 1201;

function getMoveBoundariesMet(canvasData, cropboxData) {
  const { height: canvasHeight, width: canvasWidth, left: canvasLeft, top: canvasTop } = canvasData;
  const { height: cropboxHeight, width: cropboxWidth, left: cropboxLeft, top: cropboxTop } = cropboxData;

  // origin is at center
  // coodinates are for canvas's container
  const canvasBoundaries = {
    minLeft: Math.round(-canvasWidth + cropboxLeft + cropboxWidth, 2),
    maxLeft: Math.round(cropboxLeft, 2),
    minTop: Math.round(-canvasHeight + cropboxTop + cropboxHeight, 2),
    maxTop: Math.round(cropboxTop, 2),
  };

  return {
    bottomBoundaryMet: Math.round(canvasTop, 2) === canvasBoundaries.minTop,
    topBoundaryMet: Math.round(canvasTop, 2) === canvasBoundaries.maxTop,
    leftBoundaryMet: Math.round(canvasLeft, 2) === canvasBoundaries.maxLeft,
    rightBoundaryMet: Math.round(canvasLeft, 2) === canvasBoundaries.minLeft
  };
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

export default class PhotoField extends React.Component {
  constructor(props) {
    super(props);
    const formData = props.formData || {};
    let previewSrc;
    if (formData.file instanceof Blob) {
      previewSrc = window.URL.createObjectURL(formData.file);
    }

    this.state = {
      src: null,
      zoomValue: 0.4,
      warningMessage: null,
      progress: 0,
      isCropping: false,
      previewSrc
    };

    this.screenReaderPath = false;
  }

  componentWillMount() {
    this.detectDrag();
    this.detectWidth();
  }

  componentDidMount() {
    window.addEventListener('resize', this.detectWidth);
  }

  componentWillReceiveProps(nextProps) {
    const nextFormData = nextProps.formData || {};
    const prevFormData = this.props.formData || {};
    if (nextFormData.file instanceof Blob && nextFormData.file !== prevFormData.file) {
      if (this.state.previewSrc) {
        window.URL.revokeObjectURL(this.state.previewSrc);
      }
      this.setState({ previewSrc: window.URL.createObjectURL(nextFormData.file) });
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
    if (this.state.previewSrc) {
      window.URL.revokeObjectURL(this.state.previewSrc);
    }
    window.removeEventListener('resize', this.detectWidth);
  }

  onEdit = () => {
    this.setState({
      isCropping: true,
      fileName: this.props.formData.name,
      src: this.state.src || this.state.previewSrc,
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

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      loadImage(reader.result)
        .then((img) => {
          if (!isSquareImage(img)) {
            this.props.onChange({
              errorMessage: 'The photo you uploaded is not a square photo. Please upload a new one that fits the requirements.'
            });
          } else if (!isValidImageSize(img)) {
            this.props.onChange({
              errorMessage: 'The file you selected is smaller than the 350px minimum file width or height and could not be uploaded. Please try to upload a different photo.'
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

  onChange = (files) => {
    this.screenReaderPath = false;

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
                  errorMessage: 'The file you selected is smaller than the 350px minimum file width or height and could not be uploaded. Please try to upload a different photo.'
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
    const zoomValue = e.detail.ratio;
    if (zoomValue < MAX_RATIO && zoomValue > MIN_RATIO) {
      this.setState({ zoomValue });
      this.updateBoundaryWarningAndButtonStates();

      const moveBoundariesMet = getMoveBoundariesMet(this.refs.cropper.getCanvasData(), this.refs.cropper.getCropBoxData());
      const zoomWarn = zoomValue >= WARN_RATIO;

      this.setState({
        warningMessage: makeCropBoundaryWarningMessage({ zoomWarn, ...moveBoundariesMet }),
        ...makeMoveButtonsEnabledStates(moveBoundariesMet)
      });
    } else {
      e.preventDefault();
    }
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

  updateBoundaryWarningAndButtonStates = () => {
    const moveBoundariesMet = getMoveBoundariesMet(this.refs.cropper.getCanvasData(), this.refs.cropper.getCropBoxData());

    this.setState({
      warningMessage: makeCropBoundaryWarningMessage(moveBoundariesMet),
      ...makeMoveButtonsEnabledStates(moveBoundariesMet)
    });
  }

  handleCropend = () => { // casing matches Cropper argument
    this.updateBoundaryWarningAndButtonStates();
  }

  handleMove = (direction) => {
    switch (direction) {
      case 'up':
        this.refs.cropper.move(0, -5);
        break;
      case 'down':
        this.refs.cropper.move(0, 5);
        break;
      case 'right':
        this.refs.cropper.move(5, 0);
        break;
      case 'left':
        this.refs.cropper.move(-5, 0);
        break;
      default:
    }

    this.updateBoundaryWarningAndButtonStates();
  }

  handleZoomButtonClick = (direction) => {
    switch (direction) {
      case 'IN':
        if (this.state.zoomValue < MAX_RATIO) {
          this.refs.cropper.zoom(0.1);
        }
        break;
      case 'OUT':
        if (this.state.zoomValue > MIN_RATIO) {
          this.refs.cropper.zoom(-0.1);
        }
        break;
      default:
    }
  }

  render() {
    const file = this.props.formData || {};
    const { isCropping } = this.state;
    const hasFile = !!file.confirmationCode;
    const errorMessage = file.errorMessage;
    const screenReaderError = this.screenReaderPath && !!errorMessage;
    const label = this.props.uiSchema['ui:title'];
    const smallScreen = isSmallScreen(this.state.windowWidth);
    const moveControlClass = ['cropper-control', 'cropper-control-label-container', 'va-button-link'];
    const fileTypes = this.props.uiSchema['ui:options'].fileTypes;
    const progressBarContainerClass = classNames('schemaform-file-uploading', 'progress-bar-container');

    let fieldView;
    if (isCropping) {
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
      instruction = <span><strong>Step 2 of 2:</strong> Fit your head and shoulders in the frame</span>;
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
            This is a photo editing tool that requires sight to use. If you are using a screen reader <button type="button" onClick={this.resetFile}>go back one step to upload your photo without cropping.</button>
          </span>}
          <div>
            {errorMessage && <div role="alert" className="usa-input-error-message photo-error-message">{errorMessage}</div>}
            {instruction}
            {description}
            {fieldView === 'preview' && !!this.state.previewSrc && <img
              className="photo-preview"
              src={this.state.previewSrc}
              alt="Photograph of you that will be displayed on the ID card"/>
            }
          </div>
          {file.uploading && <div className={progressBarContainerClass}>
            <span>{this.state.fileName}</span><br/>
            <ProgressBar percent={this.state.progress}/>
          </div>}
          {fieldView === 'cropper' && <div className="cropper-container-outer">
            <Cropper
              ref="cropper"
              ready={this.setCropBox}
              responsive
              src={this.state.src}
              aspectRatio={1}
              cropBoxMovable={false}
              cropend={this.handleCropend}
              toggleDragModeOnDblclick={false}
              dragMode="move"
              guides={false}
              viewMode={1}
              zoom={this.onZoom}/>
            <div className="cropper-zoom-container">
              {smallScreen && <button className="cropper-control cropper-control-zoom cropper-control-zoom-out va-button va-button-link" type="button" onClick={() => this.handleZoomButtonClick('OUT')}><i className="fa fa-search-minus"></i></button>}
              {!smallScreen && <button className="cropper-control cropper-control-zoom cropper-control-zoom-out va-button va-button-link" type="button" onClick={() => this.handleZoomButtonClick('OUT')}>
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
          {fieldView === 'initial' && <div className="drop-target-container">
            <Dropzone className="drop-target" onDrop={this.onChange} accept="image/jpeg, image/jpg, image/png, image/tiff, image/tif, image/bmp">
              <img alt="placeholder" src="/img/photo-placeholder.png"/>
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
              buttonText="Upload Again"
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
