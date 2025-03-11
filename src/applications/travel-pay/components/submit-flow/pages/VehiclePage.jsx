import React, { useState, useEffect, useContext } from 'react';
import { VaButtonPair } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import { focusElement, scrollToTop } from 'platform/utilities/ui';

import { HelpTextOptions } from '../../HelpText';
import SmocRadio from '../../SmocRadio';
import { SmocContext } from '../../../context/SmocContext';

const VehiclePage = () => {
  useEffect(() => {
    focusElement('h1', {}, 'va-radio');
    scrollToTop('topScrollElement');
  }, []);

  const {
    pageIndex,
    setPageIndex,
    setIsUnsupportedClaimType,
    yesNo,
    setYesNo,
  } = useContext(SmocContext);

  const [requiredAlert, setRequiredAlert] = useState(false);

  const handlers = {
    onNext: () => {
      if (!yesNo.vehicle) {
        setRequiredAlert(true);
      } else if (yesNo.vehicle !== 'yes') {
        setIsUnsupportedClaimType(true);
      } else {
        setIsUnsupportedClaimType(false);
        setPageIndex(pageIndex + 1);
      }
    },
    onBack: () => {
      setPageIndex(pageIndex - 1);
    },
  };

  return (
    <div>
      <SmocRadio
        name="vehicle"
        value={yesNo.vehicle}
        label="Did you travel in your own vehicle?"
        error={requiredAlert}
        onValueChange={e => setYesNo({ ...yesNo, vehicle: e.detail.value })}
      />
      <HelpTextOptions
        trigger="If you didn't travel in your own vehicle"
        headline="If you traveled by bus, train, taxi, or other authorized public transportation, you can’t file a claim in this tool right now."
      />
      <VaButtonPair
        class="vads-u-margin-y--2"
        continue
        onPrimaryClick={e => handlers.onNext(e)}
        onSecondaryClick={e => handlers.onBack(e)}
      />
    </div>
  );
};

export default VehiclePage;
