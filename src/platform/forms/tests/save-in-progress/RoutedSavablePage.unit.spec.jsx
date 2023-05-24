import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import { RoutedSavablePage } from '../../save-in-progress/RoutedSavablePage';

describe('Schemaform <RoutedSavablePage>', () => {
  const location = {
    pathname: '/testing/0',
  };

  let formConfigDefaultData;

  beforeEach(() => {
    formConfigDefaultData = {
      customText: {
        finishAppLaterMessage: '',
      },
    };
  });

  it('should include SaveLink and SaveStatus', () => {
    const route = {
      pageConfig: {
        pageKey: 'testPage',
        schema: {},
        uiSchema: {},
        errorMessages: {},
        title: '',
      },
      pageList: [
        {
          path: 'testing',
        },
      ],
    };
    const form = {
      disableSave: false,
      pages: {
        testPage: {
          schema: {},
          uiSchema: {},
        },
      },
      data: {},
    };
    const user = {
      profile: {
        savedForms: [],
      },
      login: {
        currentlyLoggedIn: true,
      },
    };

    const tree = shallow(
      <RoutedSavablePage
        form={form}
        route={route}
        user={user}
        location={location}
        formConfig={formConfigDefaultData}
      />,
    )
      .find('FormPage')
      .dive();

    expect(tree.find('SaveStatus').exists()).to.be.true;
    expect(tree.find('SaveFormLink').exists()).to.be.true;
    tree.unmount();
  });

  it('should display the finishAppLaterMessage if passed in', () => {
    const route = {
      pageConfig: {
        pageKey: 'testPage',
        schema: {},
        uiSchema: {},
        errorMessages: {},
        title: '',
      },
      pageList: [
        {
          path: 'testing',
        },
      ],
    };
    const form = {
      disableSave: false,
      pages: {
        testPage: {
          schema: {},
          uiSchema: {},
        },
      },
      data: {},
    };
    const user = {
      profile: {
        savedForms: [],
      },
      login: {
        currentlyLoggedIn: true,
      },
    };

    const finishLaterLinkFormConfigData = {
      ...formConfigDefaultData,
      customText: {
        finishAppLaterMessage:
          'Custom finish this application another time message.',
      },
    };

    const tree = shallow(
      <RoutedSavablePage
        form={form}
        route={route}
        user={user}
        location={location}
        formConfig={finishLaterLinkFormConfigData}
      />,
    )
      .find('FormPage')
      .dive();

    expect(tree.find('SaveFormLink').exists()).to.be.true;
    expect(
      tree
        .find('SaveFormLink')
        .children()
        .text(),
    ).to.equal('Custom finish this application another time message.');
    tree.unmount();
  });

  it('should auto save on change', () => {
    const route = {
      pageConfig: {
        pageKey: 'testPage',
        schema: {},
        uiSchema: {},
        errorMessages: {},
        title: '',
      },
      pageList: [
        {
          path: 'testing',
        },
      ],
    };
    const form = {
      disableSave: false,
      pages: {
        testPage: {
          schema: {},
          uiSchema: {},
        },
      },
      data: {},
    };
    const user = {
      profile: {
        savedForms: [],
      },
      login: {
        currentlyLoggedIn: true,
      },
    };
    const autosave = sinon.spy();
    const setData = sinon.spy();

    const tree = shallow(
      <RoutedSavablePage
        setData={setData}
        form={form}
        route={route}
        user={user}
        location={location}
        autoSave={autosave}
        formConfig={formConfigDefaultData}
      />,
    );
    tree.instance().debouncedAutoSave = autosave;

    tree.instance().onChange({ tests: 1 });
    expect(autosave.called).to.be.true;
    expect(setData.called).to.be.true;
    tree.unmount();
  });

  it('should auto save and include returnUrl from page config on change', () => {
    const route = {
      pageConfig: {
        pageKey: 'testPage',
        schema: {},
        uiSchema: {},
        errorMessages: {},
        title: '',
        returnUrl: '/testing2',
      },
      pageList: [
        {
          path: 'testing',
        },
      ],
    };
    const form = {
      disableSave: false,
      pages: {
        testPage: {
          schema: {},
          uiSchema: {},
        },
      },
      data: {},
    };
    const user = {
      profile: {
        savedForms: [],
      },
      login: {
        currentlyLoggedIn: true,
      },
    };
    const autoSaveForm = sinon.spy();
    const setData = sinon.spy();

    const tree = shallow(
      <RoutedSavablePage
        setData={setData}
        form={form}
        route={route}
        user={user}
        location={location}
        autoSaveForm={autoSaveForm}
        formConfig={formConfigDefaultData}
      />,
    );
    tree.instance().debouncedAutoSave = tree.instance().autoSave;

    tree.instance().onChange({ tests: 1 });
    expect(autoSaveForm.called).to.be.true;
    expect(autoSaveForm.args[0][3]).to.eq('/testing2');
    expect(setData.called).to.be.true;
    tree.unmount();
  });
});
