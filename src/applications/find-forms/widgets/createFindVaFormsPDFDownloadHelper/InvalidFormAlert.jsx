import React from 'react';
import PropTypes from 'prop-types';

// InvalidFormDownload as in the name, react component to render an alert
const InvalidFormDownload = ({ downloadUrl, isRelatedForm }) => {
  const subject = encodeURIComponent('Bad PDF link');
  const body = encodeURIComponent(
    `I tried to download this form but the link doesn't work: ${downloadUrl}`,
  );
  const mailto = `mailto:VaFormsManagers@va.gov?subject=${subject}&body=${body}`;

  return (
    <va-alert status="error">
      {!isRelatedForm && <h3 slot="headline">This form link isn’t working</h3>}
      {isRelatedForm && <h4 slot="headline">This form link isn’t working</h4>}
      We’re sorry, but the form you’re trying to download appears to have an
      invalid link. Please{' '}
      <va-link href={mailto} text="email the forms managers" /> for help with{' '}
      this form.
    </va-alert>
  );
};

InvalidFormDownload.propTypes = {
  downloadUrl: PropTypes.string,
  isRelatedForm: PropTypes.bool,
};

export default InvalidFormDownload;
