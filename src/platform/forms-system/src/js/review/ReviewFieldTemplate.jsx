import React from 'react';
/*
 * This is the template for each field (which in the schema library means label + widget)
 */

// The uiSchema passed in from props could be a nested object
export const getNestedUISchema = uiSchema => {
  const objKeys = Object.keys(uiSchema);
  const isThisAUISchema = objKeys.find(objKey => objKey.includes('ui:'));
  let nestedUISchema;
  if (!isThisAUISchema) {
    const nestedObjKeys = Object.keys(uiSchema);
    nestedObjKeys.forEach(nestedObjKey => {
      nestedUISchema = uiSchema[nestedObjKey];
      getNestedUISchema(nestedUISchema);
    });
  }
  return nestedUISchema || uiSchema;
};
export default function ReviewFieldTemplate(props) {
  const { children, uiSchema, schema } = props;
  const realUISchema = getNestedUISchema(uiSchema);
  const label = realUISchema['ui:title'] || props.label;
  const description = realUISchema['ui:description'];
  const textDescription = typeof description === 'string' ? description : null;
  const DescriptionField =
    typeof description === 'function' ? realUISchema['ui:description'] : null;

  // `hideEmptyValueInReview` option is ignored if a 'ui:reviewField' is defined
  // give priority to defined `ui:reviewField components`
  if (realUISchema?.['ui:reviewField']) {
    return realUISchema['ui:reviewField'](props);
  }

  if (schema.type === 'object' || schema.type === 'array') {
    return children;
  }

  // The custom reviewField should handle empty values

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
