import React from 'react';
import classNames from 'classnames';

const moveControlClass = ['cropper-control', 'cropper-control-label-container', 'va-button-link'];

const CropperControls = ({
  disableMoveDown,
  disableMoveLeft,
  disableMoveRight,
  disableMoveUp,
  moveDown,
  moveLeft,
  moveRight,
  moveUp,
  narrowLayout,
  onSliderChange,
  onSliderMouseDown,
  onSliderMouseMove,
  onSliderMouseUp,
  rotateLeft,
  rotateRight,
  sliderMaxValue,
  sliderMinValue,
  sliderValue,
  zoomIn,
  zoomOut
}) => (
  <div>
    <div className="cropper-zoom-container">
      {narrowLayout && <button className="cropper-control cropper-control-zoom cropper-control-zoom-out va-button va-button-link" type="button" onClick={zoomOut}><i className="fa fa-search-minus"></i></button>}
      {!narrowLayout && <button className="cropper-control cropper-control-zoom cropper-control-zoom-out va-button va-button-link" type="button" onClick={zoomOut}>
        <span className="cropper-control-label">Make smaller<i className="fa fa-search-minus"></i></span>
      </button>}
      <input type="range"
        className="cropper-zoom-slider"
        min={sliderMinValue}
        max={sliderMaxValue}
        step="0.01"
        aria-valuemin={sliderMinValue}
        aria-valuemax={sliderMaxValue}
        aria-valuenow={sliderValue}
        onMouseDown={onSliderMouseDown}
        onMouseUp={onSliderMouseUp}
        onMouseMove={onSliderMouseMove}
        onChange={onSliderChange}
        value={sliderValue}/>
      {narrowLayout && <button className="cropper-control cropper-control-zoom cropper-control-zoom-in va-button va-button-link" type="button" onClick={zoomIn}><i className="fa fa-search-plus"></i></button>}
      {!narrowLayout && <button className="cropper-control cropper-control-zoom cropper-control-zoom-in va-button va-button-link" type="button" onClick={zoomIn}>
        <span className="cropper-control-label">Make larger<i className="fa fa-search-plus"></i></span>
      </button>}
    </div>
    <div className="cropper-control-container">
      <div className="cropper-control-row">
        {narrowLayout && <button className="cropper-control cropper-control-label-container va-button va-button-link" type="button" onClick={zoomOut}>
          <span className="cropper-control-label">Make smaller</span>
        </button>}
        {narrowLayout && <button className="cropper-control cropper-control-label-container va-button va-button-link" type="button" onClick={zoomIn}>
          <span className="cropper-control-label">Make larger</span>
        </button>}
      </div>
      <div className="cropper-control-row">
        <button className={classNames(moveControlClass, { disabled: disableMoveUp })} type="button" onClick={moveUp}>
          <span className="cropper-control-label">Move up<i className="fa fa-arrow-up"></i></span>
        </button>
        <button className={classNames(moveControlClass, { disabled: disableMoveDown })} type="button" onClick={moveDown}>
          <span className="cropper-control-label">Move down<i className="fa fa-arrow-down"></i></span>
        </button>
      </div>
      <div className="cropper-control-row">
        <button className={classNames(moveControlClass, { disabled: disableMoveLeft })} type="button" onClick={moveLeft}>
          <span className="cropper-control-label">Move left<i className="fa fa-arrow-left"></i></span>
        </button>
        <button className={classNames(moveControlClass, { disabled: disableMoveRight })} type="button" onClick={moveRight}>
          <span className="cropper-control-label">Move right<i className="fa fa-arrow-right"></i></span>
        </button>
      </div>
      <div className="cropper-control-row">
        <button className={classNames(moveControlClass)} type="button" onClick={rotateLeft}>
          <span className="cropper-control-label">Rotate left<i className="fa fa-rotate-left"></i></span>
        </button>
        <button className={classNames(moveControlClass)} type="button" onClick={rotateRight}>
          <span className="cropper-control-label">Rotate right<i className="fa fa-rotate-right"></i></span>
        </button>
      </div>
      <div className="cropper-control-row">
      </div>
    </div>
  </div>
);

CropperControls.defaultValues = {
  narrowLayout: false
}

CropperControls.PropTypes = {
  disableMoveUp: React.PropTypes.bool,
  disableMoveDown: React.PropTypes.bool,
  disableMoveRight: React.PropTypes.bool,
  disableMoveLeft: React.PropTypes.bool,
  move: React.PropTypes.func,
  onSliderChange: React.PropTypes.func,
  onSliderMouseDown: React.PropTypes.func,
  onSliderMouseMove: React.PropTypes.func,
  onSliderMouseUp: React.PropTypes.func,
  rotate: React.PropTypes.func,
  narrowLayout: React.PropTypes.bool,
  sliderMaxValue: React.PropTypes.number,
  sliderMinValue: React.PropTypes.number,
  sliderValue: React.PropTypes.number,
  zoom: React.PropTypes.func
};

export default CropperControls;
