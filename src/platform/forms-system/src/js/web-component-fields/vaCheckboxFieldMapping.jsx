import React from 'react';
import commonFieldMapping from './commonFieldMapping';

/** @param {WebComponentFieldProps} props */
export default function vaCheckboxFieldMapping(props) {
  const {
    description,
    textDescription,
    DescriptionField,
    uiOptions = {},
    index,
    childrenProps,
  } = props;

  const checkboxProps = {
    ...commonFieldMapping(props),
    description: textDescription,
    checked:
      typeof childrenProps.formData === 'undefined'
        ? false
        : childrenProps.formData,
    onVaChange: (event, value) => {
      const newVal = value ?? event.target.checked ?? undefined;
      childrenProps.onChange(newVal);
    },
    indeterminate: uiOptions.indeterminate,
    tile: uiOptions.tile,
    hint: uiOptions.hint,
    checkboxDescription: uiOptions.checkboxDescription,
    onBlur: () => childrenProps.onBlur(childrenProps.idSchema.$id),
  };

  const children = [];

  if (textDescription || DescriptionField || description) {
    children.push(
      <div slot="description" key="description">
        {textDescription && <p>{textDescription}</p>}
        {DescriptionField && (
          <DescriptionField options={uiOptions} index={index} />
        )}
        {!textDescription && !DescriptionField && description}
      </div>,
    );
  }

  if (uiOptions.internalDescription) {
    children.push(
      <div slot="internal-description" key="internal-description">
        <p>{uiOptions.internalDescription}</p>
      </div>,
    );
  }

  if (children.length) {
    checkboxProps.children = <>{children}</>;
  }

  return checkboxProps;
}
