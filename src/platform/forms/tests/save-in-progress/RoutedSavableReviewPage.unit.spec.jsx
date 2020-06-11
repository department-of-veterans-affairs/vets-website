import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import { RoutedSavableReviewPage } from '../../save-in-progress/RoutedSavableReviewPage';

describe('Schemaform save in progress: RoutedSavableReviewPage', () => {
  const location = {
    pathname: '/testing/0',
  };

  const getProps = () => ({
    setData: sinon.spy(),
    onSubmit: sinon.spy(),
    router: {
      push: sinon.spy(),
    },
    route: {
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
    },
    form: {
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
    },
    user: {
      profile: {
        savedForms: [],
      },
      login: {
        currentlyLoggedIn: true,
      },
    },
  });

  it('should render ReviewChapters', () => {
    const { router, setData, form, user, onSubmit, route } = getProps();
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

    expect(tree.find('withRouter(Connect(ReviewChapters))').exists()).to.be
      .true;
    tree.unmount();
  });

  it('should render save links and downtime component', () => {
    const { router, setData, form, user, onSubmit, route } = getProps();
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
    tree.unmount();
  });

  it('should render error messages', () => {});

  describe('downtime banner', () => {
    let tree;
    beforeEach(() => {
      const { router, setData, form, user, onSubmit, route } = getProps();
      tree = shallow(
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
      expect(submit.find('AlertBox').exists()).to.be.true;
      submit.unmount();
    });
  });
});
