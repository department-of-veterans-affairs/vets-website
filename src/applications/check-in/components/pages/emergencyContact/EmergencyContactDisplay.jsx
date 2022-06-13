import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import ConfirmablePage from '../ConfirmablePage';

import { createSetEditContext } from '../../../actions/edit';

import { URLS } from '../../../utils/navigation';
import { EDITING_PAGE_NAMES } from '../../../utils/appConstants';

export default function EmergencyContactDisplay({
  emergencyContact = {},
  yesAction = () => {},
  noAction = () => {},
  jumpToPage = () => {},
  isLoading,
  isEditEnabled = false,
  Footer,
}) {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const setEditContext = useCallback(
    (data, url) => {
      dispatch(
        createSetEditContext({
          ...data,
          originatingUrl: URLS.EMERGENCY_CONTACT,
          editingPage: EDITING_PAGE_NAMES.EMERGENCY_CONTACT,
        }),
      );
      jumpToPage(url);
    },
    [dispatch, jumpToPage],
  );
  const dataFields = [
    {
      title: t('name'),
      key: 'name',
      editAction: data => {
        setEditContext(data, URLS.EDIT_NAME);
      },
    },
    {
      title: t('relationship'),
      key: 'relationship',
      editAction: data => {
        setEditContext(data, URLS.EDIT_RELATIONSHIP);
      },
    },
    {
      title: t('address'),
      key: 'address',
      editAction: data => {
        setEditContext(data, URLS.EDIT_ADDRESS);
      },
    },
    {
      title: t('phone'),
      key: 'phone',
      editAction: data => setEditContext(data, URLS.EDIT_PHONE_NUMBER),
    },
    {
      title: t('work-phone'),
      key: 'workPhone',
      editAction: data => setEditContext(data, URLS.EDIT_PHONE_NUMBER),
    },
  ];
  return (
    <>
      <ConfirmablePage
        header={t('is-this-your-current-emergency-contact')}
        dataFields={dataFields}
        data={emergencyContact}
        yesAction={yesAction}
        noAction={noAction}
        Footer={Footer}
        isLoading={isLoading}
        isEditEnabled={isEditEnabled}
        withBackButton
      />
    </>
  );
}

EmergencyContactDisplay.propTypes = {
  Footer: PropTypes.elementType,
  emergencyContact: PropTypes.object,
  isEditEnabled: PropTypes.bool,
  isLoading: PropTypes.bool,
  jumpToPage: PropTypes.func,
  noAction: PropTypes.func,
  yesAction: PropTypes.func,
};
