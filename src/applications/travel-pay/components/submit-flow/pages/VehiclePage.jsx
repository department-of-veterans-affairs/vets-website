import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { VaButtonPair } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import { focusElement, scrollToTop } from 'platform/utilities/ui';

import useSetPageTitle from '../../../hooks/useSetPageTitle';
import { BTSSS_PORTAL_URL } from '../../../constants';
import SmocRadio from '../../SmocRadio';

const title = 'Did you travel in your own vehicle?';

const VehiclePage = ({
  pageIndex,
  setPageIndex,
  yesNo,
  setYesNo,
  setIsUnsupportedClaimType,
}) => {
  useEffect(() => {
    focusElement('h1', {}, 'va-radio');
    scrollToTop('topScrollElement');
  }, []);

  useSetPageTitle(title);

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
        label={title}
        error={requiredAlert}
        onValueChange={e => setYesNo({ ...yesNo, vehicle: e.detail.value })}
      />

      <va-additional-info
        class="vads-u-margin-y--3"
        trigger="If you didn't travel in your own vehicle"
      >
        <p>
          <strong>
            If you traveled by bus, train, taxi, or other authorized public
            transportation, you can’t file a claim in this tool right now.
          </strong>{' '}
          But you can file your claim online through the{' '}
          <va-link
            external
            href={BTSSS_PORTAL_URL}
            text="Beneficiary Travel Self Service System (BTSSS)"
          />
          . Or you can use VA Form 10-3542 to submit a claim by mail or in
          person.
        </p>
      </va-additional-info>

      <VaButtonPair
        class="vads-u-margin-y--2"
        continue
        onPrimaryClick={e => handlers.onNext(e)}
        onSecondaryClick={e => handlers.onBack(e)}
      />
    </div>
  );
};

VehiclePage.propTypes = {
  pageIndex: PropTypes.number,
  setIsUnsupportedClaimType: PropTypes.func,
  setPageIndex: PropTypes.func,
  setYesNo: PropTypes.func,
  yesNo: PropTypes.object,
};

export default VehiclePage;
