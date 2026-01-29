import React from 'react';
import PropTypes from 'prop-types';
import { loincCodes, noteTypes } from '../../../util/constants';
import DischargeSummaryListItem from './DischargeSummaryListItem';
import NoteListItem from './NoteListItem';

const CareSummariesAndNotesListItem = props => {
  const { record } = props;
  // The OR is for backward compatibility, the goal is to use noteTypes
  const isDischargeSummary =
    record.type === noteTypes.DISCHARGE_SUMMARY ||
    record.type === loincCodes.DISCHARGE_SUMMARY;

  return isDischargeSummary ? (
    <DischargeSummaryListItem record={record} />
  ) : (
    <NoteListItem record={record} />
  );
};

CareSummariesAndNotesListItem.propTypes = {
  record: PropTypes.object,
};

export default CareSummariesAndNotesListItem;
