import React, { useState } from 'react';
import PropTypes from 'prop-types';
import RatingsAccordion from './RatingsAccordion';

const SchoolCategoryRating = ({ titleObj, questionsObj }) => {
  const { heading } = titleObj;
  const categoryRating = Object.values(titleObj)[1];

  const [openNames, setOpenNames] = useState([]);

  const handleHandler = categoryName => {
    let newOpenNames = [...openNames];
    if (newOpenNames.includes(categoryName)) {
      newOpenNames = newOpenNames.filter(item => item !== categoryName);
    } else {
      newOpenNames.push(categoryName);
    }
    setOpenNames(newOpenNames);
  };

  return (
    <div className="medium-screen:vads-l-col--6 small-screen:vads-l-col--12 xsmall-screen:vads-l-col--12">
      <div className="vads-u-padding-left--0">
        <RatingsAccordion
          title={heading}
          openHandler={() => handleHandler(heading)}
          open={openNames.includes(heading)}
          categoryRating={categoryRating}
          questionObj={questionsObj}
        />
      </div>
    </div>
  );
};

SchoolCategoryRating.propTypes = {
  questionsObj: PropTypes.object.isRequired,
  titleObj: PropTypes.shape({
    heading: PropTypes.string.isRequired,
  }).isRequired,
};

export default SchoolCategoryRating;
