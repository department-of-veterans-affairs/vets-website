import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { getCernerURL } from 'platform/utilities/cerner';
import { selectRegisteredCernerFacilities } from '../redux/selectors';
import { GA_PREFIX } from '../utils/constants';

function handleClick() {
  window.recordEvent({
    event: `${GA_PREFIX}-cerner-redirect-appointments-landing-page`,
  });
}

export default function CernerAlert({ className, pageTitle, level = 2 }) {
  const H = `h${level}`;
  const cernerFacilities = useSelector(selectRegisteredCernerFacilities);
  const shouldDisplay = () =>
    cernerFacilities.length > 0 && pageTitle === 'Appointments';

  return (
    <>
      {shouldDisplay() && (
        <div className={className}>
          <va-alert status="warning" background-only visible uswds>
            <H className="vads-u-font-size--h4 vads-u-margin-top--0">
              {`To manage appointments at ${
                cernerFacilities.length === 1
                  ? 'this facility'
                  : 'these facilities'
              }, go to My VA Health`}
            </H>
            <ul>
              {/* <ListItem facilities={cernerFacilities} /> */}
              {cernerFacilities.map(facility => (
                <li key={facility.vhaId}>{facility.vamcFacilityName}</li>
              ))}
            </ul>
            <a
              className="vads-c-action-link--blue vads-u-margin-bottom--1"
              onClick={handleClick}
              href={getCernerURL('/pages/scheduling/upcoming', true)}
              rel="noreferrer noopener"
              target="_blank"
            >
              Go to My VA Health
            </a>
            <va-additional-info
              trigger="Having trouble opening My VA Health?"
              uswds
            >
              Try these steps:
              <ul className="vads-u-margin-left--1p5">
                <li>Disable your browser's pop-up blocker</li>
                <li>
                  Sign in to My VA health with the same account you used to sign
                  in to VA.gov
                </li>
              </ul>
            </va-additional-info>
          </va-alert>
        </div>
      )}
    </>
  );
}
CernerAlert.propTypes = {
  pageTitle: PropTypes.string.isRequired,
  className: PropTypes.string,
  level: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
