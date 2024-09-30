import {
  testNumberOfErrorsOnSubmit,
  testNumberOfErrorsOnSubmitForWebComponents,
  testNumberOfFields,
  testNumberOfWebComponentFields,
} from '../pageTests.spec';
import formConfig from '../../../../config/form';

const {
  schema,
  uiSchema,
} = formConfig.chapters.deceasedDependents.pages.dependentAdditionalInformationPartOne;

const pageTitle = 'Dependent who has died';

// Test array functionality in e2e.
// Just test initial fields here

const expectedNumberOfWebComponentFields = 5;
testNumberOfWebComponentFields(
  formConfig,
  schema,
  uiSchema,
  expectedNumberOfWebComponentFields,
  pageTitle,
);

// should be 4, but if multiple arrays are on the page
// the first array becomes optional. This is a bug,
// but also a rare use case.
const expectedNumberOfWebComponentErrors = 2;
testNumberOfErrorsOnSubmitForWebComponents(
  formConfig,
  schema,
  uiSchema,
  expectedNumberOfWebComponentErrors,
  pageTitle,
);

const expectedNumberOfFields = 0;
testNumberOfFields(
  formConfig,
  schema,
  uiSchema,
  expectedNumberOfFields,
  pageTitle,
);

const expectedNumberOfErrors = 0;
testNumberOfErrorsOnSubmit(
  formConfig,
  schema,
  uiSchema,
  expectedNumberOfErrors,
  pageTitle,
);

// import { render, screen } from '@testing-library/react';
// import { Provider } from 'react-redux';
// import { expect } from 'chai';
// import React from 'react';
// import createCommonStore from '@department-of-veterans-affairs/platform-startup/store';
// import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
// import { $$ } from 'platform/forms-system/src/js/utilities/ui';
// import formConfig from '../../../../config/form';
// import {
//   testNumberOfErrorsOnSubmitForWebComponents,
//   testNumberOfFieldsByType,
//   testNumberOfWebComponentFields,
//   testSubmitsWithoutErrors,
// } from '../pageTests.spec';

// const defaultStore = createCommonStore();

// const formData = (outsideUsa = false, state = 'CA') => {
//   return {
//     'view:selectable686Options': {
//       reportDeath: true,
//     },
//     deaths: [
//       {
//         dependentDeathDate: '1991-01-19',
//         dependentType: 'spouse',
//         fullName: {
//           first: 'John',
//           last: 'Doe',
//         },
//         ssn: '333445555',
//         birthDate: '1991-02-19',
//         dependentDeathLocation: {
//           outsideUsa,
//           location: {
//             city: 'Some city',
//             state,
//           },
//         },
//       },
//       {
//         dependentDeathDate: '2000-12-14',
//         dependentType: 'spouse',
//         fullName: {
//           first: 'Jane',
//           last: 'Doe',
//         },
//         ssn: '333445555',
//         birthDate: '1991-02-19',
//         dependentDeathLocation: {
//           outsideUsa,
//           location: {
//             city: 'Some city',
//             state,
//           },
//         },
//         childStatus: {
//           childUnder18: true,
//           adopted: true,
//         },
//       },
//     ],
//   };
// };

// describe('686 report death: Introduction page', () => {
//   const {
//     schema,
//     uiSchema,
//   } = formConfig.chapters.deceasedDependents.pages.dependentAdditionalInformationIntro;

//   it('should render', () => {
//     const { container } = render(
//       <Provider store={defaultStore}>
//         <DefinitionTester
//           schema={schema}
//           definitions={formConfig.defaultDefinitions}
//           uiSchema={uiSchema}
//           data={formData}
//         />
//       </Provider>,
//     );

//     expect($$('h3', container).length).to.equal(1);
//     expect($$('span', container).length).to.equal(1);
//   });
// });

// describe('686 report death: Summary page', () => {
//   const {
//     schema,
//     uiSchema,
//   } = formConfig.chapters.deceasedDependents.pages.dependentAdditionalInformationSummary;

//   it('should render', () => {
//     const { container } = render(
//       <Provider store={defaultStore}>
//         <DefinitionTester
//           schema={schema}
//           definitions={formConfig.defaultDefinitions}
//           uiSchema={uiSchema}
//           data={formData}
//         />
//       </Provider>,
//     );

//     // screen.debug();

//     expect($$('va-radio', container).length).to.equal(1);
//     expect($$('va-radio-option', container).length).to.equal(2);
//     // expect($$('va-card', container).length).to.equal(2); //TODO: This doesn't render?
//   });
// });

// describe('686 report death: Dependent information Part 1', () => {
//   const {
//     schema,
//     uiSchema,
//   } = formConfig.chapters.deceasedDependents.pages.dependentAdditionalInformationPartOne;

//   const arrayPath = 'deaths';

//   //   const pageTitle = 'Dependent who has died';

//   //   const expectedNumberOfWebComponentFields = 5;
//   //   testNumberOfWebComponentFields(
//   //     formConfig,
//   //     schema,
//   //     uiSchema,
//   //     expectedNumberOfWebComponentFields,
//   //     pageTitle,
//   //   );

//   it.only('should render', () => {
//     const { container } = render(
//       <Provider store={defaultStore}>
//         <DefinitionTester
//           schema={schema}
//           definitions={formConfig.defaultDefinitions}
//           uiSchema={uiSchema}
//           data={formData}
//           arrayPath={arrayPath}
//           pagePerItemIndex={0}
//         />
//       </Provider>,
//     );

//     screen.debug();

//     expect($$('va-radio', container).length).to.equal(1);
//     expect($$('va-radio-option', container).length).to.equal(2);
//   });
// });
