import React from 'react';
import PropTypes from 'prop-types';
import VaccinesListItem from './VaccinesListItem';
import VitalListItem from './VitalListItem';
import ConditionListItem from './ConditionListItem';
import LabsAndTestsListItem from './LabsAndTestsListItem';
import CareSummariesAndNotesListItem from './CareSummariesAndNotesListItem';
import { RecordType } from '../../util/constants';
import AllergyListItem from './AllergyListItem';

const RecordListItem = props => {
  const { record, type } = props;

  switch (type) {
    case RecordType.LABS_AND_TESTS:
      return <LabsAndTestsListItem record={record} />;
    case RecordType.CARE_SUMMARIES_AND_NOTES:
      return <CareSummariesAndNotesListItem record={record} />;
    case RecordType.VACCINES:
      return <VaccinesListItem record={record} />;
    case RecordType.VITALS:
      return <VitalListItem record={record} />;
    case RecordType.HEALTH_CONDITIONS:
      return <ConditionListItem record={record} />;
    case RecordType.ALLERGIES:
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
