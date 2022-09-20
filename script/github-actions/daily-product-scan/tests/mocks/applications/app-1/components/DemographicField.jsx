/* eslint-disable prefer-destructuring */
/* eslint-disable react/prop-types */
import React from 'react';

export default function DemographicField(props) {
  const { formContext, uiSchema, schema, formData } = props;
  const ObjectField = props.registry.fields.ObjectField;

  if (!formContext.reviewMode) {
    return <ObjectField {...props} />;
  }

  const categories = Object.keys(schema.properties).filter(
    prop => formData[prop],
  );
  return (
    <>
      <div className="review-row">
        <dt>{uiSchema['ui:title']}</dt>
        {categories.length > 0 && (
          <dd>{uiSchema[categories[0]]['ui:title']}</dd>
        )}
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
