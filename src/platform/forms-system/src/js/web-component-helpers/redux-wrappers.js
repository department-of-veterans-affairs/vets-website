/* eslint-disable no-param-reassign */
import React from 'react';
import { useSelector } from 'react-redux';
import { getFormData } from '../state/selectors';

// 'description' not supported - this is harder to support
const eligibleDynamicProps = ['label'];

// add more uiOptions here as desired
const eligibleDynamicUiOptions = ['labelHeaderLevel', 'hint'];

/**
 * Checks if a web component has any props that are functions that are normally strings
 * @param {WebComponentFieldProps} props props coming from FieldTemplate
 * @returns {boolean}
 */
export function hasDynamicProps(props) {
  let dynamic = eligibleDynamicProps.some(
    prop => typeof props[prop] === 'function',
  );
  if (!dynamic && props.uiOptions) {
    dynamic = eligibleDynamicUiOptions.some(
      prop => typeof props.uiOptions[prop] === 'function',
    );
  }
  return dynamic;
}

function callFormDataOnProps(props, object, formData) {
  props.forEach(prop => {
    if (typeof object[prop] === 'function') {
      object[prop] = object[prop]({ formData });
    }
  });
}

function validateLabel(label, id) {
  if (typeof label !== 'string') {
    throw new Error(
      `${id} ui:title must return a string or a function returning a string.`,
    );
  }
}

/**
 * wraps a `WebComponentField` so that `formData` can be accessed
 * from `'ui:title'`,  and select `'ui:options'`
 * @returns {React.ReactNode} A react component
 */
export function withFormData(WebComponentField) {
  /** @param {WebComponentFieldProps} props */
  return function WrappedWebComponentField(props) {
    const formData = useSelector(getFormData);

    const newProps = {
      ...props,
    };
    callFormDataOnProps(eligibleDynamicProps, newProps, formData);
    validateLabel(newProps.label, newProps.childrenProps?.idSchema?.$id);

    if (props.uiOptions) {
      newProps.uiOptions = {
        ...props.uiOptions,
      };
      callFormDataOnProps(
        eligibleDynamicUiOptions,
        newProps.uiOptions,
        formData,
      );
    }

    return <WebComponentField {...newProps} />;
  };
}

/**
 * Wraps a function with react redux component to access form data
 * @param {({ formData }) => string} callback function that returns a string
 * @param {string} id unique identifier
 * @returns {React.ReactNode} A react component
 */
export function labelWithFormData(callback, id) {
  const StateWrapper = () => {
    const formData = useSelector(getFormData);
    const string = callback({ formData });
    if (typeof string !== 'string') {
      throw new Error(
        `${id} callback in labelWithFormData must return a string.`,
      );
    }
    return string;
  };
  return <StateWrapper />;
}
