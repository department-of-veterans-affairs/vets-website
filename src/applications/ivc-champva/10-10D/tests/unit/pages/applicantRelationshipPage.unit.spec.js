import sinon from 'sinon';
import { expect } from 'chai';
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';
import {
  testComponentRender,
  getProps,
} from '../../../../shared/tests/pages/pageTests.spec';
import ApplicantRelationshipPage, {
  ApplicantRelationshipReviewPage,
} from '../../../../shared/components/applicantLists/ApplicantRelationshipPage';
import mockData from '../../e2e/fixtures/data/test-data.json';

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
  it('should show error on validate when when no "other" string provided', async () => {
    const component = (
      <ApplicantRelationshipPage
        data={{
          applicants: [
            {
              applicantRelationshipToSponsor: {
                relationshipToVeteran: 'other',
              },
            },
          ],
        }}
        goForward={() => {}}
        pagePerItemIndex={0}
        setFormData={() => {}}
      />
    );
    const { mockStore } = getProps();
    const view = render(<Provider store={mockStore}>{component}</Provider>);

    // Click continue button to trigger `handlers.validate`
    const continueButton = $('.usa-button-primary', view.container);
    fireEvent.click(continueButton);

    // We should now have an err msg because we didn't provide a description for other relationship
    await waitFor(() => {
      const err = $('va-text-input', view.container);
      expect(err.error).to.equal('This field is required');
      /** */
    });

    // Test that adding input removes error:
    const wrapper = mount(<Provider store={mockStore}>{component}</Provider>);
    const input = wrapper.find('va-text-input');
    input.invoke('onInput')({
      target: { value: 'testing' },
    });
    await waitFor(() => {
      expect(wrapper.find('va-text-input').prop('error')).to.not.exist;
    });
    wrapper.unmount();
  });
  it('should cause text input to render when "other" radio opt is selected', async () => {
    const component = (
      <ApplicantRelationshipPage
        data={{}}
        goForward={() => {}}
        pagePerItemIndex={0}
        setFormData={() => {}}
      />
    );
    const { mockStore } = getProps();
    const view = render(<Provider store={mockStore}>{component}</Provider>);

    // Fire the radio select
    const firstRadio = $('va-radio', view.container);
    // Set radio value to something:
    firstRadio.__events.vaValueChange({
      detail: { value: 'na' },
    });
    // 'other' text field should not appear
    expect($('va-text-input', view.container)).to.not.exist;
    // Check 'other' so the text box appears
    firstRadio.__events.vaValueChange({
      detail: { value: 'other' },
    });
    expect($('va-text-input', view.container)).to.exist;
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
