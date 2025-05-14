import React from 'react';
import {
  titleUI,
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { isLoggedIn } from 'platform/user/selectors';
import { useSelector } from 'react-redux';
import { MUST_MATCH_ALERT } from '../config/constants';
import { onCloseAlert } from '../helpers';
import { CustomAlertPage } from './helpers';
import AccessTokenManager from '../containers/AccessTokenManager';

/** @type {PageSchema} */
export const isVeteranPage = {
  uiSchema: {
    ...titleUI('Tell us who the claimant is'),
    isVeteran: {
      ...yesNoUI('Is the claimant also the veteran?'),
      'ui:required': () => true,
    },
  },
  schema: {
    type: 'object',
    properties: {
      isVeteran: yesNoSchema,
    },
  },
};

export function IsVeteranPage(props) {
  const userLoggedIn = useSelector(state => isLoggedIn(state));
  const alert = MUST_MATCH_ALERT('is-veteran', onCloseAlert, props.data);
  return (
    <>
      <AccessTokenManager userLoggedIn={userLoggedIn} />
      <CustomAlertPage {...props} alert={alert} />;
    </>
  );
}
