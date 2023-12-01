import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import { RoutedSavableReviewPage } from '../../save-in-progress/RoutedSavableReviewPage';

describe('Schemaform save in progress: RoutedSavableReviewPage', () => {
  it('should render save links and downtime component', () => {
    const setData = sinon.spy();
    const onSubmit = sinon.spy();
    const router = {
      push: sinon.spy(),
    };
    const route = {
      path: 'testPage',
      formConfig: {
        chapters: {
          chapter1: {
            pages: {
              page1: {
                schema: {},
              },
            },
          },
          chapter2: {
            pages: {
              page2: {},
            },
          },
        },
      },
    };
    const form = {
      disableSave: false,
      submission: {
        hasAttemptedSubmit: false,
      },
      page1: {
        schema: {},
      },
      page2: {
        schema: {},
      },
      data: {
        privacyAgreementAccepted: true,
      },
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
      <RoutedSavableReviewPage
        router={router}
        setData={setData}
        form={form}
        user={user}
        onSubmit={onSubmit}
        setEditMode={f => f}
        setPrivacyAgreement={f => f}
        formConfig={route.formConfig}
        path={route.path}
      />,
    );

    expect(tree.find('SaveStatus').exists()).to.be.true;
    expect(tree.find('Connect(DowntimeNotification)').exists()).to.be.true;
    expect(tree.find('withRouter(Connect(SubmitController))').exists()).to.be
      .true;
    tree.unmount();
  });

  it('should auto save after change', () => {
    const formConfig = {
      chapters: {
        chapter1: {
          pages: {
            page1: {},
          },
        },
        chapter2: {
          pages: {
            page2: {},
          },
        },
      },
    };

    const form = {
      submission: {
        hasAttemptedSubmit: false,
      },
      data: {
        privacyAgreementAccepted: false,
      },
    };

    const user = {
      profile: {
        savedForms: [],
      },
      login: {
        currentlyLoggedIn: true,
      },
    };

    const autoSave = sinon.spy();

    const tree = shallow(
      <RoutedSavableReviewPage
        form={form}
        user={user}
        formConfig={formConfig}
        setPrivacyAgreement={f => f}
      />,
    );

    const instance = tree.instance();
    instance.debouncedAutoSave = autoSave;

    instance.debouncedAutoSave();

    expect(autoSave.called).to.be.true;
    tree.unmount();
  });

  it('should auto save and include returnUrl from page config after change', () => {
    const location = {
      pathname: '/testing',
    };
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

    const tree = shallow(
      <RoutedSavableReviewPage
        form={form}
        user={user}
        formConfig={{}}
        route={route}
        autoSaveForm={autoSaveForm}
        location={location}
        setPrivacyAgreement={f => f}
      />,
    );

    const instance = tree.instance();
    instance.debouncedAutoSave = instance.autoSave;

    instance.debouncedAutoSave();

    expect(autoSaveForm.called).to.be.true;
    expect(autoSaveForm.args[0][3]).to.eq('/testing2');
    tree.unmount();
  });

  describe('downtime banner', () => {
    const setData = sinon.spy();
    const onSubmit = sinon.spy();
    const router = {
      push: sinon.spy(),
    };
    const route = {
      path: 'testPage',
      formConfig: {
        downtime: {},
        chapters: {
          chapter1: {
            pages: {
              page1: {
                schema: {},
              },
            },
          },
          chapter2: {
            pages: {
              page2: {},
            },
          },
        },
      },
    };
    const form = {
      disableSave: false,
      submission: {
        hasAttemptedSubmit: false,
      },
      page1: {
        schema: {},
      },
      page2: {
        schema: {},
      },
      data: {
        privacyAgreementAccepted: true,
      },
    };

    const user = {
      profile: {
        savedForms: [],
      },
      login: {
        currentlyLoggedIn: true,
      },
    };

    let tree;
    beforeEach(() => {
      tree = shallow(
        <RoutedSavableReviewPage
          router={router}
          setData={setData}
          form={form}
          user={user}
          onSubmit={onSubmit}
          setEditMode={f => f}
          setPrivacyAgreement={f => f}
          formConfig={route.formConfig}
          path={route.path}
        />,
      );
    });
    afterEach(() => {
      tree.unmount();
    });

    it('should not be displayed when service is up', () => {
      const submit = shallow(
        tree
          .instance()
          .renderDowntime({ status: 'up' }, <span className="not-down" />),
      );

      expect(submit.find('.not-down').exists()).to.be.true;
      expect(submit.find('AlertBox').exists()).to.be.false;
      submit.unmount();
    });

    it('should be displayed when service is down', () => {
      const submit = shallow(
        tree
          .instance()
          .renderDowntime({ status: 'down' }, <span className="not-down" />),
      );

      expect(submit.find('.not-down').exists()).to.be.false;
      expect(submit.find('va-alert').exists()).to.be.true;
      submit.unmount();
    });
  });
});
