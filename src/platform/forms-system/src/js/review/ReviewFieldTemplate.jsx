import React from 'react';
import { getNestedUISchema } from '../helpers';

/*
 * This is the template for each field (which in the schema library means label + widget)
 */

export default function ReviewFieldTemplate(props) {
  const { children, uiSchema, schema } = props;
  const realUISchema = getNestedUISchema(uiSchema);
  const label = realUISchema['ui:title'] || props.label;
  const description = realUISchema['ui:description'];
  const textDescription = typeof description === 'string' ? description : null;
  const DescriptionField =
    typeof description === 'function' ? realUISchema['ui:description'] : null;

  if (realUISchema?.['ui:reviewField']) {
    return realUISchema['ui:reviewField'](props);
  }
  if (schema.type === 'object' || schema.type === 'array') {
    return children;
  }

  // The custom reviewField should handle empty values
  // `hideEmptyValueInReview` option is ignored if a 'ui:reviewField' is defined
  if (realUISchema?.['ui:options']?.hideEmptyValueInReview) {
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
  const Tag = realUISchema?.['ui:options']?.useDlWrap ? 'dl' : 'div';

  return (
    <Tag className="review-row">
      <dt>
        {label}
        {textDescription && <p>{textDescription}</p>}
        {DescriptionField && (
          <DescriptionField options={realUISchema['ui:options']} />
        )}
        {!textDescription && !DescriptionField && description}
      </dt>
      <dd>{children}</dd>
    </Tag>
  );
}
