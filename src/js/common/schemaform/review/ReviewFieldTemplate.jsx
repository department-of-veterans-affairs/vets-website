import React from 'react';

/*
 * This is the template for each field (which in the schema library means label + widget)
 */

export default function ReviewFieldTemplate(props) {
  const { children, uiSchema, schema } = props;
  const label = uiSchema['ui:title'] || props.label;
  const hasTextDescription = typeof uiSchema['ui:description'] === 'string';
  const DescriptionField = !hasTextDescription && typeof uiSchema['ui:description'] === 'function'
    ? uiSchema['ui:description']
    : null;

  return schema.type === 'object' || schema.type === 'array'
    ? children
    : <div className="review-row">
      <dt>
        {label}
        {hasTextDescription && <p>{uiSchema['ui:description']}</p>}
        {DescriptionField && <DescriptionField options={uiSchema['ui:options']}/>}
      </dt>
      <dd>{children}</dd>
    </div>;
}
