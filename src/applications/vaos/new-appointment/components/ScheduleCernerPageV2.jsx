import React, { useEffect } from 'react';
import ProgressButton from 'platform/forms-system/src/js/components/ProgressButton';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import FacilityPhone from '../../components/FacilityPhone';
import { selectFeatureUseVpg } from '../../redux/selectors';
import { scrollAndFocus } from '../../utils/scrollAndFocus';
import { routeToPreviousAppointmentPage } from '../redux/actions';
import { getChosenFacilityInfo, selectTypeOfCare } from '../redux/selectors';
import ScheduleCernerPage from './ScheduleCernerPage';

const pageKey = 'scheduleCerner';

export default function ScheduleCernerPageV2() {
  const dispatch = useDispatch();
  const facility = useSelector(getChosenFacilityInfo);
  const typeOfCare = useSelector(selectTypeOfCare);
  const featureUseVpg = useSelector(selectFeatureUseVpg);

  const history = useHistory();
  const pageTitle = 'You can’t schedule this appointment online';
  const phone = facility?.telecom?.find(tele => tele.system === 'phone')?.value;
  useEffect(() => {
    document.title = `${pageTitle} | Veterans Affairs`;
    scrollAndFocus();
  }, []);

  return !featureUseVpg ? (
    <ScheduleCernerPage />
  ) : (
    <>
      <h1>{pageTitle}</h1>
      <p>
        To schedule an appointment for {typeOfCare?.name.toLowerCase()}, you’ll
        need to contact {facility?.name}:
      </p>
      <p>
        <FacilityPhone contact={phone} />
      </p>
      <p>
        <ProgressButton
          onButtonClick={() =>
            dispatch(routeToPreviousAppointmentPage(history, pageKey))
          }
          buttonText="Back"
          buttonClass="usa-button-secondary"
          beforeText="«"
        />
      </p>
    </>
  );
}
