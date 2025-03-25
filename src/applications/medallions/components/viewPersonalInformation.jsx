import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';
import { setData } from 'platform/forms-system/src/js/actions';
import { Title } from 'platform/forms-system/src/js/web-component-patterns/titlePattern';

export const ViewPersonalInformation = props => {
  const dispatch = useDispatch();
  // eslint-disable-next-line no-shadow
  const state = useSelector(state => state);
  const fullName = state.user.profile.userFullName;
  const firstName = fullName?.first;
  const lastName = fullName?.last;

  const formData = state.form.data;
  const { currentlyLoggedIn } = state.user.login;

  useEffect(
    () => {
      if (currentlyLoggedIn !== formData?.isLoggedIn) {
        dispatch(
          setData({
            ...formData,
            isLoggedIn: currentlyLoggedIn,
          }),
        );
      }
    },
    [dispatch, currentlyLoggedIn],
  );

  return (
    <div style={{ paddingTop: '1em' }}>
      <Title title="Confirm the personal information we have on file for you" />
      <va-card background style={{ marginTop: '2em' }}>
        <h3 className="vads-u-font-size--h4" style={{ marginTop: '1em' }}>
          Personal information
        </h3>
        <p>
          <strong>Name: </strong>
          {firstName} {lastName}
        </p>
      </va-card>
      <p>
        <strong>Note: </strong>
        To protect your personal information, we don’t allow online changes to
        your name, date of birth, or Social Security number. If you need to
        change this information, call us at{' '}
        <va-telephone contact="8008271000" /> (
        <va-telephone contact={CONTACTS['711']} tty />
        ). We’re here Monday through Friday, between 8:00 a.m. and 9:00 p.m. ET.
      </p>
      <a
        href="https://www.va.gov/resources/how-to-change-your-legal-name-on-file-with-va/"
        target="_blank"
        rel="noopener noreferrer"
      >
        Find more detailed instructions for how to change your legal name (opens
        in new tab)
      </a>
      <FormNavButtons goBack={props.goBack} goForward={props.goForward} />
    </div>
  );
};
