import React from 'react';
import {
  VaButtonPair,
  VaRadio,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import { formatDateTime } from '../../../util/dates';

const MileagePage = ({ appointment, onNext, onBack, yesNo, setYesNo }) => {
  const [formattedDate, formattedTime] = formatDateTime(
    appointment.vaos.apiData.start,
  );

  return (
    <article className="vads-u-margin--3">
      <VaRadio
        use-forms-pattern="single"
        form-heading="Are you claiming only mileage?"
        form-heading-level={2}
        id="mileage"
        onVaValueChange={e => {
          setYesNo(e.detail.value);
        }}
        data-testid="mileage-test-id"
        error={null}
        header-aria-describedby={null}
        hint=""
        label=""
        label-header-level=""
        required
      >
        <div slot="form-description">
          <hr />
          <p>
            {formattedDate} {formattedTime} at{' '}
            {appointment.vaos.apiData.location.attributes.name}
          </p>
          <p>{appointment.vaos.apiData.reasonForAppointment}</p>
          <hr />
        </div>
        <va-radio-option
          label="Yes"
          value
          key="mileage-yes"
          name="mileage"
          checked={yesNo === true}
        />
        <va-radio-option
          key="mileage-no"
          name="mileage"
          checked={yesNo === false}
          label="No"
          value={false}
        />
      </VaRadio>

      <va-additional-info
        className="vads-u-margin--3"
        trigger="How do we calculate mileage"
      >
        <ul>
          <li>We pay rounld-trip mileage for your scheduled appointments.</li>
          <li>
            We may only pay return mileage for unscheduled appointments, like
            walk-ins and labe.
          </li>
        </ul>
        <va-link
          external
          href="https://www.va.gov/resources/reimbursed-va-travel-expenses-and-mileage-rate/#mileage-reimbursement-rate"
          text="Check current mileage rates"
        />
      </va-additional-info>

      <va-additional-info
        className="vads-u-margin--3"
        trigger="If you have other expenses to claim"
      >
        <p>
          <strong>
            If you need to submit receipts for other expenses like tols, meals,
            or lodging, you can’t file a claim in this tool right now.
          </strong>{' '}
          But you can file your claim online, within 30 days, through the
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
        class="vads-u-margin-top--2"
        continue
        onPrimaryClick={e => onNext(e)}
        onSecondaryClick={e => onBack(e)}
      />
    </article>
  );
};

export default MileagePage;
