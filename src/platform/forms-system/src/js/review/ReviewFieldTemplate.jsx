import React from 'react';
/*
 * This is the template for each field (which in the schema library means label + widget)
 */

export default function ReviewFieldTemplate(props) {
  const { children, uiSchema, schema } = props;
  const label = uiSchema['ui:title'] || props.label;
  const description = uiSchema['ui:description'];
  const textDescription = typeof description === 'string' ? description : null;
  const DescriptionField =
    typeof description === 'function' ? uiSchema['ui:description'] : null;

  // `hideEmptyValueInReview` option is ignored if a 'ui:reviewField' is defined
  // give priority to defined `ui:reviewField components`
  if (uiSchema?.['ui:reviewField']) {
    return uiSchema['ui:reviewField'](props);
  }

  if (schema.type === 'object' || schema.type === 'array') {
    return children;
  }

  // The custom reviewField should handle empty values

  if (uiSchema?.['ui:options']?.hideEmptyValueInReview) {
    let value = children;
    if (typeof children !== 'undefined') {
      if ('props' in children) {
        value = children.props.formData;
      } else if ('value' in children) {
        value = children.value;
      }
    }
    if (typeof value === 'undefined' || value === null || value === '') {
      return null;
    }
  }
  const Tag = uiSchema?.['ui:options']?.useDlWrap ? 'dl' : 'div';

  return (
    <Tag className="review-row">
      <dt>
        {label}
        {textDescription && <p>{textDescription}</p>}
        {DescriptionField && (
          <DescriptionField options={uiSchema['ui:options']} />
        )}
        {!textDescription && !DescriptionField && description}
      </dt>
      <dd>{children}</dd>
    </Tag>
  );
}
