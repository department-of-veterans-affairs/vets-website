import React from 'react';
import getProfileInfoFieldAttributes from '~/platform/user/profile/vap-svc/util/getProfileInfoFieldAttributes';
import { FIELD_NAMES } from '~/platform/user/profile/vap-svc/constants';
import { useDispatch } from 'react-redux';
import {
  openModal,
  updateFormFieldWithSchema,
} from '~/platform/user/profile/vap-svc/actions';

const ID = 'profile';

export const Plugin = () => {
  const dispatch = useDispatch();
  const autoFillPreferredName = () => {
    const result = getProfileInfoFieldAttributes(FIELD_NAMES.PREFERRED_NAME);
    dispatch(openModal(FIELD_NAMES.PREFERRED_NAME));
    setTimeout(() => {
      dispatch(
        updateFormFieldWithSchema(
          FIELD_NAMES.PREFERRED_NAME,
          { [FIELD_NAMES.PREFERRED_NAME]: 'testerson' },
          result.formSchema,
          result.uiSchema,
        ),
      );
    }, 250);
  };

  return (
    <>
      <div>plugin tab</div>
      <va-button onClick={autoFillPreferredName} text="Auto fill" />{' '}
    </>
  );
};

export const profilePluginConfig = {
  id: ID,
  component: Plugin,
};
