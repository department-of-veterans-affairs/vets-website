import React from 'react';
import TextWidget from 'platform/forms-system/src/js/widgets/TextWidget';
import { getLabelClasses } from './widgetHelper';

export default function WeightWidget(props) {
  const lableStyleClasses = getLabelClasses(
    props.value,
    props.formContext.touched.root_weight,
  );
  const { formContext } = props;
  // inReviewMode = true (review page view, not in edit mode)
  // inReviewMode = false (in edit mode)
  const onReviewPage = formContext.onReviewPage;
  const inReviewMode = onReviewPage && formContext.reviewMode;
  const displayValue = inReviewMode ? (
    <div>{props.value} lbs.</div>
  ) : (
    <div className="vads-l-grid-container--full">
      <div className="vads-l-row">
        <div className="vads-l-col--2">
          <TextWidget type="number" {...props} />
        </div>
        <div className={lableStyleClasses}>.lbs</div>
      </div>
    </div>
  );
  return <span>{displayValue}</span>;
}
