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
import ApplicantOhiStatusPage, {
  ApplicantOhiStatusReviewPage,
} from '../../pages/ApplicantOhiStatusPage';
import mockData from '../fixtures/data/test-data.json';

testComponentRender(
  'ApplicantOhiStatusReviewPage',
  <>{ApplicantOhiStatusReviewPage()}</>,
);

testComponentRender(
  'ApplicantOhiStatusPage',
  <ApplicantOhiStatusPage data={{}} />,
);

// Causes 'useFirstPerson' to be true:
testComponentRender(
  'ApplicantOhiStatusPage',
  <ApplicantOhiStatusPage
    data={{
      ...mockData.data,
      certifierRole: 'applicant',
    }}
    pagePerItemIndex="0"
  />,
);

describe('ApplicantOhiStatusPage handlers', () => {
  it('should call goForward when "continue" clicked', async () => {
    const goFwdSpy = sinon.spy();
    const component = (
      <ApplicantOhiStatusPage
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

describe('ApplicantOhiStatusPage', () => {
  it('should show err msg when no option selected', async () => {
    const component = <ApplicantOhiStatusPage setFormData={() => {}} />;
    const { mockStore } = getProps();
    const view = render(<Provider store={mockStore}>{component}</Provider>);
    const group = $('va-radio', view.container);
    const continueButton = $('.usa-button-primary', view.container);
    expect(continueButton).to.contain.text('Continue');
    fireEvent.click(continueButton);
    await waitFor(() => {
      expect(group.error).to.not.equal(null);
    });
  });
});
