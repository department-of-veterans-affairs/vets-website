// // Work in progress
//
// import React from 'react';

// export default function vaCheckboxGroupFieldMapping(props) {
//   const {
//     description,
//     textDescription,
//     DescriptionField,
//     label,
//     required,
//     error,
//     uiOptions,
//     index,
//     childrenProps,
//   } = props;

//   let inputType = uiOptions?.inputType;
//   if (!inputType) {
//     inputType = ['number', 'integer'].includes(childrenProps.schema.type)
//       ? 'number'
//       : 'text';
//   }

//   return {
//     ...uiOptions,
//     name: childrenProps.idSchema.$id,
//     label,
//     required,
//     error,
//     description: textDescription,
//     maxlength: childrenProps.schema.maxLength,
//     minlength: childrenProps.schema.minLength,
//     checked:
//       typeof childrenProps.formData === 'undefined'
//         ? false
//         : childrenProps.formData,
//     type: inputType,
//     onVaChange: (event, value) => {
//       const newVal = value ?? event.target.checked ?? undefined;
//       childrenProps.onChange(newVal);
//     },
//     onBlur: () => childrenProps.onBlur(childrenProps.idSchema.$id),
//     // children: props.children,
//     // children: (
//     //   <div>inside</div>
//     //   //   <>
//     //   //     {textDescription && <p>{textDescription}</p>}
//     //   //     {DescriptionField && (
//     //   //       <DescriptionField options={uiOptions} index={index} />
//     //   //     )}
//     //   //     {!textDescription && !DescriptionField && description}
//     //   //   </>
//     // ),
//   };
// }
