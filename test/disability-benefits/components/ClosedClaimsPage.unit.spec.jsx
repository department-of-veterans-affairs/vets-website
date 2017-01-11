import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';
import sinon from 'sinon';

import { ClosedClaimsPage } from '../../../src/js/disability-benefits/containers/ClosedClaimsPage';

describe('<ClosedClaimsPage>', () => {
  it('should render loading div', () => {
    const changePage = sinon.spy();
    const getClaims = sinon.spy();
    const page = 1;
    const pages = 2;
    const claims = [];

    const tree = SkinDeep.shallowRender(
      <ClosedClaimsPage
          loading
          claims={claims}
          page={page}
          pages={pages}
          getClaims={getClaims}
          changePage={changePage}/>
    );
    expect(tree.everySubTree('LoadingIndicator').length).to.equal(1);
  });

  it('should render no claims message', () => {
    const changePage = sinon.spy();
    const getClaims = sinon.spy();
    const page = 1;
    const pages = 2;
    const claims = [];

    const tree = SkinDeep.shallowRender(
      <ClosedClaimsPage
          claims={claims}
          page={page}
          pages={pages}
          getClaims={getClaims}
          changePage={changePage}/>
    );
    expect(tree.everySubTree('NoClaims').length).to.equal(1);
  });

  it('should render claims list and pagination', () => {
    const changePage = sinon.spy();
    const getClaims = sinon.spy();
    const page = 1;
    const pages = 2;
    const claims = [{}, {}];

    const tree = SkinDeep.shallowRender(
      <ClosedClaimsPage
          claims={claims}
          page={page}
          pages={pages}
          getClaims={getClaims}
          changePage={changePage}/>
    );
    expect(tree.everySubTree('ClaimsListItem').length).to.equal(2);
    expect(tree.subTree('Pagination').props.page).to.equal(page);
    expect(tree.subTree('Pagination').props.pages).to.equal(pages);
  });
});
