import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import classnames from 'classnames';
import { waitForRenderThenFocus, focusElement } from 'platform/utilities/ui';

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
  expandedContentFocus,
}) {
  const classNames = classnames(
    'form-expanding-group',
    { 'form-expanding-group-open': open && !expandedContentFocus },
    { 'form-expanding-group-plus': showPlus },
  );

  useEffect(
    () => {
      if (open && expandedContentFocus) {
        const formExpandingGroupOpen = document.querySelector(
          '.form-expanding-group-open',
        );
        const expandedContentWebComponent = formExpandingGroupOpen.querySelector(
          'va-text-input, va-select, va-textarea, va-radio, va-checkbox, va-memorable-date',
        );

        if (expandedContentWebComponent) {
          waitForRenderThenFocus(
            'input, select, textarea',
            expandedContentWebComponent.shadowRoot,
          );
        } else {
          focusElement(
            formExpandingGroupOpen.querySelector('input, select, textarea'),
          );
        }
      }
    },
    [open],
  );

  return (
    <div className={classNames}>
      {children[0]}
      <TransitionGroup
        className={expandedContentFocus && 'vads-u-padding-left--4'}
      >
        {open ? (
          <CSSTransition
            id={expandedContentId}
            classNames="form-expanding-group-inner"
            timeout={{
              enter: 700,
            }}
            exit={false}
          >
            <div
              key="removable-group"
              className={
                expandedContentFocus
                  ? 'form-expanding-group-open'
                  : additionalClass
              }
            >
              {children[1]}
            </div>
          </CSSTransition>
        ) : null}
      </TransitionGroup>
    </div>
  );
}

ExpandingGroup.propTypes = {
  /**
   * show second child
   */
  open: PropTypes.bool.isRequired,
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
  /**
   * expanded item receives focus and vertical bar
   */
  expandedContentFocus: PropTypes.bool,
};
