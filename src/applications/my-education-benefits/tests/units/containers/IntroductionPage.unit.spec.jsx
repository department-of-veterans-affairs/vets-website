import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import HowToApplyPost911GiBill from '../../../components/HowToApplyPost911GiBill';
import IntroductionProcessList from '../../../components/IntroductionProcessList';
import IntroductionLogin from '../../../components/IntroductionLogin';
import LoadingIndicator from '../../../components/LoadingIndicator';
import { IntroductionPage } from '../../../containers/IntroductionPage';

describe('IntroductionPage', () => {
  const baseProps = {
    featureTogglesLoaded: true,
    route: {
      formConfig: {
        prefillEnabled: true,
        savedFormMessages: {
          notFound: '',
          noAuth: '',
          expired: '',
          saved: '',
          success: '',
        },
      },
      pageList: [{ path: 'introduction' }],
    },
  };

  it('renders headings and child components', () => {
    const wrapper = shallow(<IntroductionPage {...baseProps} />);
    expect(wrapper.find('h1')).to.have.lengthOf(1);
    expect(wrapper.find('h2')).to.have.lengthOf.at.least(1);

    expect(wrapper.find(HowToApplyPost911GiBill)).to.have.lengthOf(1);
    expect(wrapper.find(IntroductionProcessList)).to.have.lengthOf(1);
    expect(wrapper.find(IntroductionLogin)).to.have.lengthOf(1);
    wrapper.unmount();
  });

  it('shows <LoadingIndicator> when featureTogglesLoaded is false', () => {
    const wrapper = shallow(
      <IntroductionPage {...baseProps} featureTogglesLoaded={false} />,
    );
    expect(wrapper.find(LoadingIndicator)).to.have.lengthOf(1);
    wrapper.unmount();
  });

  it('displays the new H1 and H2 titles when meb1995Reroute is true', () => {
    const wrapper = shallow(<IntroductionPage {...baseProps} meb1995Reroute />);
    const h1 = wrapper.find('h1');
    const h2 = wrapper.find('h2').first();

    expect(h1.text()).to.equal('Apply for VA education benefits');
    expect(h2.text()).to.equal(
      'Application for VA Education Benefits (VA Form 22-1990)',
    );
    wrapper.unmount();
  });

  it('displays the original H1 and H2 titles when meb1995Reroute is false', () => {
    const wrapper = shallow(
      <IntroductionPage {...baseProps} meb1995Reroute={false} />,
    );
    const h1 = wrapper.find('h1');
    const h2 = wrapper.find('h2').first();

    expect(h1.text()).to.equal('Apply for VA education benefits Form 22-1990');
    expect(h2.text()).to.equal(
      'Equal to VA Form 22-1990 (Application for VA Education Benefits)',
    );
    wrapper.unmount();
  });
});
