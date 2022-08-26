import React from 'react';
import PropTypes from 'prop-types';
import { YOUR_PROFILE_URL } from '../constants';

export default function GoToYourProfileLink({ text = 'Go to your profile' }) {
  return <a href={YOUR_PROFILE_URL}>{text}</a>;
}

GoToYourProfileLink.propTypes = {
  text: PropTypes.string,
};
