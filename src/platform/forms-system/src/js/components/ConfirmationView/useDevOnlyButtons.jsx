import React from 'react';
import { useDispatch } from 'react-redux';
import environment from 'platform/utilities/environment';
import { VaButton } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { setData } from '../../actions';

export const useDevOnlyButtons = ({
  formData,
  mockData,
  setPdfUrl,
  setConfirmationNumber,
  setSubmitDate,
}) => {
  const dispatch = useDispatch();

  const simulateSubmission = () => {
    dispatch(
      setData({
        ...formData,
        ...mockData,
      }),
    );
    setConfirmationNumber(
      Math.random()
        .toString()
        .replace('.', ''),
    );
    setSubmitDate(new Date());
    setPdfUrl('/');
  };

  const simulateReload = () => {
    dispatch(setData({}));
    setConfirmationNumber(null);
    setSubmitDate(null);
    setPdfUrl(null);
  };

  const isApplicable = environment.isDev() || environment.isLocalhost();

  if (!isApplicable) {
    return null;
  }

  return () => {
    return (
      <div className="vads-u-margin-bottom--2">
        <VaButton
          onClick={simulateSubmission}
          text="Dev only: Simulate submission"
        />
        <VaButton
          onClick={simulateReload}
          text="Dev only: Simulate page reload"
        />
      </div>
    );
  };
};
