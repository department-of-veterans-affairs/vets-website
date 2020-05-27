import React from 'react';
import PropTypes from 'prop-types';
import ReactCSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
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
export default function ExpandingGroup({
  children,
  open,
  showPlus,
  additionalClass,
  expandedContentId,
}) {
  const classNames = classnames(
    'form-expanding-group',
    { 'form-expanding-group-open': open.includes(true) },
    { 'form-expanding-group-plus': showPlus },
  );

  return (
    <div className={classNames}>
      {children[0]}
      <ReactCSSTransitionGroup
        id={expandedContentId}
        transitionName="form-expanding-group-inner"
        transitionEnterTimeout={700}
        transitionLeave={false}
      >
        {children.slice(1).map(
          (child, index) =>
            open[index] ? (
              <div key={`removable-group-${index}`} className={additionalClass}>
                {child}
              </div>
            ) : null,
        )}
      </ReactCSSTransitionGroup>
    </div>
  );
}

ExpandingGroup.propTypes = {
  /**
   * show second child
   */
  open: PropTypes.arrayOf(PropTypes.bool).isRequired,
  /**
   * class added to parent element second child component
   */
  additionalClass: PropTypes.string,
  /**
   * show a + or - icon indicating second child's visibility
   */
  showPlus: PropTypes.bool,
  /**
   * id for ReactCSSTransitionGroup
   */
  expandedContentId: PropTypes.string,
};
