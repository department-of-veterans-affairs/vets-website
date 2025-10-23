// import sinon from 'sinon';
// import { expect } from 'chai';
import React from 'react';
// import { render, fireEvent, waitFor } from '@testing-library/react';
// import { Provider } from 'react-redux';
// import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';
import {
  testComponentRender,
  // getProps,
} from '../../../../shared/tests/pages/pageTests.spec';
import {
  ApplicantMedicareStatusContinuedPage,
  ApplicantMedicareStatusContinuedReviewPage,
} from '../../../pages/ApplicantMedicareStatusContinuedPage';
import mockData from '../../e2e/fixtures/data/test-data.json';

// The tests in here need to be re-worked. This medicare component was overhauled.

// testComponentRender(
//   'ApplicantMedicareStatusReviewPage',
//   <>{ApplicantMedicareStatusContinuedReviewPage()}</>,
// );

// testComponentRender(
//   'ApplicantMedicareStatusPage',
//   <ApplicantMedicareStatusContinuedPage data={{}} />,
// );

testComponentRender(
  'ApplicantMedicareStatusContinuedPage',
  <ApplicantMedicareStatusContinuedPage
    data={{
      ...mockData.data,
    }}
    pagePerItemIndex="0"
  />,
);

testComponentRender(
  'ApplicantMedicareStatusContinuedReviewPage',
  <ApplicantMedicareStatusContinuedReviewPage
    data={{
      ...mockData.data,
    }}
    pagePerItemIndex="0"
    title={() => {}}
  />,
);

// describe('ApplicantMedicareStatusContinuedPage handlers', () => {
//   it('should call goForward when "continue" clicked', async () => {
//     const goFwdSpy = sinon.spy();
//     const component = (
//       <ApplicantMedicareStatusContinuedPage
//         data={mockData.data}
//         pagePerItemIndex={0}
//         goForward={goFwdSpy}
//         setFormData={() => {}}
//       />
//     );
//     const { mockStore } = getProps();
//     const view = render(<Provider store={mockStore}>{component}</Provider>);
//     const continueButton = $('.usa-button-primary', view.container);
//     expect(continueButton).to.contain.text('Continue');
//     fireEvent.click(continueButton);
//     await waitFor(() => {
//       expect(goFwdSpy.called).to.be.true;
//     });
//   });
// });

// describe('ApplicantMedicareStatusContinuedPage', () => {
//   it('should show err msg when no option selected', async () => {
//     const component = (
//       <ApplicantMedicareStatusContinuedPage setFormData={() => mockData.data} />
//     );
//     const { mockStore } = getProps();
//     const view = render(<Provider store={mockStore}>{component}</Provider>);
//     const group = $('va-checkbox-group', view.container);
//     const continueButton = $('.usa-button-primary', view.container);
//     expect(continueButton).to.contain.text('Continue');
//     fireEvent.click(continueButton);
//     await waitFor(() => {
//       expect(group.error).to.not.equal(null);
//     });
//   });
// });
