import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import {
  IntroductionPage,
  mapStateToProps,
} from 'applications/edu-benefits/5495/containers/IntroductionPage';
import {
  WIZARD_STATUS_COMPLETE,
  getWizardStatus,
} from 'applications/static-pages/wizard';

describe('the Edu-Benefit 5495 Introduction Page', () => {
  const fakeStore = {
    getState: () => ({
      showWizard: true,
      route: { formConfig: {} },
    }),
    subscribe: () => {},
    dispatch: () => {},
  };
  it('should show the subway map if showWizard is set to false', () => {
    const wrapper = shallow(<IntroductionPage {...fakeStore.getState()} />);
    expect(wrapper.exists('WizardContainer')).to.equal(false);
    expect(wrapper.exists('.subway-map')).to.equal(true);
    wrapper.unmount();
  });
  it('should show the subway map if the wizard was completed', () => {
    const wrapper = shallow(<IntroductionPage {...fakeStore.getState()} />);
    const instance = wrapper.instance();
    instance.setWizardStatus(WIZARD_STATUS_COMPLETE);
    const status = getWizardStatus().then(() => {
      expect(status).to.equal(WIZARD_STATUS_COMPLETE);
    });
    expect(wrapper.exists('WizardContainer')).to.equal(false);
    expect(wrapper.exists('.subway-map')).to.equal(true);
    wrapper.unmount();
  });
  it('returns null when showWizard is undefined', () => {
    const newProps = {
      getState: () => ({
        route: { formConfig: {} },
      }),
      subscribe: () => {},
      dispatch: () => {},
    };
    const wrapper = shallow(<IntroductionPage {...newProps.getState()} />);
    expect(wrapper.isEmptyRender()).to.be.true;
    wrapper.unmount();
  });
  it('correctly maps showWizard from state', () => {
    const state = {
      form: {
        showWizard: true,
      },
    };
    const result = mapStateToProps(state);
    expect(result).to.deep.equal({
      showWizard: undefined,
    });
  });
});
