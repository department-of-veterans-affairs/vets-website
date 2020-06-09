import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import { AppDeletedAlert } from '../../../components/connected-apps/AppDeletedAlert';

describe('<AppDeletedAlert>', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<AppDeletedAlert />);
    const text = wrapper.text();

    expect(text).to.equal('This app has been disconnected');

    wrapper.unmount();
  });
});
