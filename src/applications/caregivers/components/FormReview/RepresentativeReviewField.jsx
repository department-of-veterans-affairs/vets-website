import React from 'react';
import PropTypes from 'prop-types';
import content from '../../locales/en/content.json';

const RepresentativeReviewField = ({
  children: {
    props: { uiSchema, formData },
  },
}) => (
  <div className="review-row">
    <dt>{uiSchema['ui:title']}</dt>
    <dd className="dd-privacy-hidden" data-dd-action-name="data value">
      {formData === 'yes'
        ? content['sign-as-rep-yes-text']
        : content['sign-as-rep-no-text']}
    </dd>
  </div>
);

RepresentativeReviewField.propTypes = {
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.node]),
};

export default RepresentativeReviewField;
