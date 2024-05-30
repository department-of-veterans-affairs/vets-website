import React, { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import set from 'platform/utilities/data/set';
import { setData } from 'platform/forms-system/src/js/actions';
import AutoSuggest from './MilitaryAutoSuggestField';
import jsonData from '../utils/Military Ranks.json';

function HighestRankAutoSuggest({ formData, idSchema }) {
  const dispatch = useDispatch();
  const [branchOfService, setBranchOfService] = useState('');
  const [rankOptions, setRankOptions] = useState([]);
  const [rank, setRank] = useState('');
  const [index, setIndex] = useState(0);
  const [initialRender, setInitialRender] = useState(true);

  const extractIndex = id => {
    const match = id.match(/serviceRecords_(\d+)_highestRank/);
    return match ? parseInt(match[1], 10) : 0;
  };

  const filterRanks = branch => {
    return jsonData
      .filter(row => row['Branch Of Service Code'] === branch)
      .map(row => ({
        key: row['Rank Code'],
        value: row['Rank Description'] || row['Rank Code'],
      }));
  };

  const haveOptionsChanged = (currentOptions, newOptions) => {
    if (currentOptions.length !== newOptions.length) return true;
    return currentOptions.some(
      (option, optionsIndex) => option.key !== newOptions[optionsIndex].key,
    );
  };

  useEffect(
    () => {
      const serviceRecords = formData?.application?.veteran?.serviceRecords;
      const currentIndex = extractIndex(idSchema?.$id);
      setIndex(currentIndex);

      if (serviceRecords) {
        const currentBranch = serviceRecords[currentIndex]?.serviceBranch;
        if (currentBranch) {
          setBranchOfService(currentBranch);
        }
        const currentRank = serviceRecords[currentIndex]?.highestRank;
        if (currentRank) {
          setRank(currentRank);
        }
      }
    },
    [formData, idSchema],
  );

  useEffect(
    () => {
      if (branchOfService) {
        const newRankOptions = filterRanks(branchOfService);
        if (haveOptionsChanged(rankOptions, newRankOptions)) {
          if (!initialRender) {
            setRank(' ');
          } else {
            setInitialRender(false);
          }
          setRankOptions(newRankOptions);
        }
      }
    },
    [branchOfService],
  );

  const handleSelectionChange = selection => {
    setRank(selection?.label);
    const updatedFormData = set(
      `application.veteran.serviceRecords[${index}].highestRank`,
      selection.value,
      { ...formData },
    );
    dispatch(setData(updatedFormData));
  };

  return (
    <div>
      <div className="highestRank">
        <AutoSuggest
          value={rank}
          setValue={setRank}
          labels={rankOptions}
          onSelectionChange={handleSelectionChange}
        />
      </div>
    </div>
  );
}

const mapStateToProps = state => ({
  formData: state?.form?.data,
});

export default connect(mapStateToProps)(HighestRankAutoSuggest);
