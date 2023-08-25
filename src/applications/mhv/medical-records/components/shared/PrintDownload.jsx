import React, { useState } from 'react';
import PropTypes from 'prop-types';

const PrintDownload = props => {
  const { download, list } = props;

  const [menuOpen, setMenuOpen] = useState(false);
  const [printIndex, setPrintIndex] = useState(1);

  let toggleMenuButtonClasses =
    'toggle-menu-button vads-u-justify-content--space-between';
  let menuOptionsClasses = 'menu-options';
  let menuIconClasses =
    'fas fa-angle-down vads-u-color--primary vads-u-margin-left--0p5';
  if (menuOpen) {
    toggleMenuButtonClasses +=
      'toggle-menu-button-open vads-u-justify-content--space-between';
    menuOptionsClasses += ' menu-options-open';
    menuIconClasses =
      'fas fa-angle-up vads-u-color--primary vads-u-margin-left--0p5';
  }

  const handleKeyDown = e => {
    e.preventDefault();
    if (e.keyCode === 38 && printIndex > 0) {
      setPrintIndex(printIndex - 1);
    } else if (e.keyCode === 40 && printIndex < 2) {
      setPrintIndex(printIndex + 1);
    }

    if (e.keyCode === 13) {
      if (printIndex === 0) {
        window.print();
      } else if (printIndex === 1) {
        download();
      } else if (printIndex === 2) {
        // download text function will go here
      }
    }

    if (e.keyCode === 27) {
      setMenuOpen(false);
    }
  };

  return (
    <div
      className="print-download vads-u-margin-y--2 no-print"
      onKeyDown={handleKeyDown}
      aria-hidden="true"
    >
      <button
        type="button"
        className={toggleMenuButtonClasses}
        onClick={() => setMenuOpen(!menuOpen)}
        data-testid="print-records-button"
        aria-expanded={menuOpen}
      >
        <span>Print or download this {list ? 'list' : 'record'}</span>
        <i className={menuIconClasses} aria-hidden="true" />
      </button>
      <ul className={menuOptionsClasses}>
        <li>
          {printIndex === 0 ? (
            <button
              type="button"
              onClick={window.print}
              style={{ backgroundColor: 'lightBlue' }}
            >
              Print {list && 'list'}
            </button>
          ) : (
            <button type="button" onClick={window.print}>
              Print {list && 'list'}
            </button>
          )}
        </li>
        <li>
          {printIndex === 1 ? (
            <button
              type="button"
              onClick={download}
              style={{ backgroundColor: 'lightBlue' }}
            >
              Download {list && 'list '}
              as PDF
            </button>
          ) : (
            <button type="button" onClick={download}>
              Download {list && 'list '}
              as PDF
            </button>
          )}
        </li>
        <li>
          {printIndex === 2 ? (
            <button type="button" style={{ backgroundColor: 'lightBlue' }}>
              Download {list && 'list '}
              as a text file
            </button>
          ) : (
            <button type="button">
              Download {list && 'list '}
              as a text file
            </button>
          )}
        </li>
        <div
          style={{
            backgroundColor: 'white',
            border: '2px #0071bb solid',
            borderRadius: '5px',
            marginTop: '4px',
            padding: '8px',
          }}
        >
          <i>You can use the arrow keys to make a selection.</i>
          <br />
          <i>Press "enter" to go select.</i>
          <br />
          <i>Press "esc" to go close.</i>
        </div>
      </ul>
    </div>
  );
};

export default PrintDownload;

PrintDownload.propTypes = {
  download: PropTypes.any,
  list: PropTypes.any,
};
