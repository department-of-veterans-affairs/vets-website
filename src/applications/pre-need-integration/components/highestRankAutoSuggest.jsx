import React, { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import set from 'platform/utilities/data/set';
import { setData } from 'platform/forms-system/src/js/actions';
import AutoSuggest from './MyAutoSuggestField';
import jsonData from '../utils/Military Ranks.json';

function HighestRankAutoSuggest({ formData }) {
  const dispatch = useDispatch();
  const [branchOfService, setBranchOfService] = useState('');
  const [rankOptions, setRankOptions] = useState([]);
  const [dateRange, setDateRange] = useState({});
  const [rank, setRank] = useState(''); // useState variable for rank

  // Filter ranks based on the selected branch of service and service date range
  const filterRanks = branch => {
    const filteredRanks = jsonData.filter(row => {
      if (row['Branch Of Service Code'] !== branch) {
        return false;
      }
      if (!dateRange) {
        // If dateRange is undefined, skip date filtering
        return true;
      }

      const rankBegin = row['Begin Date'];
      const rankEnd = row['End Date'];
      const from =
        dateRange.from && !dateRange.from.includes('X')
          ? new Date(dateRange.from)
          : null;
      const to =
        dateRange.to && !dateRange.to.includes('X')
          ? new Date(dateRange.to)
          : null;

      // Check if rank's begin date is after user's term 'to' date
      if (to && new Date(rankBegin) > to) {
        return false;
      }

      // Check if rank's end date is before user's term 'from' date
      if (from && new Date(rankEnd) < from) {
        return false;
      }

      return true;
    });

    const ranks = filteredRanks.map(row => ({
      key: row['Rank Code'],
      value: row['Rank Description'] || row['Rank Code'], // Fallback to Rank Code if Description is absent
    }));

    setRankOptions(ranks);
  };

  // Load JSON data and set initial state
  useEffect(
    () => {
      const branches = jsonData.map(item => item['Branch Of Service Code']);
      const uniqueBranches = Array.from(new Set(branches)).map(code => ({
        key: code,
        value: '', // Placeholder for future descriptions
      }));

      const serviceRecords = formData?.application?.veteran?.serviceRecords;
      const currentBranch = serviceRecords?.[0]?.serviceBranch;
      const dateRangeInput = serviceRecords?.[0]?.dateRange;
      if (dateRangeInput) setDateRange(dateRangeInput);
      if (
        currentBranch &&
        uniqueBranches.some(branch => branch.key === currentBranch)
      ) {
        setBranchOfService(currentBranch);
        filterRanks(currentBranch);
      }
    },
    [formData],
  );

  // Update branch of service and rank options when branch changes
  useEffect(
    () => {
      if (branchOfService) {
        setRank('');
        filterRanks(branchOfService);
      }
    },
    [branchOfService],
  );

  return (
    <div>
      {branchOfService !== '' && (
        <div className="highestRank">
          <AutoSuggest
            value={rank} // Use rank as value
            setValue={setRank}
            labels={rankOptions}
            onSelectionChange={selection => {
              setRank(selection?.label); // Update rank when selection changes
              const updatedFormData = set(
                'application.veteran.serviceRecords[0].highestRank',
                selection.value,
                { ...formData },
              );
              dispatch(setData(updatedFormData));
            }}
            maxItems={10}
          />
        </div>
      )}
    </div>
  );
}

const mapStateToProps = state => ({
  formData: state?.form?.data,
});

export default connect(mapStateToProps)(HighestRankAutoSuggest);
