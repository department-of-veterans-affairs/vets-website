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
});
