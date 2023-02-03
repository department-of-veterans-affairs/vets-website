import { expect } from 'chai';
import React from 'react';
import { shallow } from 'enzyme';
import Layout from '../../../components/Layout';

describe('Render layout breadcrumbs', () => {
  it('Layout should contain breadcrumbs', async () => {
    const initialState = {
      children: <p>This is a test</p>,
      clsName: 'test string',
      breadCrumbs: {
        href: '/education/download-letters/letters',
        text: 'Your VA education letter',
      },
    };

    const wrapper = shallow(<Layout {...initialState} />);

    expect(wrapper.text()).to.include('Education and training');
    expect(wrapper.text()).to.include('Your VA education letter');
    expect(wrapper.text()).to.include('This is a test');
    wrapper.unmount();
  });
});
