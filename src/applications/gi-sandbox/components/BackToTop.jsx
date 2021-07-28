import React, { useEffect, useState } from 'react';
import Scroll from 'react-scroll';
import { getScrollOptions } from 'platform/utilities/ui';
import classNames from 'classnames';

const scroll = Scroll.animateScroll;

/**
 * This thing has a hack in it to make sure the when the element is floating at bottom of page it is on the right side
 * of its parentId element
 * @param parentId containing element's id, used to float element right when floating at bottom of page
 * @param profilePageHeaderId once bottom of this element is less than zero triggers floating behavior
 * @return {JSX.Element}
 * @constructor
 */
export default function BackToTop({ parentId, profilePageHeaderId, compare }) {
  const [floating, setFloating] = useState(false);
  const [backToTopContainerStyle, setBackToTopContainerStyle] = useState({});
  const [compareOpen, setCompareOpen] = useState(compare.open);

  const handleScroll = () => {
    const profilePageHeader = document.getElementById(profilePageHeaderId);
    if (!profilePageHeader) return;

    setFloating(profilePageHeader.getBoundingClientRect().bottom < 0);
  };

  const resize = () => {
    if (floating) {
      const parentElement = document.getElementById(parentId);
      if (parentElement) {
        const parentX = parentElement.getBoundingClientRect().x;
        setBackToTopContainerStyle({ right: parentX });
      }
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, true);
    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('scroll', resize, true);
    };
  }, []);

  useEffect(
    () => {
      resize();
    },
    [floating],
  );

  useEffect(
    () => {
      setCompareOpen(compare.open);
    },
    [compare.open],
  );

  const backToTopClasses = classNames('back-to-top', {
    'back-to-top-floating': floating,
  });

  const backToTopContainerClasses = classNames('back-to-top-container', {
    'back-to-top-container-floating': floating && !compareOpen,
    'back-to-top-container-floating-open': floating && compareOpen,
  });

  return (
    <div className={backToTopClasses}>
      <div
        className={backToTopContainerClasses}
        style={backToTopContainerStyle}
      >
        <div className="usa-content">
          <button
            type="button"
            className="usa-button va-top-button-transition-in"
            onClick={() => scroll.scrollToTop(getScrollOptions())}
          >
            <span>
              <i aria-hidden="true" className="fas fa-arrow-up" role="img" />
            </span>
            <span>Back to top</span>
          </button>
        </div>
      </div>
    </div>
  );
}
