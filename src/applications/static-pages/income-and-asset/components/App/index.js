import React from 'react';
import { useFeatureToggle } from 'platform/utilities/feature-toggles';

const START_PATH = 'submit-income-and-asset-statement-form-21p-0969';
const DOWNLOAD_URL = 'https://www.va.gov/find-forms/about-form-21p-0969/';

export const App = () => {
  const {
    useToggleValue,
    useToggleLoadingValue,
    TOGGLE_NAMES,
  } = useFeatureToggle();
  const isLoadingFeatures = useToggleLoadingValue();
  const formEnabled = useToggleValue(TOGGLE_NAMES.incomeAndAssetsFormEnabled);

  if (isLoadingFeatures) {
    return <va-loading-indicator label="Loading" message="Loading..." />;
  }
  return formEnabled ? (
    <>
      <p>You can submit this form online or by mail.</p>
      <div className="vads-u-margin-y--2">
        <va-link-action
          href={START_PATH}
          text="Submit a Pension or DIC income and asset statement"
          type="secondary"
        />
      </div>
      <div className="vads-u-margin-y--2">
        <va-link href={DOWNLOAD_URL} text="Get VA Form 21P-0969 to download" />
      </div>
    </>
  ) : (
    <>
      <p>You can submit this form by mail.</p>
      <div className="vads-u-margin-y--2">
        <va-link href={DOWNLOAD_URL} text="Get VA Form 21P-0969 to download" />
      </div>
    </>
  );
};

export default App;
