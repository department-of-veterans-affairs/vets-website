import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import ExpandingGroup from '@department-of-veterans-affairs/formation-react/ExpandingGroup';
import recordEvent from 'platform/monitoring/record-event';
import FacilityPhone from '../../../components/FacilityPhone';
import { GA_PREFIX } from '../../../utils/constants';

const UNSUPPORTED_FACILITY_RANGE = 100;

export default function FacilitiesNotShown({ facilities, sortMethod }) {
  const [isOpen, setIsOpen] = useState(false);
  useEffect(
    () => {
      setIsOpen(false);
    },
    [sortMethod],
  );
  useEffect(
    () => {
      if (isOpen) {
        recordEvent({
          event: `${GA_PREFIX}-facilities-not-listed-click`,
        });
      }
    },
    [isOpen],
  );

  const nearbyUnsupportedFacilities = facilities.filter(
    facility =>
      !facility.legacyVAR.directSchedulingSupported &&
      !facility.legacyVAR.requestSupported &&
      facility.legacyVAR[sortMethod] < UNSUPPORTED_FACILITY_RANGE,
  );

  if (!nearbyUnsupportedFacilities.length) {
    return null;
  }

  const buttonClass = classNames(
    'additional-info-button',
    'va-button-link',
    'vads-u-display--block',
  );

  const iconClass = classNames({
    fas: true,
    'fa-angle-down': true,
    open: isOpen,
  });

  const trigger = (
    <button
      type="button"
      className={buttonClass}
      aria-expanded={isOpen ? 'true' : 'false'}
      aria-controls="facilities-not-shown-content"
      onClick={() => setIsOpen(!isOpen)}
    >
      <span className="additional-info-title">
        Why isn't my facility listed?
        <i className={iconClass} />
      </span>
    </button>
  );

  return (
    <div className="vads-u-margin-bottom--7">
      <ExpandingGroup
        open={isOpen}
        expandedContentId="facilities-not-shown-content"
      >
        {trigger}
        <div className="additional-info-content">
          <p id="vaos-unsupported-label">
            Some facilities don’t offer online scheduling. You can call them
            directly to schedule your appointment.
          </p>
          <ul
            className="usa-unstyled-list"
            aria-labelledby="vaos-unsupported-label"
          >
            {nearbyUnsupportedFacilities.map(facility => (
              <li key={facility.id} className="vads-u-margin-top--2">
                <strong>{facility.name}</strong>
                <br />
                {facility.address?.city}, {facility.address?.state}
                <br />
                {!!facility.legacyVAR[sortMethod] && (
                  <>
                    {facility.legacyVAR[sortMethod]} miles
                    <br />
                  </>
                )}
                Main phone:{' '}
                <FacilityPhone
                  contact={
                    facility.telecom.find(t => t.system === 'phone')?.value
                  }
                />
              </li>
            ))}
          </ul>
          <p className="vads-u-margin-top--4">
            <a
              href="/find-locations"
              target="_blank"
              rel="noopener nofollow"
              onClick={() =>
                recordEvent({
                  event: `${GA_PREFIX}-facilities-not-listed-locator-click`,
                })
              }
            >
              Or, find a different VA location
            </a>
          </p>
        </div>
      </ExpandingGroup>
    </div>
  );
}
