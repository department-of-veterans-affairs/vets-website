import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { PROFILE_PATH_NAMES } from '@@profile/constants';
import { selectVAPEmailAddress } from '~/platform/user/selectors';
import Headline from '../ProfileSectionHeadline';
import { Description } from './Description';
import { Note } from './Note';
import { MissingEmailAlert } from './MissingEmailAlert';

export const PaperlessDelivery = ({ emailAddress }) => {
  const showMissingEmailAlert = !emailAddress;

  return (
    <>
      <Headline>{PROFILE_PATH_NAMES.PAPERLESS_DELIVERY}</Headline>
      <Description />
      {showMissingEmailAlert && <MissingEmailAlert />}
      <hr aria-hidden="true" className="vads-u-margin-y--3" />
      <Note />
    </>
  );
};

PaperlessDelivery.propTypes = {
  emailAddress: PropTypes.string,
};

const mapStateToProps = state => {
  const emailAddress = selectVAPEmailAddress(state);

  return {
    emailAddress,
  };
};

export default connect(mapStateToProps)(PaperlessDelivery);
