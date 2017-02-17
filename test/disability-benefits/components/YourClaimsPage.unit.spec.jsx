import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';
import sinon from 'sinon';

import { YourClaimsPage } from '../../../src/js/disability-benefits/containers/YourClaimsPage';

describe('<YourClaimsPage>', () => {
  it('should render tabs', () => {
    const claims = [];
    const routeParams = {
      showClosedClaims: true
    };
    const tree = SkinDeep.shallowRender(
      <YourClaimsPage
          route={routeParams}
          claims={claims}/>
    );
    expect(tree.everySubTree('MainTabNav').length).to.equal(1);
  });
  it('should render sort select ', () => {
    const claims = [];
    const routeParams = {
      showClosedClaims: true
    };
    const tree = SkinDeep.shallowRender(
      <YourClaimsPage
          route={routeParams}
          claims={claims}/>
    );
    const sortDiv = tree.subTree('claims-list-sort');
    expect(sortDiv).to.exist;
  });
  it('should render loading div', () => {
    const changePage = sinon.spy();
    const getClaims = sinon.spy();
    const page = 1;
    const pages = 2;
    const claims = [];

    const tree = SkinDeep.shallowRender(
      <YourClaimsPage
          loading
          claims={claims}
          page={page}
          pages={pages}
          getClaims={getClaims}
          changePage={changePage}/>
    );
    expect(tree.everySubTree('LoadingIndicator').length).to.equal(1);
  });
  it('should render sync warning', () => {
    const changePage = sinon.spy();
    const getClaims = sinon.spy();
    const page = 1;
    const pages = 2;
    const claims = [];

    const tree = SkinDeep.shallowRender(
      <YourClaimsPage
          claims={claims}
          page={page}
          pages={pages}
          getClaims={getClaims}
          route={{ showClosedClaims: false }}
          synced={false}
          changePage={changePage}/>
    );
    expect(tree.everySubTree('ClaimSyncWarning')).not.to.be.empty;
  });
  it('should render no claims message', () => {
    const changePage = sinon.spy();
    const getClaims = sinon.spy();
    const page = 1;
    const pages = 2;
    const claims = [];

    const tree = SkinDeep.shallowRender(
      <YourClaimsPage
          claims={claims}
          page={page}
          pages={pages}
          getClaims={getClaims}
          route={{ showClosedClaims: false }}
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
      <YourClaimsPage
          claims={claims}
          page={page}
          pages={pages}
          getClaims={getClaims}
          route={{ showClosedClaims: false }}
          changePage={changePage}/>
    );
    expect(tree.everySubTree('ClaimsListItem').length).to.equal(2);
    expect(tree.subTree('Pagination').props.page).to.equal(page);
    expect(tree.subTree('Pagination').props.pages).to.equal(pages);
  });
  it('should render 30 day notice', () => {
    const changePage = sinon.spy();
    const getClaims = sinon.spy();
    const page = 1;
    const pages = 2;
    const claims = [{}, {}];

    const tree = SkinDeep.shallowRender(
      <YourClaimsPage
          claims={claims}
          page={page}
          pages={pages}
          show30DayNotice
          getClaims={getClaims}
          route={{}}
          changePage={changePage}/>
    );
    expect(tree.everySubTree('ClosedClaimMessage')).not.to.be.empty;
  });
  it('should not render 30 day notice', () => {
    const changePage = sinon.spy();
    const getClaims = sinon.spy();
    const page = 1;
    const pages = 2;
    const claims = [{}, {}];

    const tree = SkinDeep.shallowRender(
      <YourClaimsPage
          claims={claims}
          page={page}
          pages={pages}
          getClaims={getClaims}
          route={{}}
          changePage={changePage}/>
    );
    expect(tree.everySubTree('ClosedClaimMessage')).to.be.empty;
  });
  it('should not render 30 day notice if on closed tab', () => {
    const changePage = sinon.spy();
    const getClaims = sinon.spy();
    const page = 1;
    const pages = 2;
    const claims = [{}, {}];

    const tree = SkinDeep.shallowRender(
      <YourClaimsPage
          claims={claims}
          page={page}
          pages={pages}
          getClaims={getClaims}
          route={{ showClosedClaims: true }}
          changePage={changePage}/>
    );
    expect(tree.everySubTree('ClosedClaimMessage')).to.be.empty;
  });
});
