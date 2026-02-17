import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import { $ } from 'platform/forms-system/src/js/utilities/ui';
import { statementOfTruthFullName } from '~/platform/forms/components/review/PreSubmitSection';
import formConfig from '../../../config/form';
import PreSubmitInfo from '../../../containers/PreSubmitInfo';

const getData = ({
  loggedIn = true,
  claimantType = undefined,
  profileFullName = { first: 'Jane', middle: 'Q', last: 'Doe' },
} = {}) => {
  const mockFormData = {
    formId: formConfig.formId,
    loadedStatus: 'success',
    savedStatus: '',
    loadedData: { metadata: {} },
    data: {},
    ...(claimantType ? { claimantType } : {}),
    veteranFullName: {
      first: 'Jane',
      middle: 'Q',
      last: 'Doe',
    },
  };

  return {
    props: {
      formData: mockFormData,
      preSubmitInfo: {
        statementOfTruth: {
          body: 'I confirm that the identifying information in this form is accurate and has been represented correctly.',
          messageAriaDescribedby:
            'I confirm that the identifying information in this form is accurate and has been represented correctly.',
          fullNamePath: formData =>
            formData?.claimantType === 'VETERAN'
              ? 'veteranFullName'
              : 'claimantFullName',
        },
      },
      showError: true,
      user: {
        login: {
          currentlyLoggedIn: loggedIn,
        },
        profile: {
          userFullName: profileFullName,
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
            userFullName: profileFullName,
          },
        },
        form: mockFormData,
      }),
      subscribe: () => {},
      dispatch: () => {},
    },
  };
};

describe('<PreSubmitInfo />', () => {
  describe('when not a self-representing veteran', () => {
    it('should render the va-statement-of-truth component and not va-privacy-agreement', () => {
      const { props, mockStore } = getData({
        loggedIn: true,
        claimantType: 'SPOUSE',
      });
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

  describe('when a self-representing veteran', () => {
    it('should render the va-privacy-agreement component and use profile name', () => {
      const { props, mockStore } = getData({
        loggedIn: true,
        claimantType: 'VETERAN',
      });
      const { container } = render(
        <Provider store={mockStore}>
          <PreSubmitInfo {...props} />
        </Provider>,
      );

      expect($('va-privacy-agreement', container)).to.exist;
      expect($('va-statement-of-truth', container)).not.to.exist;

      const expectedName = 'Jane Q Doe';
      const computedName = statementOfTruthFullName(
        props.formData,
        props.preSubmitInfo.statementOfTruth,
        props.user.profile.userFullName,
      );

      expect(computedName).to.equal(expectedName);
    });
  });

  // Add unit tests for full name path
});
