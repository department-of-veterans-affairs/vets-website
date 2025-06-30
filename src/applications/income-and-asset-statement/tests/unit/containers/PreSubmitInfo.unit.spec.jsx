import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import { $ } from 'platform/forms-system/src/js/utilities/ui';
import formConfig from '../../../config/form';
import PreSubmitInfo from '../../../containers/PreSubmitInfo';

const getData = ({ loggedIn = true } = {}) => ({
  props: {
    formData: {
      formId: formConfig.formId,
      loadedStatus: 'success',
      savedStatus: '',
      loadedData: {
        metadata: {},
      },
      data: {},
    },
    preSubmitInfo: {
      statementOfTruth: {
        body:
          'I confirm that the identifying information in this form is accurate and has been represented correctly.',
        messageAriaDescribedby:
          'I confirm that the identifying information in this form is accurate and has been represented correctly.',
        fullNamePath: formData =>
          formData?.claimantType === 'VETERAN'
            ? 'veteranFullName'
            : 'claimantFullName',
        useProfileFullName: !!loggedIn,
      },
    },
    showError: true,
    user: {
      login: {
        currentlyLoggedIn: loggedIn,
      },
      profile: {
        savedForms: [],
        prefillsAvailable: [],
        verified: false,
      },
    },
  },
  mockStore: {
    getState: () => ({
      user: {
        login: {
          currentlyLoggedIn: loggedIn,
        },
        profile: {
          savedForms: [],
          prefillsAvailable: [],
          verified: false,
        },
      },
      form: {
        formId: formConfig.formId,
        loadedStatus: 'success',
        savedStatus: '',
        loadedData: {
          metadata: {},
        },
        data: {},
      },
    }),
    subscribe: () => {},
    dispatch: () => {},
  },
});

describe('<PreSubmitInfo />', () => {
  describe('when not logged in', () => {
    it('should render the va-statement-of-truth component', () => {
      const { props, mockStore } = getData({ loggedIn: false });
      const { container } = render(
        <Provider store={mockStore}>
          <PreSubmitInfo {...props} />
        </Provider>,
      );
      expect($('va-statement-of-truth', container)).to.exist;
      expect($('va-statement-of-truth', container).textContent).to.include(
        'I confirm that the identifying information in this form is accurate and has been represented correctly.',
      );
      expect($('va-privacy-agreement', container)).not.to.exist;
    });
  });
  describe('when logged in', () => {
    it('should render the va-privacy-agreement component', () => {
      const { props, mockStore } = getData();
      const { container } = render(
        <Provider store={mockStore}>
          <PreSubmitInfo {...props} />
        </Provider>,
      );
      expect($('va-privacy-agreement', container)).to.exist;
      expect($('va-statement-of-truth', container)).not.to.exist;
    });
  });
});
