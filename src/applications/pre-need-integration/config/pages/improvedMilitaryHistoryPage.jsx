import React, { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { setData } from 'platform/forms-system/src/js/actions';
import set from 'platform/utilities/data/set';
import Papa from 'papaparse';
import { serviceLabels } from '../../utils/labels';
import AutoSuggest from '../../components/MyAutoSuggestField';

function ImprovedMilitaryHistoryPage({ formData }) {
  const dispatch = useDispatch();
  const [rankData, setRankData] = useState([]); // Initialized as an array
  const [branchOfService, setBranchOfService] = useState('');
  const [highestRank, setHighestRank] = useState('');
  const [rankOptions, setRankOptions] = useState({});

  useEffect(
    () => {
      // Check if branchOfService is set and rankData is not empty
      if (branchOfService && rankData.length > 0) {
        // Filter rankData for the selected branch of service
        const filteredRanks = rankData.filter(
          rank => rank['Branch Of Service Code'] === branchOfService,
        );

        // Map filtered ranks into an object {Rank Code: Rank Description}
        const ranks = filteredRanks.reduce((acc, curr) => {
          acc[curr['Rank Code']] = curr['Rank Description'];
          return acc;
        }, {});

        setRankOptions(ranks); // Update state with the mapped ranks
      }
    },
    [branchOfService, rankData],
  );

  const handleFileUpload = e => {
    const file = e.target.files[0];
    if (file) {
      Papa.parse(file, {
        complete: result => {
          setRankData(result.data);
        },
        header: true,
      });
    }
  };

  /*
  const onChangeServiceBranch = (newServiceBranch) => {
    const updatedFormData = set(
      'application.veteran.serviceRecords.serviceBranch',
      newServiceBranch,
      { ...formData }
    );
    dispatch(setData(updatedFormData));
  };
  */

  const branchOfServiceChange = key => {
    setBranchOfService(key);
    const updatedFormData = set(
      'application.veteran.serviceRecords.serviceBranch',
      branchOfService,
      { ...formData },
    );
    dispatch(setData(updatedFormData));
  };

  const highestRankChange = key => {
    setHighestRank(key);
    const updatedFormData = set(
      'application.veteran.serviceRecords.highestRank',
      highestRank,
      { ...formData },
    );
    dispatch(setData(updatedFormData));
  };

  return (
    <div>
      <h2>Upload Rank Data</h2>
      <input type="file" accept=".csv" onChange={handleFileUpload} />
      {/* The AutosuggestField is always rendered; adjust this as needed */}
      <AutoSuggest
        title="Branch of service"
        labels={serviceLabels}
        onSelectionChange={branchOfServiceChange}
        maxItems={5}
      />
      {branchOfService !== '' &&
        rankData.length > 0 && (
          <AutoSuggest
            title="Hightest rank attained"
            labels={rankOptions}
            onSelectionChange={highestRankChange}
            maxItems={20}
          />
        )}
    </div>
  );
}

const mapStateToProps = state => ({
  formData: state?.form?.data,
});

export default connect(mapStateToProps)(ImprovedMilitaryHistoryPage);
