import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

/*
 * Component that expands to show a hidden child element with a fade in/slide down animation
 *
 * Props:
 * children - expects 2 children, the first is always shown, the second is shown if open is true
 * open - determines if the second child is displayed
 * additionalClass - A string added as a class to the parent element of the second child
 */
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

ExpandingGroup.propTypes = {
  open: React.PropTypes.bool,
  additionalClass: React.PropTypes.string
};
