import React from 'react';
import PropTypes from 'prop-types';

const CustomPageReviewField = ({ name, data }) => {
  const getNameKey = str => {
    if (str.includes('_')) {
      const key = str.split('_')[0];
      if (key === 'yourRoleEducation') {
        return 'yourRole';
      }
      return key;
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
    yourRole: 'What is your role?',
    yourRoleEducation: 'What is your role?',
    aboutYourRelationshipToFamilyMember:
      'Your relationship to the family member',
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

CustomPageReviewField.propTypes = {
  data: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
};

export default CustomPageReviewField;
