import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import { DOWNLOAD_FORMAT, PRINT_FORMAT } from '../../util/constants';
import { dataDogActionNames, pageType } from '../../util/dataDogConstants';

const PrintDownload = props => {
  const { onDownload, isSuccess, list, onPrint, isLoading, isFiltered } = props;
  const [isError, setIsError] = useState(false);

  const [menuOpen, setMenuOpen] = useState(false);
  const [printIndex, setPrintIndex] = useState(0);
  const containerEl = useRef(null);
  const toggleButton = useRef(null);
  const successAlert = useRef(null);
  const errorAlert = useRef(null);
  let toggleMenuButtonClasses =
    'toggle-menu-button vads-u-justify-content--space-between';
  let menuOptionsClasses = 'menu-options';
  if (menuOpen) {
    toggleMenuButtonClasses +=
      ' toggle-menu-button-open vads-u-justify-content--space-between';
    menuOptionsClasses += ' menu-options-open';
  }

  useEffect(() => {
    if (isError) {
      focusElement(errorAlert.current);
      return;
    }

    if (isSuccess) {
      focusElement(successAlert.current);
    }
  }, [isSuccess, isError]);

  const handleDownload = async format => {
    setMenuOpen(false); // ensure menu closes
    if (toggleButton.current) {
      focusElement(toggleButton.current); // return focus
    }
    if (!navigator.onLine) {
      setIsError(true);
      return;
    }
    try {
      setIsError(false);
      await onDownload(format);
    } catch {
      setIsError(true);
    }
  };

  const handlePrint = async option => {
    setMenuOpen(false);
    if (onPrint) {
      onPrint();
    } else {
      await onDownload(option);
    }
    if (toggleButton.current) {
      focusElement(toggleButton.current); // return focus
    }
  };

  const closeMenu = e => {
    if (
      containerEl.current &&
      menuOpen &&
      !containerEl.current.contains(e.target)
    ) {
      setMenuOpen(false);
    }
  };

  document.addEventListener('mousedown', closeMenu);

  const handleUserKeyPress = e => {
    // 13=Enter 40=DownArrow 38=UpArrow 27=Escape 9=Tab 32=Spacebar
    const NUM_OF_DROPDOWN_OPTIONS = 3;
    if (printIndex > 0 && e.keyCode === 38) {
      // If user pressed up arrow
      e.preventDefault();
      document.getElementById(`printButton-${printIndex - 2}`)?.focus();
      setPrintIndex(printIndex - 1);
    } else if (printIndex < NUM_OF_DROPDOWN_OPTIONS && e.keyCode === 40) {
      // If user pressed down arrow
      e.preventDefault();
      document.getElementById(`printButton-${printIndex}`)?.focus();
      setPrintIndex(printIndex + 1);
    } else if (e.keyCode === 27) {
      // If user pressed escape
      setMenuOpen(false);
      focusElement(document.querySelector('#print-download-menu'));
    }
  };

  const handleFocus = () => {
    // Reset printIndex to 0 every time the element receives focus
    setPrintIndex(0);
  };

  const handleBlur = e => {
    // close menu when focus leaves menu container
    if (containerEl.current && !containerEl.current.contains(e.relatedTarget)) {
      setMenuOpen(false);
    }
  };

  return (
    <>
      {isLoading && (
        <div className="vads-u-margin-y--3">
          <va-loading-indicator
            message="Loading..."
            data-testid="print-download-loading-indicator"
          />
        </div>
      )}
      {isSuccess && !isError && (
        <div
          className="vads-u-margin-y--3"
          data-testid="download-success-banner"
        >
          <va-alert
            role="alert"
            status="success"
            ref={successAlert}
            background-only
            uswds
          >
            <h2 slot="headline">Download started</h2>
            <p className="vads-u-margin--0">
              Your file should download automatically. If it doesn’t, try again.
              If you can’t find it, check your browser settings to find where
              your browser saves downloaded files.
            </p>
          </va-alert>
        </div>
      )}
      {/* hack to generate va-alert and va-telephone web components in case there is no network at the time of download */}
      <va-alert visible="false" uswds>
        <va-telephone />
      </va-alert>
      {isError && (
        <div className="vads-u-margin-y--3">
          <va-alert role="alert" status="error" ref={errorAlert} uswds>
            <h2 slot="headline">We can’t download your records right now</h2>
            <p>
              We’re sorry. There’s a problem with our system. Try again later.
            </p>
            <div className="vads-u-margin--0">
              <p>
                If it still doesn’t work, call us at{' '}
                <va-telephone contact="8773270022" /> (
                <va-telephone tty contact="711" />
                ).
              </p>
              <p>
                We’re here Monday through Friday, 8:00 a.m. to 8:00 p.m. ET.
              </p>
            </div>
          </va-alert>
        </div>
      )}
      <div
        className="print-download vads-u-margin-y--2 no-print"
        role="none"
        onKeyDown={handleUserKeyPress}
        ref={containerEl}
        onFocus={handleFocus}
        onBlur={handleBlur}
      >
        <button
          data-dd-action-name={`${
            dataDogActionNames.shared.PRINT_OR_DOWNLOAD_BUTTON
          }${list ? pageType.LIST : pageType.DETAILS}`}
          type="button"
          className={`vads-u-padding-x--2 ${toggleMenuButtonClasses} print-download-btn-min-height`}
          onClick={() => setMenuOpen(!menuOpen)}
          data-testid="print-records-button"
          aria-expanded={menuOpen}
          ref={toggleButton}
          id="print-download-menu"
          onFocus={handleFocus}
        >
          <span>
            {list && isFiltered
              ? 'Print or download filtered list'
              : 'Print or download'}
          </span>
          <va-icon
            size={3}
            icon={!menuOpen ? 'expand_more' : 'expand_less'}
            aria-hidden="true"
          />
        </button>
        <ul className={menuOptionsClasses} data-testid="print-download-list">
          <li>
            <button
              data-dd-action-name={`${dataDogActionNames.shared.PRINT}${
                list ? 'List' : 'This Page'
              } Option - ${list ? pageType.LIST : pageType.DETAILS}`}
              className="vads-u-padding-x--2 print-download-btn-min-height"
              id="printButton-0"
              type="button"
              data-testid="download-print-button"
              onClick={() => handlePrint(PRINT_FORMAT.PRINT)}
            >
              {list ? 'Print' : 'Print this page'}
            </button>
          </li>
          <li>
            <button
              data-dd-action-name={`${
                dataDogActionNames.shared.DOWNLOAD_A_PDF_OF_THIS
              }${list ? 'List' : 'Page'} Option - ${
                list ? pageType.LIST : pageType.DETAILS
              }`}
              className="vads-u-padding-x--2 print-download-btn-min-height"
              id="printButton-1"
              type="button"
              data-testid="download-pdf-button"
              onClick={() => handleDownload(DOWNLOAD_FORMAT.PDF)}
            >
              {list ? 'Download a PDF' : 'Download a PDF of this page'}
            </button>
          </li>
          <li>
            <button
              type="button"
              data-dd-action-name={`${
                dataDogActionNames.shared.DOWNLOAD_A_TEXT_FILE_OF_THIS
              }${list ? 'List' : 'Page'} Option - ${
                list ? pageType.LIST : pageType.DETAILS
              }`}
              className="vads-u-padding-x--2 print-download-btn-min-height"
              id="printButton-2"
              data-testid="download-txt-button"
              onClick={() => handleDownload(DOWNLOAD_FORMAT.TXT)}
            >
              {list
                ? 'Download a text file (.txt)'
                : 'Download a text file (.txt) of this page'}
            </button>
          </li>
        </ul>
      </div>
    </>
  );
};

export default PrintDownload;

PrintDownload.propTypes = {
  isFiltered: PropTypes.bool,
  isLoading: PropTypes.bool,
  isSuccess: PropTypes.bool,
  list: PropTypes.any,
  onDownload: PropTypes.any,
  onPrint: PropTypes.func,
  onText: PropTypes.func,
};
