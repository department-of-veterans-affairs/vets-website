import React from 'react';

export default function ReasonForVisitReview(props) {
  const widget = props.children.props;
  if (widget.formData) {
    return (
      <div className="review-row" data-testid="reason-for-visit">
        <dt>What's the reason for your visit?</dt>
        <dd>
          <span>{widget.formData}</span>
        </dd>
      </div>
    );
  } else {
    return <></>;
  }
}
