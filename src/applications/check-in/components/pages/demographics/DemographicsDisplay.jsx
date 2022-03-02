import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import PropTypes from 'prop-types';
import ConfirmablePage from '../ConfirmablePage';

import { createSetEditContext } from '../../../actions/edit';

import { URLS } from '../../../utils/navigation';
import { EDITING_PAGE_NAMES } from '../../../utils/appConstants';

export default function DemographicsDisplay({
  header = 'Is this your current contact information?',
  subtitle = 'We can better follow up with you after your appointment when we have your current information.',
  demographics = {},
  isEditEnabled = false,
  jumpToPage = () => {},
  yesAction = () => {},
  noAction = () => {},
  Footer,
}) {
  const dispatch = useDispatch();
  const setEditContext = useCallback(
    data => {
      dispatch(
        createSetEditContext({
          ...data,
          originatingUrl: URLS.DEMOGRAPHICS,
          editingPage: EDITING_PAGE_NAMES.DEMOGRAPHICS,
        }),
      );
      jumpToPage(URLS.EDIT_EMAIL);
    },
    [dispatch, jumpToPage],
  );
  const demographicFields = [
    { title: 'Mailing address', key: 'mailingAddress' },
    { title: 'Home address', key: 'homeAddress' },
    { title: 'Home phone', key: 'homePhone' },
    { title: 'Mobile phone', key: 'mobilePhone' },
    { title: 'Work phone', key: 'workPhone' },
    {
      title: 'Email address',
      key: 'emailAddress',
      editAction: data => {
        setEditContext(data);
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
        isEditEnabled={isEditEnabled}
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
  jumpToPage: PropTypes.func,
  noAction: PropTypes.func,
  subtitle: PropTypes.string,
  yesAction: PropTypes.func,
};
