import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';

const BANNER_HEIGHT = '38px';

// Colors from VA Design System: https://design.va.gov/foundation/color-palette
const bannerStyles = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  zIndex: 1000,
  backgroundColor: '#ffbe2e', // $color-gold
  color: '#1b1b1b', // $color-base-darkest (4.5:1 contrast ratio on gold)
  padding: '8px 16px',
  textAlign: 'center',
  fontWeight: 'bold',
  fontSize: '14px',
};

const linkStyles = {
  color: '#1b1b1b', // $color-base-darkest for sufficient contrast
  marginLeft: '8px',
  textDecoration: 'underline',
};

function DemoBanner() {
  useEffect(() => {
    // Add padding to body when banner mounts to prevent overlap with header
    const originalPadding = document.body.style.paddingTop;
    document.body.style.paddingTop = BANNER_HEIGHT;

    return () => {
      // Restore original padding when banner unmounts
      document.body.style.paddingTop = originalPadding;
    };
  }, []);

  return (
    <div style={bannerStyles} role="region" aria-label="Demo mode notification">
      <span>
        This is a demo for training purposes — sample data only, not real health
        records.
      </span>
      <a
        href="/mhv-demo-mode"
        style={linkStyles}
        aria-label="Exit demo and return to demo introduction page"
      >
        Exit demo
      </a>
    </div>
  );
}

export default function DemoModeAlert() {
  return createPortal(<DemoBanner />, document.body);
}
