import React from 'react';
import commonFieldMapping from './commonFieldMapping';

/** @param {WebComponentFieldProps} props */
export default function vaCheckboxFieldMapping(props) {
  const {
    description,
    textDescription,
    DescriptionField,
    uiOptions,
    index,
    childrenProps,
  } = props;

  return {
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
    onBlur: () => childrenProps.onBlur(childrenProps.idSchema.$id),
    children: (
      <div slot="description">
        {textDescription && <p>{textDescription}</p>}
        {DescriptionField && (
          <DescriptionField options={uiOptions} index={index} />
        )}
        {!textDescription && !DescriptionField && description}
      </div>
    ),
  };
}
