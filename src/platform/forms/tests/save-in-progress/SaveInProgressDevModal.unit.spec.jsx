import React from 'react';
import _ from 'lodash/fp';
import ReactDOM /* , { act } */ from 'react-dom';
import { expect } from 'chai';
import sinon from 'sinon';
import ReactTestUtils from 'react-dom/test-utils';

import { getFormDOM } from 'platform/testing/unit/schemaform-utils.jsx';
import localStorage from 'platform/utilities/storage/localStorage';
import SipsDevModal from '../../save-in-progress/SaveInProgressDevModal';
import { SAVE_STATUSES } from '../../save-in-progress/actions';

describe('Schemaform <SipsDevModal>', () => {
  let oldLocation;

  const props = {
    loggedInUser: {
      profile: {
        userFullName: 'something',
      },
      login: {
        currentlyLoggedIn: true,
      },
    },
    form: {
      formId: 'test',
      version: 1,
      data: {},
      trackingPrefix: 'test-',
      savedStatus: SAVE_STATUSES.notAttempted,
    },
    locationPathname: '/page-1',
    pageList: [
      { path: '/introduction' },
      { path: '/page-1' },
      { path: '/page-2' },
      { path: 'review-and-submit' },
    ],
  };

  const resetAfter = () => {
    window.location = oldLocation;
    localStorage.getItem.restore();
  };

  afterEach(resetAfter);

  function setLoc(storage = 'true', dev = 'on') {
    oldLocation = window.location;
    delete window.location;
    sinon.stub(localStorage, 'getItem').returns(storage);
    window.location = {
      hash: `#dev-${dev}`,
    };
  }

  it('should not render sips-modal link when disabled', () => {
    setLoc('false', 'off');
    const dom = document.createElement('div');
    ReactDOM.render(<SipsDevModal {...props} />, dom);
    expect(dom.querySelector('.va-button-link')).to.be.null;
    expect(dom.querySelector('.va-modal')).to.be.null;

    // link should render immediately after updating the hash (not working)
    // act(() => { // TypeError: (0 , _reactDom.act) is not a function
    //   resetAfter();
    //   setLoc();
    // });
    // expect(dom.querySelector('.va-button-link')).to.be.ok;
  });

  it('should render sips-modal link on page 1', () => {
    setLoc();
    const modal = ReactTestUtils.renderIntoDocument(
      <div>
        <SipsDevModal {...props} />
      </div>,
    );
    const dom = getFormDOM(modal);
    expect(dom.querySelector('.va-button-link').textContent).to.be.contain(
      'save-in-progress menu',
    );
    expect(dom.querySelector('.va-modal')).to.be.null;
  });
  it('should render the modal on click', () => {
    setLoc();
    const modal = ReactTestUtils.renderIntoDocument(
      <div>
        <SipsDevModal {...props} />
      </div>,
    );
    const dom = getFormDOM(modal);
    // open the sips modal
    dom.click('.va-button-link');
    expect(dom.querySelector('.va-modal')).to.not.be.false;
  });

  it('should replace the form data & include return url', () => {
    setLoc();
    const data = _.cloneDeep(props);
    const newData = {
      page1: { foo: true },
      page2: { bar: 'ok' },
    };
    let result = {};
    const updateResult = (formId, modData, version, sipsUrl) => {
      result = { formId, data: modData, version, sipsUrl };
    };

    const modal = ReactTestUtils.renderIntoDocument(
      <div>
        <SipsDevModal {...data} saveAndRedirectToReturnUrl={updateResult} />
      </div>,
    );
    const dom = getFormDOM(modal);
    // open the sips modal
    dom.click('.va-button-link');
    dom.fillData('textarea', JSON.stringify(newData));
    dom.fillData('select', '/page-2');
    dom.click('.usa-button-primary'); // replace button
    expect(result).to.deep.equal({
      formId: 'test',
      version: 1,
      data: newData,
      sipsUrl: '/page-2',
    });
    // Modal closed
    expect(dom.querySelector('.va-modal')).to.be.null;
  });
  it('should replace the form data from maximal-test.json & include return url', () => {
    setLoc();
    const data = _.cloneDeep(props);
    const newData = {
      data: {
        page1: { foo: true },
        page2: { bar: 'ok' },
      },
    };
    let result = {};
    const updateResult = (formId, modData, version, sipsUrl) => {
      result = { formId, data: modData, version, sipsUrl };
    };
    const modal = ReactTestUtils.renderIntoDocument(
      <div>
        <SipsDevModal {...data} saveAndRedirectToReturnUrl={updateResult} />
      </div>,
    );
    const dom = getFormDOM(modal);
    // open the sips modal
    dom.click('.va-button-link');
    dom.fillData('textarea', JSON.stringify(newData));
    dom.fillData('select', '/page-2');
    // replace button
    dom.click('.usa-button-primary');
    expect(result).to.deep.equal({
      formId: 'test',
      version: 1,
      data: newData.data,
      sipsUrl: '/page-2',
    });
    // Modal closed
    expect(dom.querySelector('.va-modal')).to.be.null;
  });

  it('should merge partial data into the form data & include return url', () => {
    setLoc();
    const data = _.cloneDeep(props);
    data.form.data = {
      page1: { foo: true },
      page2: { bar: 'ok' },
    };
    const newData = { page3: { test: '100' } };
    let result = {};
    const updateResult = (formId, modData, version, sipsUrl) => {
      result = { formId, data: modData, version, sipsUrl };
    };

    const modal = ReactTestUtils.renderIntoDocument(
      <div>
        <SipsDevModal {...data} saveAndRedirectToReturnUrl={updateResult} />
      </div>,
    );
    const dom = getFormDOM(modal);
    // open the sips modal
    dom.click('.va-button-link');
    dom.fillData('textarea', JSON.stringify(newData));
    dom.fillData('select', '/page-1');
    // merge button
    dom.click('.usa-button-secondary');
    expect(result).to.deep.equal({
      formId: 'test',
      version: 1,
      data: { ...data.form.data, ...newData },
      sipsUrl: '/page-1',
    });
    // Modal closed
    expect(dom.querySelector('.va-modal')).to.be.null;
  });
  it('should unwrap "data" & merge partial data into the form data & include return url', () => {
    setLoc();
    const data = _.cloneDeep(props);
    data.form.data = {
      page1: { foo: true },
      page2: { bar: 'ok' },
    };
    // Wrapped in "data"
    const newData = { data: { page3: { test: '100' } } };
    let result = {};
    const updateResult = (formId, modData, version, sipsUrl) => {
      result = { formId, data: modData, version, sipsUrl };
    };

    const modal = ReactTestUtils.renderIntoDocument(
      <div>
        <SipsDevModal {...data} saveAndRedirectToReturnUrl={updateResult} />
      </div>,
    );
    const dom = getFormDOM(modal);
    // open the sips modal
    dom.click('.va-button-link');
    dom.fillData('textarea', JSON.stringify(newData));
    dom.fillData('select', '/page-1');
    // merge button
    dom.click('.usa-button-secondary');
    expect(result).to.deep.equal({
      formId: 'test',
      version: 1,
      data: { ...data.form.data, ...newData.data },
      sipsUrl: '/page-1',
    });
    // Modal closed
    expect(dom.querySelector('.va-modal')).to.be.null;
  });
});
