import React from 'react';
import PropTypes from 'prop-types';
import VaccinesListItem from './VaccinesListItem';
import VitalListItem from './VitalListItem';
import LabsAndTestsListItem from './LabsAndTestsListItem';

const RecordListItem = props => {
  const { record, type } = props;

  switch (type) {
    case 'lab and test results':
      return <LabsAndTestsListItem record={record} />;
    case 'vaccine':
      return <VaccinesListItem record={record} />;
    case 'vital':
      return <VitalListItem record={record} />;
    default:
      return <p>Something went wrong, please try again.</p>;
  }
};

export default RecordListItem;

RecordListItem.propTypes = {
  record: PropTypes.object,
  type: PropTypes.string,
};
