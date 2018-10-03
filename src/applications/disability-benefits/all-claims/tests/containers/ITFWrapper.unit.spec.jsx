import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import sinon from 'sinon';
import { merge } from 'lodash/fp';

import { ITFWrapper } from '../../containers/ITFWrapper';
import { itfStatuses } from '../../constants';
import { requestStates } from '../../../../../platform/utilities/constants';

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
    global.fetch = sinon.spy();
    const tree = mount(
      <ITFWrapper location={{ pathname: '/introduction' }}>
        <p>It worked!</p>
      </ITFWrapper>,
    );
    expect(fetchITF.called).to.be.false;
    expect(tree.text()).to.equal('It worked!');
  });

  it('should not make an api call on the confirmation page', () => {
    global.fetch = sinon.spy();
    const tree = mount(
      <ITFWrapper location={{ pathname: '/confirmation' }}>
        <p>It worked!</p>
      </ITFWrapper>,
    );
    expect(fetchITF.called).to.be.false;
    expect(tree.text()).to.equal('It worked!');
  });

  it('should fetch the ITF if the form is loaded not on the intro or confirmation pages', () => {
    mount(
      <ITFWrapper {...defaultProps}>
        <p>Shouldn't see me yet...</p>
      </ITFWrapper>,
    );
    expect(fetchITF.called).to.be.true;
  });

  it('should fetch the ITF if the form is loaded on the intro and navigated to the next page', () => {
    const props = merge(defaultProps, {
      location: { pathname: '/introduction' },
    });
    const tree = shallow(
      <ITFWrapper {...props}>
        <p>Shouldn't see me yet...</p>
      </ITFWrapper>,
    );
    expect(fetchITF.called).to.be.false;
    tree.setProps(merge(props, { location: { pathname: '/middle' } }));
    expect(fetchITF.called).to.be.true;
  });

  it('should render a loading indicator', () => {
    const tree = shallow(
      <ITFWrapper {...defaultProps}>
        <p>Shouldn't see me yet...</p>
      </ITFWrapper>,
    );
    expect(tree.find('LoadingIndicator').length).to.equal(1);
    tree.setProps(
      merge(defaultProps, { itf: { fetchCallState: requestStates.pending } }),
    );
    expect(tree.find('LoadingIndicator').length).to.equal(1);
  });

  it('should render an error message if the ITF fetch failed', () => {
    const props = merge(defaultProps, {
      itf: {
        fetchCallState: requestStates.failed,
      },
    });
    const tree = shallow(
      <ITFWrapper {...props}>
        <p>Shouldn't see me yet...</p>
      </ITFWrapper>,
    );
    expect(tree.find('AlertBox').length).to.equal(1);
  });

  it('should not submit a new ITF if the fetch failed', () => {
    const props = merge(defaultProps, {
      itf: {
        fetchCallState: requestStates.pending,
      },
    });
    const tree = mount(
      <ITFWrapper {...props}>
        <p>Shouldn't see me yet...</p>
      </ITFWrapper>,
    );
    // The ITF call happens in componentWillReceiveProps, so trigger that function call
    tree.setProps(
      merge(props, { itf: { fetchCallState: requestStates.failed } }),
    );
    expect(createITF.called).to.be.false;
  });

  it('should submit a new ITF if no active ITF is found', () => {
    const tree = shallow(
      <ITFWrapper {...defaultProps}>
        <p>Shouldn't see me yet...</p>
      </ITFWrapper>,
    );
    // Fetch succeded, but no ITFs were returned
    tree.setProps(
      merge(defaultProps, { itf: { fetchCallState: requestStates.succeeded } }),
    );
    expect(createITF.called).to.be.true;
  });

  it('should render an error message if the ITF creation failed', () => {
    const props = merge(defaultProps, {
      itf: {
        fetchCallState: requestStates.succeeded,
        // But no ITF is found
        creationCallState: requestStates.failed,
      },
    });
    const tree = shallow(
      <ITFWrapper {...props}>
        <p>I'm a ninja; you can't see me!</p>
      </ITFWrapper>,
    );
    expect(tree.find('AlertBox').length).to.equal(1);
  });

  it('should render a success message with the current expiration date', () => {
    const expirationDate = '2015-08-28T19:47:52.786+00:00';
    const props = merge(defaultProps, {
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
    expect(tree.find('AlertBox').length).to.equal(1);
    expect(tree.text()).to.contain('August 28, 2015');
    expect(tree.find('AdditionalInfo').length).to.equal(1);
  });

  it('should render a success message with the previous expiration date', () => {
    const expirationDate = '2015-08-28T19:47:52.786+00:00';
    const previousExpirationDate = '2014-08-28T19:47:52.786+00:00';
    const props = merge(defaultProps, {
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
    expect(tree.find('AlertBox').length).to.equal(1);
    expect(tree.text()).to.contain('will expire on August 28, 2015');
    expect(tree.text()).to.contain('expired on August 28, 2014');
  });

  it('should not render a success message after the location changes', () => {
    const expirationDate = '2015-08-28T19:47:52.786+00:00';
    const props = merge(defaultProps, {
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
    expect(tree.find('AlertBox').length).to.equal(1);
    tree.setProps(merge(props, { location: { pathname: '/something-else' } }));
    expect(tree.find('AlertBox').length).to.equal(0);
  });
});
