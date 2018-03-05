import React from 'react';
import Cropper from 'react-cropper';
import classNames from 'classnames';

const MIN_SIZE = 350;
const SMALL_CROP_BOX_SIZE = 240;
const LARGE_CROP_BOX_SIZE = 300;
const WARN_RATIO = 1.3;
const MAX_CROPPED_HEIGHT_WIDTH = 600;

const moveControlClass = ['cropper-control', 'cropper-control-label-container', 'va-button-link'];

function getMoveButtonsDisabled({ topBoundaryMet, bottomBoundaryMet, rightBoundaryMet, leftBoundaryMet }) {
  return {
    moveUpDisabled: bottomBoundaryMet,
    moveDownDisabled: topBoundaryMet,
    moveLeftDisabled: rightBoundaryMet,
    moveRightDisabled: leftBoundaryMet
  };
}

function getWarningMessage(boundariesMet) {
  if (boundariesMet.highZoom) {
    return 'If you zoom in this close, your ID photo will be less clear.';
  }

  const { topBoundaryMet, bottomBoundaryMet, leftBoundaryMet, rightBoundaryMet } = boundariesMet;

  // min zoom
  if ((topBoundaryMet && bottomBoundaryMet) || (leftBoundaryMet && rightBoundaryMet)) {
    return 'Your photo currently fits within the square frame. If you’d like to adjust the position of your photo, click Make larger.';
  }

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

  return direction ?
    `You have reached the edge of your photo and can't move it any farther ${direction}. To continue to edit your photo, click on the other arrows to move it or to make it larger.` :
    '';
}

function getPhotoBoundaries({ photoData, cropBoxData }) {
  const { width: photoWidth, height: photoHeight } =  photoData;
  const { left: cropBoxLeft, top: cropBoxTop, width: cropBoxWidth, height: cropBoxHeight } =  cropBoxData;

  return {
    leftMin: cropBoxLeft + cropBoxWidth - photoWidth,
    leftMax: cropBoxLeft,
    topMin: cropBoxTop + cropBoxHeight - photoHeight,
    topMax: cropBoxTop
  };
}

function getDefaultPhotoPosition({ photoData, cropBoxData, containerWidth }) {
  // use the cropbox dimensions to force canvas into default position
  const { height: cropBoxHeight, width: cropBoxWidth, left: cropBoxLeft } =  cropBoxData;
  const { width: oldPhotoWidth, height: oldPhotoHeight, naturalHeight, naturalWidth } = photoData;
  // wide images are centered and set to the height of the crop box
  if (naturalHeight < naturalWidth) {
    return {
      height: cropBoxHeight,
      top: 0,
      left: (containerWidth - (cropBoxHeight / oldPhotoHeight * oldPhotoWidth)) / 2
    };
  }

  // narrow images are move to the top and set to the width of the cropbox
  return {
    width: cropBoxWidth,
    left: cropBoxLeft,
    top: 0
  };
}

function getNewPhotoPosition({ photoData, boundaries, x, y }) {
  const { left, top } =  photoData;

  const newPhotoPosition = {
    left: x ? x + left : left,
    top: y ? y + top : top,
  };

  if (boundaries.topMin === boundaries.topMax) {
    newPhotoPosition.top = boundaries.topMin;
  } else if (newPhotoPosition.top > boundaries.topMax) {
    newPhotoPosition.top = boundaries.topMax;
  } else if (newPhotoPosition.top  < boundaries.topMin) {
    newPhotoPosition.top = boundaries.topMin;
  }

  if (boundaries.leftMin === boundaries.leftMax) {
    newPhotoPosition.left = boundaries.leftMin;
  } else if (newPhotoPosition.left > boundaries.leftMax) {
    newPhotoPosition.left = boundaries.leftMax;
  } else if (newPhotoPosition.left < boundaries.leftMin) {
    newPhotoPosition.left = boundaries.leftMin;
  }

  return newPhotoPosition;
}

const MoveRotateButton = ({
  disabled = false,
  onClick,
  label,
  iconClassName
}) => (
  <button className={classNames(moveControlClass, { disabled })} type="button" onClick={onClick}>
    <span className="cropper-control-label">{label}<i className={iconClassName}></i></span>
  </button>);

