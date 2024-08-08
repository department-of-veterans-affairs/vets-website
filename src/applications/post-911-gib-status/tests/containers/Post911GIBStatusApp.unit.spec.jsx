import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import createCommonStore from '@department-of-veterans-affairs/platform-startup/store';

import Post911GIBStatusApp from '../../containers/Post911GIBStatusApp';
import reducer from '../../reducers/index';

const store = createCommonStore(reducer);

describe('<Post911GIBStatusApp>', () => {
  it('should render', () => {
    const tree = mount(
      <Provider store={store}>
        <Post911GIBStatusApp />
      </Provider>,
    );
    const vdom = tree.html();
    expect(vdom).to.not.be.undefined;
    tree.unmount();
  });
});
