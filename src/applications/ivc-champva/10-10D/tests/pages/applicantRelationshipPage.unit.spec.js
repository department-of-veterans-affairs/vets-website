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
import ApplicantRelationshipPage, {
  ApplicantRelationshipReviewPage,
} from '../../pages/ApplicantRelationshipPage';
import mockData from '../fixtures/data/test-data.json';

testComponentRender(
  'ApplicantRelationshipReviewPage',
  <>{ApplicantRelationshipReviewPage({ data: '' })}</>,
);

// Causes 'useFirstPerson' to be true:
testComponentRender(
  'ApplicantRelationshipPage',
  <ApplicantRelationshipPage
    data={{
      ...mockData.data,
      certifierRole: 'applicant',
    }}
    pagePerItemIndex="0"
  />,
);

describe('ApplicantRelationshipPage handlers', () => {
  it('should call goForward when "continue" clicked', async () => {
    const goFwdSpy = sinon.spy();
    const component = (
      <ApplicantRelationshipPage
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

describe('ApplicantRelationshipPage', () => {
  it('should show err msg when no option selected', async () => {
    const component = (
      <ApplicantRelationshipPage
        data={{ sponsorIsDeceased: true }}
        setFormData={() => {}}
      />
    );
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
