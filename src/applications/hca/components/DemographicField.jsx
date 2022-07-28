import React from 'react';
import PropTypes from 'prop-types';

const DemographicField = props => {
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
          <dd>
            {categories.length > 0 && uiSchema[categories[0]]['ui:title']}
          </dd>
        </div>
        {categories.slice(1).map(prop => (
          <div key={prop} className="review-row">
            <dt />
            <dd>{uiSchema[prop]['ui:title']}</dd>
          </div>
        ))}
      </>
    );
  }

  return <ObjectField {...props} />;
};

DemographicField.propTypes = {
  formContext: PropTypes.object,
  formData: PropTypes.object,
  registry: PropTypes.object,
  schema: PropTypes.object,
  uiSchema: PropTypes.object,
};

export default DemographicField;
