import { useRef } from 'react';
import { isMinimalHeaderApplicable } from '../helpers';

const useConditionalMinimalHeader = uiOptions => {
  const isMinimalHeader = useRef(null);

  if (!uiOptions?.ifMinimalHeader) {
    return uiOptions;
  }

  if (isMinimalHeader.current === null) {
    // only call once
    isMinimalHeader.current = isMinimalHeaderApplicable();
  }

  if (isMinimalHeader.current) {
    return {
      ...uiOptions,
      ...uiOptions.ifMinimalHeader, // override with minimal header options
    };
  }

  return uiOptions;
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
  // we are in the context of a React component, so using a hook is fine here.
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const uiOptions = useConditionalMinimalHeader(uiOptionsOriginal);
  let labelHeaderLevelStyle = uiOptions?.labelHeaderLevelStyle;
  if (uiOptions?.labelHeaderLevel === '1' && !labelHeaderLevelStyle) {
    // h1 style is too big when used as a field label
    labelHeaderLevelStyle = '2';
  }
  const headerStyle = labelHeaderLevelStyle
    ? ` rjsf-wc-header--h${labelHeaderLevelStyle} `
    : '';

  return {
    className: `rjsf-web-component-field${headerStyle}${
      uiOptions?.classNames ? ` ${uiOptions.classNames}` : ''
    }`,
    enableAnalytics: uiOptions?.enableAnalytics,
    error,
    hint: uiOptions?.hint,
    inert: uiOptions?.inert,
    inputmode: uiOptions?.inputmode,
    invalid: uiOptions?.invalid,
    label,
    labelHeaderLevel: uiOptions?.labelHeaderLevel,
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
