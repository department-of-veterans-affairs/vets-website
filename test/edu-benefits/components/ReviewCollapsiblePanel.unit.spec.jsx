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
          editOnReview: false
        },
        '/personal-information/contact-information': {
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
        '/school-selection/school-information': {
          editOnReview: false
        },
        '/personal-information/contact-information': {
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
        '/school-selection/school-information': {
          editOnReview: false
        },
        '/personal-information/contact-information': {
          editOnReview: false
        },
        '/personal-information/secondary-contact': {
          editOnReview: false
        }
      }
    };

    const tree = renderCollapsiblePanel(uiData, '/personal-information/secondary-contact');

    expect(tree.everySubTree('FakeReview').length).to.equal(0);
    expect(tree.everySubTree('FakeFields').length).to.equal(0);
    expect(tree.everySubTree('button').length).to.equal(1);
  });
  it('should expand when clicked', () => {
    const uiData = {
      pages: {
        '/school-selection/school-information': {
          editOnReview: false
        },
        '/personal-information/contact-information': {
          editOnReview: false
        },
        '/personal-information/secondary-contact': {
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
