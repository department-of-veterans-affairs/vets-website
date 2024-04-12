import React, { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import set from 'platform/utilities/data/set';
import { setData } from 'platform/forms-system/src/js/actions';
import AutoSuggest from './MyAutoSuggestField';
import jsonData from '../utils/Military Ranks.json';

function ServiceBranchAutoSuggest({ formData }) {
  const dispatch = useDispatch();
  const [serviceLabels, setServiceLabels] = useState([]);
  const [branchOfService, setBranchOfService] = useState('');

  useEffect(
    () => {
      const branches = jsonData.map(item => ({
        key: item['Branch Of Service Code'],
        value: '',
      }));
      const uniqueBranches = Array.from(new Set(branches.map(b => b.key))).map(
        code => ({
          key: code,
          value: '', // assuming future descriptions will be added here
        }),
      );
      setServiceLabels(uniqueBranches);

      const serviceRecords = formData?.application?.veteran?.serviceRecords;
      const initialBranch = serviceRecords?.[0]?.serviceBranch;
      if (
        initialBranch &&
        uniqueBranches.some(branch => branch.key === initialBranch)
      ) {
        setBranchOfService(initialBranch);
      }
    },
    [formData],
  );

  return (
    <div>
      <AutoSuggest
        value={branchOfService}
        setValue={setBranchOfService}
        labels={serviceLabels}
        onSelectionChange={selection => {
          setBranchOfService(selection.key);
          dispatch(
            setData(
              set(
                'application.veteran.serviceRecords[0].serviceBranch',
                selection.key,
                formData,
              ),
            ),
          );
        }}
        maxItems={5}
      />
    </div>
  );
}

const mapStateToProps = state => ({
  formData: state?.form?.data,
});

export default connect(mapStateToProps)(ServiceBranchAutoSuggest);
