import React from 'react';
import PropTypes from 'prop-types';

const field = 'preferredRepresentative';

const RepresentativeReviewField = ({ formData, schema, title, uiSchema }) => {
  const repUiSchema = uiSchema[field];
  const repSchema = schema.properties[field];
  const repData = formData[field];

  return (
    <>
      <div className="form-review-panel-page-header-row">
        <h4 className="form-review-panel-page-header vads-u-font-size--h5">
          {title}
        </h4>
      </div>
      <dl className="review">
        {Object.keys(repSchema.properties).map((key, index) => (
          <div key={index} className="review-row">
            <dt>{repUiSchema.properties[key]['ui:title']}</dt>
            <dd>{repData[key]}</dd>
          </div>
        ))}
      </dl>
    </>
  );
};

RepresentativeReviewField.propTypes = {
  formData: PropTypes.object,
  schema: PropTypes.object,
  title: PropTypes.string,
  uiSchema: PropTypes.object,
};

export default RepresentativeReviewField;
