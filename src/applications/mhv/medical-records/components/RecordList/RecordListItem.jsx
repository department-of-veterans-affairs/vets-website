import React from 'react';
import PropTypes from 'prop-types';
import VaccineListItem from './VaccineListItem';
import VitalListItem from './VitalListItem';
import ConditionListItem from './ConditionListItem';

const RecordListItem = props => {
  const { record, type } = props;

  switch (type) {
    case 'vaccine':
      return <VaccineListItem record={record} />;
    case 'vital':
      return <VitalListItem record={record} />;
    case 'health condition':
      return <ConditionListItem record={record} />;
    default:
      return <p>Something went wrong, please try again.</p>;
  }
};

export default RecordListItem;

RecordListItem.propTypes = {
  record: PropTypes.object,
  type: PropTypes.string,
};
