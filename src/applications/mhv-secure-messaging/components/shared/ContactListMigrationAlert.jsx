import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import { ContactListMigrationPhases } from '../../util/constants';

/**
 * ContactListMigrationAlert displays a warning alert on the Contact List page
 * when the user has facilities that recently completed migration to Oracle Health
 * (phase p6, T+2 to T+30).
 *
 * The alert informs the veteran that care teams from those facilities were
 * removed from their contact list and will reappear under different names.
 */
const ContactListMigrationAlert = () => {
  const [isVisible, setIsVisible] = useState(true);

  const userProfile = useSelector(state => state.user?.profile);
  const { userFacilityMigratingToOh, migrationSchedules } = userProfile || {};

  if (!userFacilityMigratingToOh || !migrationSchedules?.length || !isVisible) {
    return null;
  }

  // Filter migration schedules to those in a contact list migration phase (p6)
  const migratingInPhase = migrationSchedules.filter(schedule =>
    ContactListMigrationPhases.includes(schedule.phases?.current),
  );

  if (!migratingInPhase.length) {
    return null;
  }

  // Collect all facility names from matching schedules
  const facilityNames = migratingInPhase.flatMap(
    schedule =>
      schedule.facilities?.map(f => f.facilityName).filter(Boolean) || [],
  );

  if (!facilityNames.length) {
    return null;
  }

  return (
    <VaAlert
      class="vads-u-margin-bottom--2"
      closeBtnAriaLabel="Close notification"
      closeable
      onCloseEvent={() => {
        setIsVisible(false);
        focusElement(document.querySelector('h1'));
      }}
      status="warning"
      visible
      data-testid="contact-list-migration-alert"
      data-dd-action-name="Contact List Migration Alert"
    >
      <h2 slot="headline">We updated your contact list</h2>
      <div>
        <p>
          We removed care teams from these facilities from your contact list:
        </p>
        <ul>
          {facilityNames.map(name => (
            <li key={name} data-dd-privacy="mask">
              {name}
            </li>
          ))}
        </ul>
        <p>
          You can still send messages to care teams at these facilities. But the
          care team names will be different.
        </p>
      </div>
    </VaAlert>
  );
};

export default ContactListMigrationAlert;
