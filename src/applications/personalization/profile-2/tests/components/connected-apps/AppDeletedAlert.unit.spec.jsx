import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';

import { AppDeletedAlert } from '../../../components/connected-apps/AppDeletedAlert';

describe('<AppDeletedAlert>', () => {
  it('renders correctly', () => {
    const wrapper = mount(<AppDeletedAlert />);
    const text = wrapper.text();

    expect(text).to.include(
      'This app can’t access any new information from your VA.gov profile',
    );

    wrapper.unmount();
  });
});
