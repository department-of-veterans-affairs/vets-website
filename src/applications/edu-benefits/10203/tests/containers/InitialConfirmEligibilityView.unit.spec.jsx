import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';

import InitialConfirmEligibilityView from '../../containers/InitialConfirmEligibilityView';
import createCommonStore from 'platform/startup/store';
import { Provider } from 'react-redux';

const createStore = (data = {}) =>
  createCommonStore({
    form: () => ({
      data: {
        'view:benefit': { chapter33: true },
        isEnrolledStem: true,
        'view:teachingCertClinicalTraining': {
          isPursuingTeachingCert: false,
          isPursuingClinicalTraining: false,
        },
        benefitLeft: 'none',
        ...data,
      },
    }),
  });
const defaultStore = createStore();
const defaultProps = {
  ...defaultStore.getState(),
  formData: {},
  errorSchema: {
    'view:confirmEligibility': {
      __errors: [],
    },
  },
};

describe('<InitialConfirmEligibilityView>', () => {
  it('should render', () => {
    const tree = mount(
      <Provider store={defaultStore}>
        <InitialConfirmEligibilityView {...defaultProps} />
      </Provider>,
    );
    expect(tree).to.not.be.undefined;
    tree.unmount();
  });

  it('should render ExitApplicationButton', () => {
    const tree = mount(
      <Provider store={defaultStore}>
        <InitialConfirmEligibilityView {...defaultProps} />
      </Provider>,
    );
    expect(tree.find('ExitApplicationButton')).to.not.be.undefined;
    tree.unmount();
  });
});
