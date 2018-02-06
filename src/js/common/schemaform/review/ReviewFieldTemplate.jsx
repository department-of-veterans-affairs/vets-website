import React from 'react';

/*
 * This is the template for each field (which in the schema library means label + widget)
 */

export default function ReviewFieldTemplate(props) {
  const { children, uiSchema, schema } = props;
  const label = uiSchema['ui:title'] || props.label;
  const description = uiSchema['ui:reviewDescription'];
  const textDescription = typeof description === 'string' ? description : null;
  const DescriptionField = typeof description === 'function' ? description : null;
  let reviewDescription = children;

  if (schema.type !== 'object' && schema.type !== 'array') {
    reviewDescription = (
      <div className="review-row">
        <dt>
          {label}
          {textDescription && <p>{textDescription}</p>}
          {DescriptionField && <DescriptionField options={uiSchema['ui:options']}/>}
          {!textDescription && !DescriptionField && description} {/* Is this a possible option? */}
        </dt>
        <dd>{children}</dd>
      </div>
    );
  }

  if (uiSchema['ui:reviewDescription']) {
    const ReviewDescriptionField = uiSchema['ui:reviewDescription'];
    reviewDescription = (
      <div className="va-growable-background">
        <ReviewDescriptionField formData={children.props.formdData}/>
      </div>
    );
  }


  return reviewDescription;
}
