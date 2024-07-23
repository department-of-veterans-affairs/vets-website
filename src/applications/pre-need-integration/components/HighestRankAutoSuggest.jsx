import React, { useEffect, useState, useCallback } from 'react';
import { connect, useDispatch } from 'react-redux';
import { setData } from 'platform/forms-system/src/js/actions';
import PropTypes from 'prop-types';
import AutoSuggest from './MilitaryAutoSuggestField';
import jsonData from '../utils/Military Ranks.json';

function HighestRankAutoSuggest({ formData, formContext, idSchema }) {
  const dispatch = useDispatch();
  const [branchOfService, setBranchOfService] = useState('');
  const [rankOptions, setRankOptions] = useState([]);
  const [rank, setRank] = useState('');
  const [index, setIndex] = useState(0);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Extract the index from the id to identify the current service record
  const extractIndex = id => {
    const match = id.match(/serviceRecords_(\d+)_highestRank/);
    return match ? parseInt(match[1], 10) : 0;
  };

  // Handle selection change in AutoSuggest component
  const handleSelectionChange = selection => {
    if (selection.key)
      setRank(`${selection.key.toUpperCase()} - ${selection.value}`);
    else setRank('');

    // Update the form data in the redux store with the selected rank
    if (formData.application.veteran.serviceRecords) {
      const updatedFormData = {
        ...formData,
        application: {
          ...formData.application,
          veteran: {
            ...formData.application.veteran,
            serviceRecords: formData.application.veteran.serviceRecords.map(
              (record, idx) =>
                idx === index
                  ? {
                      ...record,
                      highestRank: selection.key,
                      highestRankDescription: selection.value,
                    }
                  : record,
            ),
          },
        },
      };

      dispatch(setData(updatedFormData));
    }
  };

  // Parse the date string into a Date object
  const parseDate = dateString => {
    if (!dateString) return null;
    const parts = dateString.split('/');
    if (parts.length === 3) {
      const [month, day, year] = parts.map(part => part.padStart(2, '0'));
      return new Date(`${year}-${month}-${day}`);
    }
    return new Date(dateString);
  };

  // Get ranks for a specific branch and within the specified date range
  const getRanksForBranch = useCallback((branch, start, end) => {
    const serviceStartDate = start ? parseDate(start) : null;
    const serviceEndDate = end ? parseDate(end) : null;

    return jsonData
      .filter(row => {
        const rankStartDate = parseDate(row['Begin Date']);
        const rankEndDate = parseDate(row['End Date']);
        const isBranchMatch = row['Branch Of Service Code'] === branch;
        const isStartDateMatch =
          !serviceStartDate || rankEndDate >= serviceStartDate;
        const isEndDateMatch =
          !serviceEndDate || rankStartDate <= serviceEndDate;

        return isBranchMatch && isStartDateMatch && isEndDateMatch;
      })
      .map(row => ({
        key: row['Rank Code'],
        value: row['Rank Description'] || row['Rank Code'],
      }));
  }, []);

  // Update component state when formData or idSchema changes
  useEffect(
    () => {
      const serviceRecords = formData?.application?.veteran?.serviceRecords;
      const currentIndex = extractIndex(idSchema?.$id);
      setIndex(currentIndex);

      if (serviceRecords) {
        const currentBranch = serviceRecords[currentIndex]?.serviceBranch;
        const currentStartDate = serviceRecords[currentIndex]?.dateRange?.from;
        const currentEndDate = serviceRecords[currentIndex]?.dateRange?.to;

        if (currentBranch !== branchOfService) {
          setBranchOfService(currentBranch);
        }
        if (currentStartDate !== startDate) {
          setStartDate(currentStartDate);
        }
        if (currentEndDate !== endDate) {
          setEndDate(currentEndDate);
        }

        const currentRank = serviceRecords[currentIndex];
        if (currentRank?.highestRank) {
          setRank(
            `${currentRank.highestRank} - ${
              currentRank.highestRankDescription
            }`,
          );
        }
      }
    },
    [formData, idSchema, branchOfService, startDate, endDate],
  );

  // Update rank options when branchOfService, startDate, or endDate changes
  useEffect(
    () => {
      if (branchOfService) {
        const newRankOptions = getRanksForBranch(
          branchOfService,
          startDate,
          endDate,
        );
        if (newRankOptions.length === 0) {
          const selection = { key: undefined, value: undefined };
          handleSelectionChange(selection);
        }
        setRankOptions(newRankOptions);
      }
    },
    [branchOfService, startDate, endDate, getRanksForBranch],
  );

  return (
    <div>
      {!formContext.onReviewPage ||
      (formContext.onReviewPage && !formContext.reviewMode) ? (
        <div className="highestRank">
          <AutoSuggest
            value={rank || ''}
            setValue={setRank}
            labels={rankOptions}
            onSelectionChange={handleSelectionChange}
          />
        </div>
      ) : (
        <div>
          <span>{rank}</span>
        </div>
      )}
    </div>
  );
}

HighestRankAutoSuggest.propTypes = {
  formData: PropTypes.shape({
    application: PropTypes.shape({
      veteran: PropTypes.shape({
        serviceRecords: PropTypes.arrayOf(
          PropTypes.shape({
            serviceBranch: PropTypes.string,
            dateRange: PropTypes.shape({
              from: PropTypes.string,
              to: PropTypes.string,
            }),
            highestRank: PropTypes.string,
            highestRankDescription: PropTypes.string,
          }),
        ),
      }),
    }),
  }),
  formContext: PropTypes.shape({
    onReviewPage: PropTypes.bool,
    reviewMode: PropTypes.bool,
  }),
  idSchema: PropTypes.shape({
    $id: PropTypes.string,
  }),
};

const mapStateToProps = state => ({
  formData: state?.form?.data,
});

export default connect(mapStateToProps)(HighestRankAutoSuggest);
