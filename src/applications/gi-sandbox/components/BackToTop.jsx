import React, { useEffect, useState } from 'react';
import Scroll from 'react-scroll';
import { getScrollOptions } from 'platform/utilities/ui';
import classNames from 'classnames';

const scroll = Scroll.animateScroll;

export default function BackToTop({ parentId, profilePageHeaderId }) {
  const [floating, setFloating] = useState(true);
  const [backToTopContainerStyle, setBackToTopContainerStyle] = useState({});

  const handleScroll = () => {
    const profilePageHeader = document.getElementById(profilePageHeaderId);
    if (!profilePageHeader) return;

    setFloating(profilePageHeader?.getBoundingClientRect().bottom < 0);
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

  const backToTopClasses = classNames('back-to-top', {
    'back-to-top-floating': floating,
  });

  return (
    <div className={backToTopClasses}>
      <div className="back-to-top-container" style={backToTopContainerStyle}>
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
