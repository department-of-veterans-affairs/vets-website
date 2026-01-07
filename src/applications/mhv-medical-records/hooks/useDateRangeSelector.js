import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { calculateDateRange, sendDataDogAction } from '../util/helpers';
import { getDateRangeList } from '../components/shared/DateRangeSelector';
import { loadStates } from '../util/constants';

/**
 * Custom hook for handling date range selection across domains.
 * Consolidates the duplicated handleDateRangeSelect logic from
 * LabsAndTests.jsx and CareSummariesAndNotes.jsx.
 *
 * @param {Object} options - Configuration options
 * @param {Function} options.updateDateRangeAction - Redux action creator to update date range
 * @param {string} options.updateListStateActionType - Action type for updating list state
 * @param {string} options.dataDogLabel - Label for DataDog tracking
 * @returns {Function} handleDateRangeSelect callback
 *
 * @example
 * const handleDateRangeSelect = useDateRangeSelector({
 *   updateDateRangeAction: updateNotesDateRange,
 *   updateListStateActionType: Actions.CareSummariesAndNotes.UPDATE_LIST_STATE,
 *   dataDogLabel: 'Notes date option',
 * });
 */
const useDateRangeSelector = ({
  updateDateRangeAction,
  updateListStateActionType,
  dataDogLabel,
}) => {
  const dispatch = useDispatch();

  return useCallback(
    event => {
      const { value } = event.detail;
      const { fromDate, toDate } = calculateDateRange(value);

      // Update Redux with new range
      dispatch(updateDateRangeAction(value, fromDate, toDate));

      // Update list state to trigger refetch
      dispatch({
        type: updateListStateActionType,
        payload: loadStates.PRE_FETCH,
      });

      // DataDog tracking
      const selectedOption = getDateRangeList().find(
        option => option.value === value,
      );
      const label = selectedOption ? selectedOption.label : 'Unknown';
      sendDataDogAction(`${dataDogLabel} - ${label}`);
    },
    [dispatch, updateDateRangeAction, updateListStateActionType, dataDogLabel],
  );
};

export default useDateRangeSelector;
