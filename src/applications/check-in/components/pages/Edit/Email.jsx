import React, { useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import scrollToTop from 'platform/utilities/ui/scrollToTop';
import { focusElement } from 'platform/utilities/ui';
import { VaTextInput } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { isValidEmail } from 'platform/forms/validations';

import { useFormRouting } from '../../../hooks/useFormRouting';
import { makeSelectEditContext } from '../../../selectors';
import {
  createClearEditContext,
  createSetPendingEditedData,
} from '../../../actions/edit';
import CancelButton from './shared/CancelButton';
import UpdateButton from './shared/UpdateButton';
import Footer from '../../layout/Footer';
import Header from './shared/Header';

export default function Email(props) {
  const { router } = props;
  const { t } = useTranslation();
  const { jumpToPage } = useFormRouting(router);
  const selectEditContext = useMemo(makeSelectEditContext, []);
  const { editing } = useSelector(selectEditContext);

  const { editingPage, key, originatingUrl, value } = editing;
  const [email, setEmail] = useState(value);
  const [errorMessage, setErrorMessage] = useState();

  const isUpdatable = useMemo(
    () => {
      return !errorMessage;
    },
    [errorMessage],
  );

  const dispatch = useDispatch();
  const handleUpdateEmail = useCallback(
    () => {
      if (email !== value && !errorMessage) {
        dispatch(
          createSetPendingEditedData({ emailAddress: email }, editingPage),
        );
      }
    },
    [dispatch, editingPage, email, errorMessage, value],
  );
  const clearEditContext = useCallback(
    () => {
      dispatch(createClearEditContext());
    },
    [dispatch],
  );

  useEffect(() => {
    focusElement('h1');
    scrollToTop('topScrollElement');
  }, []);

  const onInput = useCallback(
    event => {
      const { value: newEmail } = event.target;
      if (!newEmail) {
        setErrorMessage(t('please-enter-an-email-address'));
      } else if (!isValidEmail(newEmail)) {
        setErrorMessage(t('please-enter-a-valid-email-address'));
      } else {
        setErrorMessage();
      }
      setEmail(newEmail);
    },
    [setEmail, t],
  );

  return (
    <div className="vads-l-grid-container vads-u-padding-bottom--5 vads-u-padding-top--4  vads-u-padding-right--4 vads-u-padding-left-2 ">
      <Header value={value} what="email address" editingPage={editingPage} />

      <VaTextInput
        error={errorMessage}
        label={t('email-address')}
        maxlength={null}
        name={key}
        value={email}
        required
        onInput={onInput}
        class="vads-u-padding-bottom--4"
      />
      <UpdateButton
        jumpToPage={jumpToPage}
        backPage={originatingUrl}
        clearData={clearEditContext}
        handleUpdate={handleUpdateEmail}
        isUpdatable={isUpdatable}
      />
      <CancelButton
        jumpToPage={jumpToPage}
        backPage={originatingUrl}
        clearData={clearEditContext}
      />
      <Footer />
    </div>
  );
}

Email.propTypes = {
  router: PropTypes.object,
};
