import React from 'react';
import Scroll from 'react-scroll';
import { getScrollOptions } from 'platform/utilities/ui';

const scroll = Scroll.animateScroll;

export default function BackToTop() {
  return (
    <div id="back-to-top-container">
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
  );
}
