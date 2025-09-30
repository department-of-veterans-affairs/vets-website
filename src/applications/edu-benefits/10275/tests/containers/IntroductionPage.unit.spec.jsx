import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import * as ReactRedux from 'react-redux';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import { IntroductionPage } from '../../containers/IntroductionPage';
import OmbInfo from '../../components/OmbInfo';
import TechnologyProgramAccordion from '../../components/TechnologyProgramAccordion';

describe('22-10275 <IntroductionPage>', () => {
  let useSelectorStub;

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

  beforeEach(() => {
    useSelectorStub = sinon.stub(ReactRedux, 'useSelector');
  });

  afterEach(() => {
    useSelectorStub.restore();
  });

  it('should render form title', () => {
    useSelectorStub.returns(false);
    const wrapper = shallow(<IntroductionPage route={route} />);
    const title = wrapper.find(FormTitle);
    expect(title).to.have.lengthOf(1);
    expect(title.props().title).to.equal(
      'Commit to the Principles of Excellence for educational institutions',
    );
    wrapper.unmount();
  });

  it('should render main description paragraph', () => {
    useSelectorStub.returns(false);
    const wrapper = shallow(<IntroductionPage route={route} />);
    const description = wrapper.find('p').at(0);
    expect(description.text()).to.contain(
      'Principles of Excellence for educational institutions (VA Form 22-10275)',
    );
    wrapper.unmount();
  });

  it('should render info alert box', () => {
    useSelectorStub.returns(false);
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
    useSelectorStub.returns(false);
    const wrapper = shallow(<IntroductionPage route={route} />);
    expect(wrapper.find('h2')).to.have.lengthOf(3);
    wrapper.unmount();
  });

  it('should render start form section and save-in-progress widget', () => {
    useSelectorStub.returns(false);
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
    useSelectorStub.returns(false);
    const wrapper = shallow(<IntroductionPage route={route} />);
    expect(wrapper.find(OmbInfo)).to.have.lengthOf(1);
    wrapper.unmount();
  });

  it('should render TechnologyProgramAccordion', () => {
    useSelectorStub.returns(false);
    const wrapper = shallow(<IntroductionPage route={route} />);
    expect(wrapper.find(TechnologyProgramAccordion)).to.have.lengthOf(1);
    wrapper.unmount();
  });

  it('should render with correct CSS class', () => {
    useSelectorStub.returns(false);
    const wrapper = shallow(<IntroductionPage route={route} />);
    expect(wrapper.hasClass('schemaform-intro')).to.be.true;
    wrapper.unmount();
  });

  it('should render Executive Order link', () => {
    useSelectorStub.returns(false);
    const wrapper = shallow(<IntroductionPage route={route} />);
    const link = wrapper.find('va-link');
    expect(link).to.have.lengthOf(1);
    expect(link.props().href).to.equal(
      'https://www.govinfo.gov/content/pkg/FR-2012-05-02/pdf/2012-10715.pdf',
    );
    wrapper.unmount();
  });

  it('should apply correct margin class when user is logged in', () => {
    useSelectorStub.returns(true);
    const wrapper = shallow(<IntroductionPage route={route} />);
    const ombInfoContainer = wrapper
      .find('div')
      .findWhere(node => node.hasClass('vads-u-margin-top--4'));
    expect(ombInfoContainer).to.have.lengthOf(1);
    wrapper.unmount();
  });

  it('should not apply margin class when user is not logged in', () => {
    useSelectorStub.returns(false);
    const wrapper = shallow(<IntroductionPage route={route} />);
    const ombInfoContainer = wrapper
      .find('div')
      .findWhere(node => node.hasClass('vads-u-margin-top--4'));
    expect(ombInfoContainer).to.have.lengthOf(0);
    wrapper.unmount();
  });
});
