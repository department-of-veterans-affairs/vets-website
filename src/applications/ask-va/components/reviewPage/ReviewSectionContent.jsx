import React from 'react';
import { VaButton } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import PropTypes from 'prop-types';

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
      className="schemaform-chapter-accordion-content vads-u-padding-top--0 vads-u-margin-bottom--2"
      aria-hidden="false"
    >
      <div className="form-review-panel-page vads-u-margin-bottom--0">
        <form className="rjsf">
          <div className="form-review-panel-page-header-row vads-u-margin-bottom--2">
            {!!title && (
              <h5 className="form-review-panel-page-header vads-u-font-size--h5">
                {title}
              </h5>
            )}
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
            {removeNullitems.map(item => (
              <div className="review-row" key={item.name}>
                <dt className="">{item.name}</dt>
                <dd className="">{item.data}</dd>
              </div>
            ))}
          </dl>
        </form>
      </div>
    </div>
  );
};

export default ReviewSectionContent;

ReviewSectionContent.propTypes = {
  editSection: PropTypes.func.isRequired,
  items: PropTypes.array.isRequired,
  keys: PropTypes.array.isRequired,
  title: PropTypes.string,
};
