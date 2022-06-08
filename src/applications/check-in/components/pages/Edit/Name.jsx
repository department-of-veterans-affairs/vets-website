import React, { useCallback, useMemo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { focusElement } from 'platform/utilities/ui';
import scrollToTop from 'platform/utilities/ui/scrollToTop';
import { VaTextInput } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import { useFormRouting } from '../../../hooks/useFormRouting';
import { makeSelectEditContext } from '../../../selectors';
import {
  createClearEditContext,
  createSetPendingEditedData,
} from '../../../actions/edit';
import CancelButton from './shared/CancelButton';
import UpdateButton from './shared/UpdateButton';
import Footer from '../../layout/Footer';
import BackToHome from '../../BackToHome';

export default function Name(props) {
  const { router } = props;
  const { t } = useTranslation();
  const { jumpToPage } = useFormRouting(router);
  const selectEditContext = useMemo(makeSelectEditContext, []);
  const { editing } = useSelector(selectEditContext);
  const { editingPage, key, originatingUrl, value } = editing;
  const [nameValue, setNameValue] = useState(value);
  const [error, setError] = useState();

  const dispatch = useDispatch();
  const clearEditContext = useCallback(
    () => {
      dispatch(createClearEditContext());
    },
    [dispatch],
  );

  const handleUpdate = useCallback(
    () => {
      dispatch(createSetPendingEditedData({ name: nameValue }, editingPage));
    },
    [dispatch, editingPage, nameValue],
  );

  useEffect(() => {
    focusElement('h1');
    scrollToTop('topScrollElement');
  }, []);

  const onInput = useCallback(
    event => {
      if (!event.target.value) {
        setError('Name is required');
      } else {
        setError(null);
      }
      setNameValue(event.target.value);
    },
    [setNameValue, setError],
  );

  let title = '';
  switch (editingPage) {
    case 'nextOfKin':
      title = t('edit-next-of-kins-name');
      break;
    case 'emergencyContact':
      title = t('edit-your-contacts-name');
      break;
    default:
      title = t('edit-name');
  }
  return (
    <div className="vads-l-grid-container vads-u-padding-bottom--6 vads-u-padding-top--2 edit-relationship-page">
      <h1 data-testid="header">{title}</h1>
      <VaTextInput
        error={error}
        label={t('name')}
        name={key}
        value={nameValue}
        required
        onInput={onInput}
        className="vads-u-margin-bottom--3"
      />
      <UpdateButton
        jumpToPage={jumpToPage}
        backPage={originatingUrl}
        clearData={clearEditContext}
        handleUpdate={handleUpdate}
      />
      <CancelButton
        jumpToPage={jumpToPage}
        backPage={originatingUrl}
        clearData={clearEditContext}
      />
      <Footer />
      <BackToHome />
    </div>
  );
}

Name.propTypes = {
  router: PropTypes.object,
};
