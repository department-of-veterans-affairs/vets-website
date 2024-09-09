import { expect } from 'chai';
import sinon from 'sinon';
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';
import { getProps } from '../../../../shared/tests/pages/pageTests.spec';
import mockData from '../../e2e/fixtures/data/test-data.json';
import { ApplicantAddressCopyPage } from '../../../../shared/components/applicantLists/ApplicantAddressPage';

describe('ApplicantAddressCopyPage handlers', () => {
  it('should call goForward when "continue" clicked', async () => {
    const goFwdSpy = sinon.spy();
    const component = (
      <ApplicantAddressCopyPage
        contentBeforeButtons={<></>}
        contentAfterButtons={<></>}
        data={{ ...mockData.data, certifierRole: 'applicant' }}
        setFormData={() => {}}
        goBack={() => {}}
        goForward={goFwdSpy}
        pagePerItemIndex={0}
        updatePage={() => {}}
        onReviewPage={false}
      />
    );
    const { mockStore } = getProps();
    const view = render(<Provider store={mockStore}>{component}</Provider>);

    const addressSelect = $('va-select', view.container);
    // Set select value to something valid
    addressSelect.__events.vaSelect({
      detail: { value: '{"originatorAddress": "lorem"}' },
    });

    const continueButton = $('.usa-button-primary', view.container);
    expect(continueButton).to.contain.text('Continue');
    fireEvent.click(continueButton);
    await waitFor(() => {
      expect(goFwdSpy.called).to.be.true;
    });
  });
  it('should render address select component', async () => {
    const component = (
      <ApplicantAddressCopyPage
        contentBeforeButtons={<></>}
        contentAfterButtons={<></>}
        data={{ ...mockData.data, certifierRole: 'other' }}
        setFormData={() => {}}
        goBack={() => {}}
        goForward={() => {}}
        pagePerItemIndex={0}
        updatePage={() => {}}
        onReviewPage
      />
    );

    const { mockStore } = getProps();
    const view = render(<Provider store={mockStore}>{component}</Provider>);

    const addressSelect = $('va-select', view.container);
    // Set select value to something:
    addressSelect.__events.vaSelect({
      detail: { value: '{"originatorAddress": "lorem"}' },
    });
    addressSelect.__events.vaSelect({
      detail: { value: 'not-shared' },
    });

    expect(addressSelect).to.exist;
  });
});
