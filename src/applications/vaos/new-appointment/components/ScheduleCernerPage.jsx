import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { scrollAndFocus } from '../../utils/scrollAndFocus';
import ProgressButton from 'platform/forms-system/src/js/components/ProgressButton';

import { routeToPreviousAppointmentPage } from '../redux/actions';
import { getChosenFacilityInfo } from '../redux/selectors';
import FacilityAddress from '../../components/FacilityAddress';
import { getCernerURL } from 'platform/utilities/cerner';
import FacilityPhone from '../../components/FacilityPhone';

const pageKey = 'scheduleCerner';

export default function ScheduleCernerPage() {
  const dispatch = useDispatch();
  const facility = useSelector(getChosenFacilityInfo);

  const history = useHistory();
  const pageTitle = 'How to schedule';
  const phone = facility?.telecom?.find(tele => tele.system === 'phone')?.value;

  useEffect(() => {
    document.title = `${pageTitle} | Veterans Affairs`;
    scrollAndFocus();
  }, []);

  return (
    <>
      <h1>{pageTitle}</h1>
      <FacilityAddress
        facility={facility}
        name={facility.name}
        showPhone={false}
        level={2}
      />
      <p>
        To schedule an appointment online at this facility, go to{' '}
        <a href={getCernerURL('/pages/scheduling/upcoming')}>My VA Health</a>.
      </p>
      <p>
        <strong>OR</strong> call this facility to schedule:
      </p>

      <FacilityPhone contact={phone} level={2} />
      <p>
        <ProgressButton
          onButtonClick={() =>
            dispatch(routeToPreviousAppointmentPage(history, pageKey))
          }
          buttonText="Back"
          buttonClass="usa-button-secondary"
          beforeText="«"
        />
        <ProgressButton
          disabled
          buttonText="Continue"
          buttonClass="usa-button usa-button-primary"
          afterText="»"
        />
      </p>
    </>
  );
}
