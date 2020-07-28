import React from 'react';
import WizardContainer from '../../../wizard/containers/WizardContainer';
import { expect } from 'chai';
import { shallow } from 'enzyme';

describe('WizardContainer', () => {
  const mockStore = {
    sessionStorage: {},
  };
  let setWizardStatus;

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

  beforeEach(() => {
    setWizardStatus = value => {
      sessionStorage.setItem('wizardStatus', value);
      this.setState({ wizardStatus: value });
    };
  });

  afterEach(() => {
    global.sessionStorage.clear();
  });

  it('should render', () => {
    const wrapper = shallow(
      <WizardContainer setWizardStatus={setWizardStatus} />,
    );
    expect(wrapper.exists('.wizard-container')).to.equal(true);
    wrapper.unmount();
  });
});
