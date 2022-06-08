import React, { useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import scrollToTop from 'platform/utilities/ui/scrollToTop';
import { focusElement } from 'platform/utilities/ui';
import { VaTextInput } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { isValidPhone } from 'platform/forms/validations';

import { useFormRouting } from '../../../hooks/useFormRouting';
import { makeSelectEditContext } from '../../../selectors';
import {
  createClearEditContext,
  createSetPendingEditedData,
} from '../../../actions/edit';
import CancelButton from './shared/CancelButton';
import UpdateButton from './shared/UpdateButton';
import Header from './shared/Header';
import Footer from '../../layout/Footer';

import { getLabelForEditField } from '../../../utils/appConstants';
import { formatPhone } from '../../../utils/formatters';

export default function PhoneNumber(props) {
  const { router } = props;
  const { t } = useTranslation();
  const { jumpToPage } = useFormRouting(router);
  const selectEditContext = useMemo(makeSelectEditContext, []);
  const { editing } = useSelector(selectEditContext);

  const { editingPage, key, originatingUrl, value } = editing;
  const phone = useMemo(
    () => {
      const data = value.split('x');
      return { number: data[0], extension: data[1], value };
    },
    [value],
  );

  const [phoneNumber, setPhoneNumber] = useState(phone.number);
  const [extension, setExtension] = useState(phone.extension);
  const [phoneErrorMessage, setPhoneErrorMessage] = useState();
  const [extensionErrorMessage] = useState();

  const isUpdatable = useMemo(
    () => {
      return !phoneErrorMessage && !extensionErrorMessage && phone.number;
    },
    [phoneErrorMessage, extensionErrorMessage, phone.number],
  );

  const dispatch = useDispatch();
  const handleUpdatePhone = useCallback(
    () => {
      const newPhoneNumber = `${phoneNumber}${
        extension ? `x${extension}` : ''
      }`;
      if (newPhoneNumber !== value && !phoneErrorMessage) {
        dispatch(
          createSetPendingEditedData({ [key]: newPhoneNumber }, editingPage),
        );
      }
    },
    [
      dispatch,
      editingPage,
      phoneErrorMessage,
      extension,
      key,
      phoneNumber,
      value,
    ],
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

  const onPhoneNumberInput = useCallback(
    event => {
      const { value: newPhone } = event.target;
      if (newPhone === '') {
        setPhoneErrorMessage(
          `${getLabelForEditField(key, {
            capitalizeFirstLetter: true,
          })} is required`,
        );
      } else if (!isValidPhone(newPhone)) {
        setPhoneErrorMessage(t('please-enter-valid-phone-number'));
      } else {
        setPhoneErrorMessage();
      }
      setPhoneNumber(newPhone);
    },
    [setPhoneNumber, key, t],
  );

  const onExtensionInput = useCallback(
    event => {
      const { value: newExtension } = event.target;
      setExtension(newExtension);
    },
    [setExtension],
  );

  return (
    <div className="vads-l-grid-container vads-u-padding-bottom--5 vads-u-padding-top--4  vads-u-padding-right--4 vads-u-padding-left-2 ">
      <Header
        what={getLabelForEditField(key)}
        editingPage={editingPage}
        value={value}
      />
      <VaTextInput
        error={phoneErrorMessage}
        label={getLabelForEditField(key, { capitalizeFirstLetter: true })}
        maxlength={null}
        name={key}
        value={formatPhone(phoneNumber)}
        onInput={onPhoneNumberInput}
        required
      />
      <VaTextInput
        error={extensionErrorMessage}
        label="Extension"
        maxlength={null}
        name={`${key}-extension`}
        value={extension}
        onInput={onExtensionInput}
        class="vads-u-padding-bottom--6"
      />
      <UpdateButton
        jumpToPage={jumpToPage}
        backPage={originatingUrl}
        clearData={clearEditContext}
        handleUpdate={handleUpdatePhone}
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

PhoneNumber.propTypes = {
  router: PropTypes.object,
};
