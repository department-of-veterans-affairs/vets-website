import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

const DemographicViewField = props => {
  const { formContext, uiSchema, schema, formData, registry } = props;
  const { ObjectField } = registry.fields;

  const categories = useMemo(
    () => Object.keys(schema.properties).filter(prop => formData[prop]),
    [formData, schema.properties],
  );

  if (!formContext.reviewMode) {
    return <ObjectField {...props} />;
  }

  return (
    <>
      <div className="review-row">
        <dt>{uiSchema['ui:title']}</dt>
        <dd className="dd-privacy-hidden" data-dd-action-name="data value">
          {categories.length > 0 && uiSchema[categories[0]]['ui:title']}
        </dd>
      </div>
      {categories.slice(1).map(field => {
        const title = uiSchema[field]['ui:title'];
        return (
          <div key={field} className="review-row">
            <dt />
            <dd className="dd-privacy-hidden" data-dd-action-name="data value">
              {title}
            </dd>
          </div>
        );
      })}
    </>
  );
};

DemographicViewField.propTypes = {
  formContext: PropTypes.object,
  formData: PropTypes.object,
  registry: PropTypes.object,
  schema: PropTypes.object,
  uiSchema: PropTypes.object,
};

export default DemographicViewField;
