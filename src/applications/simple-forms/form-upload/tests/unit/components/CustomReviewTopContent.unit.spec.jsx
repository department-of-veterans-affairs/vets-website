import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { $ } from 'platform/forms-system/src/js/utilities/ui';
import formConfig from '../../../config/form';
import CustomReviewTopContent from '../../../components/CustomReviewTopContent';

const TEST_URL = 'https://dev.va.gov/form-upload/21-0779/test-page';
const config = formConfig(TEST_URL);

const mockStore = withPhoneNumber => ({
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
        uploadedFile: { name: 'test-file.png', size: 800, type: 'image/png' },
        idNumber: { ssn: '234232345' },
        address: { postalCode: '55555' },
        fullName: { first: 'John', last: 'Veteran' },
        phoneNumber: withPhoneNumber ? '1234567890' : null,
        supportingDocuments: [
          {
            confirmationCode: '12345',
            name: 'placeholder',
            size: 1024,
            warnings: [],
            additionalData: {},
            type: 'image/png',
          },
        ],
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
});

describe('CustomReviewTopContent', () => {
  const subject = withPhoneNumber =>
    render(
      <Provider store={mockStore(withPhoneNumber)}>
        <CustomReviewTopContent />
      </Provider>,
    );

  it('renders successfully', () => {
    const { container } = subject();
    expect(container).to.exist;
  });

  describe('renderFileInfo', () => {
    it('renders the correct component', () => {
      const { container } = subject();

      const component = $('va-file-input', container);
      expect(component).to.exist;
    });

    it('renders the file input component', () => {
      const { container } = subject();
      const fileInput = $('va-file-input', container);

      expect(fileInput).to.exist;
      expect(fileInput).to.have.attr('read-only', 'true');
    });

    it('renders the supporting documents input component', () => {
      const { container } = subject();
      const fileInputMultiple = $('va-file-input-multiple', container);

      expect(fileInputMultiple).to.exist;
      expect(fileInputMultiple).to.have.attr('read-only', 'true');
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

  describe('renderContactInfo', () => {
    it('renders phone number when provided', () => {
      const { getByText } = subject('with-phone-number');

      expect(getByText('Phone number')).to.exist;
      expect(getByText('(123) 456-7890')).to.exist;
    });
  });

  it('renders the correct headers', () => {
    const { getByText } = subject();

    expect(getByText('Veteran’s information')).to.exist;
    expect(getByText('Uploaded file')).to.exist;
  });

  it('renders the correct contact', () => {
    const { container } = subject();

    const phone = $('va-telephone', container);

    expect(phone).to.exist;
    expect(phone).to.have.attr('contact', '8008271000');
  });
});
