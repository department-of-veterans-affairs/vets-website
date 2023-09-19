import React from 'react';
import PropTypes from 'prop-types';

const PrintDownload = props => {
  const { download, list } = props;

  // Variables required for dropdown button group should we go back to it
  // const [menuOpen, setMenuOpen] = useState(false);
  // let toggleMenuButtonClasses =
  //   'toggle-menu-button vads-u-justify-content--space-between';
  // let menuOptionsClasses = 'menu-options';
  // let menuIconClasses =
  //   'fas fa-angle-down vads-u-color--primary vads-u-margin-left--0p5';
  // if (menuOpen) {
  //   toggleMenuButtonClasses +=
  //     'toggle-menu-button-open vads-u-justify-content--space-between';
  //   menuOptionsClasses += ' menu-options-open';
  //   menuIconClasses =
  //     'fas fa-angle-up vads-u-color--primary vads-u-margin-left--0p5';
  // }

  return (
    <button
      type="button"
      className="link-button vads-u-margin-bottom--3"
      onClick={download}
    >
      <i className="fas fa-download vads-u-margin-right--0p5" />
      {list
        ? 'Download your medication list as a PDF'
        : 'Download your medication details as a PDF'}
    </button>

    // Code for dropdown print/download button should we go back to it
    // <div className="print-download vads-u-margin-y--2 no-print">
    //   <button
    //     type="button"
    //     className={toggleMenuButtonClasses}
    //     onClick={() => setMenuOpen(!menuOpen)}
    //     data-testid="print-records-button"
    //     aria-expanded={menuOpen}
    //   >
    //     <span>Print or download this {list ? 'list' : 'page'}</span>
    //     <i className={menuIconClasses} aria-hidden="true" />
    //   </button>
    //   <ul className={menuOptionsClasses}>
    //     <li>
    //       <button
    //         type="button"
    //         data-testid="print-button"
    //         onClick={window.print}
    //       >
    //         Print {list && 'list'}
    //       </button>
    //     </li>
    //     <li>
    //       <button
    //         type="button"
    //         data-testid="download-pdf-button"
    //         onClick={download}
    //       >
    //         Download {list && 'list '}
    //         as PDF
    //       </button>
    //     </li>
    //   </ul>
    // </div>
  );
};

export default PrintDownload;

PrintDownload.propTypes = {
  download: PropTypes.any,
  list: PropTypes.any,
};
