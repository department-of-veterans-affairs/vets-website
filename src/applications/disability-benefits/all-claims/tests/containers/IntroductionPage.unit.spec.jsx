import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
// Using native Date instead of moment; previous moment-based implementation removed.
// Environment-based conditionals removed; alert always renders now.
import {
  PAGE_TITLES,
  START_TEXT,
  SAVED_SEPARATION_DATE,
  DISABILITY_526_V2_ROOT_URL,
  PAGE_TITLE_SUFFIX,
  DOCUMENT_TITLE_SUFFIX,
} from '../../constants';
import formConfig from '../../config/form';
import { IntroductionPage } from '../../components/IntroductionPage';

const { formId, prefillEnabled } = formConfig;
// Removed unused initialState and related store utilities after simplifying tests
describe('<IntroductionPage/>', () => {
  const defaultProps = {
    route: {
      formConfig: {
        prefillEnabled,
      },
      pageList: [],
    },
    // 'form526' service _should_ be required to proceed
    user: {
      profile: {
        services: ['form526'],
      },
    },
    loggedIn: true,
    formId,
  };

  it('should render', () => {
    const wrapper = shallow(<IntroductionPage {...defaultProps} />);
    expect(wrapper.length).to.equal(1);
    expect(wrapper.type()).to.equal('div');
    expect(wrapper.find('#restart-wizard').length).to.equal(1);
    wrapper.unmount();
  });

  it('should not render wizard restart when logged out', () => {
    const wrapper = shallow(
      <IntroductionPage {...defaultProps} loggedIn={false} />,
    );
    expect(wrapper.find('.schemaform-process').length).to.equal(1);
    expect(wrapper.find('#restart-wizard').length).to.equal(0);
    wrapper.unmount();
  });

  it('should render a form title', () => {
    const wrapper = shallow(<IntroductionPage {...defaultProps} />);
    const title = wrapper.find('FormTitle');
    const titleText = `${PAGE_TITLES.ALL} ${PAGE_TITLE_SUFFIX}`;
    expect(title.length).to.equal(1);
    expect(title.props().title).to.equal(titleText);
    expect(document.title).to.contain(titleText);
    expect(document.title).to.contain(DOCUMENT_TITLE_SUFFIX);
    wrapper.unmount();
  });

  it('should render a BDD form title', () => {
    const inNinetyDays = new Date();
    inNinetyDays.setDate(inNinetyDays.getDate() + 90);
    window.sessionStorage.setItem(
      SAVED_SEPARATION_DATE,
      inNinetyDays.toISOString().slice(0, 10),
    );
    const wrapper = shallow(<IntroductionPage {...defaultProps} />);
    const title = wrapper.find('FormTitle');
    expect(title.length).to.equal(1);
    expect(title.props().title).to.equal(
      `${PAGE_TITLES.BDD} with VA Form 21-526EZ`,
    );
    wrapper.unmount();
  });

  it('should render 2 SiP intros', () => {
    const wrapper = shallow(<IntroductionPage {...defaultProps} />);
    const sipIntro = wrapper.findWhere(
      n =>
        n.type &&
        n.type() &&
        n.type().displayName &&
        n.type().displayName.includes('SaveInProgressIntro'),
    );
    expect(sipIntro.length).to.equal(2);
    expect(sipIntro.first().props().startText).to.equal(START_TEXT.ALL);
    wrapper.unmount();
  });

  it('should render BDD SiP intros', () => {
    const inNinetyDays = new Date();
    inNinetyDays.setDate(inNinetyDays.getDate() + 90);
    window.sessionStorage.setItem(
      SAVED_SEPARATION_DATE,
      inNinetyDays.toISOString().slice(0, 10),
    );
    const wrapper = shallow(<IntroductionPage {...defaultProps} />);
    const sipIntro = wrapper.findWhere(
      n =>
        n.type &&
        n.type() &&
        n.type().displayName &&
        n.type().displayName.includes('SaveInProgressIntro'),
    );
    expect(sipIntro.length).to.equal(2);
    expect(sipIntro.first().props().startText).to.equal(START_TEXT.BDD);
    wrapper.unmount();
  });

  it('should render reset wizard link to info page', () => {
    const wrapper = shallow(<IntroductionPage {...defaultProps} />);
    expect(wrapper.find('#restart-wizard a').props().href).to.contain(
      'how-to-file-claim',
    );
    wrapper.unmount();
  });

  it('should render reset wizard link to intro page', () => {
    const wrapper = shallow(<IntroductionPage {...defaultProps} showWizard />);
    expect(wrapper.find('#restart-wizard a').props().href).to.equal(
      `${DISABILITY_526_V2_ROOT_URL}/start`,
    );
    wrapper.unmount();
  });

  it('should render evidence needed info alert', () => {
    const wrapper = shallow(<IntroductionPage {...defaultProps} />);
    expect(wrapper.find('va-alert').length).to.equal(1);
    // heading text inside alert
    expect(
      wrapper.find('va-alert').props().children[0].props.children,
    ).to.include('Notice of evidence needed');
    wrapper.unmount();
  });

  it('should not render disability ratings alert text', () => {
    const wrapper = shallow(<IntroductionPage {...defaultProps} />);
    expect(wrapper.text()).to.not.include('Disability Ratings');
    wrapper.unmount();
  });

  it('should display default process steps when not BDD flow', () => {
    const wrapper = shallow(<IntroductionPage {...defaultProps} showWizard />);

    expect(
      wrapper.find('[data-testid="process-step1-prepare"]').text(),
    ).contains('When you file a disability claim');
    expect(wrapper.find('[data-testid="process-step2-apply"]').text()).contains(
      'Complete this disability compensation benefits form',
    );
    expect(
      wrapper.find('[data-testid="process-step3-vareview"]').text(),
    ).contains('We process applications in the order we receive them');
    expect(
      wrapper.find('[data-testid="process-step4-decision"]').text(),
    ).contains('Once we’ve processed your claim');

    wrapper.unmount();
  });

  it('should display BDD prepare overview when using BDD flow', () => {
    const wrapper = shallow(
      <IntroductionPage {...defaultProps} showWizard isBDDForm />,
    );

    expect(
      wrapper.find('[data-testid="process-step1-prepare"]').text(),
    ).contains('When you file a BDD claim online');

    wrapper.unmount();
  });

  it('should render OMB info', () => {
    const wrapper = shallow(<IntroductionPage {...defaultProps} />);

    expect(wrapper.find('va-omb-info').length).to.equal(1);
    wrapper.unmount();
  });
});
