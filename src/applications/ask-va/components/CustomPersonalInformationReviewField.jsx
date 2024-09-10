import React from 'react';

const CustomPersonalInformationReviewField = ({ name, data }) => {
  const getNameKey = str => {
    if (str.includes('_')) {
      return str.split('_')[0];
    }
    return str;
  };

  const nameKey = getNameKey(name);

  const customReviewHeaderTitles = {
    aboutYourself: 'Your personal information',
  };

  const customReviewPageTitles = {};

  const header = customReviewHeaderTitles[nameKey];
  const title = customReviewPageTitles[nameKey] || 'MISSING TITLE';
  const description = data[nameKey];

  const renderValue = value => {
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }
    return value;
  };

  return (
    <>
      {header && <h5 className="vads-u-padding-y--1">{header}</h5>}
      <dl className="review custom-review-dl">
        <div className="review-row vads-u-border-top--0">
          <dt>{title}</dt>
          <dd>
            <span
              className="dd-privacy-hidden"
              data-dd-action-name="data value"
            >
              {renderValue(description)}
            </span>
          </dd>
        </div>
      </dl>
    </>
  );
};

export default CustomPersonalInformationReviewField;
