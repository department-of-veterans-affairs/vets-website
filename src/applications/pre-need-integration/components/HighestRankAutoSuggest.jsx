import React, { useEffect, useState, useCallback } from 'react';
import { connect, useDispatch } from 'react-redux';
import { setData } from 'platform/forms-system/src/js/actions';
import PropTypes from 'prop-types';
import AutoSuggest from './MilitaryAutoSuggestField';
import jsonData from '../utils/Military Ranks.json';

function HighestRankAutoSuggest({ formData, formContext, idSchema, uiSchema }) {
  const dispatch = useDispatch();
  const [branchOfService, setBranchOfService] = useState('');
  const [rankOptions, setRankOptions] = useState([]);
  const [rank, setRank] = useState('');
  const [index, setIndex] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  /*
  useEffect(() => {
    console.log("Index in highest rank auto suggest: ", index);
    console.log("Branch of service: ", branchOfService);    
    console.log("Rank Options lenght: ", rankOptions.length);
    console.log("Rank: ", rank);    
  }, []);
*/
  const extractIndex = id => {
    // const match = id.match(/serviceRecords_(\d+)_highestRank/);
    const match = id.match(/(\d+)\/service-period/);
    // eslint-disable-next-line radix
    return match ? parseInt(match[1], 0) : 0;
  };

  const handleSelectionChange = selection => {
    const highestRankTemp =
      typeof selection === 'string' ? selection : selection.key;

    if (selection.key) {
      // console.log("Handle Selection Change");
      setRank(`${selection.key.toUpperCase()} - ${selection.value}`);
    } else {
      // console.log("Handle Selection Change ELSE ", highestRankTemp);
      setRank(highestRankTemp);
    }

    // if (formData.application.veteran.serviceRecords) {
    // console.log("form data: ", formData);

    if (formData.serviceRecords) {
      // } && selection.key) {
      // console.log("We in here");

      const updatedFormData = {
        ...formData,
        // application: {
        //   ...formData.application,
        //   veteran: {
        //     ...formData.application.veteran,
        // serviceRecords: formData.application.veteran.serviceRecords.map(
        serviceRecords: formData.serviceRecords.map(
          (record, idx) =>
            idx === index
              ? {
                  ...record,
                  highestRank: highestRankTemp,
                  highestRankDescription: selection.value || undefined,
                }
              : record,
        ),
        //   },
        // },
      };
      // console.log("Dispatch data");

      dispatch(setData(updatedFormData));
    }
  };

  // Parse the date string into a Date object. This is needed in order to play nicely
  // with the Military Ranks.json file
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
          !serviceStartDate || !rankEndDate || rankEndDate >= serviceStartDate;
        const isEndDateMatch =
          !serviceEndDate || !rankStartDate || rankStartDate <= serviceEndDate;

        return isBranchMatch && isStartDateMatch && isEndDateMatch;
      })
      .map(row => ({
        key: row['Rank Code'],
        value: row['Rank Description'] || row['Rank Code'],
      }));
  }, []);

  useEffect(
    () => {
      // const serviceRecords = formData?.application?.veteran?.serviceRecords;
      const serviceRecords = formData?.serviceRecords;
      // const currentIndex = extractIndex(idSchema?.$id);
      const currentIndex = extractIndex(window.location.href);
      // const currentIndex = 0;
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
          if (currentRank.highestRankDescription) {
            setRank(
              `${currentRank.highestRank} - ${
                currentRank.highestRankDescription
              }`,
            );
          } else if (typeof currentRank.highestRank !== 'object') {
            setRank(currentRank.highestRank);
          } else {
            setRank(' ');
          }
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

  const hint = uiSchema['ui:options']?.hint || null;

  return (
    <div>
      {!formContext.reviewMode &&
        hint && <div className="usa-hint">{hint}</div>}
      {!formContext.onReviewPage ||
      (formContext.onReviewPage && !formContext.reviewMode) ? (
        <div className="highestRank">
          <AutoSuggest
            value={typeof rank === 'object' || rank === undefined ? '' : rank}
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

// Added PropTypes Validation for eslint purposes
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
  uiSchema: PropTypes.shape({
    'ui:options': PropTypes.shape({
      hint: PropTypes.string,
    }),
  }),
};

const mapStateToProps = state => ({
  formData: state?.form?.data,
});

export default connect(mapStateToProps)(HighestRankAutoSuggest);
