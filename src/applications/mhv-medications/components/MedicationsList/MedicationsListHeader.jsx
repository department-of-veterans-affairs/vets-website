import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { selectHasMedsByMailFacility } from '../../selectors/selectUser';

import MedsByMailContent from './MedsByMailContent';
import RxRenewalDeleteDraftSuccessAlert from '../shared/RxRenewalDeleteDraftSuccessAlert';
import RxRenewalMessageSuccessAlert from '../shared/RxRenewalMessageSuccessAlert';

const MedicationsListHeader = ({
  showRxRenewalDeleteDraftSuccessAlert,
  showRxRenewalMessageSuccessAlert,
}) => {
  const hasMedsByMailFacility = useSelector(selectHasMedsByMailFacility);
  let titleNotesMessage =
    'Bring your medications list to each appointment. And tell your provider about any new allergies or reactions.';

  if (!hasMedsByMailFacility) {
    titleNotesMessage +=
      ' If you use Meds by Mail, you can also call your servicing center and ask them to update your records.';
  }

  const titleNotesBottomMarginUnit = hasMedsByMailFacility ? 3 : 2;

  return (
    <>
      <h1 data-testid="list-page-title" className="vads-u-margin-bottom--2">
        Medications
      </h1>
      {showRxRenewalDeleteDraftSuccessAlert && (
        <RxRenewalDeleteDraftSuccessAlert />
      )}
      {showRxRenewalMessageSuccessAlert && <RxRenewalMessageSuccessAlert />}
      <p
        className={`vads-u-margin-top--0 vads-u-margin-bottom--${titleNotesBottomMarginUnit}`}
        data-testid="Title-Notes"
      >
        {titleNotesMessage}
      </p>
      <a
        href="/my-health/medical-records/allergies"
        rel="noreferrer"
        className="vads-u-display--block vads-u-margin-bottom--3"
        data-testid="allergies-link"
      >
        Go to your allergies and reactions
      </a>
      {hasMedsByMailFacility && <MedsByMailContent />}
    </>
  );
};

MedicationsListHeader.propTypes = {
  showRxRenewalDeleteDraftSuccessAlert: PropTypes.bool.isRequired,
  showRxRenewalMessageSuccessAlert: PropTypes.bool.isRequired,
};

export default MedicationsListHeader;
