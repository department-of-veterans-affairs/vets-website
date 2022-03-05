import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import propTypes from 'prop-types';
import ConfirmablePage from '../ConfirmablePage';

import { createSetEditContext } from '../../../actions/edit';

import { URLS } from '../../../utils/navigation';
import { EDITING_PAGE_NAMES } from '../../../utils/appConstants';

export default function NextOfKinDisplay({
  header = 'Is this your current next of kin information?',
  subtitle = '',
  nextOfKin = {},
  yesAction = () => {},
  noAction = () => {},
  jumpToPage = () => {},
  isSendingData = false,
  isEditEnabled = false,
  Footer,
}) {
  const dispatch = useDispatch();
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
    { title: 'Name', key: 'name' },
    {
      title: 'Relationship',
      key: 'relationship',
      editAction: data => {
        setEditContext(data, URLS.EDIT_RELATIONSHIP);
      },
    },
    { title: 'Address', key: 'address' },
    { title: 'Phone', key: 'phone' },
    { title: 'Work phone', key: 'workPhone' },
  ];
  const loadingMessage = useCallback(() => {
    return (
      <>
        <va-loading-indicator
          data-testid="loading-message"
          message="Saving your responses..."
        />
      </>
    );
  }, []);
  return (
    <>
      <ConfirmablePage
        header={header}
        subtitle={subtitle}
        dataFields={nextOfKinFields}
        data={nextOfKin}
        yesAction={yesAction}
        noAction={noAction}
        isLoading={isSendingData}
        LoadingMessage={loadingMessage}
        Footer={Footer}
        isEditEnabled={isEditEnabled}
      />
    </>
  );
}

NextOfKinDisplay.propTypes = {
  Footer: propTypes.elementType,
  header: propTypes.string,
  isEditEnabled: propTypes.bool,
  isSendingData: propTypes.bool,
  jumpToPage: propTypes.func,
  nextOfKin: propTypes.object,
  noAction: propTypes.func,
  subtitle: propTypes.string,
  yesAction: propTypes.func,
};
