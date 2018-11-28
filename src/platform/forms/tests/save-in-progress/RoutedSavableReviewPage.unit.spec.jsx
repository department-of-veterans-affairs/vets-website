import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import { RoutedSavableReviewPage } from '../../save-in-progress/RoutedSavableReviewPage';

describe('Schemaform save in progress: RoutedSavableReviewPage', () => {
  const location = {
    pathname: '/testing/0',
  };

  it('should render save links and downtime component', () => {
    const setData = sinon.spy();
    const onSubmit = sinon.spy();
    const router = {
      push: sinon.spy(),
    };
    const route = {
      path: 'testPage',
      pageList: [
        {
          path: 'previous-page',
        },
        {
          path: 'testing',
          pageKey: 'testPage',
        },
        {
          path: 'next-page',
        },
      ],
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
        openChapters={[]}
        form={form}
        user={user}
        onSubmit={onSubmit}
        setEditMode={f => f}
        setPrivacyAgreement={f => f}
        formConfig={route.formConfig}
        pageList={route.pageList}
        path={route.path}
        location={location}
      />,
    );

    expect(tree.find('SaveStatus').exists()).to.be.true;
    expect(tree.find('SaveFormLink').exists()).to.be.true;
    expect(tree.find('Connect(DowntimeNotification)').exists()).to.be.true;
    expect(tree.find('withRouter(Connect(SubmitController))').exists()).to.be
      .true;
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

    const pageList = [
      {
        path: 'previous-page',
      },
      {
        path: 'next-page',
      },
    ];

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
        pageList={pageList}
        setPrivacyAgreement={f => f}
        location={location}
      />,
    );

    const instance = tree.instance();
    instance.debouncedAutoSave = autoSave;

    instance.debouncedAutoSave();

    expect(autoSave.called).to.be.true;
  });

  describe('downtime banner', () => {
    const setData = sinon.spy();
    const onSubmit = sinon.spy();
    const router = {
      push: sinon.spy(),
    };
    const route = {
      path: 'testPage',
      pageList: [
        {
          path: 'previous-page',
        },
        {
          path: 'testing',
          pageKey: 'testPage',
        },
        {
          path: 'next-page',
        },
      ],
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

    const tree = shallow(
      <RoutedSavableReviewPage
        router={router}
        setData={setData}
        openChapters={[]}
        form={form}
        user={user}
        onSubmit={onSubmit}
        setEditMode={f => f}
        setPrivacyAgreement={f => f}
        formConfig={route.formConfig}
        pageList={route.pageList}
        path={route.path}
        location={location}
      />,
    );

    it('should not be displayed when service is up', () => {
      const submit = shallow(
        tree
          .instance()
          .renderDowntime({ status: 'up' }, <span className="not-down" />),
      );

      expect(submit.find('.not-down').exists()).to.be.true;
      expect(submit.find('AlertBox').exists()).to.be.false;
    });

    it('should be displayed when service is down', () => {
      const submit = shallow(
        tree
          .instance()
          .renderDowntime({ status: 'down' }, <span className="not-down" />),
      );

      expect(submit.find('.not-down').exists()).to.be.false;
      expect(submit.find('AlertBox').exists()).to.be.true;
    });
  });
});
