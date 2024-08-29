import React from 'react';
import { mount } from 'enzyme';
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

    expect(wrapper.find('va-breadcrumbs')).to.not.be.null;
    wrapper.unmount();
  });
});
