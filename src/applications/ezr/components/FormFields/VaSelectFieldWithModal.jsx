// @ts-check
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  VaSelect,
  VaModal,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { replaceStrValues } from '../../utils/helpers/general';

function optionsList(schema) {
  return schema.enum.map((value, i) => {
    const label = (schema.enumNames && schema.enumNames[i]) || String(value);
    return { label, value };
  });
}

/**
 * Usage uiSchema:
 * ```
 * maritalStatus: {
 *   'ui:title': 'Marital Status',
 *   'ui:webComponentField': VaSelectFieldWithModal,
 *   'ui:description': 'Select your current marital status',
 *   'ui:options': {
 *     labels: {
 *       Married: 'Married',
 *       Separated: 'Separated',
 *       Divorced: 'Divorced',
 *       Widowed: 'Widowed',
 *       NeverMarried: 'Never Married',
 *     },
 *     modalConfig: {
 *       triggerValues: ['Married', 'Separated'],
 *       modalTitle: 'Marital Status Changed',
 *       modalDescription: 'Your marital status has been updated. This may affect your benefits eligibility.',
 *       primaryButtonText: 'Continue',
 *       secondaryButtonText: 'Cancel',
 *     },
 *   },
 * }
 * ```
 *
 * Usage schema:
 * ```
 * maritalStatus: {
 *   type: 'string',
 *   enum: ['Married', 'Separated', 'Divorced', 'Widowed', 'NeverMarried'],
 * }
 * ```
 * @param {Object} props */
export default function VaSelectFieldWithModal(props) {
  const [modalVisible, setModalVisible] = useState(false);
  const [pendingValue, setPendingValue] = useState(null);
  const [currentValue, setCurrentValue] = useState(
    props.childrenProps.formData ?? props.childrenProps.schema.default ?? '',
  );

  const enumOptions =
    (Array.isArray(props.childrenProps.schema.enum) &&
      optionsList(props.childrenProps.schema)) ||
    [];
  const labels = props.uiOptions?.labels || {};
  const modalConfig = props.uiOptions?.modalConfig || {};

  const {
    triggerValues = [],
    modalTitle = 'Value Changed',
    modalDescription = 'This change may affect your benefits eligibility.',
    primaryButtonText = 'Continue',
    secondaryButtonText = 'Cancel',
    autoAdvance = false,
  } = modalConfig;

  // Check if a value change should trigger the modal
  const shouldShowModal = (oldValue, newValue) => {
    return (
      triggerValues.includes(oldValue) &&
      !triggerValues.includes(newValue) &&
      oldValue !== newValue
    );
  };

  // Handle select change
  const handleSelectChange = (event, value) => {
    const newValue = value || event.target.value || undefined;

    if (shouldShowModal(currentValue, newValue)) {
      setPendingValue(newValue);
      setModalVisible(true);
      // Don't update currentValue here - keep showing the original value
    } else {
      // Direct change without modal
      setCurrentValue(newValue);
      props.childrenProps.onChange(newValue);
    }
  };

  // Handle modal confirmation
  const handleModalConfirm = () => {
    if (pendingValue !== null) {
      setModalVisible(false);
      setCurrentValue(pendingValue);
      props.childrenProps.onChange(pendingValue);
      setPendingValue(null);

      // Optionally advance to next page if autoAdvance is enabled and navigation function is provided
      if (autoAdvance && props.goForward) {
        // Small delay to ensure the form data is updated before navigation
        setTimeout(() => {
          props.goForward();
        }, 100);
      }
    }
  };

  // Handle modal cancellation
  const handleModalCancel = () => {
    setModalVisible(false);
    setPendingValue(null);
    // currentValue is already correct since we didn't update it when the modal was triggered
  };

  // Update current value when form data changes externally
  useEffect(
    () => {
      const newValue =
        props.childrenProps.formData ??
        props.childrenProps.schema.default ??
        '';
      setCurrentValue(newValue);
    },
    [props.childrenProps.formData, props.childrenProps.schema.default],
  );

  return (
    <>
      <VaSelect
        key={`${currentValue}-${modalVisible}`}
        className="rjsf-web-component-field"
        error={props.error}
        label={props.label}
        required={props.required}
        name={props.childrenProps.idSchema.$id}
        value={currentValue}
        onVaSelect={handleSelectChange}
        onBlur={() =>
          props.childrenProps.onBlur(props.childrenProps.idSchema.$id)
        }
      >
        {enumOptions.map((option, index) => (
          <option key={index} value={option.value}>
            {labels[option.value] || option.label}
          </option>
        ))}
      </VaSelect>

      <VaModal
        modalTitle={modalTitle}
        visible={modalVisible}
        primaryButtonText={primaryButtonText}
        secondaryButtonText={secondaryButtonText}
        onPrimaryButtonClick={handleModalConfirm}
        onSecondaryButtonClick={handleModalCancel}
        onCloseEvent={handleModalCancel}
        status="warning"
        clickToClose
      >
        {pendingValue && (
          <p className="vads-u-margin--0">
            {replaceStrValues(modalDescription, pendingValue)}
          </p>
        )}
      </VaModal>
    </>
  );
}

VaSelectFieldWithModal.propTypes = {
  DescriptionField: PropTypes.func,
  childrenProps: PropTypes.object,
  description: PropTypes.string,
  error: PropTypes.string,
  goForward: PropTypes.func,
  index: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  label: PropTypes.string,
  required: PropTypes.bool,
  textDescription: PropTypes.string,
  uiOptions: PropTypes.object,
};
