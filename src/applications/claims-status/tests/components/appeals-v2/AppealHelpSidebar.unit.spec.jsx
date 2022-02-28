import React from 'react';
import { Provider } from 'react-redux';
import { shallow, mount } from 'enzyme';
import { expect } from 'chai';
import AppealHelpSidebar from '../../../components/appeals-v2/AppealHelpSidebar';

describe('<AppealHelpSidebar>', () => {
  it('should render', () => {
    const props = { aoj: 'vba' };
    const wrapper = shallow(<AppealHelpSidebar {...props} />);

    expect(wrapper.find('AskVAQuestions')).to.not.be.false;
    wrapper.unmount();
  });

  it('should render the vba version', () => {
    const props = { aoj: 'vba' };
    const mockStore = {
      getState: () => ({
        featureToggles: {
          // eslint-disable-next-line camelcase
          omni_channel_link: true,
        },
      }),
      subscribe: () => {},
      dispatch: () => {},
    };
    const wrapper = mount(
      <Provider store={mockStore}>
        <AppealHelpSidebar {...props} />
      </Provider>,
    );

    expect(wrapper.find('AskVAQuestions').text()).to.contain(
      'Monday through Friday, 8:00 a.m. to 9:00 p.m. ET',
    );
    wrapper.unmount();
  });

  it('should render the vha version', () => {
    const props = { aoj: 'vha' };
    const wrapper = shallow(<AppealHelpSidebar {...props} />);

    expect(
      wrapper
        .find('p')
        .first()
        .text(),
    ).to.equal('Call Health Care Benefits');
    wrapper.unmount();
  });

  it.skip('should render the nca version', () => {
    const props = { aoj: 'nca' };
    const wrapper = shallow(<AppealHelpSidebar {...props} />);

    expect(
      wrapper
        .find('p')
        .first()
        .text(),
    ).to.equal();
    wrapper.unmount();
  });
});
