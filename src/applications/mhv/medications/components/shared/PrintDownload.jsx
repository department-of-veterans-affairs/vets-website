import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { VaLink } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import FeedbackEmail from './FeedbackEmail';

const PrintDownload = props => {
  const { download, isSuccess, list } = props;
  const [isError, setIsError] = useState(false);

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
  const handleDownloadPDF = async () => {
    try {
      await download();
      setIsError(false);
    } catch {
      setIsError(true);
    }
  };

  return (
    <>
      {isSuccess && (
        <div className="vads-u-margin-bottom--2">
          <va-alert status="success" background-only uswds>
            <p className="vads-u-margin--0">Download complete</p>
          </va-alert>
        </div>
      )}
      {isError && (
        <div className="vads-u-margin-bottom--2">
          <va-alert status="error" uswds>
            <h2 slot="headline">We can’t access your medications right now</h2>
            <p className="vads-u-margin-bottom--0">
              We’re sorry. There’s a problem with our system. Check back later.
            </p>
            <p className="vads-u-margin--0">
              If it still doesn’t work, email us at <FeedbackEmail />
            </p>
          </va-alert>
        </div>
      )}
      <VaLink
        download
        uswds
        className="vads-u-margin-bottom--3 vads-u-display--block"
        onClick={handleDownloadPDF}
        data-testid="download-pdf-button"
        text={list ? 'Download your medication list as a PDF' : 'Download PDF'}
      />

      {/* Code for dropdown print/download button should we go back to it
       <div className="print-download vads-u-margin-y--2 no-print">
         <button
           type="button"
           className={toggleMenuButtonClasses}
           onClick={() => setMenuOpen(!menuOpen)}
           data-testid="print-records-button"
           aria-expanded={menuOpen}
         >
           <span>Print or download this {list ? 'list' : 'page'}</span>
           <i className={menuIconClasses} aria-hidden="true" />
         </button>
         <ul className={menuOptionsClasses}>
           <li>
             <button
               type="button"
               data-testid="print-button"
               onClick={window.print}
             >
               Print {list && 'list'}
             </button>
           </li>
           <li>
             <button
               type="button"
               data-testid="download-pdf-button"
               onClick={download}
             >
               Download {list && 'list '}
               as PDF
             </button>
           </li>
         </ul>
       </div> */}
    </>
  );
};

export default PrintDownload;

PrintDownload.propTypes = {
  download: PropTypes.any,
  isSuccess: PropTypes.bool,
  list: PropTypes.any,
};
