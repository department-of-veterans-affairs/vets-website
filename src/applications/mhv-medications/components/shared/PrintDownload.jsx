import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import {
  DD_ACTIONS_PAGE_TYPE,
  DOWNLOAD_FORMAT,
  PRINT_FORMAT,
} from '../../util/constants';

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
      setMenuOpen(!menuOpen);
      setIsError(false);
      await download(format);
    } catch {
      setIsError(true);
    }
  };

  const handlePrint = async option => {
    setMenuOpen(!menuOpen);
    await download(option);
  };

  const closeMenu = e => {
    if (menu.current && menuOpen && !menu.current.contains(e.target)) {
      setMenuOpen(false);
    }
  };

  document.addEventListener('mousedown', closeMenu);

  const handleUserKeyPress = e => {
    const NUM_OF_DROPDOWN_OPTIONS = 4;
    if (printIndex > 0 && e.keyCode === 38) {
      // If user pressed up arrow
      e.preventDefault();
      document.getElementById(`printButton-${printIndex - 2}`).focus();
      setPrintIndex(printIndex - 1);
    } else if (printIndex < NUM_OF_DROPDOWN_OPTIONS && e.keyCode === 40) {
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
        <div
          className="vads-u-margin-bottom--3"
          data-testid="download-success-banner"
        >
          <va-alert role="alert" status="success" background-only uswds>
            <h2 slot="headline">Download started</h2>
            <p className="vads-u-margin--0">
              Check your device’s downloads location for your file.
            </p>
          </va-alert>
        </div>
      )}
      {isError && (
        <div className="vads-u-margin-bottom--3">
          <va-alert role="alert" status="error" uswds>
            <h2 slot="headline">We can’t download your records right now</h2>
            <p>
              We’re sorry. There’s a problem with our system. Check back later.
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
        ref={menu}
        onFocus={handleFocus}
      >
        <button
          data-dd-action-name={`Print Or Download Button - ${
            list ? DD_ACTIONS_PAGE_TYPE.LIST : DD_ACTIONS_PAGE_TYPE.DETAILS
          }`}
          type="button"
          className={`vads-u-padding-x--2 ${toggleMenuButtonClasses}`}
          onClick={() => setMenuOpen(!menuOpen)}
          data-testid="print-records-button"
          aria-expanded={menuOpen}
        >
          <span>Print or download</span>
          <va-icon
            className={menuIconClasses}
            size={3}
            icon={!menuOpen ? 'expand_more' : 'expand_less'}
            aria-hidden="true"
          />
        </button>
        <ul className={menuOptionsClasses} data-testid="print-download-list">
          <li>
            <button
              data-dd-action-name={`Print This ${
                list ? 'Page Of The List' : 'Page'
              } Option - ${
                list ? DD_ACTIONS_PAGE_TYPE.LIST : DD_ACTIONS_PAGE_TYPE.DETAILS
              }`}
              className="vads-u-padding-x--2"
              id="printButton-0"
              type="button"
              data-testid="download-print-button"
              onClick={() => handlePrint(PRINT_FORMAT.PRINT)}
            >
              Print this {list ? 'page of the list' : 'page'}
            </button>
          </li>
          {list && (
            <li>
              <button
                data-dd-action-name={`Print All Medications Option - ${
                  DD_ACTIONS_PAGE_TYPE.LIST
                }`}
                className="vads-u-padding-x--2"
                id="printButton-1"
                type="button"
                data-testid="download-print-all-button"
                onClick={() => handlePrint(PRINT_FORMAT.PRINT_FULL_LIST)}
              >
                Print all medications
              </button>
            </li>
          )}
          <li>
            <button
              data-dd-action-name={`Download A PDF Of This ${
                list ? 'List' : 'Page'
              } Option - ${
                list ? DD_ACTIONS_PAGE_TYPE.LIST : DD_ACTIONS_PAGE_TYPE.DETAILS
              }`}
              className="vads-u-padding-x--2"
              id="printButton-2"
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
              data-dd-action-name={`Download A Text File Of This ${
                list ? 'List' : 'Page'
              } Option - ${
                list ? DD_ACTIONS_PAGE_TYPE.LIST : DD_ACTIONS_PAGE_TYPE.DETAILS
              }`}
              className="vads-u-padding-x--2"
              id="printButton-3"
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
