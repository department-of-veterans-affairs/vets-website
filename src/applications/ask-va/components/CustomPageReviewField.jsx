import React from 'react';

const CustomPageReviewField = ({ name, data }) => {
  const getNameKey = str => {
    if (str.includes('_')) {
      return str.split('_')[0];
    }
    return str;
  };

  const nameKey = getNameKey(name);

  const customReviewHeaderTitles = {
    selectCategory: 'Category and topic',
    whoIsYourQuestionAbout: 'Who your question is about',
  };

  const customReviewPageTitles = {
    selectCategory: 'Category',
    selectTopic: 'Topic',
    selectSubtopic: 'Subtopic',
    whoIsYourQuestionAbout: 'Who is your question about?',
    relationshipToVeteran: 'Your relationship to the Veteran',
    moreAboutYourRelationshipToVeteran:
      'More about your relationship to the Veteran',
    isQuestionAboutVeteranOrSomeoneElse:
      'Is your question about the Veteran or someone else?',
    theirRelationshipToVeteran: 'Their relationship to the Veteran',
  };

  const header = customReviewHeaderTitles[nameKey];
  const title = customReviewPageTitles[nameKey] || 'MISSING TITLE';
  const description = data[nameKey];

  const renderValue = value => {
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }
    return value;
  };

  if (renderValue(description) === undefined) {
    return null;
  }

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

export default CustomPageReviewField;
