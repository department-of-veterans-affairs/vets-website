import React, { useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import { sendDataDogAction } from '../../util/helpers';

const PrintDownload = props => {
  const { downloadPdf, downloadTxt, list, description } = props;
  const menu = useRef(null);

  const [menuOpen, setMenuOpen] = useState(false);
  const [printIndex, setPrintIndex] = useState(0);

  const listOrPage = useMemo(() => (list ? 'list' : 'page'), [list]);

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
  const handleBlur = e => {
    if (menu.current && !menu.current.contains(e.relatedTarget)) {
      setMenuOpen(false);
    }
  };

  document.addEventListener('mousedown', closeMenu);

  const handleUserKeyPress = e => {
    // 13=Enter 40=DownArrow 38=UpArrow 27=Escape 9=Tab 32=Spacebar

    if (printIndex > 0 && e.keyCode === 38) {
      e.preventDefault();
      document.getElementById(`printButton-${printIndex - 2}`)?.focus();
      setPrintIndex(printIndex - 1);
    } else if (printIndex < 3 && e.keyCode === 40) {
      e.preventDefault();
      document.getElementById(`printButton-${printIndex}`)?.focus();
      setPrintIndex(printIndex + 1);
    } else if (e.keyCode === 27) {
      setMenuOpen(false);
      focusElement(document.querySelector('#print-download-menu'));
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
      onBlur={handleBlur}
    >
      <button
        className={`vads-u-padding-x--2 ${toggleMenuButtonClasses}`}
        type="button"
        onClick={() => {
          setMenuOpen(!menuOpen);
          sendDataDogAction(`Print Button - ${description}`);
        }}
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
            onClick={() => {
              handlePrint();
              sendDataDogAction(
                `Print this ${listOrPage} option - ${description}`,
              );
            }}
            id="printButton-0"
            data-testid="printButton-0"
          >
            Print this {listOrPage}
          </button>
        </li>
        <li>
          <button
            className="vads-u-padding-x--2"
            type="button"
            onClick={() => {
              handlePdfDownload();
              sendDataDogAction(
                `Download PDF of this ${listOrPage} option - ${description}`,
              );
            }}
            id="printButton-1"
            data-testid="printButton-1"
          >
            Download PDF of this {listOrPage}
          </button>
        </li>
        <li>
          <button
            className="vads-u-padding-x--2"
            type="button"
            id="printButton-2"
            data-testid="printButton-2"
            onClick={() => {
              handleTxtDownload();
              sendDataDogAction(
                `Download TXT of this ${listOrPage} option - ${description}`,
              );
            }}
          >
            Download a text file (.txt) of this {listOrPage}
          </button>
        </li>
      </ul>
    </div>
  );
};

export default PrintDownload;

PrintDownload.propTypes = {
  description: PropTypes.string,
  downloadPdf: PropTypes.any,
  downloadTxt: PropTypes.any,
  list: PropTypes.any,
};
