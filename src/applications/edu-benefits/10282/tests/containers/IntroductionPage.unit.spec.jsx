import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import IntroductionPage from '../../containers/IntroductionPage';
import OmbInfo from '../../components/OmbInfo';

describe('Edu 10282 <IntroductionPage>', () => {
  it('should render', () => {
    const fakeStore = {
      getState: () => ({
        showWizard: false,
        route: { formConfig: {} },
      }),
      subscribe: () => {},
      dispatch: () => {},
    };

    const wrapper = shallow(<IntroductionPage {...fakeStore.getState()} />);

    expect(wrapper.find('FormTitle').props().title).to.contain('Apply');

    expect(wrapper.find('va-link-action').length).to.equal(1);

    expect(wrapper.find(OmbInfo)).to.not.be.undefined;

    wrapper.unmount();
  });
});
