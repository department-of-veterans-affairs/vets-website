import React from 'react';
import PropTypes from 'prop-types';
import VaccinesListItem from './VaccinesListItem';
import VitalListItem from './VitalListItem';
import ConditionListItem from './ConditionListItem';
import LabsAndTestsListItem from './LabsAndTestsListItem';
import CareSummariesAndNotesListItem from './CareSummariesAndNotesListItem';
import { recordType } from '../../util/constants';
import AllergyListItem from './AllergyListItem';

const RecordListItem = props => {
  const { record, type } = props;

  switch (type) {
    case recordType.LABS_AND_TESTS:
      return <LabsAndTestsListItem record={record} />;
    case recordType.CARE_SUMMARIES_AND_NOTES:
      return <CareSummariesAndNotesListItem record={record} />;
    case recordType.VACCINES:
      return <VaccinesListItem record={record} />;
    case recordType.VITALS:
      return <VitalListItem record={record} />;
    case recordType.HEALTH_CONDITIONS:
      return <ConditionListItem record={record} />;
    case recordType.ALLERGIES:
      return <AllergyListItem record={record} />;
    default:
      return <p>Something went wrong, please try again.</p>;
  }
};

export default RecordListItem;

RecordListItem.propTypes = {
  record: PropTypes.object,
  type: PropTypes.string,
};
