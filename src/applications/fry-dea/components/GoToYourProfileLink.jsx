import React from 'react';
import { YOUR_PROFILE_URL } from '../constants';

export default function GoToYourProfileLink() {
  return (
    <a href={YOUR_PROFILE_URL} target="blank">
      Go to your profile
    </a>
  );
}
