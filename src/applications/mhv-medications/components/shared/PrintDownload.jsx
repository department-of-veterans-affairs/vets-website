import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { DOWNLOAD_FORMAT, PRINT_FORMAT } from '../../util/constants';
import { dataDogActionNames, pageType } from '../../util/dataDogConstants';

const PrintDownload = props => {
  const { onDownload, isSuccess, list, onPrint, onText, isLoading } = props;
  const [isError, setIsError] = useState(false);

  const [menuOpen, setMenuOpen] = useState(false);
  const [printIndex, setPrintIndex] = useState(0);
  const containerEl = useRef(null);
  const toggleButton = useRef(null);
  let toggleMenuButtonClasses =
    'toggle-menu-button vads-u-justify-content--space-between';
  let menuOptionsClasses = 'menu-options';
  if (menuOpen) {
    toggleMenuButtonClasses +=
      ' toggle-menu-button-open vads-u-justify-content--space-between';
    menuOptionsClasses += ' menu-options-open';
  }

  const handleDownload = async format => {
    setMenuOpen(!menuOpen);
    toggleButton.current.focus();
    if (!navigator.onLine) {
      setIsError(true);
      return;
    }

    try {
      setIsError(false);
      if (format === DOWNLOAD_FORMAT.TXT && onText) {
        onText();
      } else {
        await onDownload(format);
      }
    } catch {
      setIsError(true);
    }
  };

  const handlePrint = async option => {
    setMenuOpen(!menuOpen);
    if (onPrint) {
      onPrint();
    } else {
      await onDownload(option);
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
    const NUM_OF_DROPDOWN_OPTIONS = list ? 4 : 3;
    if (printIndex > 0 && e.keyCode === 38) {
      // If user pressed up arrow
      e.preventDefault();
      document.getElementById(`printButton-${printIndex - 1}`)?.focus();
      setPrintIndex(printIndex - 1);
    } else if (printIndex < NUM_OF_DROPDOWN_OPTIONS - 1 && e.keyCode === 40) {
      // If user pressed down arrow
      e.preventDefault();
      document.getElementById(`printButton-${printIndex + 1}`)?.focus();
      setPrintIndex(printIndex + 1);
    } else if (e.keyCode === 27) {
      // If user pressed escape
      setMenuOpen(false);
    }
  };
  const handleFocus = () => {
    // Reset printIndex to 0 every time the element receives focus
    setPrintIndex(-1);
  };

  return (
    <>
      {isLoading && (
        <va-loading-indicator
          message="Loading..."
          data-testid="print-download-loading-indicator"
        />
      )}
      {isSuccess &&
        !isError && (
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
      {/* hack to generate va-alert and va-telephone web components in case there is no network at the time of download */}
      <va-alert visible="false" uswds>
        <va-telephone />
      </va-alert>
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
        ref={containerEl}
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
          onFocus={handleFocus}
        >
          <span>Print or download</span>
          <va-icon
            size={3}
            icon={!menuOpen ? 'expand_more' : 'expand_less'}
            aria-hidden="true"
          />
        </button>
        <ul className={menuOptionsClasses} data-testid="print-download-list">
          <li>
            <button
              data-dd-action-name={`${dataDogActionNames.shared.PRINT_THIS}${
                list ? 'Page Of The List' : 'Page'
              } Option - ${list ? pageType.LIST : pageType.DETAILS}`}
              className="vads-u-padding-x--2 print-download-btn-min-height"
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
                data-dd-action-name={
                  dataDogActionNames.medicationsListPage
                    .PRINT_ALL_MEDICATIONS_OPTION
                }
                className="vads-u-padding-x--2 print-download-btn-min-height"
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
              data-dd-action-name={`${
                dataDogActionNames.shared.DOWNLOAD_A_PDF_OF_THIS
              }${list ? 'List' : 'Page'} Option - ${
                list ? pageType.LIST : pageType.DETAILS
              }`}
              className="vads-u-padding-x--2 print-download-btn-min-height"
              id={`printButton-${list ? '2' : '1'}`}
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
              data-dd-action-name={`${
                dataDogActionNames.shared.DOWNLOAD_A_TEXT_FILE_OF_THIS
              }${list ? 'List' : 'Page'} Option - ${
                list ? pageType.LIST : pageType.DETAILS
              }`}
              className="vads-u-padding-x--2 print-download-btn-min-height"
              id={`printButton-${list ? '3' : '2'}`}
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
  isSuccess: PropTypes.bool,
  list: PropTypes.any,
  onDownload: PropTypes.any,
  onPrint: PropTypes.func,
  onText: PropTypes.func,
  isLoading: PropTypes.bool,
};
