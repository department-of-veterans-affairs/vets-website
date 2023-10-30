import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import sinon from 'sinon';
import { MemoryRouter } from 'react-router-dom';
import proxyquire from 'proxyquire';
import GIBillHeaderInfo from '../../components/GIBillHeaderInfo';

const useRouteMatchStub = sinon.stub();
const mockReactRouterDom = {
  ...require('react-router-dom'),
  useRouteMatch: useRouteMatchStub,
};

const GiBillBreadcrumbs = proxyquire('../../components/GiBillBreadcrumbs', {
  'react-router-dom': mockReactRouterDom,
}).default;
describe('<GIBillHeaderInfo/>', () => {
  it('should render', () => {
    const wrapper = shallow(<GIBillHeaderInfo />);
    expect(wrapper.html()).to.not.be.undefined;
    wrapper.unmount();
  });
  it('should render links', () => {
    useRouteMatchStub.returns({
      path: '/institution/:facilityCode',
      params: { facilityCode: '123456' },
      isExact: true,
      url: '/institution/123456',
    });

    const wrapper = mount(
      <MemoryRouter>
        <GiBillBreadcrumbs />
      </MemoryRouter>,
    );

    const link = wrapper.find('Link[to="/institution/123456"]');
    expect(link).to.have.lengthOf(1);
    expect(link.text()).to.equal('Institution details');
    useRouteMatchStub.reset();
    wrapper.unmount();
  });
});
