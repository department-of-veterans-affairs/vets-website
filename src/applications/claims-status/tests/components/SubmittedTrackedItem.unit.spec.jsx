import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';

import SubmittedTrackedItem from '../../components/SubmittedTrackedItem';

describe('<SubmittedTrackedItem>', () => {
  it('should render submitted item with no docs', () => {
    const item = {
      id: 1,
      displayName: 'Request 1',
      date: '2010-01-01',
      description: 'Testing',
      type: 'received_from_you_list',
      status: 'SUBMITTED_AWAITING_REVIEW',
    };

    const tree = SkinDeep.shallowRender(<SubmittedTrackedItem item={item} />);

    expect(tree.subTree('.submission-file-type').text()).to.equal(
      item.displayName,
    );
    expect(tree.subTree('.submitted-file-list-item').text()).to.contain(
      item.description,
    );
    expect(tree.subTree('.submitted-file-list-item').text()).to.contain(
      'Submitted',
    );
    expect(tree.everySubTree('.submission-item')).to.be.empty;
  });

  it('should render item with doc', () => {
    const item = {
      id: 1,
      displayName: 'Request 1',
      description: 'Testing',
      status: 'SUBMITTED_AWAITING_REVIEW',
      documents: [
        {
          originalFileName: 'testfile.pdf',
          documentTypeLabel: 'Test Type',
        },
      ],
    };

    const tree = SkinDeep.shallowRender(<SubmittedTrackedItem item={item} />);

    expect(tree.everySubTree('.submission-description')).not.to.be.empty;
    expect(tree.everySubTree('.submission-description')[1].text()).contain(
      'File: testfile.pdf',
    );
    expect(tree.everySubTree('.submission-description')[1].text()).contain(
      'Type: Test Type',
    );
  });

  it('should render item with multiple docs', () => {
    const item = {
      id: 1,
      displayName: 'Request 1',
      description: 'Testing',
      status: 'SUBMITTED_AWAITING_REVIEW',
      documents: [
        {
          originalFileName: 'testfile.pdf',
          documentTypeLabel: 'Test Type',
        },
        {
          originalFileName: 'testfile2.pdf',
          documentTypeLabel: 'Test 2 Type',
        },
      ],
    };

    const tree = SkinDeep.shallowRender(<SubmittedTrackedItem item={item} />);

    // two docs plus one description
    expect(tree.everySubTree('.submission-description').length).to.equal(
      item.documents.length + 1,
    );
  });

  it('should render reviewed item', () => {
    const item = {
      id: 1,
      displayName: 'Request 1',
      description: 'Testing',
      status: 'ACCEPTED',
      documents: [
        {
          originalFileName: 'testfile.pdf',
          documentTypeLabel: 'Test Type',
        },
      ],
    };

    const tree = SkinDeep.shallowRender(<SubmittedTrackedItem item={item} />);

    expect(tree.subTree('.submitted-file-list-item').text()).to.contain(
      'Reviewed by VA',
    );
  });

  it('should render no longer needed item by status', () => {
    const item = {
      id: 1,
      displayName: 'Request 1',
      description: 'Testing',
      status: 'NO_LONGER_REQUIRED',
      documents: [],
    };

    const tree = SkinDeep.shallowRender(<SubmittedTrackedItem item={item} />);

    expect(tree.subTree('.submitted-file-list-item').text()).to.contain(
      'No longer needed',
    );
  });

  it('should mask filenames in DataDog (no PII)', () => {
    const item = {
      id: 1,
      displayName: 'Request 1',
      description: 'Testing',
      status: 'ACCEPTED',
      documents: [
        {
          originalFileName: 'testfile.pdf',
          documentTypeLabel: 'Test Type',
        },
      ],
    };

    const tree = SkinDeep.shallowRender(<SubmittedTrackedItem item={item} />);

    expect(
      tree.subTree('.submission-description').props['data-dd-privacy'],
    ).to.equal('mask');
    expect(
      tree.subTree('.submission-description-filename').props['data-dd-privacy'],
    ).to.equal('mask');
  });
});
