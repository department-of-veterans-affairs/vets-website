import React from 'react';
import classNames from 'classnames';

const moveControlClass = ['cropper-control', 'cropper-control-label-container', 'va-button-link'];

const CropperControls = ({
  disableMoveDown,
  disableMoveLeft,
  disableMoveRight,
  disableMoveUp,
  maxRatio,
  minRatio,
  move,
  onChange,
  onSliderMouseDown,
  onSliderMouseMove,
  onSliderMouseUp,
  rotate,
  narrowLayout,
  zoom,
  zoomValue
}) => (
  <div>
    <div className="cropper-zoom-container">
      {narrowLayout && <button className="cropper-control cropper-control-zoom cropper-control-zoom-out va-button va-button-link" type="button" onClick={() => zoom('OUT')}><i className="fa fa-search-minus"></i></button>}
      {!narrowLayout && <button className="cropper-control cropper-control-zoom cropper-control-zoom-out va-button va-button-link" type="button" onClick={() => zoom('OUT')}>
        <span className="cropper-control-label">Make smaller<i className="fa fa-search-minus"></i></span>
      </button>}
      <input type="range"
        className="cropper-zoom-slider"
        min={minRatio}
        max={maxRatio}
        step="0.01"
        aria-valuemin={minRatio}
        aria-valuemax={maxRatio}
        aria-valuenow={zoomValue}
        onMouseDown={onSliderMouseDown}
        onMouseUp={onSliderMouseUp}
        onMouseMove={onSliderMouseMove}
        onChange={onChange}
        value={zoomValue}/>
      {narrowLayout && <button className="cropper-control cropper-control-zoom cropper-control-zoom-in va-button va-button-link" type="button" onClick={() => zoom('IN')}><i className="fa fa-search-plus"></i></button>}
      {!narrowLayout && <button className="cropper-control cropper-control-zoom cropper-control-zoom-in va-button va-button-link" type="button" onClick={() => zoom('IN')}>
        <span className="cropper-control-label">Make larger<i className="fa fa-search-plus"></i></span>
      </button>}
    </div>
    <div className="cropper-control-container">
      <div className="cropper-control-row">
        {narrowLayout && <button className="cropper-control cropper-control-label-container va-button va-button-link" type="button" onClick={() => zoom('OUT')}>
          <span className="cropper-control-label">Make smaller</span>
        </button>}
        {narrowLayout && <button className="cropper-control cropper-control-label-container va-button va-button-link" type="button" onClick={() => zoom('IN')}>
          <span className="cropper-control-label">Make larger</span>
        </button>}
      </div>
      {[
        [{
          action: 'Move',
          icon: 'arrow',
          direction: 'up',
          disabled: disableMoveUp
        }, {
          action: 'Move',
          icon: 'arrow',
          direction: 'down',
          disabled: disableMoveDown
        }],
        [{
          action: 'Move',
          icon: 'arrow',
          direction: 'left',
          disabled: disableMoveLeft
        }, {
          action: 'Move',
          icon: 'arrow',
          direction: 'right',
          disabled: disableMoveRight
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
            <button className={classNames(moveControlClass, { disabled: button.disabled })} type="button" onClick={() => move(`${button.action} ${button.direction}`)} key={button.direction}>
              <span className="cropper-control-label">{`${button.action} ${button.direction}`}<i className={`fa fa-${button.icon}-${button.direction}`}></i></span>
            </button>))
          }
        </div>))
      }
    </div>
  </div>
);

CropperControls.defaultValues = {
  narrowLayout: false
}

CropperControls.PropTypes = {
  maxRatio: React.PropTypes.number,
  minRatio: React.PropTypes.number,
  disableMoveUp: React.PropTypes.bool,
  disableMoveDown: React.PropTypes.bool,
  disableMoveRight: React.PropTypes.bool,
  disableMoveLeft: React.PropTypes.bool,
  move: React.PropTypes.func,
  onChange: React.PropTypes.func,
  onSliderMouseDown: React.PropTypes.func,
  onSliderMouseMove: React.PropTypes.func,
  onSliderMouseUp: React.PropTypes.func,
  rotate: React.PropTypes.func,
  narrowLayout: React.PropTypes.bool,
  zoom: React.PropTypes.func,
  zoomValue: React.PropTypes.number
};

export default CropperControls;
