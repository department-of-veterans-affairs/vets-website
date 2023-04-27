// // Work in progress
//
// import React, { useState } from 'react';
// import {
//   VaCheckbox,
//   VaCheckboxGroup,
// } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
// import vaCheckboxGroupFieldMapping from './vaCheckboxGroupFieldMapping';
// import vaCheckboxFieldMapping from './vaCheckboxFieldMapping';

// export default function VaCheckboxField(props) {
//   const mappedProps = vaCheckboxGroupFieldMapping(props);

//   const { formContext, onChange } = mappedProps;
//   const { onReviewPage, reviewMode } = formContext || {};
//   //   const { labels } = options;
//   const labels = Object.keys(mappedProps.checked);

//   const [checked, setChecked] = useState(mappedProps.checked);

//   const isOnReviewPage = onReviewPage || false;
//   // inReviewMode = true (review page view, not in edit mode)
//   // inReviewMode = false (in edit mode)
//   const inReviewMode = (isOnReviewPage && reviewMode) || false;

//   //   const [data, setData] = useState(labels.map(label => value.includes(label)));

//   const onGroupChange = event => {
//     console.log('first');
//     // const checkboxIndex = Number(event.target.dataset.index);
//     // const isChecked = event.detail.checked;
//     // const newData = data.map(
//     //   (val, index) => (index === checkboxIndex ? isChecked : val),
//     // );
//     // const dataArray = labels.reduce((result, label, index) => {
//     //   if (newData[index]) {
//     //     result.push(label);
//     //   }
//     //   return result;
//     // }, []);
//     // setData(newData);
//     // onChange(dataArray.join(','));
//   };

//   return isOnReviewPage && inReviewMode ? (
//     // <span>{value.split(',').join(', ')}</span>
//     <span>review page</span>
//   ) : (
//     <VaCheckboxGroup
//       {...mappedProps}
//       //   label="va-checkbox-group label"
//       onVaChange={onGroupChange}
//       //   error={null} // form system validation handles this
//       //   required
//     >
//       {labels.map((label, index) => (
//         // <VaCheckbox
//         <VaCheckbox
//           key={label}
//           data-index={index}
//           label={label}
//           checked={'true'}
//           onVaChange={event => {
//             console.log('second');
//           }}
//         />
//       ))}
//     </VaCheckboxGroup>
//   );
//   //   return (
//   //     <VaCheckboxGroup {...mappedProps}>
//   //       {props?.uiOptions?.properties
//   //         ? Object.entries(props.uiOptions.properties).map(([key, uiSchema]) => {
//   //             const mapped = vaCheckboxFieldMapping({
//   //               ...mappedProps,
//   //               uiSchema,
//   //             });
//   //             return <VaCheckboxField key={key} {...mapped} />;
//   //           })
//   //         : null}
//   //     </VaCheckboxGroup>
//   //   );
// }
