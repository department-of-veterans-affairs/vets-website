import React from 'react';
import { PROFILE_PATH_NAMES } from '@@profile/constants';
import Headline from '../ProfileSectionHeadline';
import { Description } from './Description';
import { Note } from './Note';

export const PaperlessDelivery = () => {
  return (
    <>
      <Headline>{PROFILE_PATH_NAMES.PAPERLESS_DELIVERY}</Headline>
      <Description />
      <hr aria-hidden="true" className="vads-u-margin-y--3" />
      <Note />
    </>
  );
};
