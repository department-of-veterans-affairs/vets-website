import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import { SET_DATA } from 'platform/forms-system/src/js/actions';
import { fireEvent, render } from '@testing-library/react';
import { BackLinkImpl } from '../../../src/js/components/BackLink';

const mockRedux = (formData, setFormData) => {
  const review = false;
  const submitted = false;
  const onChange = () => {};

  return {
    props: {
      onChange,
      formContext: {
        onReviewPage: review,
        reviewMode: review,
        submitted,
      },
      formData,
      setFormData,
    },
    mockStore: {
      getState: () => ({
        form: { data: formData },
        formContext: {
          onReviewPage: false,
          reviewMode: false,
          submitted: false,
          touched: {},
        },
      }),
      subscribe: () => {},
      dispatch: action => {
        if (action.type === SET_DATA) {
          return setFormData(action.data);
        }
        return null;
      },
    },
  };
};

let setFormData;

function setupBackLink({ pageConfig = {}, location, pageList, formData }) {
  setFormData = sinon.spy();
  const routerPush = sinon.spy();
  const { mockStore } = mockRedux(formData, setFormData);

  const mockRoutes = [
    {
      path: 'introduction',
      pageList,
    },
    {
      path: pageConfig.path,
      pageList,
      pageConfig,
    },
    {
      path: 'summary',
      pageList,
    },
  ];

  const mockRouter = {
    params: {
      index: 0,
    },
    push: routerPush,
  };

  const { container, getByText } = render(
    <Provider store={mockStore}>
      <BackLinkImpl
        form={{ data: formData }} // typically injected by connect
        setData={setFormData} // typically injected by connect
        router={mockRouter} // typically injected by withRouter
        routes={mockRoutes} // typically injected by withRouter
        location={location} // typically injected by withRouter
      />
    </Provider>,
  );

  return { setFormData, container, routerPush, getByText };
}

const PAGE_CONFIG_STATEMENT_TYPE = {
  path: 'statement-type',
};

const PAGE_CONFIG_INTRODUCTION = {
  path: 'introduction',
};

const LOCATION_STATEMENT_TYPE = {
  pathname: '/statement-type',
  query: {},
};

const LOCATION_INTRODUCTION = {
  pathname: '/introduction',
  query: {},
};

const DEFAULT_PAGE_LIST = [
  {
    pageKey: 'introduction',
    path: '/introduction',
  },
  {
    path: '/statement-type',
    pageKey: 'statementTypePage',
  },
  {
    pageKey: 'review-and-submit',
    path: '/review-and-submit',
    chapterKey: 'review',
  },
];

describe('BackLink', () => {
  it('should go back to the previous page if on the second page', () => {
    const pageConfig = PAGE_CONFIG_STATEMENT_TYPE;
    const location = LOCATION_STATEMENT_TYPE;
    const pageList = DEFAULT_PAGE_LIST;

    const { container, routerPush } = setupBackLink({
      pageConfig,
      location,
      pageList,
      formData: {},
    });
    const link = container.querySelector('va-link');
    expect(link).to.have.attribute('href', '/introduction');
    fireEvent.click(link);
    expect(routerPush.calledWith('/introduction')).to.be.true;
  });

  it('should not render if on the first page', () => {
    const pageConfig = PAGE_CONFIG_INTRODUCTION;
    const location = LOCATION_INTRODUCTION;
    const pageList = DEFAULT_PAGE_LIST;

    const { container } = setupBackLink({
      pageConfig,
      location,
      pageList,
      formData: {},
    });
    const link = container.querySelector('va-link');
    expect(link).to.not.exist;
  });

  it('should respect custom onNavBack', () => {
    const customOnNavBack = sinon.spy();
    const pageConfig = {
      ...PAGE_CONFIG_STATEMENT_TYPE,
      onNavBack: customOnNavBack,
    };
    const location = LOCATION_STATEMENT_TYPE;
    const pageList = DEFAULT_PAGE_LIST;

    const { container } = setupBackLink({
      pageConfig,
      location,
      pageList,
      formData: {},
    });
    const link = container.querySelector('va-link');
    expect(link).to.have.attribute('href', '#');
    fireEvent.click(link);
    expect(customOnNavBack.called).to.be.true;
  });
});
