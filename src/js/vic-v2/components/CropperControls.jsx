import React from 'react';
import classNames from 'classnames';

const moveControlClass = ['cropper-control', 'cropper-control-label-container', 'va-button-link'];

const MoveRotateButton = ({
  disabled = false,
  onClick,
  label,
  iconClassName
}) => (
  <button className={classNames(moveControlClass, { disabled })} type="button" onClick={onClick}>
    <span className="cropper-control-label">{label}<i className={iconClassName}></i></span>
  </button>);

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
      <button className="cropper-control cropper-control-zoom cropper-control-zoom-in va-button va-button-link" type="button" onClick={zoomOut}>
        <span className="cropper-control-label">{narrowLayout || 'Make smaller'}<i className="fa fa-search-minus"></i></span>
      </button>
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
      <button className="cropper-control cropper-control-zoom cropper-control-zoom-in va-button va-button-link" type="button" onClick={zoomIn}>
        <span className="cropper-control-label">{narrowLayout || 'Make larger'}<i className="fa fa-search-plus"></i></span>
      </button>
    </div>
    <div className="cropper-control-container">
      {narrowLayout && <div className="cropper-control-row">
        <button className="cropper-control cropper-control-label-container va-button va-button-link" type="button" onClick={zoomOut}>
          <span className="cropper-control-label">Make smaller</span>
        </button>
        <button className="cropper-control cropper-control-label-container va-button va-button-link" type="button" onClick={zoomIn}>
          <span className="cropper-control-label">Make larger</span>
        </button>
      </div>}
      <div className="cropper-control-row">
        <MoveRotateButton disabled={disableMoveUp} onClick={moveUp} label="Move up" iconClassName="fa fa-arrow-up"/>
        <MoveRotateButton disabled={disableMoveDown} onClick={moveDown} label="Move down" iconClassName="fa fa-arrow-down"/>
      </div>
      <div className="cropper-control-row">
        <MoveRotateButton disabled={disableMoveLeft} onClick={moveLeft} label="Move left" iconClassName="fa fa-arrow-left"/>
        <MoveRotateButton disabled={disableMoveRight} onClick={moveRight} label="Move right" iconClassName="fa fa-arrow-right"/>
      </div>
      <div className="cropper-control-row">
        <MoveRotateButton onClick={rotateLeft} label="Rotate left" iconClassName="fa fa-rotate-left"/>
        <MoveRotateButton onClick={rotateRight} label="Rotate left" iconClassName="fa fa-rotate-right"/>
      </div>
      <div className="cropper-control-row">
      </div>
    </div>
  </div>
);

CropperControls.defaultValues = {
  narrowLayout: false
};

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
