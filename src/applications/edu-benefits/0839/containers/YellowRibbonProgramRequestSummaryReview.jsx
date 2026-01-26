import React from 'react';
import PropTypes from 'prop-types';
import ArrayBuilderSummaryPage from 'platform/forms-system/src/js/patterns/array-builder/ArrayBuilderSummaryPage';
import AddEligibileStudents from '../components/AddEligibileStudents';

const YellowRibbonProgramRequestSummaryReview = props => {
  const { arrayBuilder } = props;
  const DefaultSummaryPage = ArrayBuilderSummaryPage(arrayBuilder);

  return (
    <>
      <DefaultSummaryPage {...props} />
      {props?.data?.yellowRibbonProgramRequest?.length > 0 && (
        <AddEligibileStudents />
      )}
    </>
  );
};
YellowRibbonProgramRequestSummaryReview.propTypes = {
  arrayBuilder: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
};

export default YellowRibbonProgramRequestSummaryReview;
