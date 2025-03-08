import React from 'react';
import { datadogRum } from '@datadog/browser-rum';
import {
  VaButton,
  VaIcon,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { dataDogActionNames } from '../../util/dataDogConstants';

const InProductionEducationFiltering = () => {
  const handleStopShowing = () => {
    datadogRum.addAction(
      dataDogActionNames.medicationsListPage.STOP_SHOWING_IPE_FILTERING_HINT,
    );
    // integration logic here
  };

  return (
    <div
      id="rx-ipe-filtering-container"
      data-testid="rx-ipe-filtering-container"
      className="vads-u-margin-top--3 vads-u-padding--2p5"
    >
      <p className="vads-u-margin--0">
        Filter the medications list to easily find what you are looking for.
      </p>
      <VaButton
        className="vads-u-width--full tablet:vads-u-width--auto vads-u-margin-top--3"
        secondary
        text="Stop showing this hint"
        data-testid="rx-ipe-filtering-stop-showing-this-hint"
        onClick={handleStopShowing}
      />
      <VaIcon
        size={3}
        icon="cancel"
        id="rx-ipe-filtering-close"
        data-testid="rx-ipe-filtering-close"
        onClick={handleStopShowing}
        aria-label="Close button - Stop showing this hint"
      />
    </div>
  );
};

export default InProductionEducationFiltering;
