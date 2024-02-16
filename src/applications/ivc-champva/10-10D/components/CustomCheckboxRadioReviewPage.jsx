import React from 'react';
import { VaButton } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

// Custom review page for use with the applicant medicare and OHI screens
export function CustomCheckboxRadioReviewPage(props) {
  const {
    data,
    useLabels,
    editPage,
    title,
    generateOptions,
    pagePerItemIndex,
  } = props || {};
  const { labels, options, description, keyname } = generateOptions(props);
  const currentApp = data?.applicants?.[pagePerItemIndex];

  return data ? (
    <div className="form-review-panel-page">
      <div className="form-review-panel-page-header-row">
        <h4 className="form-review-panel-page-header vads-u-font-size--h5">
          {title(currentApp)}
        </h4>
        <VaButton secondary onClick={editPage} text="Edit" uswds />
      </div>
      <dl className="review">
        <div className="review-row">
          <dt>{description}</dt>
          <dd>
            {useLabels // <select>
              ? labels
                  .filter(el => currentApp?.[keyname]?.includes(el.value))
                  .map(el => el.title)
                  .join(', ')
              : options.map(
                  // <radio>
                  opt => (opt.value === currentApp?.[keyname] ? opt.label : ''),
                )}
          </dd>
        </div>
      </dl>
    </div>
  ) : null;
}
