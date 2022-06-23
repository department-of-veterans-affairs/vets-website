import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import propTypes from 'prop-types';
import ConfirmablePage from '../ConfirmablePage';

import { createSetEditContext } from '../../../actions/edit';

import { URLS } from '../../../utils/navigation';
import { EDITING_PAGE_NAMES } from '../../../utils/appConstants';

export default function NextOfKinDisplay({
  header = '',
  subtitle = '',
  nextOfKin = {},
  yesAction = () => {},
  noAction = () => {},
  jumpToPage = () => {},
  isLoading = false,
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
          originatingUrl: URLS.NEXT_OF_KIN,
          editingPage: EDITING_PAGE_NAMES.NEXT_OF_KIN,
        }),
      );
      jumpToPage(url);
    },
    [dispatch, jumpToPage],
  );
  const nextOfKinFields = [
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
  const loadingMessage = useCallback(
    () => {
      return (
        <>
          <va-loading-indicator
            data-testid="loading-message"
            message={t('saving-your-responses')}
          />
        </>
      );
    },
    [t],
  );
  return (
    <>
      <ConfirmablePage
        header={header || t('is-this-your-current-next-of-kin-information')}
        subtitle={subtitle}
        dataFields={nextOfKinFields}
        data={nextOfKin}
        yesAction={yesAction}
        noAction={noAction}
        isLoading={isLoading}
        loadingMessageOverride={loadingMessage}
        Footer={Footer}
        isEditEnabled={isEditEnabled}
        withBackButton
      />
    </>
  );
}

NextOfKinDisplay.propTypes = {
  Footer: propTypes.elementType,
  header: propTypes.string,
  isEditEnabled: propTypes.bool,
  isLoading: propTypes.bool,
  jumpToPage: propTypes.func,
  nextOfKin: propTypes.object,
  noAction: propTypes.func,
  subtitle: propTypes.string,
  yesAction: propTypes.func,
};
