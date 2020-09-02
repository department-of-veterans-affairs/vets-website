import React from 'react';
import TextWidget from 'platform/forms-system/src/js/widgets/TextWidget';
import { getLabelClasses } from './widgetHelper';

export default function WeightWidget(props) {
  const lableStyleClasses = getLabelClasses(
    props.value,
    props.formContext.touched.root_weight,
  );

  return (
    <div className="vads-l-grid-container--full">
      <div className="vads-l-row">
        <div className="vads-l-col--2">
          <TextWidget type="number" {...props} />
        </div>
        <div className={lableStyleClasses}>.lbs</div>
      </div>
    </div>
  );
}
