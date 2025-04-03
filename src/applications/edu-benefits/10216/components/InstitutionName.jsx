import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { apiRequest } from 'platform/utilities/api';
import { setData } from 'platform/forms-system/src/js/actions';

const InstitutionName = () => {
  const formData = useSelector(state => state.form?.data);
  const [loader, setLoader] = useState(false);
  const [institutionName, setInstitutionName] = useState('');
  const dispatch = useDispatch();

  useEffect(
    () => {
      const fetchInstitutionName = async () => {
        setLoader(true);
        try {
          const response = await apiRequest(
            `/gi/institutions/${formData?.institutionDetails.facilityCode}`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            },
          );
          setInstitutionName(response?.data?.attributes?.name || 'not found');
          setLoader(false);
          dispatch(
            setData({
              ...formData,
              institutionDetails: {
                ...formData.institutionDetails,
                institutionName:
                  response?.data?.attributes?.name || 'not found',
              },
            }),
          );
        } catch (error) {
          setInstitutionName('not found');
          setLoader(false);
          dispatch(
            setData({
              ...formData,
              institutionDetails: {
                ...formData.institutionDetails,
                institutionName: 'not found',
              },
            }),
          );
        }
      };
      if (formData?.institutionDetails?.facilityCode?.length === 8) {
        fetchInstitutionName();
      }
    },
    [formData?.institutionDetails?.facilityCode],
  );
  return (
    <div>
      <p>Institution Name</p>
      <div>
        {loader ? (
          <va-loading-indicator
            set-focus
            message="Loading institution name..."
          />
        ) : (
          <p className="vads-u-font-weight--bold">
            {institutionName === 'not found' || !institutionName
              ? '--'
              : institutionName}
          </p>
        )}
      </div>
    </div>
  );
};

export default InstitutionName;
