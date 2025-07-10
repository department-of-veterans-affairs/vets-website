import React from 'react';
import PropTypes from 'prop-types';

import GetFormHelp from '../components/GetFormHelp';

export default function ConfirmationPage() {
  return (
    <>
      <h2 className="vads-u-font-size--h3">
        Download, print, and sign your form
      </h2>
      <p>First, you’ll need to download your form.</p>
      <va-link
        download
        filetype="PDF"
        href={localStorage.getItem('pdfUrl')}
        filename="VA form"
        label="Download your form"
        text="Download your form"
      />

      <div>
        <h2 className="help-heading">Need help?</h2>
        <GetFormHelp />
      </div>
    </>
  );
}

ConfirmationPage.propTypes = {
  router: PropTypes.object,
};
