import React, { useState } from 'react';
import PropTypes from 'prop-types';

const PrintDownload = props => {
  const { download, list } = props;
  const [menuOpen, setMenuOpen] = useState(false);

  let toggleMenuButtonClasses = 'toggle-menu-button';
  let menuOptionsClasses = 'menu-options';
  let menuIconClasses =
    'fas fa-angle-down vads-u-color--primary vads-u-margin-left--5';
  if (menuOpen) {
    toggleMenuButtonClasses += ' toggle-menu-button-open';
    menuOptionsClasses += ' menu-options-open';
    menuIconClasses =
      'fas fa-angle-up vads-u-color--primary vads-u-margin-left--5';
  }

  return (
    <div className="print-download vads-u-margin-y--3 no-print">
      <button
        type="button"
        className={toggleMenuButtonClasses}
        onClick={() => setMenuOpen(!menuOpen)}
        data-testid="print-records-button"
      >
        <span>Print or download this {list ? 'list' : 'record'}</span>
        <i className={menuIconClasses} aria-hidden="true" />
      </button>
      <div className={menuOptionsClasses}>
        <button
          type="button"
          onClick={window.print}
          aria-label={`Print ${list && 'list'}. Menu item 1 of 3`}
        >
          Print {list && 'list'}
        </button>
        <button
          type="button"
          onClick={download}
          aria-label={`Download ${list && 'list'} as PDF. Menu item 2 of 3`}
        >
          Download {list && 'list '}
          as PDF
        </button>
        <button
          type="button"
          aria-label={`Download ${list &&
            'list'} as a text file. Menu item 3 of 3`}
        >
          Download {list && 'list '}
          as a text file
        </button>
      </div>
    </div>
  );
};

export default PrintDownload;

PrintDownload.propTypes = {
  download: PropTypes.any,
  list: PropTypes.any,
};
