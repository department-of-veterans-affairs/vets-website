import React, { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { setData } from 'platform/forms-system/src/js/actions';
import set from 'platform/utilities/data/set';
import Papa from 'papaparse';
import { serviceLabels } from '../utils/labels';
import AutoSuggest from './MyAutoSuggestField';

function ImprovedMilitaryHistoryPage({ formData }) {
  const dispatch = useDispatch();
  const [rankData, setRankData] = useState([]); // Initialized as an array
  const [branchOfService, setBranchOfService] = useState('');
  const [rankOptions, setRankOptions] = useState([]);

  useEffect(
    () => {
      const serviceRecords = formData?.application?.veteran?.serviceRecords;
      if (serviceRecords !== undefined && serviceRecords.length > 0) {
        const bos = serviceRecords[0].serviceBranch;
        // Check if 'bos' is one of the keys in 'serviceLabels'
        if (bos && Object.keys(serviceLabels).includes(bos)) {
          setBranchOfService(bos);
        } else {
          setBranchOfService('');
        }
      }
    },
    [formData, serviceLabels],
  );

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

  const highestRankChange = key => {
    const updatedFormData = set(
      'application.veteran.serviceRecords[0].highestRank',
      key,
      { ...formData },
    );
    dispatch(setData(updatedFormData));
  };

  return (
    <div>
      <input type="file" accept=".csv" onChange={handleFileUpload} />
      {/* The AutosuggestField is always rendered; adjust this as needed */}
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
