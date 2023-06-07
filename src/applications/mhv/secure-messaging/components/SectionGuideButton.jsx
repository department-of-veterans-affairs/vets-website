import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

const SectionGuideButton = props => {
  const { onMenuClick, setNavMenuButtonRef } = props;
  const navMenuButtonRef = useRef(null);

  useEffect(
    () => {
      setNavMenuButtonRef(navMenuButtonRef.current);
    },
    [navMenuButtonRef, setNavMenuButtonRef],
  );
  return (
    <div className="va-btn-sidebarnav-trigger">
      <div className="button-background" />
      <div className="button-wrapper">
        <button
          ref={navMenuButtonRef}
          aria-controls="va-detailpage-sidebar"
          onClick={() => {
            onMenuClick();
          }}
          type="button"
        >
          <strong>In the Messages section</strong>
          <i className="fas fa-bars" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};

SectionGuideButton.propTypes = {
  sectionName: PropTypes.string,
  setNavMenuButtonRef: PropTypes.func,
  onMenuClick: PropTypes.func,
};

export default SectionGuideButton;
