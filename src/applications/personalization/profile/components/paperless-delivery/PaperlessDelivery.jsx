import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { PROFILE_PATH_NAMES } from '@@profile/constants';
import { selectVAPEmailAddress } from '~/platform/user/selectors';
import Headline from '../ProfileSectionHeadline';
import { Description } from './Description';
import { Note } from './Note';
import { MissingEmailAlert } from './MissingEmailAlert';
import { ProfileEmail } from './ProfileEmail';
import { FieldHasBeenUpdated } from '../alerts/FieldHasBeenUpdated';

export const PaperlessDelivery = () => {
  const emailAddress = useSelector(selectVAPEmailAddress);
  const showMissingEmailAlert = !emailAddress;

  useEffect(() => {
    document.title = `Paperless Delivery | Veterans Affairs`;
  }, []);

  return (
    <>
      <Headline>{PROFILE_PATH_NAMES.PAPERLESS_DELIVERY}</Headline>
      <Description />
      {showMissingEmailAlert && <MissingEmailAlert />}
      <FieldHasBeenUpdated slim />
      <ProfileEmail emailAddress={emailAddress} />
      <hr aria-hidden="true" className="vads-u-margin-y--3" />
      <Note />
    </>
  );
};
