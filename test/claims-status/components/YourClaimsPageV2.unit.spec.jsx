import React from 'react';
import { shallow } from 'enzyme';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';
import sinon from 'sinon';
import _ from 'lodash/fp';

import { YourClaimsPageV2 } from '../../../src/js/claims-status/containers/YourClaimsPageV2';

describe.only('<YourClaimsPageV2', () => {
  const defaultProps = {
    canAccessClaims: true,
    canAccessAppeals: true,
    claimsLoading: false,
    appealsLoading: false,
    loading: false,
    appealsAvailable: 'AVAILABLE',
    claimsAvailable: 'AVAILABLE',
    claimsAuthorized: true,
    list: [
      {
        type: 'claimSeries',
        id: '1122334455',
      },
      {
        type: 'appealSeries',
        id: '1122334455',
      }
    ],
    pages: 1,
    page: 1,
    show30DayNotice: false,
    hide30DayNotice: true,
    consolidatedModal: false
  };

  it('should render', () => {
    const wrapper = shallow(<YourClaimsPageV2/>);
    expect(wrapper.type()).to.equal('div');
  });

  it('should render a loading indicator if both requests loading', () => {
    const props = _.merge(defaultProps, { claimsLoading: true, appealsLoading: true });
    const wrapper = shallow(<YourClaimsPageV2 {...props}/>, { disableLifecycleMethods: true });
    expect(wrapper.find('LoadingIndicator').length).to.equal(1);
  });

  it('should render a loading indicator if one list empty and other loading', () => {
    const props = _.merge(defaultProps, { appealsLoading: true, list: [] });
    const wrapper = shallow(<YourClaimsPageV2 {...props}/>, { disableLifecycleMethods: true });
    expect(wrapper.find('LoadingIndicator').length).to.equal(1);
  });

  it('should render a list of claims and appeals', () => {
    const wrapper = shallow(<YourClaimsPageV2 {...defaultProps}/>, { disableLifecycleMethods: true });
    expect(wrapper.find('AppealListItem').length).to.equal(1);
    expect(wrapper.find('ClaimsListItem').length).to.equal(1);
  });

  it('should render a closed claim message if show30DayNotice is true', () => {
    const props = _.set('show30DayNotice', true, defaultProps);
    const wrapper = shallow(<YourClaimsPageV2 {...props}/>, { disableLifecycleMethods: true });
    expect(wrapper.find('ClosedClaimMessage').length).to.equal(1);
  });

  it('should render Pagination', () => {
    const wrapper = shallow(<YourClaimsPageV2 {...defaultProps}/>, { disableLifecycleMethods: true });
    expect(wrapper.find('Pagination').length).to.equal(1);
  });

  it('should render a no claims message when no claims or appeals present', () => {

  });

  it('should not render error messages if either list is loading', () => {

  });

  it('should render claims and appeals unavailable when neither is unavailable', () => {

  });

  it('should render claims unavailable when claims are unavailable', () => {

  });

  it('should render appeals unavailable when appeals are unavailable', () => {

  });

  it('should render a consolidated claims modal when the relevant button is clicked', () => {

  });

  it('should render a FeaturesWarning component', () => {

  });

  it('should render an AskVAQuestions warning component', () => {

  });
});

