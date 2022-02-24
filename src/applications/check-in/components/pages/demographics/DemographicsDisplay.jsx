import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import ConfirmablePage from '../ConfirmablePage';

import { URLS } from '../../../utils/navigation';

import { createEditFieldAction } from '../../../actions/edit';

export default function DemographicsDisplay({
  header = 'Is this your current contact information?',
  subtitle = 'We can better follow up with you after your appointment when we have your current information.',
  demographics = {},
  yesAction = () => {},
  noAction = () => {},
  Footer,
  jumpToPage,
  isEditEnabled = false,
}) {
  const dispatch = useDispatch();
  const demographicFields = [
    { title: 'Mailing address', key: 'mailingAddress', editAction: () => {} },
    { title: 'Home address', key: 'homeAddress', editAction: () => {} },
    {
      title: 'Home phone',
      key: 'homePhone',
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
      title: 'Mobile phone',
      key: 'mobilePhone',
      editAction: field => {
        const dataForEdit = {
          originatingUrl: URLS.DEMOGRAPHICS,
          thingToUpdate: 'demographics',
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
        jumpToPage(URLS.EDIT_PHONE_NUMBER);
      },
    },
    {
      title: 'Email address',
      key: 'emailAddress',
      editAction: field => {
        const dataForEdit = {
          originatingPage: URLS.DEMOGRAPHICS,
          ...field,
        };
        // update redux with {where we came from, what we want to edit, }
        dispatch(createEditFieldAction(dataForEdit));
        // go to next page
        jumpToPage(URLS.EDIT_EMAIL);
      },
    },
  ];
  return (
    <>
      <ConfirmablePage
        header={header}
        subtitle={subtitle}
        dataFields={demographicFields}
        data={demographics}
        yesAction={yesAction}
        noAction={noAction}
        Footer={Footer}
        isEditEnabled={isEditEnabled}
      />
    </>
  );
}

DemographicsDisplay.propTypes = {
  Footer: PropTypes.elementType,
  demographics: PropTypes.object,
  header: PropTypes.string,
  noAction: PropTypes.func,
  subtitle: PropTypes.string,
  yesAction: PropTypes.func,
  jumpToPage: PropTypes.func,
};
