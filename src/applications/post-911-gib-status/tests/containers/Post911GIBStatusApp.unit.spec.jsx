import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import Post911GIBStatusApp from '../../containers/Post911GIBStatusApp';
import reducer from '../../reducers/index.js';
import createCommonStore from 'platform/startup/store';

const store = createCommonStore(reducer);

describe('<Post911GIBStatusApp>', () => {
  it('should render', () => {
    const tree = shallow(<Post911GIBStatusApp store={store} />);
    const vdom = tree.html();
    expect(vdom).to.not.be.undefined;
    tree.unmount();
  });
});
