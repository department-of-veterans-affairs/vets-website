import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import { mockFetch, resetFetch } from '../../util/unit-helpers.js';

import PhotoPreview from '../../../src/js/vic-v2/components/PhotoPreview.jsx';

function setFetchResponse(stub, data) {
  const response = new Response();
  response.ok = true;
  response.blob = () => Promise.resolve(data);
  stub.resolves(response);
}

let oldSesionStorage;

describe('<PhotoPreview>', () => {
  beforeEach(() => {
    oldSesionStorage = window.sessionStorage;
    window.sessionStorage = {};
  });
  it('should render preview with src', () => {
    const tree = shallow(
      <PhotoPreview
        id="guid"
        onError={f => f}
        src="testing"/>
    );

    expect(tree.find('img').props().src).to.equal('testing');
  });

  it('should fetch file metadata and update', (done) => {
    mockFetch();
    const response = new Blob();
    setFetchResponse(global.fetch.onFirstCall(), response);

    window.URL.createObjectURL = sinon.stub().returns('test');

    function updatePreview(src) {
      expect(src).to.equal('test');
      resetFetch();
      delete window.URL.createObjectURL;
      done();
    }

    function onError() {
      expect.fail();
      delete window.URL.createObjectURL;
      done();
    }

    const tree = shallow(
      <PhotoPreview
        onUpdatePreview={updatePreview}
        onError={onError}
        isLoggedIn
        id="guid"/>
    );

    expect(tree.find('LoadingIndicator').exists()).to.be.true;
  });

  it('should render no photo chosen', () => {
    const tree = shallow(
      <PhotoPreview/>
    );

    expect(tree.text()).to.contain('No photo chosen');
  });

  it('should render processing message', () => {
    const tree = shallow(
      <PhotoPreview
        isLoggedIn
        processing
        src="asfasd"
        id="guid"/>
    );

    expect(tree.find('.usa-alert-warning').exists()).to.be.true;
  });
  afterEach(() => {
    window.sessionStorage = oldSesionStorage;
  });
});
