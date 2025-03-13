import React from 'react';
import { VaButton } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const ReviewSectionContent = ({
  title,
  editSection,
  keys = [],
  items = [],
}) => {
  const removeNullitems = items.filter(item => item.data);
  const reviewListKeys = removeNullitems
    .map(item => keys.filter(key => key.split('_')[0] === item.key)[0])
    .filter(key => key !== undefined && key !== null);

  return (
    <div
      className="usa-accordion-content schemaform-chapter-accordion-content vads-u-padding-top--0 vads-u-margin-bottom--2"
      aria-hidden="false"
    >
      <div className="form-review-panel-page vads-u-margin-bottom--0">
        <form className="rjsf">
          <div className="form-review-panel-page-header-row">
            <h4 className="form-review-panel-page-header vads-u-font-size--h5 vads-u-margin-bottom--2">
              {title}
            </h4>
            <div className="vads-u-justify-content--flex-end">
              <VaButton
                text="Edit"
                label={`Edit ${title}`}
                onClick={() => editSection(reviewListKeys, title)}
                secondary
              />
            </div>
          </div>
          <dl className="review vads-u-margin-top--0 vads-u-margin-bottom--0">
            <dl className="vads-u-border-top--0 vads-u-margin-top--0 vads-u-margin-bottom--0">
              {removeNullitems.map(item => (
                <div className="review-row" key={item.name}>
                  <dt className="">{item.name}</dt>
                  <dd className="">{item.data}</dd>
                </div>
              ))}
            </dl>
          </dl>
        </form>
      </div>
    </div>
  );
};

export default ReviewSectionContent;
