import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

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

  beforeEach(() => {
    minimalHeader = null;
  });

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
    minimalHeader = document.createElement('div');
    minimalHeader.id = 'header-minimal';
    document.body.appendChild(minimalHeader);

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
    treeWithMinimalHeader.unmount();
  });

  it('should not contain the h1 if header-minimal is not present', () => {
    const treeWithoutMinimalHeader = shallow(
      <ReviewPage
        form={form}
        openChapters={{}}
        route={{ formConfig, pageList }}
        setEditMode={f => f}
        setPreSubmit={f => f}
        location={location}
      />,
    );

    expect(treeWithoutMinimalHeader.find('h1').exists()).to.be.false;
    treeWithoutMinimalHeader.unmount();
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
