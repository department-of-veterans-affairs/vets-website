import React, { useState, useEffect } from 'react';
import {
  VaButtonPair,
  VaRadio,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { focusElement, scrollToTop } from 'platform/utilities/ui';

import PropTypes from 'prop-types';
import { formatDateTime } from '../../../util/dates';

const MileagePage = ({
  appointment,
  pageIndex,
  setPageIndex,
  yesNo,
  setYesNo,
  setCantFile,
}) => {
  useEffect(() => {
    focusElement('h1');
    scrollToTop('topScrollElement');
  }, []);

  const [formattedDate, formattedTime] = formatDateTime(
    appointment.vaos.apiData.start,
  );

  const [requiredAlert, setRequiredAlert] = useState(false);

  const handlers = {
    onNext: e => {
      e.preventDefault();
      if (!yesNo.mileage) {
        setRequiredAlert(true);
      } else if (yesNo.mileage !== 'yes') {
        setCantFile(true);
      } else {
        setCantFile(false);
        setPageIndex(pageIndex + 1);
      }
    },
    onBack: e => {
      e.preventDefault();
      setPageIndex(pageIndex - 1);
    },
  };

  return (
    <div>
      <VaRadio
        use-forms-pattern="single"
        form-heading="Are you claiming only mileage?"
        form-heading-level={1}
        id="mileage"
        onVaValueChange={e => {
          setYesNo({ ...yesNo, mileage: e.detail.value });
        }}
        value={yesNo.mileage}
        data-testid="mileage-test-id"
        error={requiredAlert ? 'You must make a selection to continue.' : null}
        header-aria-describedby={null}
        hint=""
        label=""
        label-header-level=""
      >
        <div slot="form-description">
          <hr className="vads-u-margin-y--0" />
          <p>
            {' '}
            <strong>
              {formattedDate} {formattedTime} at{' '}
              {appointment.vaos.apiData.location.attributes.name}
            </strong>
          </p>
          <p>{appointment.vaos.apiData.reasonForAppointment}</p>
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
          But you can file your claim online, within 30 days, through the{' '}
          <va-link
            external
            href="https://link-to-btsss"
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

MileagePage.propTypes = {
  appointment: PropTypes.object,
  pageIndex: PropTypes.number,
  setCantFile: PropTypes.func,
  setPageIndex: PropTypes.func,
  setYesNo: PropTypes.func,
  yesNo: PropTypes.object,
};

export default MileagePage;
