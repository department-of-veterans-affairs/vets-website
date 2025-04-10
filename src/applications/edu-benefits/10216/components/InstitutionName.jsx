import React from 'react';
import { useSelector } from 'react-redux';
import { useValidateFacilityCode } from '../../hooks/useValidateFacilityCode';

const InstitutionName = () => {
  const formData = useSelector(state => state.form?.data);
  const { loader, institutionName } = useValidateFacilityCode(formData);

  return (
    <div>
      <p>Institution Name</p>
      <div>
        {loader ? (
          <va-loading-indicator set-focus message="Finding your institution" />
        ) : (
          <h3>
            {institutionName === 'not found' || !institutionName
              ? '--'
              : institutionName}
          </h3>
        )}
      </div>
    </div>
  );
};

export default InstitutionName;
