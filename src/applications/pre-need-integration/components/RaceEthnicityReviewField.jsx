import React from 'react';

export default function RaceEthnicityReviewField(props) {
  const { formContext, uiSchema, schema, formData } = props;
  const { ObjectField } = props.registry.fields;

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
      </div>
      {categories.map(prop => (
        <div key={prop} className="review-row">
          <dt />
          <dd>{uiSchema[prop]['ui:title']}</dd>
        </div>
      ))}
    </>
  );
}