describe('<YourClaimsPageV2>', () => {
  // it('should render sort select ', () => {
  //   const claims = [];
  //   const routeParams = {
  //     showClosedClaims: true
  //   };
  //   const tree = SkinDeep.shallowRender(
  //     <YourClaimsPageV2
  //       route={routeParams}
  //       list={claims}/>
  //   );
  //   const sortDiv = tree.subTree('claims-list-sort');
  //   expect(sortDiv).to.exist;
  // });
  it('should render loading div', () => {
    const changePage = sinon.spy();
    const getClaims = sinon.spy();
    const page = 1;
    const pages = 2;
    const claims = [];

    const tree = SkinDeep.shallowRender(
      <YourClaimsPageV2
        claimsLoading
        appealsLoading
        claims={claims}
        page={page}
        pages={pages}
        getClaims={getClaims}
        changePage={changePage}/>
    );
    expect(tree.everySubTree('LoadingIndicator').length).to.equal(1);
  });
  it('should render loading div if one is loading and no appeals', () => {
    const changePage = sinon.spy();
    const getClaims = sinon.spy();
    const page = 1;
    const pages = 2;
    const claims = [];

    const tree = SkinDeep.shallowRender(
      <YourClaimsPageV2
        claimsLoading
        claims={claims}
        page={page}
        pages={pages}
        getClaims={getClaims}
        changePage={changePage}/>
    );
    expect(tree.everySubTree('LoadingIndicator').length).to.equal(1);
  });
  it('should render claims list and loading indicator if claims is still loading', () => {
    const changePage = sinon.spy();
    const getClaims = sinon.spy();
    const page = 1;
    const pages = 2;
    const claims = [{}, {}];

    const tree = SkinDeep.shallowRender(
      <YourClaimsPageV2
        claimsLoading
        list={claims}
        page={page}
        pages={pages}
        getClaims={getClaims}
        route={{ showClosedClaims: false }}
        changePage={changePage}/>
    );
    expect(tree.everySubTree('ClaimsListItem').length).to.equal(2);
    expect(tree.everySubTree('LoadingIndicator').length).to.equal(1);
  });
  it('should not render error message when loading', () => {
    const changePage = sinon.spy();
    const getClaims = sinon.spy();
    const page = 1;
    const pages = 2;
    const claims = [];

    const tree = SkinDeep.shallowRender(
      <YourClaimsPageV2
        loading
        list={claims}
        page={page}
        pages={pages}
        getClaims={getClaims}
        route={{ showClosedClaims: false }}
        synced={false}
        changePage={changePage}/>
    );

    expect(tree.everySubTree('ClaimsAppealsUnavailable')).to.be.empty;
    expect(tree.everySubTree('ClaimsUnavailable')).to.be.empty;
    expect(tree.everySubTree('ClaimsUnauthorized')).to.be.empty;
    expect(tree.everySubTree('AppealsUnavailable')).to.be.empty;
  });

  it('should render error message when claims & appeals are unavailable', () => {
    const changePage = sinon.spy();
    const getClaims = sinon.spy();
    const page = 1;
    const pages = 2;
    const claims = [];

    const tree = SkinDeep.shallowRender(
      <YourClaimsPageV2
        canAccessAppeals
        canAccessClaims
        appealsAvailable={false}
        claimsAvailable={false}
        list={claims}
        page={page}
        pages={pages}
        getClaims={getClaims}
        route={{ showClosedClaims: false }}
        synced={false}
        changePage={changePage}/>
    );

    expect(tree.everySubTree('ClaimsAppealsUnavailable')).not.to.be.empty;
    expect(tree.everySubTree('ClaimsUnavailable')).to.be.empty;
    expect(tree.everySubTree('ClaimsUnauthorized')).to.be.empty;
    expect(tree.everySubTree('AppealsUnavailable')).to.be.empty;
  });

  it('should render error message when only claims are unavailable', () => {
    const changePage = sinon.spy();
    const getClaims = sinon.spy();
    const page = 1;
    const pages = 2;
    const claims = [];

    const tree = SkinDeep.shallowRender(
      <YourClaimsPageV2
        canAccessClaims
        claimsAvailable={false}
        list={claims}
        page={page}
        pages={pages}
        getClaims={getClaims}
        route={{ showClosedClaims: false }}
        synced={false}
        changePage={changePage}/>
    );

    expect(tree.everySubTree('ClaimsAppealsUnavailable')).to.be.empty;
    expect(tree.everySubTree('ClaimsUnavailable')).not.to.be.empty;
    expect(tree.everySubTree('ClaimsUnauthorized')).to.be.empty;
    expect(tree.everySubTree('AppealsUnavailable')).to.be.empty;
  });

  // it('should render error message when claims are unauthorized', () => {
  //   const changePage = sinon.spy();
  //   const getClaims = sinon.spy();
  //   const page = 1;
  //   const pages = 2;
  //   const claims = [];

  //   const tree = SkinDeep.shallowRender(
  //     <YourClaimsPageV2
  //       canAccessClaims
  //       claimsAvailable
  //       claimsAuthorized={false}
  //       list={claims}
  //       page={page}
  //       pages={pages}
  //       getClaims={getClaims}
  //       route={{ showClosedClaims: false }}
  //       synced={false}
  //       changePage={changePage}/>
  //   );

  //   expect(tree.everySubTree('ClaimsAppealsUnavailable')).to.be.empty;
  //   expect(tree.everySubTree('ClaimsUnavailable')).to.be.empty;
  //   expect(tree.everySubTree('ClaimsUnauthorized')).not.to.be.empty;
  //   expect(tree.everySubTree('AppealsUnavailable')).to.be.empty;
  // });

  it('should render no claims message', () => {
    const changePage = sinon.spy();
    const getClaims = sinon.spy();
    const page = 1;
    const pages = 2;
    const claims = [];

    const tree = SkinDeep.shallowRender(
      <YourClaimsPageV2
        list={claims}
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
      <YourClaimsPageV2
        list={claims}
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
      <YourClaimsPageV2
        unfilteredClaims={claims}
        unfilteredAppeals={claims}
        list={claims}
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
      <YourClaimsPageV2
        list={claims}
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
      <YourClaimsPageV2
        list={claims}
        page={page}
        pages={pages}
        getClaims={getClaims}
        route={{ showClosedClaims: true }}
        changePage={changePage}/>
    );
    expect(tree.everySubTree('ClosedClaimMessage')).to.be.empty;
  });
});
