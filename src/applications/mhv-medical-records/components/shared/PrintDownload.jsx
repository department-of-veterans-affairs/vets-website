import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';

const PrintDownload = props => {
  const { downloadPdf, downloadTxt, list, allowTxtDownloads } = props;
  const menu = useRef(null);

  const [menuOpen, setMenuOpen] = useState(false);
  const [printIndex, setPrintIndex] = useState(0);

  let toggleMenuButtonClasses =
    'toggle-menu-button vads-u-justify-content--space-between';
  let menuOptionsClasses = 'menu-options';
  if (menuOpen) {
    toggleMenuButtonClasses +=
      ' toggle-menu-button-open vads-u-justify-content--space-between';
    menuOptionsClasses += ' menu-options-open';
  }

  const closeMenu = e => {
    if (menu.current && menuOpen && !menu.current.contains(e.target)) {
      setMenuOpen(false);
    }
  };

  document.addEventListener('mousedown', closeMenu);

  const handleUserKeyPress = e => {
    // 13=Enter 40=DownArrow 38=UpArrow 27=Escape 9=Tab 32=Spacebar

    if (printIndex > 0 && e.keyCode === 38) {
      e.preventDefault();
      document.getElementById(`printButton-${printIndex - 2}`).focus();
      setPrintIndex(printIndex - 1);
    } else if (printIndex < 3 && e.keyCode === 40) {
      e.preventDefault();
      document.getElementById(`printButton-${printIndex}`).focus();
      setPrintIndex(printIndex + 1);
    } else if (e.keyCode === 27) {
      setMenuOpen(false);
    }
  };
  const handleFocus = () => {
    // Reset printIndex to 0 every time the element receives focus
    setPrintIndex(0);
  };
  const handlePrint = () => {
    window.print();
    setMenuOpen(false);
    focusElement(document.querySelector('#print-download-menu'));
  };
  const handlePdfDownload = () => {
    downloadPdf();
    setMenuOpen(false);
    focusElement(document.querySelector('#print-download-menu'));
  };
  const handleTxtDownload = () => {
    downloadTxt();
    setMenuOpen(false);
    focusElement(document.querySelector('#print-download-menu'));
  };

  return (
    <div
      className="print-download vads-u-margin-y--2 no-print"
      role="none"
      onKeyDown={handleUserKeyPress}
      ref={menu}
      onFocus={handleFocus}
    >
      <button
        className={`vads-u-padding-x--2 ${toggleMenuButtonClasses}`}
        type="button"
        onClick={() => setMenuOpen(!menuOpen)}
        id="print-download-menu"
        data-testid="print-download-menu"
        aria-expanded={menuOpen}
      >
        <span>Print or download</span>
        <span
          className="vads-u-color--primary vads-u-margin-left--0p5"
          aria-hidden="true"
        >
          {menuOpen ? (
            <va-icon icon="expand_less" size={3} />
          ) : (
            <va-icon icon="expand_more" size={3} />
          )}
        </span>
      </button>
      <ul className={menuOptionsClasses}>
        <li>
          <button
            className="vads-u-padding-x--2"
            type="button"
            onClick={handlePrint}
            id="printButton-0"
            data-testid="printButton-0"
          >
            Print this {list ? 'list' : 'page'}
          </button>
        </li>
        <li>
          <button
            className="vads-u-padding-x--2"
            type="button"
            onClick={handlePdfDownload}
            id="printButton-1"
            data-testid="printButton-1"
          >
            Download PDF of this {list ? 'list' : 'page'}
          </button>
        </li>
        {allowTxtDownloads && (
          <li>
            <button
              className="vads-u-padding-x--2"
              type="button"
              id="printButton-2"
              data-testid="printButton-2"
              onClick={handleTxtDownload}
            >
              Download a text file (.txt) of this {list ? 'list' : 'page'}
            </button>
          </li>
        )}
      </ul>
    </div>
  );
};

export default PrintDownload;

PrintDownload.propTypes = {
  allowTxtDownloads: PropTypes.bool,
  downloadPdf: PropTypes.any,
  downloadTxt: PropTypes.any,
  list: PropTypes.any,
};
