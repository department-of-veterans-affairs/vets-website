import React, { useState } from 'react';
import PropTypes from 'prop-types';

const PrintDownload = props => {
  const { download, list } = props;
  const [menuOpen, setMenuOpen] = useState(false);

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

  return (
    <div className="print-download vads-u-margin-y--2 no-print">
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
          <button type="button" onClick={window.print}>
            Print {list && 'list'}
          </button>
        </li>
        <li>
          <button type="button" onClick={download}>
            Download {list && 'list '}
            as PDF
          </button>
        </li>
        <li>
          <button type="button">
            Download {list && 'list '}
            as a text file
          </button>
        </li>
      </ul>
    </div>
  );
};

export default PrintDownload;

PrintDownload.propTypes = {
  download: PropTypes.any,
  list: PropTypes.any,
};
