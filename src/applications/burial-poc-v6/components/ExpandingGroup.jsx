import PropTypes from 'prop-types';
import React from 'react';
import { TransitionGroup } from 'react-transition-group';
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
    { 'form-expanding-group-open': open },
    { 'form-expanding-group-plus': showPlus },
  );

  return (
    <div className={classNames}>
      {children[0]}
      <TransitionGroup>
        id=
        {expandedContentId}
        transitionName="form-expanding-group-inner" transitionEnterTimeout=
        {700}
        transitionLeave=
        {false}>
        {open ? (
          <div key="removable-group" className={additionalClass}>
            {children[1]}
          </div>
        ) : null}
      </TransitionGroup>
    </div>
  );
}

ExpandingGroup.propTypes = {
  /**
   * Show second child if true
   */
  open: PropTypes.bool.isRequired,
  /**
   * Class added to parent element of second child component
   */
  additionalClass: PropTypes.string,
  /**
   * `id` attribute for ReactCSSTransitionGroup
   */
  expandedContentId: PropTypes.string,
  /**
   * Show a `+` or `-` icon indicating second child's visibility
   */
  showPlus: PropTypes.bool,
};
