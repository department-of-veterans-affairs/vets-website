import React from 'react';

const CropperControls = ({
  moveUpDisabled,
  moveDownDisabled,
  moveRightDisabled,
  moveLeftDisabled,
  move,
  rotate,
  zoom
}) => (
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
);

CropperControlls.propTypes = {
  moveUpDisabled: React.propTypes.bool,
  moveDownDisabled: React.propTypes.bool,
  moveRightDisabled: React.propTypes.bool,
  moveLeftDisabled: React.propTypes.bool,
  move: React.propTypes.func,
  rotate: React.propTypes.func,
  zoom: React.propTypes.func,
};

export default CropperControls;
