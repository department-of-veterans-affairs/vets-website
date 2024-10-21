// import React from 'react';
// import { render } from '@testing-library/react';
// import { Provider } from 'react-redux';
// import { expect } from 'chai';
// import createCommonStore from '@department-of-veterans-affairs/platform-startup/store';
// import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
// import { $$ } from 'platform/forms-system/src/js/utilities/ui';
// // import { capitalize } from 'lodash';
// import formConfig from '../../../../config/form';
// import { addStudentsOptions } from '../../../../config/chapters/674/addStudentsArrayPages';

// const defaultStore = createCommonStore();

// const arrayPath = 'studentInformation';

// const formData = () => {
//   return {
//     'view:selectable686Options': {
//       report674: true,
//     },
//     studentInformation: [{}],
//   };
// };

// // Array pages
// describe('674 Add students: Intro page ', () => {
//   const {
//     schema,
//     uiSchema,
//   } = formConfig.chapters.reportStepchildNotInHousehold.pages.removeChildHouseholdIntro;

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
//     expect($$('p', container).length).to.equal(3);
//   });
// });
