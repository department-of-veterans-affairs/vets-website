import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';
import sinon from 'sinon';

import ReviewCollapsiblePanel from '../../../src/js/edu-benefits/components/ReviewCollapsiblePanel';
import { createVeteran } from '../../../src/js/edu-benefits/utils/veteran';

describe('<ReviewCollapsiblePanel>', () => {
  function FakeFields() {}
  function FakeReview() {}
  it('should render fields to update', () => {
    let data = createVeteran();
    let uiData = {
      pages: {
        '/veteran-information/personal-information': {
          complete: false,
          verified: false
        }
      }
    };
    const onFieldsInitialized = sinon.spy();
    const onUpdateSaveStatus = sinon.spy();
    const onUpdateVerifiedStatus = sinon.spy();
    const onUpdateEditStatus = sinon.spy();

    const tree = SkinDeep.shallowRender(
      <ReviewCollapsiblePanel
          data={data}
          uiData={uiData}
          pageLabel="Test"
          updatePath="/veteran-information/personal-information"
          component={<FakeFields/>}
          reviewComponent={<FakeReview/>}
          onFieldsInitialized={onFieldsInitialized}
          onUpdateSaveStatus={onUpdateSaveStatus}
          onUpdateVerifiedStatus={onUpdateVerifiedStatus}
          onUpdateEditStatus={onUpdateEditStatus}/>
    );

    expect(tree.everySubTree('FakeFields').length).to.equal(1);
    expect(tree.everySubTree('button')[0].text()).to.equal('Update page');
  });
  it('should render review fields', () => {
    let data = createVeteran();
    let uiData = {
      pages: {
        '/veteran-information/personal-information': {
          complete: true,
          verified: false
        }
      }
    };
    const onFieldsInitialized = sinon.spy();
    const onUpdateSaveStatus = sinon.spy();
    const onUpdateVerifiedStatus = sinon.spy();
    const onUpdateEditStatus = sinon.spy();

    const tree = SkinDeep.shallowRender(
      <ReviewCollapsiblePanel
          data={data}
          uiData={uiData}
          pageLabel="Test"
          updatePath="/veteran-information/personal-information"
          component={<FakeFields/>}
          reviewComponent={<FakeReview/>}
          onFieldsInitialized={onFieldsInitialized}
          onUpdateSaveStatus={onUpdateSaveStatus}
          onUpdateVerifiedStatus={onUpdateVerifiedStatus}
          onUpdateEditStatus={onUpdateEditStatus}/>
    );

    expect(tree.everySubTree('FakeReview').length).to.equal(1);
    expect(tree.everySubTree('button')[0].text()).to.equal('Edit');
    expect(tree.everySubTree('button')[1].text()).to.equal('Next');
  });
  it('should render nothing', () => {
    let data = createVeteran();
    let uiData = {
      pages: {
        '/veteran-information/personal-information': {
          complete: true,
          verified: false
        },
        '/veteran-information/contact-information': {
          complete: false,
          verified: false
        }
      }
    };
    const onFieldsInitialized = sinon.spy();
    const onUpdateSaveStatus = sinon.spy();
    const onUpdateVerifiedStatus = sinon.spy();
    const onUpdateEditStatus = sinon.spy();

    const tree = SkinDeep.shallowRender(
      <ReviewCollapsiblePanel
          data={data}
          uiData={uiData}
          pageLabel="Test"
          updatePath="/veteran-information/contact-information"
          component={<FakeFields/>}
          reviewComponent={<FakeReview/>}
          onFieldsInitialized={onFieldsInitialized}
          onUpdateSaveStatus={onUpdateSaveStatus}
          onUpdateVerifiedStatus={onUpdateVerifiedStatus}
          onUpdateEditStatus={onUpdateEditStatus}/>
    );

    expect(tree.everySubTree('FakeReview').length).to.equal(0);
    expect(tree.everySubTree('FakeFields').length).to.equal(0);
    expect(tree.everySubTree('button').length).to.equal(0);
  });
  it('should render just an edit button', () => {
    let data = createVeteran();
    let uiData = {
      pages: {
        '/veteran-information/personal-information': {
          complete: true,
          verified: true
        },
        '/veteran-information/contact-information': {
          complete: true,
          verified: true
        }
      }
    };
    const onFieldsInitialized = sinon.spy();
    const onUpdateSaveStatus = sinon.spy();
    const onUpdateVerifiedStatus = sinon.spy();
    const onUpdateEditStatus = sinon.spy();

    const tree = SkinDeep.shallowRender(
      <ReviewCollapsiblePanel
          data={data}
          uiData={uiData}
          pageLabel="Test"
          updatePath="/veteran-information/contact-information"
          component={<FakeFields/>}
          reviewComponent={<FakeReview/>}
          onFieldsInitialized={onFieldsInitialized}
          onUpdateSaveStatus={onUpdateSaveStatus}
          onUpdateVerifiedStatus={onUpdateVerifiedStatus}
          onUpdateEditStatus={onUpdateEditStatus}/>
    );

    expect(tree.everySubTree('FakeReview').length).to.equal(0);
    expect(tree.everySubTree('FakeFields').length).to.equal(0);
    expect(tree.everySubTree('button').length).to.equal(1);
    expect(tree.everySubTree('button')[0].text()).to.equal('Edit');
  });
});
