import { expect } from 'chai';
import { mount } from 'enzyme';
import React from 'react';

import formConfig from '../../config/form';

import ConfirmationPage from '../../containers/ConfirmationPage';

const data = {
  user: {
    profile: {
      userFullName: {
        first: 'Peter',
        middle: 'B',
        last: 'Parker',
      },
    },
  },
  form: {
    formId: formConfig.formId,
    submission: {
      response: {},
      timestamp: Date.now(),
    },
    data: {},
  },
};

describe('Confirmation page', () => {
  const fakeStore = {
    getState: () => data,
    subscribe: () => {},
    dispatch: () => {},
  };

  it('should render the confirmation page', () => {
    const tree = mount(<ConfirmationPage store={fakeStore} />);
    expect(tree).not.to.be.undefined;
    expect(tree.text()).to.contain(
      'Thank you for submitting a question to the U.S. Department of Veteran Affairs.',
    );
    tree.unmount();
  });
});
