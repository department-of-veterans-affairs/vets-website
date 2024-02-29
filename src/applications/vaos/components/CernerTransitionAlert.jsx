import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { selectPatientFacilities } from '~/platform/user/cerner-dsot/selectors';
import { OH_TRANSITION_SITES } from '../utils/constants';

export default function CernerTransitionAlert({ className, level = 2 }) {
  const H = `h${level}`;
  const registeredFacilities = useSelector(selectPatientFacilities);
  const hasRegisteredOHTransitionSite = registeredFacilities.find(
    ({ facilityId }) => facilityId === OH_TRANSITION_SITES.Lovell.id,
  );
  // Show Alert if user is registered at an OH Transition site
  const showAlert = () => !!hasRegisteredOHTransitionSite;

  const hasRegisteredNonTransitionSite = registeredFacilities.find(
    ({ facilityId }) => facilityId !== OH_TRANSITION_SITES.Lovell.id,
  );

  return (
    <>
      {showAlert() && (
        <div className={className}>
          <va-alert status="warning" background-only visible uswds>
            <H className="vads-u-font-size--h4 vads-u-margin-top--0">
              {hasRegisteredNonTransitionSite
                ? 'One of your health facilities is moving to My VA Health'
                : 'Your health facility is moving to My VA Health'}
            </H>
            <p className="usa-alert__text vads-u-font-weight--normal vads-u-line-height--3">
              We’re moving data for{' '}
              <strong>{OH_TRANSITION_SITES.Lovell.name}</strong> to our My VA
              Health portal. You can’t use this tool to schedule or cancel
              appointments at this facility right now.
            </p>
            <p className="usa-alert__text vads-u-font-weight--normal vads-u-line-height--3">
              On <strong>{OH_TRANSITION_SITES.Lovell.transitionDate},</strong>{' '}
              you can use start using My VA Health to schedule and cancel
              appointments at this facility.
            </p>
            <p className="usa-alert__text vads-u-font-weight--normal vads-u-line-height--3">
              To schedule or cancel appointments at this facility now, call this
              facility.
            </p>
            <div className="main-phone vads-u-margin-bottom--1">
              <strong>Main phone: </strong>
              <va-telephone contact={OH_TRANSITION_SITES.Lovell.telephone} /> (
              <va-telephone contact="711" tty />)
            </div>
          </va-alert>
        </div>
      )}
    </>
  );
}
CernerTransitionAlert.propTypes = {
  className: PropTypes.string,
  level: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
