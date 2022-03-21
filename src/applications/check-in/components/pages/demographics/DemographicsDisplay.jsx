import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

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
  isLoading = false,
  jumpToPage = () => {},
  yesAction = () => {},
  noAction = () => {},
  Footer,
}) {
  const { currentlyLoggedIn } = useSelector(state => state.user?.login);

  const dispatch = useDispatch();
  const setEditContext = useCallback(
    (data, url) => {
      dispatch(
        createSetEditContext({
          ...data,
        }),
      );
      jumpToPage(url);
    },
    [dispatch, jumpToPage],
  );
  const shared = {
    originatingUrl: URLS.DEMOGRAPHICS,
    editingPage: EDITING_PAGE_NAMES.DEMOGRAPHICS,
  };

  const demographicFields = [
    { title: 'Mailing address', key: 'mailingAddress' },
    { title: 'Home address', key: 'homeAddress' },
    {
      title: 'Home phone',
      key: 'homePhone',
      ...shared,
      editAction: data => setEditContext(data, URLS.EDIT_PHONE_NUMBER),
    },
    {
      title: 'Mobile phone',
      key: 'mobilePhone',
      ...shared,
      editAction: data => setEditContext(data, URLS.EDIT_PHONE_NUMBER),
    },
    {
      title: 'Work phone',
      key: 'workPhone',
      ...shared,
      editAction: data => setEditContext(data, URLS.EDIT_PHONE_NUMBER),
    },
    {
      title: 'Email address',
      key: 'emailAddress',
      ...shared,
      editAction: data => setEditContext(data, URLS.EDIT_EMAIL),
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
        isLoading={isLoading}
        yesAction={yesAction}
        noAction={noAction}
        Footer={Footer}
        currentlyLoggedIn={currentlyLoggedIn}
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
