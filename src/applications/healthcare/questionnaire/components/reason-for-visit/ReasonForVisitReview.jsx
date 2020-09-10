import React from 'react';

export default function ReasonForVisitReview(props) {
  // const widget = { formData: 'booop' };
  const widget = props.children.props;
  if (widget.formData) {
    return (
      <div className="review-row">
        <dt>Main reason for visit</dt>
        <dd>
          <span>{widget.formData}</span>
        </dd>
      </div>
    );
  } else {
    return <></>;
  }
}
