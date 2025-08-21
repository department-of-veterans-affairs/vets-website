import React from 'react';
import PropTypes from 'prop-types';
import { loincCodes } from '../../../util/constants';
import DischargeSummaryListItem from './DischargeSummaryListItem';
import NoteListItem from './NoteListItem';

const CareSummariesAndNotesListItem = props => {
  const { record } = props;
  const isDischargeSummary = record.type === loincCodes.DISCHARGE_SUMMARY;
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
