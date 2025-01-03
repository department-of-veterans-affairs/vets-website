import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { $ } from 'platform/forms-system/src/js/utilities/ui';
import formConfig from '../../../config/form';
import CustomReviewTopContent from '../../../components/CustomReviewTopContent';

const TEST_URL = 'https://dev.va.gov/form-upload/21-0779/test-page';
const config = formConfig(TEST_URL);

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

describe('CustomReviewTopContent', () => {
  const subject = () =>
    render(
      <Provider store={mockStore}>
        <CustomReviewTopContent />
      </Provider>,
    );

  it('renders successfully', () => {
    const { container } = subject();
    expect(container).to.exist;
  });

  describe('renderFileInfo', () => {
    it('renders the correct card', () => {
      const { container } = subject();

      const card = $('va-card', container);
      expect(card).to.exist;
    });

    it('renders the correct icon', () => {
      const { container } = subject();

      const card = $('va-card', container);
      const icon = $('va-icon', card);

      expect(icon).to.exist;
      expect(icon).to.have.attr('icon', 'file_present');
    });

    it('renders the correct file data', () => {
      const { getByText } = subject();

      expect(getByText('test-file.png')).to.exist;
      expect(getByText('800 B')).to.exist;
    });
  });

  describe('renderPersonalInfo', () => {
    it('renders the correct personal data', () => {
      const { getByText } = subject();

      expect(getByText('Name')).to.exist;
      expect(getByText('John Veteran')).to.exist;
      expect(getByText('Zip code')).to.exist;
      expect(getByText('55555')).to.exist;
      expect(getByText('Social security number')).to.exist;
      expect(getByText('●●●–●●–2345')).to.exist;
    });
  });

  it('renders the correct headers', () => {
    const { getByText } = subject();

    expect(getByText('Personal information')).to.exist;
    expect(getByText('Uploaded file')).to.exist;
  });

  it('renders the correct contact', () => {
    const { container } = subject();

    const phone = $('va-telephone', container);

    expect(phone).to.exist;
    expect(phone).to.have.attr('contact', '8008271000');
  });
});
