import React, { useCallback, useMemo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { useSelector, useDispatch } from 'react-redux';
import { focusElement } from 'platform/utilities/ui';
import scrollToTop from 'platform/utilities/ui/scrollToTop';
import { VaTextInput } from 'web-components/react-bindings';

import { useFormRouting } from '../../../hooks/useFormRouting';
import { makeSelectEditContext } from '../../../selectors';
import {
  createClearEditContext,
  createSetPendingEditedData,
} from '../../../actions/edit';
import CancelButton from './shared/CancelButton';
import UpdateButton from './shared/UpdateButton';
import Footer from '../../Footer';
import BackToHome from '../../BackToHome';

export default function Name(props) {
  const { router } = props;
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

  const onChange = useCallback(
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
      title = "Edit next of kin's name";
      break;
    case 'emergencyContact':
      title = "Edit your contact's name";
      break;
    default:
      title = 'Edit name';
  }
  return (
    <div className="vads-l-grid-container vads-u-padding-bottom--6 vads-u-padding-top--2 edit-relationship-page">
      <h1 data-testid="header">{title}</h1>
      <VaTextInput
        error={error}
        label="Name"
        name={key}
        value={nameValue}
        required
        onVaChange={onChange}
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
