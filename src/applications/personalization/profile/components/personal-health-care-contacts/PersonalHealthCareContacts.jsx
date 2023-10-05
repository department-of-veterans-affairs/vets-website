import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  selectProfileContactsToggle,
  selectProfileContacts,
  selectEmergencyContact,
  selectNextOfKin,
} from '@@profile/selectors';
import { fetchProfileContacts } from '@@profile/actions';

import Contact from './Contact';
import Loading from './Loading';

const PersonalHealthCareContacts = () => {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector(selectProfileContacts);
  const { featureToggles } = useSelector(state => state);
  const enabled = useSelector(selectProfileContactsToggle);
  const emergencyContact = useSelector(selectEmergencyContact);
  const nextOfKin = useSelector(selectNextOfKin);

  useEffect(
    () =>
      enabled &&
      !data &&
      !loading &&
      !error &&
      dispatch(fetchProfileContacts()),
    [data, dispatch, enabled, error, loading],
  );

  if (featureToggles.loading) return <Loading testId="phcc-loading" />;
  if (!enabled) return <></>;

  return (
    <div className="vads-u-padding-bottom--4">
      <h1
        tabIndex="-1"
        className="vads-u-font-size--h2 vads-u-margin-y--2 medium-screen:vads-u-margin-bottom--4 medium-screen:vads-u-margin-top--3"
        data-focus-target
      >
        Personal health care contacts
      </h1>

      <div className="vads-u-margin-bottom--3">
        <va-additional-info
          className=""
          trigger="Learn how to update your personal health care contact information"
          uswds
        >
          <p>
            If this isn’t your correct information, a staff member can help
            update your information or you can call the help desk at
            <br />
            <va-telephone contact="8006982411" />
          </p>
        </va-additional-info>
      </div>

      <section className="profile-info-card">
        <div className="row vads-u-border-color--gray-lighter vads-u-color-gray-dark vads-u-display--flex vads-u-flex-direction--column vads-u-padding-x--2 vads-u-padding-y--1p5 medium-screen:vads-u-padding--4 vads-u-border--1px">
          <h2 className="vads-u-font-family--sans vads-u-font-size--base vads-u-margin--0">
            Medical emergency contact
          </h2>
          <p className="vads-u-color--gray-medium vads-u-margin-top--1 vads-u-margin-bottom--1">
            This person may be contacted in the event of an emergency.
          </p>
          {emergencyContact && (
            <Contact
              key={emergencyContact.id}
              {...emergencyContact.attributes}
            />
          )}
          {!emergencyContact && (
            <p>
              To add an emergency contact please call the Help Desk at
              800-698-2411
            </p>
          )}
        </div>

        <div className="row vads-u-border-color--gray-lighter vads-u-color-gray-dark vads-u-display--flex vads-u-flex-direction--column vads-u-padding-x--2 vads-u-padding-y--1p5 medium-screen:vads-u-padding--4 vads-u-border-left--1px vads-u-border-right--1px vads-u-border-bottom--1px">
          <h3 className="vads-u-font-family--sans vads-u-font-size--base vads-u-margin--0">
            Next of kin contact
          </h3>
          <p className="vads-u-color--gray-medium vads-u-margin-top--1 vads-u-margin-bottom--1">
            This person is who you’d like to represent your wishes for care and
            medical documentation if needed. Your next of kin is often your
            closest living relative, like your spouse, child, or sibling.
          </p>
          {nextOfKin && (
            <Contact key={nextOfKin.id} {...nextOfKin.attributes} />
          )}
          {!nextOfKin && (
            <p>
              To add a next of kin please call the Help Desk at 800-698-2411
            </p>
          )}
        </div>
      </section>
    </div>
  );
};

export default PersonalHealthCareContacts;
