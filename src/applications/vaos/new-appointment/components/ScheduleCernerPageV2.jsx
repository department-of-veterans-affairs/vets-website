import ProgressButton from 'platform/forms-system/src/js/components/ProgressButton';
import { getCernerURL } from 'platform/utilities/cerner';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import FacilityPhone from '../../components/FacilityPhone';
import NewTabAnchor from '../../components/NewTabAnchor';
import { TYPE_OF_CARE_IDS } from '../../utils/constants';
import { scrollAndFocus } from '../../utils/scrollAndFocus';
import { routeToPreviousAppointmentPage } from '../redux/actions';
import { getChosenFacilityInfo, selectTypeOfCare } from '../redux/selectors';

const pageKey = 'scheduleCerner';

export default function ScheduleCernerPageV2() {
  const dispatch = useDispatch();
  const facility = useSelector(getChosenFacilityInfo);
  const typeOfCare = useSelector(selectTypeOfCare);

  const history = useHistory();
  const pageTitle = 'You can’t schedule this appointment online';
  const phone = facility?.telecom?.find(tele => tele.system === 'phone')?.value;

  useEffect(() => {
    document.title = `${pageTitle} | Veterans Affairs`;
    scrollAndFocus();
  }, []);

  return (
    <>
      <h1>{pageTitle}</h1>
      <p>
        To schedule an appointment, you’ll need to contact {facility?.name}:
      </p>
      <p>
        <FacilityPhone contact={phone} />
      </p>
      {(TYPE_OF_CARE_IDS.PHARMACY_ID === typeOfCare?.id ||
        TYPE_OF_CARE_IDS.FOOD_AND_NUTRITION_ID === typeOfCare?.id) && (
        <>
          <p>
            You can also access tools to schedule appointments online in the My
            VA Health portal.
            <br />
            <NewTabAnchor href={getCernerURL('/pages/scheduling/upcoming')}>
              Go to My VA Health (opens in a new tab)
            </NewTabAnchor>
          </p>
        </>
      )}
      <va-additional-info
        trigger="Why can't I schedule online"
        uswds
        data-testid="additional-info"
      >
        <p className="vads-u-margin-top--0">
          This facility doesn't support online scheduling.
        </p>
      </va-additional-info>
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
