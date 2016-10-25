import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import classnames from 'classnames';

/*
 * Component that expands to show a hidden child element with a fade in/slide down animation
 *
 * Props:
 * children - expects 2 children, the first is always shown, the second is shown if open is true
 * open - determines if the second child is displayed
 * additionalClass - A string added as a class to the parent element of the second child
 * showPlus - Boolean to display a "+" or "-" icon based on open status
 */
export default function ExpandingGroup({ children, open, showPlus, additionalClass }) {
  const classNames = classnames(
    'form-expanding-group',
    { 'form-expanding-group-open': open },
    { 'form-expanding-group-plus': showPlus }
  );

  return (
    <div className={classNames}>
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
  additionalClass: React.PropTypes.string,
  showPlus: React.PropTypes.bool
};
