import React from 'react';
import sinon from 'sinon';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import { App } from '../../containers/App';

describe('<App/>', () => {
  const props = {
    ratedDisabilities: [],
    user: {},
    loginUrl: '',
    verifyUrl: '',
    fetchRatedDisabilities: sinon.stub(),
  };

  it('should render a RequiredLoginView', () => {
    const wrapper = shallow(
      <App {...props}>
        <div>App Children</div>
      </App>,
    );

    expect(wrapper.find('RequiredLoginView').length).to.equal(1);
    wrapper.unmount();
  });
});
