import React from 'react';
import _ from 'lodash/fp';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import { mockFetch, resetFetch } from '../../util/unit-helpers.js';
import { ConfirmationPage } from '../../../src/js/vic-v2/containers/ConfirmationPage';

const form = {
  submission: {
    response: {
      attributes: {
        confirmationNumber: 'V-VIC-177',
      }
    }
  },
  data: {
    veteranFullName: {
      first: 'Jane',
      last: 'Doe'
    }
  }
};

function setFetchResponse(stub, data) {
  const response = new Response();
  response.ok = true;
  response.blob = () => Promise.resolve(data);
  stub.resolves(response);
}

describe('<ConfirmationPage>', () => {
  beforeEach(() => {
    mockFetch();
  });
  it('should render unverified', () => {
    const tree = shallow(
      <ConfirmationPage form={form} userSignedIn/>
    );

    expect(tree.text()).to.contain('Jane  Doe');
    expect(tree.text()).to.contain('We process applications and print cards in the order we receive them.');
    expect(tree.text()).to.contain('We’ll send you emails updating you on the status of your application. You can also print this page for your records.');
  });
  it('should render not signed in', () => {
    const tree = shallow(
      <ConfirmationPage form={_.set('data.verified', true, form)}/>
    );

    expect(tree.text()).to.contain('Jane  Doe');
    expect(tree.text()).to.contain('We process applications and print cards in the order we receive them.');
    expect(tree.text()).to.contain('We’ll send you emails updating you on the status of your application. You can also print this page for your records.');
  });
  it('should render verified and signed in', (done) => {
    const response = new Blob();
    setFetchResponse(global.fetch.onFirstCall(), response);

    window.URL = {
      createObjectURL: sinon.stub().returns('imagesrc')
    };

    const tree = shallow(
      <ConfirmationPage form={_.set('data.verified', true, form)} userSignedIn/>
    );

    setTimeout(() => {
      tree.update();
      expect(tree.text()).not.to.contain('We’ll review your application to verify your eligibility.');
      expect(tree.text()).to.contain('In the meantime, you can print a temporary digital Veteran ID Card.');
      expect(tree.find('VeteranIDCard').props().veteranPhotoUrl).to.equal('imagesrc');
      done();
    });
  });
  afterEach(() => {
    resetFetch();
    delete window.URL;
  });
});
