import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';
import sinon from 'sinon';

import ReviewCollapsiblePanel from '../../../src/js/edu-benefits/components/ReviewCollapsiblePanel';
import { createVeteran } from '../../../src/js/edu-benefits/utils/veteran';

describe('<ReviewCollapsiblePanel>', () => {
  function renderCollapsiblePanel(uiData, path = '/personal-information/contact-information') {
    function FakeFields() {}
    function FakeReview() {}
    let data = createVeteran();
    const onFieldsInitialized = sinon.spy();
    const onUpdateSaveStatus = sinon.spy();
    const onUpdateVerifiedStatus = sinon.spy();
    const onUpdateEditStatus = sinon.spy();

    return SkinDeep.shallowRender(
      <ReviewCollapsiblePanel
          data={data}
          uiData={uiData}
          pageLabel="Test"
          updatePath={path}
          component={<FakeFields/>}
          reviewComponent={<FakeReview/>}
          onFieldsInitialized={onFieldsInitialized}
          onUpdateSaveStatus={onUpdateSaveStatus}
          onUpdateVerifiedStatus={onUpdateVerifiedStatus}
          onUpdateEditStatus={onUpdateEditStatus}/>
    );
  }
  it('should render fields to update', () => {
    const uiData = {
      pages: {
        '/school-selection/school-information': {
          complete: true,
          verified: true
        },
        '/personal-information/contact-information': {
          complete: false,
          verified: false
        }
      }
    };

    const tree = renderCollapsiblePanel(uiData);

    expect(tree.everySubTree('FakeFields').length).to.equal(1);
    expect(tree.everySubTree('button')[0].text()).to.equal('Update page');
  });
  it('should render review fields', () => {
    const uiData = {
      pages: {
        '/school-selection/school-information': {
          complete: true,
          verified: true
        },
        '/personal-information/contact-information': {
          complete: true,
          verified: false
        }
      }
    };

    const tree = renderCollapsiblePanel(uiData);

    expect(tree.everySubTree('FakeReview').length).to.equal(1);
    expect(tree.everySubTree('button')[0].text()).to.equal('Edit');
    expect(tree.everySubTree('button')[1].text()).to.equal('Next');
  });
  it('should render nothing', () => {
    const uiData = {
      pages: {
        '/school-selection/school-information': {
          complete: true,
          verified: true
        },
        '/personal-information/contact-information': {
          complete: true,
          verified: false
        },
        '/personal-information/secondary-contact': {
          complete: false,
          verified: false
        }
      }
    };

    const tree = renderCollapsiblePanel(uiData, '/personal-information/secondary-contact');

    expect(tree.everySubTree('FakeReview').length).to.equal(0);
    expect(tree.everySubTree('FakeFields').length).to.equal(0);
    expect(tree.everySubTree('button').length).to.equal(0);
  });
  it('should render just an edit button', () => {
    const uiData = {
      pages: {
        '/school-selection/school-information': {
          complete: true,
          verified: true
        },
        '/personal-information/contact-information': {
          complete: true,
          verified: true
        },
        '/personal-information/secondary-contact': {
          complete: true,
          verified: true
        }
      }
    };

    const tree = renderCollapsiblePanel(uiData);

    expect(tree.everySubTree('FakeReview').length).to.equal(0);
    expect(tree.everySubTree('FakeFields').length).to.equal(0);
    expect(tree.everySubTree('button').length).to.equal(1);
    expect(tree.everySubTree('button')[0].text()).to.equal('Edit');
  });
});
