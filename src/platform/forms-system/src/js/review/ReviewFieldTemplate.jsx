import React from 'react';
import { isReactComponent } from '../../../../utilities/ui';
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

  // `hideEmptyValueInReview` option is ignored if a 'ui:reviewField' is defined
  // The custom reviewField should handle empty values
  if (uiSchema?.['ui:reviewField']) {
    return uiSchema['ui:reviewField'](props);
  }

  if (schema.type === 'object' || schema.type === 'array') {
    return children;
  }

  const filterEmptyFields =
    typeof formContext?.filterEmptyFields === 'boolean'
      ? formContext.filterEmptyFields
      : uiSchema?.['ui:options']?.hideEmptyValueInReview;

  if (filterEmptyFields) {
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
   * For the review page, widgets are chosen based on their schema type
   * (boolean, string, etc) or if ui:widget is defined, then it will look
   * up a review widget based on that same name. See ./widgets.jsx or
   * ./StringField.jsx for examples.
   *
   * Easiest solution is to just leverage the widget logic and choose an
   * appropriate widget for the review page, or we can also choose to
   * set the ui:reviewField or define a ui:reviewWidget
   */
  if (
    uiSchema?.['ui:webComponentField'] &&
    !uiSchema?.['ui:widget'] &&
    !uiSchema?.['ui:reviewField']
  ) {
    if (uiSchema?.['ui:webComponentField'].name === 'VaMemorableDateField') {
      uiSchema['ui:widget'] = 'date';
    } else if (uiSchema?.['ui:webComponentField'].name === 'VaRadioField') {
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
