import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import { ConnectedApp } from '../../../components/connected-apps/ConnectedApp';

describe('<ConnectedApp>', () => {
  it('renders correctly', () => {
    const defaultProps = {
      attributes: {
        created: '2020-06-09T00:42:41.798Z',
        grants: [{ title: 'hello' }, { title: 'hello' }, { title: 'hello' }],
        logo: 'logoURL',
        title: 'Random title',
      },
      confirmDelete: () => {},
      id: '1',
    };

    const wrapper = shallow(<ConnectedApp {...defaultProps} />);

    const image = wrapper.find('img');
    expect(image.prop('src')).to.equal('logoURL');

    const text = wrapper.text();
    expect(text).to.include(defaultProps.attributes.title);
    expect(text).to.include('Connected on ');
    expect(text).to.include('Disconnect');

    wrapper.unmount();
  });
});
