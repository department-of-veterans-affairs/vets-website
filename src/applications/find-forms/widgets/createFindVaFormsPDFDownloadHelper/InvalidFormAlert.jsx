import React from 'react';
import PropTypes from 'prop-types';

// InvalidFormDownload as in the name, react component to render an alert
const InvalidFormDownload = ({ downloadUrl }) => {
  const subject = encodeURIComponent('Bad PDF link');
  const body = encodeURIComponent(
    `I tried to download this form but the link doesn't work: ${downloadUrl}`,
  );
  const mailto = `mailto:VaFormsManagers@va.gov?subject=${subject}&body=${body}`;

  return (
    <va-alert status="error" uswds>
      <h3 slot="headline">This form link isn’t working</h3>
      We’re sorry, but the form you’re trying to download appears to have an
      invalid link. Please <a href={mailto}>email the forms managers</a> for
      help with this form.
    </va-alert>
  );
};

InvalidFormDownload.propTypes = {
  downloadUrl: PropTypes.string,
};

export default InvalidFormDownload;
