import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
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
  return (
    <>
      <ConfirmablePage
        header="Is this your current emergency contact?"
        dataFields={dataFields}
        data={emergencyContact}
        yesAction={yesAction}
        noAction={noAction}
        Footer={Footer}
        isLoading={isLoading}
        isEditEnabled={isEditEnabled}
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
