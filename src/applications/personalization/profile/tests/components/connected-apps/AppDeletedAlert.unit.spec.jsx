import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';

import { AppDeletedAlert } from '../../../components/connected-apps/AppDeletedAlert';

describe('<AppDeletedAlert>', () => {
  it('renders correctly', () => {
    const privacyUrl = 'https://www.apple.com/legal/privacy/';
    const defaultProps = {
      id: '',
      title: 'Apple Health',
      dismissAlert: () => {},
      privacyUrl,
    };
    const wrapper = mount(<AppDeletedAlert {...defaultProps} />);
    const text = wrapper.text();

    expect(text).to.include(
      'This app can’t access any new information from your VA.gov profile',
    );

    expect(wrapper.find('a').props().href).to.equal(privacyUrl);

    wrapper.unmount();
  });
});
