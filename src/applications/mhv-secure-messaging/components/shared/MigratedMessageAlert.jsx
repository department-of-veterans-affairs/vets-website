import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { VaLinkAction } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { hasMessageMigratedToOracleHealth } from '../../util/helpers';

const DATADOG_FIND_VA_FACILITY_LINK =
  'Find your VA health facility link - in migrated message alert';

// MigratedMessageAlert displays an alert when a message has been migrated to Oracle Health.
const MigratedMessageAlert = () => {
  const messages = useSelector(
    state => state.sm?.threadDetails?.messages || [],
  );

  const userMessagePostMigration = useMemo(
    () => {
      return hasMessageMigratedToOracleHealth(messages);
    },
    [messages],
  );

  if (userMessagePostMigration) {
    return (
      <va-alert-expandable
        status="warning"
        trigger="You can’t send messages in this conversation"
        data-testid="migrated-message-alert"
        data-dd-privacy="mask"
        data-dd-action-name="Migrated Message Alert Expandable"
      >
        <div className="vads-u-padding-bottom--1">
          <p className="vads-u-margin-bottom--1p5">
            We’ve updated this care team’s name. If you need to contact them,
            you can call your VA health care facility directly.
          </p>
          <va-link
            data-testid="find-facility-link"
            href="https://www.va.gov/find-locations/"
            text="Find your facility's contact information"
          />
          <p className="vads-u-margin-bottom--1p5">
            {' '}
            Or you can send a new message to this care team. To send a message,
            you’ll need to select your care team’s updated name.
          </p>
          <VaLinkAction
            data-dd-action-name={`${DATADOG_FIND_VA_FACILITY_LINK} - expandable`}
            href="/find-locations/"
            text="Find your VA health facility"
          />
        </div>
      </va-alert-expandable>
    );
  }
  return null;
};

export default MigratedMessageAlert;
