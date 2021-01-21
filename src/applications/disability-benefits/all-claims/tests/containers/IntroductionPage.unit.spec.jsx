import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import moment from 'moment';

import { IntroductionPage } from '../../components/IntroductionPage';
import formConfig from '../../config/form';
import {
  PAGE_TITLES,
  START_TEXT,
  SAVED_SEPARATION_DATE,
  DISABILITY_526_V2_ROOT_URL,
} from '../../constants';

describe('<IntroductionPage/>', () => {
  const { formId, prefillEnabled } = formConfig;
  const defaultProps = {
    formId,
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
  };

  const originalClaimsProps = allow => ({
    ...defaultProps,
    testOriginalClaim: allow,
    user: {
      profile: {
        services: ['original-claim'],
      },
    },
  });

  it('should render', () => {
    const wrapper = shallow(<IntroductionPage {...defaultProps} />);
    expect(wrapper.length).to.equal(1);
    expect(wrapper.type()).to.equal('div');
    wrapper.unmount();
  });

  it('should render a form title', () => {
    const wrapper = shallow(<IntroductionPage {...defaultProps} />);
    const title = wrapper.find('FormTitle');
    expect(title.length).to.equal(1);
    expect(title.props().title).to.equal(
      `${PAGE_TITLES.ALL} with VA Form 21-526EZ`,
    );
    wrapper.unmount();
  });

  it('should render a BDD form title', () => {
    sessionStorage.setItem(
      SAVED_SEPARATION_DATE,
      moment()
        .add(90, 'days')
        .format('YYYY-MM-DD'),
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
    const sipIntro = wrapper.find('withRouter(Connect(SaveInProgressIntro))');
    expect(sipIntro.length).to.equal(2);
    expect(sipIntro.first().props().startText).to.equal(START_TEXT.ALL);
    wrapper.unmount();
  });

  it('should render BDD SiP intros', () => {
    sessionStorage.setItem(
      SAVED_SEPARATION_DATE,
      moment()
        .add(90, 'days')
        .format('YYYY-MM-DD'),
    );
    const wrapper = shallow(<IntroductionPage {...defaultProps} />);
    const sipIntro = wrapper.find('withRouter(Connect(SaveInProgressIntro))');
    expect(sipIntro.length).to.equal(2);
    expect(sipIntro.first().props().startText).to.equal(START_TEXT.BDD);
    wrapper.unmount();
  });

  it('should render as usual (allow original claim)', () => {
    const wrapper = shallow(
      <IntroductionPage {...originalClaimsProps(true)} />,
    );
    expect(
      wrapper.find('withRouter(Connect(SaveInProgressIntro))').length,
    ).to.equal(2);
    expect(wrapper.find('FormTitle').length).to.equal(1);
    expect(wrapper.find('Connect(FileOriginalClaimPage)').length).to.equal(0);
    wrapper.unmount();
  });
  it('should block original claim & show alert', () => {
    const wrapper = shallow(
      <IntroductionPage {...originalClaimsProps(false)} />,
    );
    expect(
      wrapper.find('withRouter(Connect(SaveInProgressIntro))').length,
    ).to.equal(0);
    expect(wrapper.find('FormTitle').length).to.equal(1);
    expect(wrapper.find('Connect(FileOriginalClaimPage)').length).to.equal(1);
    wrapper.unmount();
  });
  it('should render reset wizard link to info page', () => {
    const wrapper = shallow(<IntroductionPage {...defaultProps} />);
    expect(wrapper.find('.va-button-link').props().href).to.contain(
      'how-to-file-claim',
    );
    wrapper.unmount();
  });
  it('should render reset wizard link to intro page', () => {
    const wrapper = shallow(<IntroductionPage {...defaultProps} showWizard />);
    expect(wrapper.find('.va-button-link').props().href).to.equal(
      DISABILITY_526_V2_ROOT_URL,
    );
    wrapper.unmount();
  });
});
