import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import { VerifiedReviewContainer } from '../../components/VerifiedReviewContainer.jsx';

describe('526EZ <VerifiedReviewContainer>', () => {
  const location = {
    pathname: '/testing/0'
  };

  it('should include VerifiedReviewPage, SaveLink, and SaveStatus when prefilled', () => {
    const route = {
      pageConfig: {
        chapterKey: 'reviewVeteranDetails',
        pageKey: 'veteranInformation',
        schema: {},
        uiSchema: {},
        errorMessages: {},
        title: ''
      },
      pageList: [
        {
          path: 'testing'
        }
      ]
    };
    const form = {
      disableSave: false,
      pages: {
        testPage: {
          schema: {},
          uiSchema: {}
        }
      },
      data: {
        prefilled: true
      }
    };
    const user = {
      profile: {
        savedForms: []
      },
      login: {
        currentlyLoggedIn: true
      }
    };

    const tree = shallow(
      <VerifiedReviewContainer
        form={form}
        route={route}
        user={user}
        location={location}/>
    );

    expect(tree.find('VerifiedReviewPage').exists()).to.be.true;
    expect(tree.find('SaveStatus').exists()).to.be.true;
    expect(tree.find('SaveFormLink').exists()).to.be.true;
  });

  it('should not include VerifiedReviewPage when not prefilled', () => {
    const route = {
      pageConfig: {
        chapterKey: 'reviewVeteranDetails',
        pageKey: 'veteranInformation',
        schema: {},
        uiSchema: {},
        errorMessages: {},
        title: ''
      },
      pageList: [
        {
          path: 'testing'
        }
      ]
    };
    const form = {
      disableSave: false,
      pages: {
        testPage: {
          schema: {},
          uiSchema: {}
        }
      },
      data: {}
    };
    const user = {
      profile: {
        savedForms: []
      },
      login: {
        currentlyLoggedIn: true
      }
    };

    const tree = shallow(
      <VerifiedReviewContainer
        form={form}
        route={route}
        user={user}
        location={location}/>
    );

    expect(tree.find('VerifiedReviewPage').exists()).to.be.false;
  });

  it('should auto save on change', () => {
    const route = {
      pageConfig: {
        chapterKey: 'reviewVeteranDetails',
        pageKey: 'veteranInformation',
        schema: {},
        uiSchema: {},
        errorMessages: {},
        title: ''
      },
      pageList: [
        {
          path: 'testing'
        }
      ]
    };
    const form = {
      disableSave: false,
      pages: {
        testPage: {
          schema: {},
          uiSchema: {}
        }
      },
      data: {}
    };
    const user = {
      profile: {
        savedForms: []
      },
      login: {
        currentlyLoggedIn: true
      }
    };
    const autosave = sinon.spy();
    const setData = sinon.spy();

    const tree = shallow(
      <VerifiedReviewContainer
        setData={setData}
        form={form}
        route={route}
        user={user}
        location={location}
        autoSave={autosave}/>
    );
    tree.instance().debouncedAutoSave = autosave;

    tree.instance().setData({ tests: 1 });
    expect(autosave.called).to.be.true;
    expect(setData.called).to.be.true;
  });
});
