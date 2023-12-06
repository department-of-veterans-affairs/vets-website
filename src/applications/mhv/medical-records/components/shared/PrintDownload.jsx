import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';

const PrintDownload = props => {
  const { download, downloadTxt, list, allowTxtDownloads } = props;
  const menu = useRef(null);

  const [menuOpen, setMenuOpen] = useState(false);
  const [printIndex, setPrintIndex] = useState(0);

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
      document.getElementById(`printButton-${printIndex - 1}`).focus();
      setPrintIndex(printIndex - 1);
    } else if (printIndex < 2 && e.keyCode === 40) {
      e.preventDefault();
      document.getElementById(`printButton-${printIndex + 1}`).focus();
      setPrintIndex(printIndex + 1);
    } else if (e.keyCode === 27) {
      setMenuOpen(false);
    }
  };

  return (
    <div
      className="print-download vads-u-margin-y--2 no-print"
      role="none"
      onKeyDown={handleUserKeyPress}
      ref={menu}
    >
      <button
        type="button"
        className={toggleMenuButtonClasses}
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
            type="button"
            onClick={window.print}
            id="printButton-0"
            data-testid="printButton-0"
          >
            Print this {list ? 'list' : 'page'}
          </button>
        </li>
        <li>
          <button
            type="button"
            onClick={download}
            id="printButton-1"
            data-testid="printButton-1"
          >
            Download PDF of this {list ? 'list' : 'page'}
          </button>
        </li>
        {allowTxtDownloads && (
          <li>
            <button
              type="button"
              id="printButton-2"
              data-testid="printButton-2"
              onClick={downloadTxt}
            >
              Download {list ? 'list' : 'page'} as a text file
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
  download: PropTypes.any,
  downloadTxt: PropTypes.any,
  list: PropTypes.any,
};
