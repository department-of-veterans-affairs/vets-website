import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';
import sinon from 'sinon';

import ReviewCollapsiblePanel from '../../../../src/js/edu-benefits/1990/components/ReviewCollapsiblePanel';
import { createVeteran } from '../../../../src/js/edu-benefits/1990/utils/veteran';

describe('<ReviewCollapsiblePanel>', () => {
  function renderCollapsiblePanel(uiData, path = 'personal-information/contact-information') {
    function FakeFields() {}
    function FakeReview() {}
    const data = createVeteran();
    const onFieldsInitialized = sinon.spy();
    const onUpdateSaveStatus = sinon.spy();
    const onUpdateVerifiedStatus = sinon.spy();
    const onUpdateEditStatus = sinon.spy();

    return SkinDeep.shallowRender(
      <ReviewCollapsiblePanel
          chapter="2"
          data={data}
          uiData={uiData}
          urlPrefix="/1990/"
          pages={
            [
              {
                name: 'Test',
                path,
                fieldsComponent: FakeFields,
                reviewComponent: FakeReview
              }
            ]
          }
          onStateChange={f => f}
          onFieldsInitialized={onFieldsInitialized}
          onUpdateSaveStatus={onUpdateSaveStatus}
          onUpdateVerifiedStatus={onUpdateVerifiedStatus}
          onUpdateEditStatus={onUpdateEditStatus}/>
    );
  }
  it('should render fields to update', () => {
    const uiData = {
      pages: {
        '/1990/school-selection/school-information': {
          editOnReview: false
        },
        '/1990/personal-information/contact-information': {
          editOnReview: true
        }
      }
    };

    const tree = renderCollapsiblePanel(uiData);
    tree.getMountedInstance().toggleChapter();

    expect(tree.everySubTree('FakeFields').length).to.equal(1);
    expect(tree.everySubTree('button')[1].text()).to.equal('Update page');
  });
  it('should render review fields', () => {
    const uiData = {
      pages: {
        '/1990/school-selection/school-information': {
          editOnReview: false
        },
        '/1990/personal-information/contact-information': {
          editOnReview: false
        }
      }
    };

    const tree = renderCollapsiblePanel(uiData);
    tree.getMountedInstance().toggleChapter();

    expect(tree.everySubTree('FakeReview').length).to.equal(1);
    expect(tree.everySubTree('button')[1].text()).to.equal('Edit');
  });
  it('should render nothing', () => {
    const uiData = {
      pages: {
        '/1990/school-selection/school-information': {
          editOnReview: false
        },
        '/1990/personal-information/contact-information': {
          editOnReview: false
        },
        '/1990/personal-information/secondary-contact': {
          editOnReview: false
        }
      }
    };

    const tree = renderCollapsiblePanel(uiData, 'personal-information/secondary-contact');

    expect(tree.everySubTree('FakeReview').length).to.equal(0);
    expect(tree.everySubTree('FakeFields').length).to.equal(0);
    expect(tree.everySubTree('button').length).to.equal(1);
  });
  it('should expand when clicked', () => {
    const uiData = {
      pages: {
        '/1990/school-selection/school-information': {
          editOnReview: false
        },
        '/1990/personal-information/contact-information': {
          editOnReview: false
        },
        '/1990/personal-information/secondary-contact': {
          editOnReview: false
        }
      }
    };

    const tree = renderCollapsiblePanel(uiData);

    expect(tree.everySubTree('FakeReview').length).to.equal(0);
    tree.getMountedInstance().toggleChapter();
    expect(tree.everySubTree('FakeReview').length).to.equal(1);
  });
});
