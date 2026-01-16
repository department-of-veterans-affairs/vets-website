import React from 'react';
import ReactDOM /* , { act } */ from 'react-dom';
import { expect } from 'chai';
import ReactTestUtils from 'react-dom/test-utils';

import { getFormDOM } from 'platform/testing/unit/schemaform-utils';
import cloneDeep from '../../../utilities/data/cloneDeep';
import SipsDevModal from '../../save-in-progress/SaveInProgressDevModal';
import { SAVE_STATUSES } from '../../save-in-progress/actions';

describe('Schemaform <SipsDevModal>', () => {
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
      { path: '/page-3/:index/test' },
      { path: 'review-and-submit' },
    ],
  };

  function setLoc(dev = 'on') {
    window.location = {
      hash: `#dev-${dev}`,
    };
  }

  it('should not render sips-modal link when disabled', () => {
    setLoc('off');
    const dom = document.createElement('div');
    ReactDOM.render(<SipsDevModal {...props} />, dom);
    expect(dom.querySelector('va-link[icon-name="settings"]')).to.be.null;
    expect(dom.querySelector('va-modal')).to.be.null;

    // link should render immediately after updating the hash (not working)
    // act(() => { // TypeError: (0 , _reactDom.act) is not a function
    //   resetAfter();
    //   setLoc();
    // });
    // expect(dom.querySelector('va-link[icon-name="settings"]')).to.be.ok;
  });

  it('should render sips-modal link on page 1', () => {
    setLoc();
    const modal = ReactTestUtils.renderIntoDocument(
      <div>
        <SipsDevModal {...props} />
      </div>,
    );
    const dom = getFormDOM(modal);
    expect(
      dom.querySelector('va-link[icon-name="settings"]').getAttribute('text'),
    ).to.be.contain('save-in-progress menu');
    expect(dom.querySelector('va-modal')).to.be.null;
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
    dom.click('va-link[icon-name="settings"]');
    expect(dom.querySelector('va-modal')).to.exist;
  });

  it('should replace the form data & include return url', () => {
    setLoc();
    const data = cloneDeep(props);
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
    dom.click('va-link[icon-name="settings"]');
    dom.fillData('va-textarea', JSON.stringify(newData));
    const vaSelect = dom.querySelector('va-select');
    vaSelect.__events.vaSelect({ target: { value: '/page-2' } });
    dom.click('va-button[text="Update"]'); // Update button
    expect(result).to.deep.equal({
      formId: 'test',
      version: 1,
      data: newData,
      sipsUrl: '/page-2',
    });
    // Modal closed
    expect(dom.querySelector('va-modal')).to.be.null;
  });

  it('should replace the form data from maximal-test.json & include return url', () => {
    setLoc();
    const data = cloneDeep(props);
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
    dom.click('va-link[icon-name="settings"]');
    dom.fillData('va-textarea', JSON.stringify(newData));
    const vaSelect = dom.querySelector('va-select');
    vaSelect.__events.vaSelect({ target: { value: '/page-2' } });
    // Update button
    dom.click('va-button[text="Update"]');
    expect(result).to.deep.equal({
      formId: 'test',
      version: 1,
      data: newData.data,
      sipsUrl: '/page-2',
    });
    // Modal closed
    expect(dom.querySelector('va-modal')).to.be.null;
  });

  it('should go to indexed page in return url', () => {
    setLoc();
    const data = cloneDeep(props);
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
    dom.click('va-link[icon-name="settings"]');
    const vaSelect = dom.querySelector('va-select');
    vaSelect.__events.vaSelect({ target: { value: '/page-3/0/test' } });
    // Update button
    dom.click('va-button[text="Update"]');
    expect(result).to.deep.equal({
      formId: 'test',
      version: 1,
      data: {},
      sipsUrl: '/page-3/0/test',
    });
    // Modal closed
    expect(dom.querySelector('va-modal')).to.be.null;
  });

  it('should not show link, or modal, with an empty pageList', () => {
    setLoc();
    const dom = document.createElement('div');
    ReactDOM.render(<SipsDevModal {...props} pageList={[]} />, dom);
    expect(dom.querySelector('va-link[icon-name="settings"]')).to.be.null;
    expect(dom.querySelector('va-modal')).to.be.null;
  });

  it('should not show link, or modal, with an undefined pageList', () => {
    setLoc();
    const dom = document.createElement('div');
    ReactDOM.render(<SipsDevModal {...props} pageList={undefined} />, dom);
    expect(dom.querySelector('va-link[icon-name="settings"]')).to.be.null;
    expect(dom.querySelector('va-modal')).to.be.null;
  });
});
