import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import ExpandingGroup from '@department-of-veterans-affairs/component-library/ExpandingGroup';
import recordEvent from 'platform/monitoring/record-event';
import FacilityPhone from '../../../components/FacilityPhone';
import { GA_PREFIX } from '../../../utils/constants';
import State from '../../../components/State';
import NewTabAnchor from '../../../components/NewTabAnchor';

const UNSUPPORTED_FACILITY_RANGE = 100;

export default function FacilitiesNotShown({
  facilities,
  sortMethod,
  typeOfCareId,
}) {
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

  const nearbyUnsupportedFacilities = facilities?.filter(
    facility =>
      !facility.legacyVAR.directSchedulingSupported[typeOfCareId] &&
      !facility.legacyVAR.requestSupported[typeOfCareId] &&
      facility.legacyVAR[sortMethod] < UNSUPPORTED_FACILITY_RANGE,
  );

  if (!nearbyUnsupportedFacilities?.length) {
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
            The facilities below don’t offer online scheduling for this care.
          </p>
          <ul
            className="usa-unstyled-list"
            aria-labelledby="vaos-unsupported-label"
          >
            {nearbyUnsupportedFacilities.map(facility => (
              <li key={facility.id} className="vads-u-margin-top--2">
                <strong>{facility.name}</strong>
                <br />
                {facility.address?.city},{' '}
                <State state={facility.address?.state} />
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
          <h3 className="vads-u-font-size--h4 vads-u-margin-top--2 vads-u-margin-bottom--1">
            What you can do
          </h3>
          <p className="vads-u-margin-top--0">
            Call the facility directly to schedule your appointment,{' '}
            <strong>or </strong>
            <NewTabAnchor
              href="/find-locations"
              onClick={() =>
                recordEvent({
                  event: `${GA_PREFIX}-facilities-not-listed-locator-click`,
                })
              }
            >
              search for a different VA location
            </NewTabAnchor>
            .
          </p>
        </div>
      </ExpandingGroup>
    </div>
  );
}
