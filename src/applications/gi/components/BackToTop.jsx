import React, { useEffect, useRef, useState, useCallback } from 'react';

import scrollToTop from 'platform/utilities/ui/scrollToTop';
import classNames from 'classnames';
import recordEvent from 'platform/monitoring/record-event';
import { focusElement } from 'platform/utilities/ui';

/**
 * This thing has a hack in it to make sure the when the element is floating at bottom of page it is on the right side
 * of its parentId element
 * @param parentId containing element's id, used to float element right when floating at bottom of page
 * @param profilePageHeaderId once bottom of this element is less than zero triggers floating behavior
 * @param compare
 * @param smallScreen
 * @return {JSX.Element}
 * @constructor
 */
export default function BackToTop({
  parentId,
  profilePageHeaderId,
  compare,
  smallScreen,
}) {
  const [floating, setFloating] = useState(false);
  const [backToTopContainerStyle, setBackToTopContainerStyle] = useState({});
  const [compareOpen, setCompareOpen] = useState(compare.open);
  const placeholder = useRef(null);
  const [scrolled, setScrolled] = useState(false);

  const handleScroll = () => {
    setScrolled(true);
  };

  /**
   * Determine if button should be floating on page or not
   * Accounts for if CompareDrawer is open or not
   * Using an useEffect so can correctly access the value of compareOpen
   */
  useEffect(
    () => {
      if (smallScreen && compare.open) {
        setFloating(false);
        setScrolled(false);
      } else if (scrolled || (smallScreen && !compare.open)) {
        const profilePageHeader = document.getElementById(profilePageHeaderId);
        if (!profilePageHeader || !placeholder.current) return;

        const headerNotVisible =
          profilePageHeader.getBoundingClientRect().bottom < 0;

        // Values below are based on whether Compare Drawer is open or closed as this component needs to sit 0.8em above
        // the Compare Drawer when open or closed
        // See _gi-back-to-top.scss: 212 = 13.3em, 52 = 3.3em
        // These values are the 2 heights of compare drawer plus 0.8em
        const adjustment = compareOpen ? 212 : 52;

        // Has a consistent adjustment 52 because placeholder ends up above the Button in the dom
        const footerNotVisible =
          placeholder.current.getBoundingClientRect().bottom >=
          window.innerHeight - 52 - adjustment;

        setFloating(headerNotVisible && footerNotVisible);
        setScrolled(false);
      }
      setCompareOpen(compare.open);
    },
    [scrolled, smallScreen, compare.open, profilePageHeaderId, compareOpen],
  );

  const resize = useCallback(
    () => {
      if (floating) {
        const parentElement = document.getElementById(parentId);
        if (parentElement) {
          const parentX = parentElement.getBoundingClientRect().x;
          setBackToTopContainerStyle({ right: parentX });
        }
      }
    },
    [floating, parentId],
  );

  useEffect(
    () => {
      window.addEventListener('scroll', handleScroll, true);
      window.addEventListener('resize', resize);

      return () => {
        window.removeEventListener('scroll', handleScroll, true);
        window.removeEventListener('scroll', resize, true);
      };
    },
    [resize],
  );

  useEffect(
    () => {
      resize();
    },
    [floating, resize],
  );

  const backToTopClasses = classNames('back-to-top', {
    'back-to-top-floating': floating,
  });

  const backToTopContainerClasses = classNames('back-to-top-container', {
    'back-to-top-container-floating': floating && !compareOpen,
    'back-to-top-container-floating-open': floating && compareOpen,
  });

  const placeholderClasses = classNames('placeholder', {
    'button-floating': floating,
  });

  return (
    <>
      <div className={backToTopClasses}>
        <div
          className={backToTopContainerClasses}
          style={backToTopContainerStyle}
        >
          <div className="usa-content">
            <button
              type="button"
              className="usa-button va-top-button-transition-in"
              onClick={() => {
                scrollToTop();
                recordEvent({
                  event: 'cta-button-click',
                  'button-click-label': 'Back to top',
                  'button-type': 'default',
                });

                const h1 = document.querySelector(`#${profilePageHeaderId} h1`);
                if (h1) focusElement(h1);
              }}
            >
              <span>
                <va-icon icon="arrow_upward" aria-hidden="true" role="img" />
              </span>
              <span>Back to top</span>
            </button>
          </div>
        </div>
      </div>
      <div ref={placeholder} className={placeholderClasses}>
        &nbsp;
      </div>
    </>
  );
}
