import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

export default function ExpandingGroup({ children, open, additionalClass }) {
  return (
    <div className={open ? 'form-expanding-group form-expanding-group-open' : 'form-expanding-group'}>
      {children[0]}
      <ReactCSSTransitionGroup transitionName="form-expanding-group-inner" transitionEnterTimeout={700} transitionLeaveTimeout={500}>
        {open
          ? <div key="removable-group" className={additionalClass}>
            {children[1]}
          </div>
          : null}
      </ReactCSSTransitionGroup>
    </div>
  );
}