export default class CropperControls extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      zoomMin: 0.2,
      zoomMax: 1.7,
      zoomValue: 0
    };
  }

  onCropstart = (e) => {
    // prevents dragging of crop box edges
    const action = e.detail.action;
    const allowedActions = ['crop', 'move', 'zoom', 'all'];

    if (!allowedActions.includes(action)) {
      e.preventDefault();
    }
  }

  onCropend = () => {
    window.requestAnimationFrame(() => {
      this.movePhoto();
      const boundariesMet = this.getBoundariesMet();
      const warningMessage = getWarningMessage(boundariesMet);
      const buttonsDisabled = getMoveButtonsDisabled(boundariesMet);

      this.setState({
        warningMessage,
        ...buttonsDisabled
      });
    });
  }

  onDone = () => {
    const croppedCanvasOptions = this.refs.cropper.getData().width > MAX_CROPPED_HEIGHT_WIDTH ?
      { width: MAX_CROPPED_HEIGHT_WIDTH, height: MAX_CROPPED_HEIGHT_WIDTH } :
      {};

    croppedCanvasOptions.imageSmoothingQuality = 'high';

    this.refs.cropper.getCroppedCanvas(croppedCanvasOptions).toBlob(blob => {
      this.props.onPhotoCropped(blob);
    });
  }

  onSliderChange = (e) => {
    this.refs.cropper.zoomTo(e.target.value);
  }

  onSliderMouseMove = (e) => {
    if (this.mouseDown) {
      this.onSliderChange(e);
    }
  }

  onSliderMouseDown = (e) => {
    this.mouseDown = true;
    if (e.target.value !== this.state.zoomValue) {
      this.onSliderChange(e);
    }
  }

  onSliderMouseUp = () => {
    this.mouseDown = false;
  }

  onZoom = (e) => {
    // Cropper returns the attempted zoom value
    const zoomValue = e.detail.ratio;

    // check if zoom is out of bounds
    let zoomBoundaryValue;
    if (zoomValue < this.state.zoomMin) {
      zoomBoundaryValue = this.state.zoomMin;
    } else if (zoomValue > this.state.zoomMax) {
      zoomBoundaryValue = this.state.zoomMax;
    }

    // force zoom within zoom bounds
    if (zoomBoundaryValue) {
      this.refs.cropper.zoomTo(zoomBoundaryValue); // force zoom within constraints
      e.preventDefault(); // prevents bad zoom attempt
      return; // don't update state until the subsequent zoom attempt
    }

    // zoom value is good- update the state / messaging
    this.setState({ zoomValue });


    window.requestAnimationFrame(() => {
      // move photo within bounds
      this.movePhoto();

      // update warnings and buttons enabled state
      const boundariesMet = this.getBoundariesMet();
      const warningMessage = getWarningMessage(boundariesMet);
      const buttonsDisabled = getMoveButtonsDisabled(boundariesMet);

      this.setState({
        warningMessage,
        ...buttonsDisabled
      });
    });
  }

  // examines photo and cropper positions to determine if photo is at any edges
  getBoundariesMet = () => {
    const photoData = this.refs.cropper.getCanvasData();
    const cropBoxData = this.refs.cropper.getCropBoxData();
    const boundaries = getPhotoBoundaries({ photoData, cropBoxData });
    const croppedPhotoWidth = this.refs.cropper.getData().width;

    const highZoom = croppedPhotoWidth < MIN_SIZE || this.state.zoomValue > WARN_RATIO;

    const boundariesMet = {
      bottomBoundaryMet: false,
      topBoundaryMet: false,
      leftBoundaryMet: false,
      rightBoundaryMet: false,
      highZoom
    };

    if (boundaries.topMin === boundaries.topMax) {
      boundariesMet.topBoundaryMet = true;
      boundariesMet.bottomBoundaryMet = true;
    } else if (photoData.top >= boundaries.topMax) {
      boundariesMet.topBoundaryMet = true;
    } else if (photoData.top  <= boundaries.topMin) {
      boundariesMet.bottomBoundaryMet = true;
    }

    if (boundaries.leftMin === boundaries.leftMax) {
      boundariesMet.leftBoundaryMet = true;
      boundariesMet.rightBoundaryMet = true;
    } else if (photoData.left >= boundaries.leftMax) {
      boundariesMet.leftBoundaryMet = true;
    } else if (photoData.left <= boundaries.leftMin) {
      boundariesMet.rightBoundaryMet = true;
    }

    return boundariesMet;
  }

  setCropBox = () => {
    // sometimes this callback is called before the new cropper has mounted
    // check if the cropper instance has canvasData before setting its values
    // center the cropbox using container width
    const containerWidth = this.refs.cropper.getContainerData().width;
    const left = this.props.narrowLayout ? (containerWidth / 2) - 120 : (containerWidth / 2) - 150;
    const heightWidth = this.props.narrowLayout ? SMALL_CROP_BOX_SIZE : LARGE_CROP_BOX_SIZE;

    this.refs.cropper.setCropBoxData({
      top: 0,
      left,
      height: heightWidth,
      width: heightWidth
    });

    const defaultPhotoPosition = getDefaultPhotoPosition({
      photoData: this.refs.cropper.getCanvasData(),
      cropBoxData: this.refs.cropper.getCropBoxData(),
      containerWidth: this.refs.cropper.getContainerData().width
    });

    this.movePhotoToPosition(defaultPhotoPosition);

    // calculate new min ratio and warnings after photo is moved
    window.requestAnimationFrame(() => {
      const photoData = this.refs.cropper.getCanvasData();
      const zoomMin = photoData.width / photoData.naturalWidth;

      const boundariesMet = this.getBoundariesMet();
      const warningMessage = getWarningMessage(boundariesMet);
      const buttonsDisabled = getMoveButtonsDisabled(boundariesMet);

      this.setState({
        zoomMin,
        warningMessage,
        zoomValue: zoomMin,
        ...buttonsDisabled
      });
    });
  }

  movePhotoToPosition = (position) => {
    window.requestAnimationFrame(() => {
      this.refs.cropper.setCanvasData(position);
    });
  }

  movePhoto = ({ x = 0, y = 0 } = {}) => {
    const photoData = this.refs.cropper.getCanvasData();
    const cropBoxData = this.refs.cropper.getCropBoxData();
    const boundaries = getPhotoBoundaries({ photoData, cropBoxData });

    const newPhotoPosition = getNewPhotoPosition({ photoData, boundaries, x, y });

    this.movePhotoToPosition(newPhotoPosition);
  }

  rotatePhoto = (degrees) => {
    // rotate
    this.refs.cropper.rotate(degrees);

    const defaultPhotoPosition = getDefaultPhotoPosition({
      photoData: this.refs.cropper.getCanvasData(),
      cropBoxData: this.refs.cropper.getCropBoxData(),
      containerWidth: this.refs.cropper.getContainerData().width
    });

    this.movePhotoToPosition(defaultPhotoPosition);

    // calculate new min ratio and warnings after photo is moved
    window.requestAnimationFrame(() => {

      const photoData = this.refs.cropper.getCanvasData();
      const zoomMin = photoData.width / photoData.naturalWidth;

      const boundariesMet = this.getBoundariesMet();
      const warningMessage = getWarningMessage(boundariesMet);
      const buttonsDisabled = getMoveButtonsDisabled(boundariesMet);

      this.setState({
        zoomMin,
        warningMessage,
        zoomValue: zoomMin,
        ...buttonsDisabled
      });
    });
  }

  zoomPhoto = (direction) => {
    switch (direction) {
      case 'IN':
        if (this.state.zoomValue < this.state.zoomMax) {
          this.refs.cropper.zoom(0.1);
        }
        break;
      case 'OUT':
        if (this.state.zoomValue > this.state.zoomMin) {
          this.refs.cropper.zoom(-0.1);
        }
        break;
      default:
    }
  }

  render() {
    return (
      <div className="cropper-container-outer">
        <Cropper
          ref="cropper"
          key={this.props.narrowLayout ? 'narrowLayout' : 'normalLayout'}
          ready={this.setCropBox}
          responsive
          src={this.props.src}
          aspectRatio={1}
          cropBoxMovable={false}
          cropstart={this.onCropstart}
          cropend={this.onCropend}
          cropmove={() => true}
          minContainerHeight={this.props.narrowLayout ? SMALL_CROP_BOX_SIZE : LARGE_CROP_BOX_SIZE}
          toggleDragModeOnDblclick={false}
          dragMode="move"
          guides={false}
          viewMode={0}
          zoom={this.onZoom}/>
        <div className="cropper-zoom-container">
          <button className="cropper-control cropper-control-zoom cropper-control-zoom-in va-button va-button-link" type="button" onClick={() => this.zoomPhoto('OUT')}>
            <span className="cropper-control-label">{this.props.narrowLayout || 'Make smaller'}<i className="fa fa-search-minus"></i></span>
          </button>
          <input type="range"
            className="cropper-zoom-slider"
            min={this.state.zoomMin}
            max={this.state.zoomMax}
            step="0.01"
            aria-valuemin={this.state.zoomMin}
            aria-valuemax={this.state.zoomMax}
            aria-valuenow={this.state.zoomValue}
            onMouseDown={this.onSliderMouseDown}
            onMouseUp={this.onSliderMouseUp}
            onMouseMove={this.onSliderMouseMove}
            onChange={this.onSliderChange}
            value={this.state.zoomValue}/>
          <button className="cropper-control cropper-control-zoom cropper-control-zoom-in va-button va-button-link" type="button" onClick={() => this.zoomPhoto('IN')}>
            <span className="cropper-control-label">{this.props.narrowLayout || 'Make larger'}<i className="fa fa-search-plus"></i></span>
          </button>
        </div>
        <div className="cropper-control-container">
          {this.props.narrowLayout && <div className="cropper-control-row">
            <button className="cropper-control cropper-control-label-container va-button va-button-link" type="button" onClick={() => this.zoomPhoto('OUT')}>
              <span className="cropper-control-label">Make smaller</span>
            </button>
            <button className="cropper-control cropper-control-label-container va-button va-button-link" type="button" onClick={() => this.zoomPhoto('IN')}>
              <span className="cropper-control-label">Make larger</span>
            </button>
          </div>}
          <div className="cropper-control-row">
            <MoveRotateButton disabled={this.state.moveUpDisabled} onClick={() => this.movePhoto({ y: -5 })} label="Move up" iconClassName="fa fa-arrow-up"/>
            <MoveRotateButton disabled={this.state.moveDownDisabled} onClick={() => this.movePhoto({ y: 5 })} label="Move down" iconClassName="fa fa-arrow-down"/>
          </div>
          <div className="cropper-control-row">
            <MoveRotateButton disabled={this.state.moveLeftDisabled} onClick={() => this.movePhoto({ x: -5 })} label="Move left" iconClassName="fa fa-arrow-left"/>
            <MoveRotateButton disabled={this.state.moveRightDisabled} onClick={() => this.movePhoto({ x: 5 })} label="Move right" iconClassName="fa fa-arrow-right"/>
          </div>
          <div className="cropper-control-row">
            <MoveRotateButton onClick={() => this.rotatePhoto(-90)} label="Rotate left" iconClassName="fa fa-rotate-left"/>
            <MoveRotateButton onClick={() => this.rotatePhoto(90)} label="Rotate left" iconClassName="fa fa-rotate-right"/>
          </div>
        </div>
        <div style={{ margin: '1em 1em 4em' }}>
          {this.props.warningMessage && <div className="photo-warning">{this.props.warningMessage}</div>}
        </div>
        <div style={{ margin: '1em 1em 4em' }}>
          {this.props.warningMessage && <div className="photo-warning">{this.props.warningMessage}</div>}
        </div>
        <div className="crop-button-container">
          <button type="button" className="usa-button-primary" onClick={this.onDone}>
            I’m Done
          </button>
        </div>
      </div>
    );
  }
}

CropperControls.defaultValues = {
  narrowLayout: false
};

CropperControls.PropTypes = {
  narrowLayout: React.PropTypes.bool,
};
