import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import FeedbackEmail from './FeedbackEmail';

export const DOWNLOAD_FORMAT = {
  PDF: 'PDF',
  TXT: 'TXT',
};

const PrintDownload = props => {
  const { download, isSuccess, list } = props;
  const [isError, setIsError] = useState(false);

  const [menuOpen, setMenuOpen] = useState(false);
  const [printIndex, setPrintIndex] = useState(0);
  const menu = useRef(null);
  let toggleMenuButtonClasses =
    'toggle-menu-button vads-u-justify-content--space-between';
  let menuOptionsClasses = 'menu-options';
  let menuIconClasses =
    'fas fa-angle-down vads-u-color--primary vads-u-margin-left--0p5';
  if (menuOpen) {
    toggleMenuButtonClasses +=
      ' toggle-menu-button-open vads-u-justify-content--space-between';
    menuOptionsClasses += ' menu-options-open';
    menuIconClasses =
      'fas fa-angle-up vads-u-color--primary vads-u-margin-left--0p5';
  }

  const handleDownload = async format => {
    try {
      setIsError(false);
      await download(format);
    } catch {
      setIsError(true);
    }
  };

  const handlePrint = () => {
    setMenuOpen(!menuOpen);
    window.print();
  };

  const closeMenu = e => {
    if (menu.current && menuOpen && !menu.current.contains(e.target)) {
      setMenuOpen(false);
    }
  };

  document.addEventListener('mousedown', closeMenu);

  const handleUserKeyPress = e => {
    if (printIndex > 0 && e.keyCode === 38) {
      // If user pressed up arrow
      e.preventDefault();
      document.getElementById(`printButton-${printIndex - 2}`).focus();
      setPrintIndex(printIndex - 1);
    } else if (printIndex < 3 && e.keyCode === 40) {
      // If user pressed down arrow
      e.preventDefault();
      document.getElementById(`printButton-${printIndex}`).focus();
      setPrintIndex(printIndex + 1);
    } else if (e.keyCode === 27) {
      // If user pressed escape
      setMenuOpen(false);
    }
  };
  const handleFocus = () => {
    // Reset printIndex to 0 every time the element receives focus
    setPrintIndex(0);
  };

  return (
    <>
      {isSuccess && (
        <div className="vads-u-margin-bottom--2">
          <va-alert status="success" background-only uswds>
            <p
              className="vads-u-margin--0"
              data-testid="download-success-banner"
            >
              Download complete
            </p>
          </va-alert>
        </div>
      )}
      {isError && (
        <div className="vads-u-margin-bottom--2">
          <va-alert status="error" uswds>
            <h2 slot="headline">We can’t access your medications right now</h2>
            <p className="vads-u-margin-bottom--0">
              We’re sorry. There’s a problem with our system. Check back later.
            </p>
            <p className="vads-u-margin--0">
              If it still doesn’t work, email us at <FeedbackEmail />
            </p>
          </va-alert>
        </div>
      )}
      <div
        className="print-download vads-u-margin-y--2 no-print"
        role="none"
        onKeyDown={handleUserKeyPress}
        ref={menu}
        onFocus={handleFocus}
      >
        <button
          type="button"
          className={`vads-u-padding-x--2 ${toggleMenuButtonClasses}`}
          onClick={() => setMenuOpen(!menuOpen)}
          data-testid="print-records-button"
          aria-expanded={menuOpen}
        >
          <span>Print or download</span>
          <i className={menuIconClasses} aria-hidden="true" />
        </button>
        <ul className={menuOptionsClasses}>
          <li>
            <button
              className="vads-u-padding-x--2"
              id="printButton-0"
              type="button"
              data-testid="download-print-button"
              onClick={() => handlePrint()}
            >
              Print this {list ? 'list' : 'page'}
            </button>
          </li>
          <li>
            <button
              className="vads-u-padding-x--2"
              id="printButton-1"
              type="button"
              data-testid="download-pdf-button"
              onClick={() => handleDownload(DOWNLOAD_FORMAT.PDF)}
            >
              Download a PDF of this {list ? 'list' : 'page'}
            </button>
          </li>
          <li>
            <button
              type="button"
              className="vads-u-padding-x--2"
              id="printButton-2"
              data-testid="download-txt-button"
              onClick={() => handleDownload(DOWNLOAD_FORMAT.TXT)}
            >
              Download a text file (.txt) of this {list ? 'list' : 'page'}
            </button>
          </li>
        </ul>
      </div>
    </>
  );
};

export default PrintDownload;

PrintDownload.propTypes = {
  download: PropTypes.any,
  isSuccess: PropTypes.bool,
  list: PropTypes.any,
};
