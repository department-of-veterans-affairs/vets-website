import { expect } from 'chai';
import sinon from 'sinon';
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';
import { mockLocation } from 'platform/testing/unit/helpers';
import { getProps } from '../../../../shared/tests/pages/pageTests.spec';
import CustomArrayBuilderButtonPair from '../../../../shared/components/CustomArrayBuilderButtonPair';

describe('CustomArrayBuilderButtonPair', () => {
  it('should call goForward when "continue" clicked', async () => {
    const restoreLocation = mockLocation('http://localhost:3001/test?add=true');
    const goFwdSpy = sinon.spy();
    const component = (
      <CustomArrayBuilderButtonPair
        contentBeforeButtons={<></>}
        contentAfterButtons={<></>}
        setFormData={() => {}}
        goBack={() => {}}
        onContinue={goFwdSpy}
        updatePage={() => {}}
        arrayPath="applicants"
        getSummaryPath={() => '/summaryRoute'}
        getIntroPath={() => '/introRoute'}
        reviewRoute="/reviewRoute"
        required={() => false}
        getText={() => {}}
      />
    );
    const { mockStore } = getProps();
    const { container } = render(
      <Provider store={mockStore}>{component}</Provider>,
    );

    const continueButton = $('.usa-button-primary', container);
    expect(continueButton).to.contain.text('Continue');
    fireEvent.click(continueButton);
    await waitFor(() => {
      expect(goFwdSpy.called).to.be.true;
    });
    restoreLocation();
  });
  it('should use custom text when on edit flow', async () => {
    const restoreLocation = mockLocation(
      'http://localhost:3001/ivc-champva/10-10d-extended/applicant-name-dob/0?edit=true',
    );
    const component = (
      <CustomArrayBuilderButtonPair
        contentBeforeButtons={<></>}
        contentAfterButtons={<></>}
        setFormData={() => {}}
        goBack={() => {}}
        onContinue={() => {}}
        updatePage={() => {}}
        arrayPath="applicants"
        getSummaryPath={() => '/summaryRoute'}
        getIntroPath={() => '/introRoute'}
        reviewRoute="/reviewRoute"
        required={() => false}
        getText={_prop => {
          return 'Custom text';
        }}
      />
    );
    const { mockStore } = getProps();
    const { container } = render(
      <Provider store={mockStore}>{component}</Provider>,
    );

    const continueButton = $('va-button', container);
    expect(continueButton).to.exist;
    expect(continueButton.text).to.eq('Custom text');
    restoreLocation();
  });
});
