import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { IntroductionPage } from '../../components/IntroductionPage';
import formConfig from '../../config/form';

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
    expect(wrapper.find('FormTitle').length).to.equal(1);
    wrapper.unmount();
  });

  it('should render 2 SiP intros', () => {
    const wrapper = shallow(<IntroductionPage {...defaultProps} />);
    expect(
      wrapper.find('withRouter(Connect(SaveInProgressIntro))').length,
    ).to.equal(2);
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
    expect(wrapper.find('FileOriginalClaimPage').length).to.equal(0);
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
    expect(wrapper.find('FileOriginalClaimPage').length).to.equal(1);
    wrapper.unmount();
  });
});
