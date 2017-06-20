import React from 'react';
import { findDOMNode } from 'react-dom';
import { expect } from 'chai';
import SkinDeep from 'skin-deep';
import sinon from 'sinon';
import ReactTestUtils from 'react-dom/test-utils';

import LoadingPage from '../../../src/js/common/schemaform/LoadingPage';
import { LOAD_STATUSES } from '../../../src/js/common/schemaform/save-load-actions';


describe('<LoadingPage>', () => {
  // Don't need this for each test, so I'm calling them in just the tests I need
  // beforeEach(setup);
  // afterEach(teardown);

  const goBack = sinon.spy();
  const startOver = sinon.spy();
  const retry = sinon.spy();
  const updateLoginSpy = sinon.spy();
  it('should render the spinner when pending', () => {
    const tree = SkinDeep.shallowRender(
      <LoadingPage
          loadedStatus={LOAD_STATUSES.pending}
          goBack={goBack}
          startOver={startOver}
          retry={retry}
          isLoggedIn
          onUpdateLoginUrl={updateLoginSpy}/>
    );

    expect(tree.everySubTree('LoadingIndicator')).to.not.be.empty;
  });
  it('should render the no auth error', () => {
    const tree = ReactTestUtils.renderIntoDocument(
      <LoadingPage
          loadedStatus={LOAD_STATUSES.noAuth}
          goBack={goBack}
          startOver={startOver}
          retry={retry}
          isLoggedIn
          onUpdateLoginUrl={updateLoginSpy}/>
    );
    const findDOM = findDOMNode(tree);

    expect(findDOM.querySelector('.usa-alert').textContent).to.contain('You have been signed out.');
    expect(findDOM.querySelector('.usa-button-outline').textContent).to.contain('Back');
    expect(findDOM.querySelector('.usa-button-primary').textContent).to.contain('Sign in');
  });
  it('should render the unrecoverable failure error', () => {
    const tree = ReactTestUtils.renderIntoDocument(
      <LoadingPage
          loadedStatus={LOAD_STATUSES.notFound}
          goBack={goBack}
          startOver={startOver}
          retry={retry}
          isLoggedIn
          onUpdateLoginUrl={updateLoginSpy}/>
    );
    const findDOM = findDOMNode(tree);

    expect(findDOM.querySelector('.usa-alert').textContent).to.contain("We're sorry, but something went wrong.");
    expect(findDOM.querySelector('.usa-button-primary').textContent).to.contain('Back');
  });
  it('should render the recoverable failure error', () => {
    const tree = ReactTestUtils.renderIntoDocument(
      <LoadingPage
          loadedStatus={LOAD_STATUSES.failure}
          goBack={goBack}
          startOver={startOver}
          retry={retry}
          isLoggedIn
          onUpdateLoginUrl={updateLoginSpy}/>
    );
    const findDOM = findDOMNode(tree);

    expect(findDOM.querySelector('.usa-alert').textContent).to.contain("We're sorry, but something went wrong.");
    expect(findDOM.querySelector('.usa-button-outline').textContent).to.contain('Back');
    expect(findDOM.querySelector('.usa-button-primary').textContent).to.contain('Resume previous application');
  });
  it('should render custom error text for an unrecoverable error', () => {
    const notFoundText = "The silly thing just doesn't exist!";
    const tree = ReactTestUtils.renderIntoDocument(
      <LoadingPage
          loadedStatus={LOAD_STATUSES.notFound}
          goBack={goBack}
          startOver={startOver}
          retry={retry}
          isLoggedIn
          onUpdateLoginUrl={updateLoginSpy}
          errorMessages={{ notFound: notFoundText }}/>
    );
    const findDOM = findDOMNode(tree);

    expect(findDOM.querySelector('.usa-alert').textContent).to.contain(notFoundText);
  });
  it('should render custom error text for a no-auth error', () => {
    const noAuthText = 'The silly thing just does not exist!';
    const tree = ReactTestUtils.renderIntoDocument(
      <LoadingPage
          loadedStatus={LOAD_STATUSES.noAuth}
          goBack={goBack}
          startOver={startOver}
          retry={retry}
          isLoggedIn
          onUpdateLoginUrl={updateLoginSpy}
          errorMessages={{ noAuth: noAuthText }}/>
    );
    const findDOM = findDOMNode(tree);

    expect(findDOM.querySelector('.usa-alert').textContent).to.contain(noAuthText);
  });
  it('should call goBack', () => {
    const tree = ReactTestUtils.renderIntoDocument(
      <LoadingPage
          loadedStatus={LOAD_STATUSES.noAuth}
          goBack={goBack}
          startOver={startOver}
          retry={retry}
          isLoggedIn
          onUpdateLoginUrl={updateLoginSpy}/>
    );
    const findDOM = findDOMNode(tree);
    const button = findDOM.querySelector('.usa-button-outline');
    ReactTestUtils.Simulate.click(button);
    expect(goBack.called).to.be.true;
  });
  it.skip('should call startOver', () => {});
  it('should call retry', () => {
    const tree = ReactTestUtils.renderIntoDocument(
      <LoadingPage
          loadedStatus={LOAD_STATUSES.failure}
          goBack={goBack}
          startOver={startOver}
          retry={retry}
          isLoggedIn
          onUpdateLoginUrl={updateLoginSpy}/>
    );
    const findDOM = findDOMNode(tree);
    const button = findDOM.querySelector('.usa-button-primary');
    ReactTestUtils.Simulate.click(button);
    expect(retry.called).to.be.true;
  });
});
