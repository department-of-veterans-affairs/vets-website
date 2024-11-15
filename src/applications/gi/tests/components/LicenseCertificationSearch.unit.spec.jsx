import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import LicenseCertificationSearch from '../../components/LicenseCertificationSearch';

describe('<LicenseCertificationSearch />', () => {
  let wrapper;
  let history;

  beforeEach(() => {
    history = { push: sinon.spy() };
    wrapper = shallow(<LicenseCertificationSearch />);
    wrapper.setProps({ history });
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it('should render without crashing', () => {
    expect(wrapper.exists()).to.be.ok;
  });
});
