import React from 'react';
import { isReactComponent } from '../../../../utilities/ui';
import VaMemorableDateField from '../web-component-fields/VaMemorableDateField';
import VaRadioField from '../web-component-fields/VaRadioField';
/*
 * This is the template for each field (which in the schema library means label + widget)
 */

export default function ReviewFieldTemplate(props) {
  const { children, uiSchema, schema, formContext } = props;
  const label = uiSchema['ui:title'] || props.label;
  const description = uiSchema['ui:description'];
  const textDescription = typeof description === 'string' ? description : null;
  const DescriptionField = isReactComponent(description)
    ? uiSchema['ui:description']
    : null;
  const pageIndex = formContext?.pagePerItemIndex;

  if (schema.type === 'object' || schema.type === 'array') {
    return children;
  }

  // `hideEmptyValueInReview` option is ignored if a 'ui:reviewField' is defined
  // The custom reviewField should handle empty values
  if (uiSchema?.['ui:reviewField']) {
    return uiSchema['ui:reviewField'](props);
  }

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

  /**
   * Web components field handling
   *
   * RJSF uses widget types to determine how to render the field
   * ui:webComponentFields won't be detected as a widget by the schema library
   * so we need to manually set the widget type here.
   * This only affects the read format, not edit format.
   *
   * Optionally, we can also set the reviewField to use for the field.
   */
  if (
    uiSchema?.['ui:webComponentField'] &&
    !uiSchema?.['ui:widget'] &&
    !uiSchema?.['ui:reviewField']
  ) {
    if (uiSchema?.['ui:webComponentField'] === VaMemorableDateField) {
      uiSchema['ui:widget'] = 'date';
    } else if (uiSchema?.['ui:webComponentField'] === VaRadioField) {
      uiSchema['ui:widget'] = 'radio';
    }
  }

  return (
    <Tag className="review-row">
      <dt>
        {label}
        {textDescription && <p>{textDescription}</p>}
        {DescriptionField && (
          <DescriptionField
            options={uiSchema['ui:options']}
            index={pageIndex}
          />
        )}
        {!textDescription && !DescriptionField && description}
      </dt>
      <dd>{children}</dd>
    </Tag>
  );
}
