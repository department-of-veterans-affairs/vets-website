import React from 'react';
import { OLD_FORM_FIRST_PAGE_URL } from '../constants';

export default function StartApplicationWithoutSigningInLink() {
  return (
    <a href={OLD_FORM_FIRST_PAGE_URL}>
      Start your application without signing in
    </a>
  );
}
