import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import IntroductionPage from '../../containers/IntroductionPage';
import OmbInfo from '../../components/OmbInfo';

describe('22-10215 <IntroductionPage>', () => {
  const route = {
    formConfig: {
      prefillEnabled: false,
      savedFormMessages: {},
    },
    pageList: [],
  };

  it('should render form title', () => {
    const wrapper = shallow(<IntroductionPage route={route} />);
    const title = wrapper.find(FormTitle);
    expect(title).to.have.lengthOf(1);
    expect(title.props().title).to.equal(
      'Update your institution’s list of certifying officials',
    );
    wrapper.unmount();
  });

  it('should render designation paragraph', () => {
    const wrapper = shallow(<IntroductionPage route={route} />);
    const designation = wrapper.find('p').at(0);
    expect(designation.text()).to.contain(
      'Designation of certifying official(s) (VA Form 22-8794)',
    );
    wrapper.unmount();
  });

  it('should render info alert box', () => {
    const wrapper = shallow(<IntroductionPage route={route} />);
    const alert = wrapper.find('va-alert');
    expect(alert).to.have.lengthOf(1);
    expect(alert.props().status).to.equal('info');
    expect(alert.find('h2').text()).to.contain(
      'For educational institutions and training facilities only',
    );
    wrapper.unmount();
  });

  it('should render the correct number of section headers', () => {
    const wrapper = shallow(<IntroductionPage route={route} />);
    expect(wrapper.find('h2')).to.have.lengthOf(4);
    wrapper.unmount();
  });

  it('should render process list with three items', () => {
    const wrapper = shallow(<IntroductionPage route={route} />);
    expect(wrapper.find('va-process-list')).to.have.lengthOf(1);
    expect(wrapper.find('va-process-list-item')).to.have.lengthOf(3);
    wrapper.unmount();
  });

  it('should render start form section and save-in-progress widget', () => {
    const wrapper = shallow(<IntroductionPage route={route} />);
    const startHeader = wrapper.find('h2').at(3);
    expect(startHeader.text()).to.contain('Start the form');

    const sip = wrapper.find(SaveInProgressIntro);
    expect(sip).to.have.lengthOf(1);
    expect(sip.props().startText).to.equal(
      'Start your 85/15 calculations report',
    );
    wrapper.unmount();
  });

  it('should render OmbInfo', () => {
    const wrapper = shallow(<IntroductionPage route={route} />);
    expect(wrapper.find(OmbInfo)).to.have.lengthOf(1);
    wrapper.unmount();
  });
});
