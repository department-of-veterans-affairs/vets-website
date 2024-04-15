import React from 'react';
import PropTypes from 'prop-types';

const DemographicViewField = props => {
  const { formContext, uiSchema, schema, formData, registry } = props;
  const { ObjectField } = registry.fields;

  if (formContext.reviewMode) {
    const categories = Object.keys(schema.properties).filter(
      prop => formData[prop],
    );

    return (
      <>
        <div className="review-row">
          <dt>{uiSchema['ui:title']}</dt>
          <dd className="dd-privacy-hidden" data-dd-action-name="data value">
            {categories.length > 0 && uiSchema[categories[0]]['ui:title']}
          </dd>
        </div>
        {categories.slice(1).map(prop => (
          <div key={prop} className="review-row">
            <dt />
            <dd className="dd-privacy-hidden" data-dd-action-name="data value">
              {uiSchema[prop]['ui:title']}
            </dd>
          </div>
        ))}
      </>
    );
  }

  return <ObjectField {...props} />;
};

DemographicViewField.propTypes = {
  formContext: PropTypes.object,
  formData: PropTypes.object,
  registry: PropTypes.object,
  schema: PropTypes.object,
  uiSchema: PropTypes.object,
};

export default DemographicViewField;
