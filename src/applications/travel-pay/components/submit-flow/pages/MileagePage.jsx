import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import {
  VaButtonPair,
  VaRadio,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { focusElement, scrollToTop } from 'platform/utilities/ui';

import { formatDateTime } from '../../../util/dates';
import { BTSSS_PORTAL_URL } from '../../../constants';
import { selectAppointment } from '../../../redux/selectors';

const MileagePage = ({
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

  const { data } = useSelector(selectAppointment);

  const [formattedDate, formattedTime] = formatDateTime(data.start);

  const [requiredAlert, setRequiredAlert] = useState(false);

  const handlers = {
    onNext: () => {
      if (!yesNo.mileage) {
        setRequiredAlert(true);
      } else if (yesNo.mileage !== 'yes') {
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
      <VaRadio
        id="mileage"
        onVaValueChange={e => {
          setYesNo({ ...yesNo, mileage: e.detail.value });
        }}
        value={yesNo.mileage}
        data-testid="mileage-test-id"
        error={requiredAlert ? 'You must make a selection to continue.' : null}
        header-aria-describedby={null}
        hint={null}
        label="Are you claiming only mileage?"
        label-header-level="1"
      >
        <div className="vads-u-margin-y--2">
          <hr className="vads-u-margin-y--0" />
          <p>
            For your appointment on{' '}
            <strong>
              {formattedDate} at {formattedTime}{' '}
              {data.location?.attributes?.name
                ? `at ${data.location.attributes.name}`
                : ''}{' '}
            </strong>
          </p>
          <p>{data.reasonForAppointment}</p>
          <hr className="vads-u-margin-y--0" />
        </div>
        <va-radio-option
          label="Yes"
          value="yes"
          key="mileage-yes"
          name="mileage"
          checked={yesNo.mileage === 'yes'}
        />
        <va-radio-option
          key="mileage-no"
          name="mileage"
          checked={yesNo.mileage === 'no'}
          label="No"
          value="no"
        />
      </VaRadio>

      <va-additional-info
        class="vads-u-margin-y--3"
        trigger="How do we calculate mileage"
      >
        <ul>
          <li>We pay round-trip mileage for your scheduled appointments.</li>
          <li>
            We may only pay return mileage for unscheduled appointments, like
            walk-ins and labs.
          </li>
        </ul>
        <va-link
          external
          href="https://www.va.gov/resources/reimbursed-va-travel-expenses-and-mileage-rate/#mileage-reimbursement-rate"
          text="Check current mileage rates"
        />
      </va-additional-info>

      <va-additional-info
        class="vads-u-margin-bottom--3"
        trigger="If you have other expenses to claim"
      >
        <p>
          <strong>
            If you need to submit receipts for other expenses like tolls, meals,
            or lodging, you can’t file a claim in this tool right now.
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
        onPrimaryClick={handlers.onNext}
        onSecondaryClick={handlers.onBack}
      />
    </div>
  );
};

MileagePage.propTypes = {
  pageIndex: PropTypes.number,
  setIsUnsupportedClaimType: PropTypes.func,
  setPageIndex: PropTypes.func,
  setYesNo: PropTypes.func,
  yesNo: PropTypes.object,
};

export default MileagePage;
