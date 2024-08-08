import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import sinon from 'sinon';
import { merge } from 'lodash';
import moment from 'moment';

import { requestStates } from 'platform/utilities/constants';
import { mockFetch } from 'platform/testing/unit/helpers';
import { ITFWrapper } from '../../containers/ITFWrapper';
import { itfStatuses } from '../../constants';

const fetchITF = sinon.spy();
const createITF = sinon.spy();

const defaultProps = {
  location: { pathname: '/middle' },
  // Copied this from the reducer initial state
  itf: {
    fetchCallState: requestStates.notCalled,
    creationCallState: requestStates.notCalled,
    currentITF: null,
    previousITF: null,
  },
  fetchITF,
  createITF,
};

describe('526 ITFWrapper', () => {
  afterEach(() => {
    fetchITF.reset();
    createITF.reset();
  });

  it('should not make an api call on the intro page', () => {
    mockFetch();
    const tree = mount(
      <ITFWrapper location={{ pathname: '/introduction' }}>
        <p>It worked!</p>
      </ITFWrapper>,
    );
    expect(fetchITF.called).to.be.false;
    expect(tree.text()).to.equal('It worked!');
    tree.unmount();
  });

  it('should not make an api call on the intro page with a trailing slash', () => {
    mockFetch();
    const tree = mount(
      <ITFWrapper location={{ pathname: '/introduction/' }}>
        <p>It worked!</p>
      </ITFWrapper>,
    );
    expect(fetchITF.called).to.be.false;
    expect(tree.text()).to.equal('It worked!');
    tree.unmount();
  });

  it('should not make an api call on the confirmation page', () => {
    mockFetch();
    const tree = mount(
      <ITFWrapper location={{ pathname: '/confirmation' }}>
        <p>It worked!</p>
      </ITFWrapper>,
    );
    expect(fetchITF.called).to.be.false;
    expect(tree.text()).to.equal('It worked!');
    tree.unmount();
  });

  it('should fetch the ITF if the form is loaded not on the intro or confirmation pages', () => {
    const tree = mount(
      <ITFWrapper {...defaultProps}>
        <p>Shouldn’t see me yet...</p>
      </ITFWrapper>,
    );
    expect(fetchITF.called).to.be.true;
    tree.unmount();
  });

  it('should fetch the ITF if the form is loaded on the intro and navigated to the next page', () => {
    const props = merge({}, defaultProps, {
      location: { pathname: '/introduction' },
    });
    const tree = shallow(
      <ITFWrapper {...props}>
        <p>Shouldn’t see me yet...</p>
      </ITFWrapper>,
    );
    expect(fetchITF.called).to.be.false;
    tree.setProps(merge({}, props, { location: { pathname: '/middle' } }));
    expect(fetchITF.called).to.be.true;
    tree.unmount();
  });

  it('should render a loading indicator', () => {
    const tree = shallow(
      <ITFWrapper {...defaultProps}>
        <p>Shouldn’t see me yet...</p>
      </ITFWrapper>,
    );
    expect(tree.find('va-loading-indicator').length).to.equal(1);
    tree.setProps(
      merge({}, defaultProps, {
        itf: { fetchCallState: requestStates.pending },
      }),
    );
    expect(tree.find('va-loading-indicator').length).to.equal(1);
    tree.unmount();
  });

  it('should render an error message if the ITF fetch failed', () => {
    const props = merge({}, defaultProps, {
      itf: {
        fetchCallState: requestStates.failed,
      },
    });
    const tree = shallow(
      <ITFWrapper {...props}>
        <p>Shouldn’t see me yet...</p>
      </ITFWrapper>,
    );
    const banner = tree.find('ITFBanner');
    expect(banner.length).to.equal(1);
    expect(banner.props().status).to.equal('error');
    tree.unmount();
  });

  it('should submit a new ITF if the fetch failed', () => {
    const props = merge({}, defaultProps, {
      itf: {
        fetchCallState: requestStates.pending,
      },
    });
    const tree = mount(
      <ITFWrapper {...props}>
        <p>Shouldn’t see me yet...</p>
      </ITFWrapper>,
    );
    // The ITF call happens in componentWillReceiveProps, so trigger that function call
    tree.setProps(
      merge({}, props, { itf: { fetchCallState: requestStates.failed } }),
    );
    expect(createITF.called).to.be.true;
    tree.unmount();
  });

  it('should submit a new ITF if no active ITF is found', () => {
    const tree = shallow(
      <ITFWrapper {...defaultProps}>
        <p>Shouldn’t see me yet...</p>
      </ITFWrapper>,
    );
    // Fetch succeded, but no ITFs were returned
    tree.setProps(
      merge({}, defaultProps, {
        itf: { fetchCallState: requestStates.succeeded },
      }),
    );
    expect(createITF.called).to.be.true;
    tree.unmount();
  });

  it('should submit a new ITF if the current ITF is expired', () => {
    const expirationDate = moment()
      .subtract(1, 'd')
      .format();
    const tree = shallow(
      <ITFWrapper {...defaultProps}>
        <p>Shouldn’t see me yet...</p>
      </ITFWrapper>,
    );
    // Fetch succeded and expired ITF was returned
    // This is used to catch cases where the status field is out of date
    tree.setProps(
      merge({}, defaultProps, {
        itf: {
          fetchCallState: requestStates.succeeded,
          currentITF: {
            status: 'active',
            expirationDate,
          },
        },
      }),
    );
    expect(createITF.called).to.be.true;
    tree.unmount();
  });

  it('should render an error message if the ITF creation failed', () => {
    const props = merge({}, defaultProps, {
      itf: {
        fetchCallState: requestStates.succeeded,
        // But no ITF is found
        creationCallState: requestStates.failed,
      },
    });
    const tree = shallow(
      <ITFWrapper {...props}>
        <p>I'm a ninja; you can’t see me!</p>
      </ITFWrapper>,
    );
    const banner = tree.find('ITFBanner');
    expect(tree.dive().find('h1')).to.have.lengthOf(1);
    expect(banner.length).to.equal(1);
    expect(banner.props().status).to.equal('error');
    tree.unmount();
  });

  it('should continue regardless of ITF creation failed', () => {
    const props = merge({}, defaultProps, {
      itf: {
        fetchCallState: requestStates.succeeded,
        // But no ITF is found
        creationCallState: requestStates.failed,
      },
    });
    const tree = shallow(
      <ITFWrapper {...props}>
        <p>I'm a ninja; you can’t see me!</p>
      </ITFWrapper>,
    );
    const banner = tree.find('ITFBanner');
    expect(tree.dive().find('h1')).to.have.lengthOf(1);
    expect(banner.length).to.equal(1);
    expect(banner.props().status).to.equal('error');
    tree.unmount();
  });

  it('should render a success message for fetched ITF', () => {
    const expirationDate = moment()
      .add(1, 'd')
      .format();
    const props = merge({}, defaultProps, {
      itf: {
        fetchCallState: requestStates.succeeded,
        currentITF: {
          status: itfStatuses.active,
          expirationDate,
        },
      },
    });
    const tree = mount(
      <ITFWrapper {...props}>
        <p>Hello, world.</p>
      </ITFWrapper>,
    );
    const banner = tree.find('ITFBanner');
    const bannerProps = banner.props();
    expect(banner.length).to.equal(1);
    expect(bannerProps.status).to.equal('itf-found');
    expect(bannerProps.currentExpDate).to.equal(expirationDate);
    expect(tree.find('h1')).to.have.lengthOf(1);
    tree.unmount();
  });

  it('should render a success message for newly created ITF', () => {
    const expirationDate = moment()
      .add(1, 'd')
      .format();
    const previousExpirationDate = moment()
      .subtract(1, 'd')
      .format();
    const props = merge({}, defaultProps, {
      itf: {
        fetchCallState: requestStates.succeeded,
        currentITF: {
          status: itfStatuses.active,
          expirationDate,
        },
        creationCallState: requestStates.succeeded,
        previousITF: {
          expirationDate: previousExpirationDate,
        },
      },
    });
    const tree = mount(
      <ITFWrapper {...props}>
        <p>Hello, world.</p>
      </ITFWrapper>,
    );
    const banner = tree.find('ITFBanner');
    const bannerProps = banner.props();
    expect(banner.length).to.equal(1);
    expect(bannerProps.status).to.equal('itf-created');
    expect(bannerProps.currentExpDate).to.equal(expirationDate);
    expect(bannerProps.previousExpDate).to.equal(previousExpirationDate);
    tree.unmount();
  });
});
