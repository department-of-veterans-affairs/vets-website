import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';

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
    expect(tree.text()).to.contain('Your application has been submitted');
    tree.unmount();
  });
});
