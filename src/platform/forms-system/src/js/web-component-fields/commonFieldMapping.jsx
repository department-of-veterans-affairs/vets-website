import { useRef } from 'react';
import classNames from 'classnames';
import { isMinimalHeaderPath } from '../patterns/minimal-header';

const useConditionalMinimalHeader = uiOptions => {
  const isMinimalHeader = useRef(null);

  if (!uiOptions?.ifMinimalHeader) {
    // Do nothing if uiOptions.ifMinimalHeader is not set
    return uiOptions;
  }

  if (isMinimalHeader.current === null) {
    // only call once
    isMinimalHeader.current = isMinimalHeaderPath();
  }

  if (isMinimalHeader.current) {
    return {
      ...uiOptions,
      ...uiOptions.ifMinimalHeader, // override with minimal header options
    };
  }

  return uiOptions;
};

const getLabelHeaderLevelProps = uiOptions => {
  let labelHeaderLevelStyle = uiOptions?.labelHeaderLevelStyle;
  if (uiOptions?.labelHeaderLevel === '1' && !labelHeaderLevelStyle) {
    // h1 style is too big when used as a field label
    labelHeaderLevelStyle = '2';
  }
  const formHeadingLevelStyle = uiOptions?.formHeadingLevelStyle;
  return {
    labelHeaderLevel: uiOptions?.labelHeaderLevel,
    headerStyleClass: labelHeaderLevelStyle
      ? `rjsf-wc-header--h${labelHeaderLevelStyle}`
      : '',
    formHeadingStyleClass: formHeadingLevelStyle
      ? `wc-pattern-form-heading-style--h${formHeadingLevelStyle}`
      : '',
  };
};

/** @param {WebComponentFieldProps} props */
export default function commonFieldMapping(props) {
  const {
    label,
    required,
    error,
    uiOptions: uiOptionsOriginal,
    childrenProps,
  } = props;
  // About eslint rule disabled here: As long as we are in the context
  // of a React component, using a hook should be fine here.
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const uiOptions = useConditionalMinimalHeader(uiOptionsOriginal);
  const {
    headerStyleClass,
    labelHeaderLevel,
    formHeadingStyleClass,
  } = getLabelHeaderLevelProps(uiOptions);
  const dataAttributes = {};

  if (uiOptions?.data) {
    Object.entries(uiOptions.data).forEach(([key, value]) => {
      dataAttributes[`data-${key}`] = value;
    });
  }

  return {
    className: classNames(
      'rjsf-web-component-field',
      headerStyleClass,
      formHeadingStyleClass,
      uiOptions?.classNames,
    ),
    ...dataAttributes,
    enableAnalytics: uiOptions?.enableAnalytics,
    error,
    hint: uiOptions?.hint,
    inert: uiOptions?.inert,
    inputmode: uiOptions?.inputmode,
    invalid: uiOptions?.invalid,
    label,
    labelHeaderLevel,
    maxlength: childrenProps.schema.maxLength,
    messageAriaDescribedby: uiOptions?.messageAriaDescribedby,
    minlength: childrenProps.schema.minLength,
    name: childrenProps.idSchema.$id,
    pattern: childrenProps.schema.pattern,
    reflectInputError: uiOptions?.reflectInputError,
    required,
    success: uiOptions?.success,
    // returning false results in bugs, so use undefined or true instead
    // default uswds to true (v3 web component)
    uswds: uiOptions?.uswds === false ? undefined : true,
  };
}
