import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import { ContactListMigrationAlertContent } from '../../util/constants';

/**
 * ContactListMigrationAlert displays a warning alert on the Contact List page
 * when the user has facilities in a migration phase defined in
 * ContactListMigrationAlertContent.
 *
 * The component auto-detects the user's current migration phase from Redux
 * state and renders the appropriate variant content (headline, body text,
 * facility list). New variants can be added to ContactListMigrationAlertContent
 * in constants.js without modifying this component.
 */
const ContactListMigrationAlert = () => {
  const [isVisible, setIsVisible] = useState(true);

  const userProfile = useSelector(state => state.user?.profile);
  const { userFacilityMigratingToOh, migrationSchedules } = userProfile || {};

  if (!userFacilityMigratingToOh || !migrationSchedules?.length || !isVisible) {
    return null;
  }

  // Find the first matching variant based on the user's current phase
  const variants = Object.values(ContactListMigrationAlertContent);
  let matchedVariant = null;
  const matchingSchedules = [];

  migrationSchedules.forEach(schedule => {
    const variant = variants.find(v =>
      v.phases.includes(schedule.phases?.current),
    );
    if (variant) {
      matchedVariant = variant;
      matchingSchedules.push(schedule);
    }
  });

  if (!matchedVariant || !matchingSchedules.length) {
    return null;
  }

  // Collect all facilities from matching schedules, de-duplicating by facilityId
  const facilitiesMap = new Map();
  matchingSchedules.forEach(schedule => {
    schedule.facilities?.forEach(facility => {
      if (facility.facilityId && facility.facilityName) {
        facilitiesMap.set(facility.facilityId, facility);
      }
    });
  });
  const facilities = Array.from(facilitiesMap.values());

  if (!facilities.length) {
    return null;
  }

  // Resolve content — supports strings or functions (for dynamic date content)
  const resolveContent = content =>
    typeof content === 'function' ? content(matchingSchedules[0]) : content;

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
      <h2 slot="headline">{matchedVariant.headline}</h2>
      <div>
        <p>{resolveContent(matchedVariant.bodyTop)}</p>
        <ul>
          {facilities.map(facility => (
            <li key={facility.facilityId} data-dd-privacy="mask">
              {facility.facilityName}
            </li>
          ))}
        </ul>
        <p>{resolveContent(matchedVariant.bodyBottom)}</p>
      </div>
    </VaAlert>
  );
};

export default ContactListMigrationAlert;
