import React, { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { setData } from 'platform/forms-system/src/js/actions';
import AutoSuggest from './MilitaryAutoSuggestField';
import jsonData from '../utils/Military Ranks.json';

function HighestRankAutoSuggest({ formData, formContext, idSchema }) {
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

  const getRanksForBranch = branch => {
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
        const currentRank = serviceRecords[currentIndex];
        if (currentRank.highestRank) {
          setRank(
            `${currentRank.highestRank} - ${
              currentRank.highestRankDescription
            }`,
          );
        }
      }
    },
    [formData, idSchema],
  );

  useEffect(
    () => {
      if (branchOfService) {
        const newRankOptions = getRanksForBranch(branchOfService);
        if (haveOptionsChanged(rankOptions, newRankOptions)) {
          if (!initialRender) {
            setRank('');
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
    setRank(`${selection.key.toUpperCase()} - ${selection.value}`);

    // Create an updated form data object with both highestRank and highestRankDescription
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
  };

  return (
    <div>
      {!formContext.onReviewPage ||
      (formContext.onReviewPage && !formContext.reviewMode) ? (
        <div className="highestRank">
          <AutoSuggest
            value={rank}
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

const mapStateToProps = state => ({
  formData: state?.form?.data,
});

export default connect(mapStateToProps)(HighestRankAutoSuggest);
