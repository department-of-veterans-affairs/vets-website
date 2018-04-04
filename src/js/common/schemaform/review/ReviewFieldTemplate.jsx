import React from 'react';
import classNames from 'classnames';

/*
 * This is the template for each field (which in the schema library means label + widget)
 */

export default function ReviewFieldTemplate(props) {
  const { children, uiSchema, schema } = props;
  const label = uiSchema['ui:title'] || props.label;
  const description = uiSchema['ui:description'];
  const textDescription = typeof description === 'string' ? description : null;
  const DescriptionField = typeof description === 'function'
    ? uiSchema['ui:description']
    : null;
  const hasData = !!(schema.type !== 'object' && schema.type !== 'array' && children.props.formData);
  const SummaryViewField = uiSchema['ui:options'] && uiSchema['ui:options'].summaryViewField;
  const view = hasData && uiSchema['ui:options'] && uiSchema['ui:options'].viewField;
  const textView = typeof view === 'string' ? view : null;
  const ViewField = typeof view === 'function'
    ? uiSchema['ui:options'].viewField
    : null;
  const classes = classNames({
    'review-row': !SummaryViewField && !view,
    'view-row': SummaryViewField || view
  });

  return (schema.type === 'object' && !SummaryViewField) || schema.type === 'array'
    ? children
    : <div className={classes}>
      {SummaryViewField && <SummaryViewField formData={children.props.formData}/>}
      {textView && <p>{textView}</p>}
      {ViewField && <ViewField formData={children.props.formData}/>}
      {!view && !SummaryViewField && <div>
        <dt>
          {label}
          {textDescription && <p>{textDescription}</p>}
          {DescriptionField && <DescriptionField options={uiSchema['ui:options']}/>}
          {!textDescription && !DescriptionField && description}
        </dt>
        <dd>{children}</dd>
      </div>}
    </div>;
}
