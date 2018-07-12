import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import { RoutedSavableSinglePageForm } from '../../../0993/containers/RoutedSavableSinglePageForm';

describe('Schemaform <RoutedSavableSinglePageForm>', () => {
  const location = {
    pathname: '/testing/0'
  };

  xit('should include SaveLink and SaveStatus', () => {
    const route = {
      pageConfig: {
        pageKey: 'testPage',
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
          uiSchema: {},
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
      <RoutedSavableSinglePageForm form={form} route={route} user={user} location={location}/>
    ).find('SinglePageForm').dive();


    expect(tree.find('SaveStatus').exists()).to.be.true;
    expect(tree.find('SaveFormLink').exists()).to.be.true;
  });

  it('should auto save on change', () => {
    const route = {
      pageConfig: {
        pageKey: 'testPage',
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
          uiSchema: {},
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
      <RoutedSavableSinglePageForm setData={setData} form={form} route={route} user={user} location={location} autoSave={autosave}/>
    );
    tree.instance().debouncedAutoSave = autosave;

    tree.instance().onChange({ tests: 1 });
    expect(autosave.called).to.be.true;
    expect(setData.called).to.be.true;
  });
});
