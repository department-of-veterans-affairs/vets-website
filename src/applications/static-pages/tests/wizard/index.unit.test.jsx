import React from 'react';
import Wizard from '../../wizard/';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import pages from './pages';

describe('the Wizard', () => {
  const mockStore = {
    sessionStorage: {},
  };

  before(() => {
    global.sessionStorage = {
      getItem: key =>
        key in mockStore.sessionStorage ? mockStore.sessionStorage[key] : null,
      setItem: (key, value) => {
        mockStore.sessionStorage[key] = `${value}`;
      },
      removeItem: key => delete mockStore.sessionStorage[key],
      clear: () => {
        mockStore.sessionStorage = {};
      },
    };
  });
  let defaultProps;

  beforeEach(() => {
    defaultProps = {
      pages,
      expander: true,
      buttonText: 'Start the wizard',
      setBenefitReferred: formId =>
        sessionStorage.setItem('benefitReferred', formId),
      setWizardStatus: value => sessionStorage.setItem('wizardStatus', value),
    };
  });

  afterEach(() => {
    global.sessionStorage.clear();
  });

  it('should initially render the wizard start button', () => {
    const wrapper = shallow(<Wizard {...defaultProps} />);
    expect(wrapper.exists('.wizard-button')).to.equal(true);
    wrapper.unmount();
  });
  it('should show the new benefit page when the start button is clicked', () => {
    const wrapper = shallow(<Wizard {...defaultProps} />);
    wrapper.find('.wizard-button').simulate('click');
    wrapper.unmount();
  });
});
