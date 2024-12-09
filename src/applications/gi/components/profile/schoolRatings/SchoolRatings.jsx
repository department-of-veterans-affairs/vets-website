/* eslint-disable no-unused-expressions */
import React from 'react';
import PropTypes from 'prop-types';
import { convertRatingToStars } from '../../../utils/helpers';
import { CTRatingsHeaderQuestions } from '../../../constants';
import RatingsAbout from './RatingsAbout';
import RatingHeading from './RatingHeading';
import SchoolCategoryRating from './SchoolCategoryRating';

export default function SchoolRatings({
  ratingAverage,
  ratingCount,
  institutionCategoryRatings,
}) {
  const stars = convertRatingToStars(ratingAverage);

  const updateQuestionRatingsCounts = questionsArrary => {
    // update each question with avg/count from api data
    const tempQuestions = [...questionsArrary];
    const keyValues = tempQuestions.map(keyValue => keyValue);
    keyValues.forEach((valueObj, valueObjIndex) => {
      const objKeys = Object.keys(valueObj);
      objKeys.forEach(key => {
        if (key !== 'question') {
          tempQuestions[valueObjIndex][key] = institutionCategoryRatings[key];
        }
      });
    });
    return tempQuestions;
  };

  const getAccordionResults = () => {
    return CTRatingsHeaderQuestions.map((response, index) => {
      const { title, questions } = response;
      const avgKey = Object.keys(title)[1];
      title[avgKey] = institutionCategoryRatings[avgKey]; // update avg amount for category rating using api data
      const updatedQuestions = updateQuestionRatingsCounts(questions);
      return (
        <SchoolCategoryRating
          key={index}
          titleObj={title}
          questionsObj={updatedQuestions}
        />
      );
    });
  };

  return (
    <div>
      <RatingHeading
        ratingCount={ratingCount}
        displayStars={stars.display}
        ratingAverage={ratingAverage}
      />
      <div className="vads-l-grid-container vads-u-padding--0 small-screen-font">
        <div className="vads-l-row">{getAccordionResults()}</div>
      </div>
      <RatingsAbout />
    </div>
  );
}

SchoolRatings.propTypes = {
  institutionCategoryRatings: PropTypes.object,
  ratingAverage: PropTypes.number,
  ratingCount: PropTypes.number,
};
