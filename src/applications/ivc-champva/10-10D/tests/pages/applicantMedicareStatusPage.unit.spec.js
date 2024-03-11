import sinon from 'sinon';
import { expect } from 'chai';
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';
import {
  testComponentRender,
  getProps,
} from '../../../shared/tests/pages/pageTests.spec';
import {
  ApplicantMedicareStatusPage,
  ApplicantMedicareStatusReviewPage,
} from '../../pages/ApplicantMedicareStatusPage';
import mockData from '../fixtures/data/test-data.json';

testComponentRender(
  'ApplicantMedicareStatusReviewPage',
  <>{ApplicantMedicareStatusReviewPage()}</>,
);

testComponentRender(
  'ApplicantMedicareStatusPage',
  <ApplicantMedicareStatusPage data={{}} />,
);

// Causes 'useFirstPerson' to be true:
testComponentRender(
  'ApplicantMedicareStatusPage',
  <ApplicantMedicareStatusPage
    data={{
      ...mockData.data,
      certifierRole: 'applicant',
    }}
    pagePerItemIndex="0"
  />,
);

describe('ApplicantMedicareStatusPage handlers', () => {
  it('should call goForward when "continue" clicked', async () => {
    const goFwdSpy = sinon.spy();
    const component = (
      <ApplicantMedicareStatusPage
        data={mockData.data}
        pagePerItemIndex={0}
        goForward={goFwdSpy}
        setFormData={() => {}}
      />
    );
    const { mockStore } = getProps();
    const view = render(<Provider store={mockStore}>{component}</Provider>);
    const continueButton = $('.usa-button-primary', view.container);
    expect(continueButton).to.contain.text('Continue');
    fireEvent.click(continueButton);
    await waitFor(() => {
      expect(goFwdSpy.called).to.be.true;
    });
  });
});

describe('ApplicantMedicareStatusPage', () => {
  it('should show err msg when no option selected', async () => {
    const component = (
      <ApplicantMedicareStatusPage setFormData={() => mockData.data} />
    );
    const { mockStore } = getProps();
    const view = render(<Provider store={mockStore}>{component}</Provider>);
    const continueButton = $('.usa-button-primary', view.container);
    expect(continueButton).to.contain.text('Continue');
    fireEvent.click(continueButton);
    await waitFor(() => {
      expect($('va-radio', view.container).error).to.not.equal(null);
    });
  });
});
