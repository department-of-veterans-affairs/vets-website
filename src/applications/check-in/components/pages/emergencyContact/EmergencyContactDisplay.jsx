import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';

import ConfirmablePage from '../ConfirmablePage';

import { URLS } from '../../../utils/navigation';

import { createEditFieldAction } from '../../../actions/edit';

export default function EmergencyContactDisplay({
  data = {},
  yesAction = () => {},
  noAction = () => {},
  isLoading,
  Footer,
  jumpToPage,
  isEditEnabled,
}) {
  const dispatch = useDispatch();
  const dataFields = [
    { title: 'Name', key: 'name', editAction: () => {} },
    { title: 'Relationship', key: 'relationship', editAction: () => {} },
    { title: 'Address', key: 'address', editAction: () => {} },
    {
      title: 'Phone',
      key: 'phone',
      editAction: field => {
        const dataForEdit = {
          originatingPage: URLS.DEMOGRAPHICS,
          ...field,
        };
        // update redux with {where we came from, what we want to edit, }
        dispatch(createEditFieldAction(dataForEdit));
        // go to next page
        jumpToPage(URLS.EDIT_PHONE_NUMBER);
      },
    },
    {
      title: 'Work phone',
      key: 'workPhone',
      editAction: field => {
        const dataForEdit = {
          originatingPage: URLS.DEMOGRAPHICS,
          ...field,
        };
        // update redux with {where we came from, what we want to edit, }
        dispatch(createEditFieldAction(dataForEdit));
        // go to next page
        jumpToPage(URLS.EDIT_PHONE_NUMBER);
      },
    },
  ];
  return (
    <>
      <ConfirmablePage
        header="Is this your current emergency contact?"
        dataFields={dataFields}
        data={data}
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
  data: PropTypes.object,
  isLoading: PropTypes.bool,
  noAction: PropTypes.func,
  yesAction: PropTypes.func,
};
