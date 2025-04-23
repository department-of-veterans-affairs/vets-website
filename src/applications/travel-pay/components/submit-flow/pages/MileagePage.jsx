import React, { useState, useEffect, useContext } from 'react';
import { useSelector } from 'react-redux';

import { VaButtonPair } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { focusElement, scrollToTop } from 'platform/utilities/ui';

import useSetPageTitle from '../../../hooks/useSetPageTitle';
import { HelpTextOptions } from '../../HelpText';
import { formatDateTime } from '../../../util/dates';
import { selectAppointment } from '../../../redux/selectors';
import { SmocContext } from '../../../context/SmocContext';
import SmocRadio from '../../SmocRadio';
import {
  recordSmocButtonClick,
  recordSmocPageview,
} from '../../../util/events-helpers';

const title = 'Are you only claiming mileage?';

const MileagePage = () => {
  useEffect(() => {
    recordSmocPageview('mileage');
    focusElement('h1', {}, 'va-radio');
    scrollToTop('topScrollElement');
  }, []);

  const {
    pageIndex,
    setIsUnsupportedClaimType,
    setPageIndex,
    yesNo,
    setYesNo,
  } = useContext(SmocContext);
  useSetPageTitle(title);

  const { data } = useSelector(selectAppointment);

  const [formattedDate, formattedTime] = formatDateTime(data.start);

  const [requiredAlert, setRequiredAlert] = useState(false);

  const handlers = {
    onNext: () => {
      recordSmocButtonClick('mileage', 'continue');
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
      recordSmocButtonClick('mileage', 'back');
      setPageIndex(pageIndex - 1);
    },
  };
  return (
    <div>
      <SmocRadio
        name="mileage"
        value={yesNo.mileage}
        label={title}
        error={requiredAlert}
        onValueChange={e => {
          setYesNo({ ...yesNo, mileage: e.detail.value });
        }}
      >
        <div className="vads-u-margin-y--2">
          <hr aria-hidden="true" className="vads-u-margin-y--0" />
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
          <hr aria-hidden="true" className="vads-u-margin-y--0" />
        </div>
      </SmocRadio>

      <va-additional-info
        class="vads-u-margin-y--3"
        trigger="How do we calculate mileage"
      >
        <ul>
          <li>We pay round-trip mileage for your scheduled appointments.</li>
          <li>
            We may only pay return mileage for unscheduled appointments like
            walk-ins and labs.
          </li>
        </ul>
        <va-link
          external
          href="https://www.va.gov/resources/reimbursed-va-travel-expenses-and-mileage-rate/#mileage-reimbursement-rate"
          text="Check current mileage rates"
        />
      </va-additional-info>
      <HelpTextOptions
        trigger="If you have other expenses to claim"
        headline="If you need to submit receipts for other expenses like tolls, meals,
            or lodging, you can’t file a claim in this tool right now."
      />
      <VaButtonPair
        class="vads-u-margin-y--2"
        continue
        disable-analytics
        onPrimaryClick={handlers.onNext}
        onSecondaryClick={handlers.onBack}
      />
    </div>
  );
};

export default MileagePage;
