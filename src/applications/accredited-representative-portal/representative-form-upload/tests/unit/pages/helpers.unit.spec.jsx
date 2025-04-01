import React from 'react';
import { Provider } from 'react-redux';
import { render, cleanup } from '@testing-library/react';
import { expect } from 'chai';
import { $ } from 'platform/forms-system/src/js/utilities/ui';
import formConfig from '../../../config/form';
import { CustomTopContent } from '../../../pages/helpers';

const TEST_URL = 'https://dev.va.gov/form-upload/21-686c/test-page';
const config = formConfig;

const mockStore = {
  getState: () => ({
    user: {
      login: {
        currentlyLoggedIn: false,
      },
      profile: {
        savedForms: [],
        prefillsAvailable: ['FORM-UPLOAD-FLOW'],
        dob: '2000-01-01',
        loa: {
          current: 3,
        },
        verified: true,
      },
    },
    form: {
      formId: config.formId,
      loadedStatus: 'success',
      savedStatus: '',
      loadedData: {
        metadata: {},
      },
      data: {
        uploadedFile: { name: 'test-file.png', size: 800 },
        idNumber: { ssn: '234232345' },
        address: { postalCode: '55555' },
        fullName: { first: 'John', last: 'Veteran' },
      },
    },
    scheduledDowntime: {
      globalDowntime: null,
      isReady: true,
      isPending: false,
      serviceMap: { get() {} },
      dismissedDowntimeWarnings: [],
    },
  }),
  subscribe: () => {},
  dispatch: () => {},
};

describe('CustomTopContent', () => {
  beforeEach(() => {
    window.location = new URL(TEST_URL);
  });

  afterEach(() => {
    cleanup();
  });

  const subject = () =>
    render(
      <Provider store={mockStore}>
        <CustomTopContent />
      </Provider>,
    );

  it('renders successfully', () => {
    const { container } = subject();
    expect(container).to.exist;
  });

  it('renders the correct breadcrumbs', () => {
    const { container } = subject();

    const breadcrumbs = $('va-breadcrumbs', container);
    expect(breadcrumbs).to.exist;
    expect(breadcrumbs).to.have.attr(
      'breadcrumb-list',
      '[{"href":"/representative","label":"ARP home"},{"href":"/representative/representative-form-upload/21-686c/introduction","label":"Upload form 21-686c"}]',
    );
  });
});
