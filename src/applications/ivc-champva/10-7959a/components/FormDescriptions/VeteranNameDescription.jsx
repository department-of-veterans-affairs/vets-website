import React from 'react';
import PropTypes from 'prop-types';
import content from '../../locales/en/content.json';

const VeteranNameDescription = ({ formData }) => {
  const isSponsor = formData?.certifierRole === 'sponsor';
  return isSponsor ? (
    <div data-testid="veteran-name-description">
      <p>
        You selected that you’re the Veteran filling out this claim for your
        spouse or dependent. This means that you’re their sponsor (this is the
        Veteran or service member the beneficiary is connected to).
      </p>
      <p>
        Enter your information here. We’ll use this information to confirm the
        beneficiary’s eligibility.
      </p>
    </div>
  ) : (
    content['veteran--name-desc']
  );
};

VeteranNameDescription.propTypes = {
  formData: PropTypes.shape({
    certifierRole: PropTypes.string,
  }),
};

export default VeteranNameDescription;
