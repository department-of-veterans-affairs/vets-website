import React from 'react';
import ProgressButton from 'platform/forms-system/src/js/components/ProgressButton';
import LoadingButton from 'platform/site-wide/loading-button/LoadingButton';

export default function FormButtons({ goBack, navigatingBetweenPages }) {
  return (
    <div className="vads-l-row form-progress-buttons schemaform-buttons">
      <div className="vads-l-col--6 vads-u-padding-right--2p5">
        <ProgressButton
          onButtonClick={goBack}
          buttonText="Back"
          buttonClass="usa-button-secondary vads-u-width--full"
          beforeText="«"
        />
      </div>
      <div className="vads-l-col--6">
        <LoadingButton
          isLoading={navigatingBetweenPages}
          type="submit"
          className="usa-button usa-button-primary"
        >
          Continue »
        </LoadingButton>
      </div>
    </div>
  );
}
