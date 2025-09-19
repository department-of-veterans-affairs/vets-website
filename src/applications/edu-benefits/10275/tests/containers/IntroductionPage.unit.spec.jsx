import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import { IntroductionPage } from '../../containers/IntroductionPage';
import OmbInfo from '../../components/OmbInfo';
import TechnologyProgramAccordion from '../../components/TechnologyProgramAccordion';

describe('22-10275 <IntroductionPage>', () => {
  const route = {
    formConfig: {
      prefillEnabled: true,
      savedFormMessages: {
        notFound: 'Form not found',
        noAuth: 'Please sign in',
      },
    },
    pageList: [{ path: '/introduction' }, { path: '/form' }],
  };

  it('should render form title', () => {
    const wrapper = shallow(<IntroductionPage route={route} />);
    const title = wrapper.find(FormTitle);
    expect(title).to.have.lengthOf(1);
    expect(title.props().title).to.equal(
      'Commit to the Principles of Excellence for educational institutions',
    );
    wrapper.unmount();
  });

  it('should render main description paragraph', () => {
    const wrapper = shallow(<IntroductionPage route={route} />);
    const description = wrapper.find('p').at(0);
    expect(description.text()).to.contain(
      'Use this form to commit to the Principles of Excellence for educational institutions',
    );
    wrapper.unmount();
  });

  it('should render info alert box', () => {
    const wrapper = shallow(<IntroductionPage route={route} />);
    const alert = wrapper.find('va-alert');
    expect(alert).to.have.lengthOf(1);
    expect(alert.props().status).to.equal('info');
    expect(alert.find('h2').text()).to.contain(
      'For educational institutions only',
    );
    wrapper.unmount();
  });

  it('should render the correct number of section headers', () => {
    const wrapper = shallow(<IntroductionPage route={route} />);
    expect(wrapper.find('h2')).to.have.lengthOf(3);
    wrapper.unmount();
  });

  it('should render start form section and save-in-progress widget', () => {
    const wrapper = shallow(<IntroductionPage route={route} />);
    const startHeader = wrapper.find('h2').at(2);
    expect(startHeader.text()).to.contain('Start the form');

    const sip = wrapper.find(SaveInProgressIntro);
    expect(sip).to.have.lengthOf(1);
    expect(sip.props().startText).to.equal(
      'Start your Principles of Excellence for educational institutions form',
    );
    wrapper.unmount();
  });

  it('should render OmbInfo', () => {
    const wrapper = shallow(<IntroductionPage route={route} />);
    expect(wrapper.find(OmbInfo)).to.have.lengthOf(1);
    wrapper.unmount();
  });

  it('should render TechnologyProgramAccordion', () => {
    const wrapper = shallow(<IntroductionPage route={route} />);
    expect(wrapper.find(TechnologyProgramAccordion)).to.have.lengthOf(1);
    wrapper.unmount();
  });

  it('should render with correct CSS class', () => {
    const wrapper = shallow(<IntroductionPage route={route} />);
    expect(wrapper.hasClass('schemaform-intro')).to.be.true;
    wrapper.unmount();
  });

  it('should render Executive Order link', () => {
    const wrapper = shallow(<IntroductionPage route={route} />);
    const link = wrapper.find('va-link');
    expect(link).to.have.lengthOf(1);
    expect(link.props().href).to.equal(
      'https://www.govinfo.gov/content/pkg/FR-2012-05-02/pdf/2012-10715.pdf',
    );
    wrapper.unmount();
  });
});
