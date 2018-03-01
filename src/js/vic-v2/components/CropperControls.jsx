import React from 'react';
import classNames from 'classnames';

const moveControlClass = ['cropper-control', 'cropper-control-label-container', 'va-button-link'];

const CropperControls = ({
  maxRatio,
  minRatio,
  moveUpDisabled,
  moveDownDisabled,
  moveRightDisabled,
  moveLeftDisabled,
  move,
  onChange,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  rotate,
  smallScreen,
  zoom,
  zoomValue
}) => (
  <div>
    <div className="cropper-zoom-container">
      {smallScreen && <button className="cropper-control cropper-control-zoom cropper-control-zoom-out va-button va-button-link" type="button" onClick={() => zoom('OUT')}><i className="fa fa-search-minus"></i></button>}
      {!smallScreen && <button className="cropper-control cropper-control-zoom cropper-control-zoom-out va-button va-button-link" type="button" onClick={() => zoom('OUT')}>
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
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseMove={onMouseMove}
        onChange={onChange}
        value={zoomValue}
      />
      {smallScreen && <button className="cropper-control cropper-control-zoom cropper-control-zoom-in va-button va-button-link" type="button" onClick={() => zoom('IN')}><i className="fa fa-search-plus"></i></button>}
      {!smallScreen && <button className="cropper-control cropper-control-zoom cropper-control-zoom-in va-button va-button-link" type="button" onClick={() => zoom('IN')}>
        <span className="cropper-control-label">Make larger<i className="fa fa-search-plus"></i></span>
      </button>}
    </div>
    <div className="cropper-control-container">
      <div className="cropper-control-row">
        {smallScreen && <button className="cropper-control cropper-control-label-container va-button va-button-link" type="button" onClick={() => zoom('OUT')}>
          <span className="cropper-control-label">Make smaller</span>
        </button>}
        {smallScreen && <button className="cropper-control cropper-control-label-container va-button va-button-link" type="button" onClick={() => zoom('IN')}>
          <span className="cropper-control-label">Make larger</span>
        </button>}
      </div>
      {[
        [{
          action: 'Move',
          icon: 'arrow',
          direction: 'up',
          disabled: moveUpDisabled
        }, {
          action: 'Move',
          icon: 'arrow',
          direction: 'down',
          disabled: moveDownDisabled
        }],
        [{
          action: 'Move',
          icon: 'arrow',
          direction: 'left',
          disabled: moveLeftDisabled
        }, {
          action: 'Move',
          icon: 'arrow',
          direction: 'right',
          disabled: moveRightDisabled
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

CropperControls.PropTypes = {
  maxRatio: React.PropTypes.number,
  minRatio: React.PropTypes.number,
  moveUpDisabled: React.PropTypes.bool,
  moveDownDisabled: React.PropTypes.bool,
  moveRightDisabled: React.PropTypes.bool,
  moveLeftDisabled: React.PropTypes.bool,
  move: React.PropTypes.func,
  onChange: React.PropTypes.func,
  onMouseDown: React.PropTypes.func,
  onMouseMove: React.PropTypes.func,
  onMouseUp: React.PropTypes.func,
  rotate: React.PropTypes.func,
  smallScreen: React.PropTypes.bool,
  zoom: React.PropTypes.func,
  zoomValue: React.PropTypes.number
};

export default CropperControls;
