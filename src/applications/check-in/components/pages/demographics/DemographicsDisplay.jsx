import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import PropTypes from 'prop-types';
import ConfirmablePage from '../ConfirmablePage';

import { createSetEditContext } from '../../../actions/edit';

import { URLS } from '../../../utils/navigation';
import { EDITING_PAGE_NAMES } from '../../../utils/appConstants';

export default function DemographicsDisplay({
  header = '',
  subtitle = '',
  demographics = {},
  isEditEnabled = false,
  isLoading = false,
  jumpToPage = () => {},
  yesAction = () => {},
  noAction = () => {},
  Footer,
}) {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const setEditContext = useCallback(
    (data, url) => {
      dispatch(
        createSetEditContext({
          ...data,
          originatingUrl: URLS.DEMOGRAPHICS,
          editingPage: EDITING_PAGE_NAMES.DEMOGRAPHICS,
        }),
      );
      jumpToPage(url);
    },
    [dispatch, jumpToPage],
  );

  const demographicFields = [
    {
      title: t('mailing-address'),
      key: 'mailingAddress',
      editAction: data => {
        setEditContext(data, URLS.EDIT_ADDRESS);
      },
    },
    {
      title: t('home-address'),
      key: 'homeAddress',
      editAction: data => {
        setEditContext(data, URLS.EDIT_ADDRESS);
      },
    },
    {
      title: t('home-phone'),
      key: 'homePhone',
      editAction: data => setEditContext(data, URLS.EDIT_PHONE_NUMBER),
    },
    {
      title: t('mobile-phone'),
      key: 'mobilePhone',
      editAction: data => setEditContext(data, URLS.EDIT_PHONE_NUMBER),
    },
    {
      title: t('work-phone'),
      key: 'workPhone',
      editAction: data => setEditContext(data, URLS.EDIT_PHONE_NUMBER),
    },
    {
      title: t('email-address'),
      key: 'emailAddress',
      editAction: data => setEditContext(data, URLS.EDIT_EMAIL),
    },
  ];
  return (
    <>
      <ConfirmablePage
        header={header || t('is-this-your-current-contact-information')}
        subtitle={subtitle}
        dataFields={demographicFields}
        data={demographics}
        isEditEnabled={isEditEnabled}
        isLoading={isLoading}
        yesAction={yesAction}
        noAction={noAction}
        Footer={Footer}
      />
    </>
  );
}

DemographicsDisplay.propTypes = {
  Footer: PropTypes.elementType,
  demographics: PropTypes.object,
  header: PropTypes.string,
  isEditEnabled: PropTypes.bool,
  isLoading: PropTypes.bool,
  jumpToPage: PropTypes.func,
  noAction: PropTypes.func,
  subtitle: PropTypes.string,
  yesAction: PropTypes.func,
};
