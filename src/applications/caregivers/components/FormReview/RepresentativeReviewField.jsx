import React from 'react';
import PropTypes from 'prop-types';
import content from '../../locales/en/content.json';

const RepresentativeReviewField = ({ children }) => {
  const { formData, uiSchema } = children.props;
  return (
    <div className="review-row">
      <dt>{uiSchema['ui:title']}</dt>
      <dd className="dd-privacy-hidden" data-dd-action-name="data value">
        {content[`sign-as-rep-${formData}-text`]}
      </dd>
    </div>
  );
};

RepresentativeReviewField.propTypes = {
  children: PropTypes.shape({
    props: PropTypes.shape({
      formData: PropTypes.bool,
      uiSchema: PropTypes.object,
    }),
  }),
};

export default RepresentativeReviewField;
