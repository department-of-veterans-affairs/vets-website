import React, { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import set from 'platform/utilities/data/set';
import { setData } from 'platform/forms-system/src/js/actions';
import AutoSuggest from './MyAutoSuggestField';
import jsonData from '../utils/Military Ranks.json'; // Adjusted to correct path

function ImprovedMilitaryHistoryPage({ formData }) {
  const dispatch = useDispatch();
  const [serviceLabels, setServiceLabels] = useState([]);
  const [branchOfService, setBranchOfService] = useState('');
  const [rankOptions, setRankOptions] = useState([]);

  // Filter ranks based on the selected branch of service
  const filterRanks = branch => {
    const filteredRanks = jsonData.filter(
      rank => rank['Branch Of Service Code'] === branch,
    );
    const ranks = filteredRanks.reduce((acc, curr) => {
      acc[curr['Rank Code']] = curr['Rank Description'];
      return acc;
    }, {});
    setRankOptions(ranks);
  };

  // Load JSON data and set initial state
  useEffect(
    () => {
      const branches = jsonData.map(item => item['Branch Of Service Code']);
      const uniqueBranches = Array.from(new Set(branches));
      setServiceLabels(uniqueBranches);

      const serviceRecords = formData?.application?.veteran?.serviceRecords;
      const initialBranch = serviceRecords?.[0]?.serviceBranch;
      if (initialBranch && uniqueBranches.includes(initialBranch)) {
        setBranchOfService(initialBranch);
        filterRanks(initialBranch);
      }
    },
    [formData],
  );

  // Update branch of service and rank options when branch changes
  useEffect(
    () => {
      if (branchOfService) {
        filterRanks(branchOfService);
      }
    },
    [branchOfService],
  );

  return (
    <div>
      {serviceLabels.length > 0 && (
        <div className="branchOfService">
          {/* Render your service branch related UI here */}
        </div>
      )}
      {branchOfService && (
        <div className="highestRank">
          <AutoSuggest
            title="Highest rank attained"
            labels={rankOptions}
            onSelectionChange={key => {
              const updatedFormData = set(
                'application.veteran.serviceRecords[0].highestRank',
                key,
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

export default connect(mapStateToProps)(ImprovedMilitaryHistoryPage);
