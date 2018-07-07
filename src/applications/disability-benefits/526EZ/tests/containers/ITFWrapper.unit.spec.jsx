import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';

// import { mockMultipleApiRequest } from '../../../../../platform/testing/unit/helpers';
import { ITFWrapper } from '../../containers/ITFWrapper';

const originalFetch = global.fetch;

describe('526 ITFWrapper', () => {
  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('should not make an api call on the intro page', () => {
    global.fetch = sinon.spy();
    const tree = shallow(
      <ITFWrapper location={{ pathname: '/introduction' }}>
        <p>It worked!</p>
      </ITFWrapper>
    );
    expect(fetch.called).to.be.false;
    expect(tree.text()).to.equal('It worked!');
  });

  it('should not make an api call on the confirmation page', () => {
    global.fetch = sinon.spy();
    const tree = shallow(
      <ITFWrapper location={{ pathname: '/introduction' }}>
        <p>It worked!</p>
      </ITFWrapper>
    );
    expect(fetch.called).to.be.false;
    expect(tree.text()).to.equal('It worked!');
  });

  it('should fetch the ITF if not on the intro or confirmation pages', () => {});
  it('should render a loading indicator', () => {});
  it('should render an error message if the ITF fetch failed', () => {});
  it('should submit a new ITF if no active ITF is found', () => {});
  it('should render an error message if the ITF creation failed', () => {});
  it('should render an success message with the current expiration date', () => {});
  it('should render an success message with the previous expiration date', () => {});
});
