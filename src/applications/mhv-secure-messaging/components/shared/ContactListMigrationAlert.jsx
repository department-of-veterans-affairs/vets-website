import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import { ContactListMigrationAlertContent } from '../../util/constants';

/**
 * ContactListMigrationAlert displays a warning alert on the Contact List page
 * when the user has facilities in a migration phase defined in
 * ContactListMigrationAlertContent.
 *
 * The component receives migration data as props from the parent container
 * and renders the appropriate variant content (headline, body text,
 * facility list). New variants can be added to ContactListMigrationAlertContent
 * in constants.js without modifying this component.
 *
 * @param {Object} props
 * @param {Array} props.migrationSchedules - Array of migration schedule objects
 */
const ContactListMigrationAlert = ({ migrationSchedules }) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) {
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
        <p>{matchedVariant.bodyTop}</p>
        <ul>
          {facilities.map(facility => (
            <li key={facility.facilityId} data-dd-privacy="mask">
              {facility.facilityName}
            </li>
          ))}
        </ul>
        <p>{matchedVariant.bodyBottom}</p>
      </div>
    </VaAlert>
  );
};

ContactListMigrationAlert.propTypes = {
  migrationSchedules: PropTypes.arrayOf(
    PropTypes.shape({
      facilities: PropTypes.arrayOf(
        PropTypes.shape({
          facilityId: PropTypes.string,
          facilityName: PropTypes.string,
        }),
      ),
      phases: PropTypes.shape({
        current: PropTypes.string,
      }),
    }),
  ),
};

ContactListMigrationAlert.defaultProps = {
  migrationSchedules: [],
};

export default ContactListMigrationAlert;
