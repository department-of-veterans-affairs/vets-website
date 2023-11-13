import React from 'react';
import { mount, shallow } from 'enzyme';
import { expect } from 'chai';
import { MemoryRouter } from 'react-router-dom';
import sinon from 'sinon';
import * as reactRouterDom from 'react-router-dom';
import GiBillBreadcrumbs from '../../components/GiBillBreadcrumbs';
import * as helpers from '../../utils/helpers';

const mockUseRouteMatch = sinon.stub(reactRouterDom, 'useRouteMatch');
const mockUseQueryParams = sinon.stub(helpers, 'useQueryParams');

describe('<GiBillBreadcrumbs>', () => {
  it('should render default breadcrumb structure', () => {
    mockUseRouteMatch.returns(null);
    mockUseQueryParams.returns(new URLSearchParams());

    const wrapper = mount(
      <MemoryRouter>
        <GiBillBreadcrumbs />
      </MemoryRouter>,
    );

    expect(wrapper.find('Breadcrumbs')).to.have.lengthOf(0);
    expect(wrapper.find('Link')).to.have.lengthOf(1);
    wrapper.unmount();
  });
  it('should add Institution details to breadcrumbs if profileMatch is true', () => {
    mockUseRouteMatch.returns({ params: { facilityCode: '123' } });
    mockUseQueryParams.returns(new URLSearchParams());

    const wrapper = shallow(
      <MemoryRouter>
        <GiBillBreadcrumbs />
      </MemoryRouter>,
    );

    expect(wrapper.find('Link[to="/institution/123"]')).to.have.lengthOf(0);
    wrapper.unmount();
  });
  it('should add Institution comparison to breadcrumbs if compareMatch is true', () => {
    mockUseRouteMatch.returns({});
    mockUseQueryParams.returns(new URLSearchParams());

    const wrapper = shallow(
      <MemoryRouter>
        <GiBillBreadcrumbs />
      </MemoryRouter>,
    );

    expect(wrapper.find('Link[to="/"]')).to.have.lengthOf(0);
    wrapper.unmount();
  });
});
