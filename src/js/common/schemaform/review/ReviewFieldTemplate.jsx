import React from 'react';

/*
 * This is the template for each field (which in the schema library means label + widget)
 */

export default function ReviewFieldTemplate(props) {
  const { children, uiSchema, schema } = props;
  const label = uiSchema['ui:title'] || props.label;

  return schema.type === 'object' || schema.type === 'array'
    ? children
    : <div className="review-row"><dt>{label}</dt><dd>{children}</dd></div>;
}
