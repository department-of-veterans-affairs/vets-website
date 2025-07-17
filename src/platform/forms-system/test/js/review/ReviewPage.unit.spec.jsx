import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import { cleanup } from '@testing-library/react';
import { ReviewPage } from '../../../src/js/review/ReviewPage';

describe('Schemaform review: ReviewPage', () => {
  let minimalHeader;

  const location = {
    pathname: '/testing/0',
  };

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
      path: 'testing',
      pageKey: 'testPage',
    },
    {
      path: 'next-page',
    },
  ];

  const form = {
    submission: {
      hasAttemptedSubmit: false,
    },
    data: {},
  };

  afterEach(() => {
    if (minimalHeader) {
      document.body.removeChild(minimalHeader);
      minimalHeader = null;
    }
    cleanup();
  });

  it('should render chapters', () => {
    const tree = shallow(
      <ReviewPage
        form={form}
        openChapters={{}}
        route={{ formConfig, pageList }}
        setEditMode={f => f}
        setPreSubmit={f => f}
        location={location}
      />,
    );
    expect(tree.find('withRouter(Connect(ReviewChapters))')).to.have.length(1);
    expect(tree.find('withRouter(Connect(SubmitController))')).to.have.length(
      1,
    );
    tree.unmount();
  });

  it('should render h1 header if minimal header is present', () => {
    const getElementByIdStub = sinon.stub(document, 'getElementById');
    getElementByIdStub.withArgs('header-minimal').returns({}); // truthy value

    const treeWithMinimalHeader = shallow(
      <ReviewPage
        form={form}
        openChapters={{}}
        route={{ formConfig, pageList }}
        setEditMode={f => f}
        setPreSubmit={f => f}
        location={location}
      />,
    );

    expect(treeWithMinimalHeader.find('h1').exists()).to.be.true;

    getElementByIdStub.restore();
    treeWithMinimalHeader.unmount();
  });

  it('should not contain the h1 if header-minimal is not present', () => {
    const getElementByIdStub = sinon.stub(document, 'getElementById');
    getElementByIdStub.withArgs('header-minimal').returns(null); // falsy value

    const treeWithMinimalHeader = shallow(
      <ReviewPage
        form={form}
        openChapters={{}}
        route={{ formConfig, pageList }}
        setEditMode={f => f}
        setPreSubmit={f => f}
        location={location}
      />,
    );

    expect(treeWithMinimalHeader.find('h1').exists()).to.be.false;

    getElementByIdStub.restore();
    treeWithMinimalHeader.unmount();
  });

  it('should appropriately render a downtime notification', () => {
    const tree = shallow(
      <ReviewPage
        form={form}
        openChapters={{}}
        route={{ formConfig, pageList }}
        setEditMode={f => f}
        setPreSubmit={f => f}
        location={location}
      />,
    );

    expect(tree.find('Connect(DowntimeNotification)')).to.have.length(1);
    tree.unmount();
  });
});
