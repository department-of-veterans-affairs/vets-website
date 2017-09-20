import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';

import SubmittedTrackedItem from '../../../src/js/disability-benefits/components/SubmittedTrackedItem';

describe('<SubmittedTrackedItem>', () => {
  it('should render submitted item with no docs', () => {
    const item = {
      trackedItemId: 1,
      displayName: 'Request 1',
      date: '2010-01-01',
      description: 'Testing',
      type: 'received_from_you_list',
      status: 'SUBMITTED_AWAITING_REVIEW'
    };

    const tree = SkinDeep.shallowRender(
      <SubmittedTrackedItem
        item={item}/>
    );

    expect(tree.subTree('.submission-file-type').text()).to.equal(item.displayName);
    expect(tree.subTree('.submitted-file-list-item').text()).to.contain(item.description);
    expect(tree.subTree('.submitted-file-list-item').text()).to.contain('Submitted');
    expect(tree.everySubTree('.submission-item')).to.be.empty;
  });
  it('should render item with doc', () => {
    const item = {
      trackedItemId: 1,
      displayName: 'Request 1',
      date: '2010-01-01',
      description: 'Testing',
      type: 'received_from_you_list',
      status: 'SUBMITTED_AWAITING_REVIEW',
      documents: [
        {
          filename: 'testfile.pdf',
          fileType: 'Test Type'
        }
      ]
    };

    const tree = SkinDeep.shallowRender(
      <SubmittedTrackedItem
        item={item}/>
    );

    expect(tree.everySubTree('.submission-item')).not.to.be.empty;
    expect(tree.subTree('.submission-item').text()).contain('File: testfile.pdf');
    expect(tree.subTree('.submission-item').text()).contain('Type: Test Type');
  });
  it('should render item with multiple docs', () => {
    const item = {
      trackedItemId: 1,
      displayName: 'Request 1',
      date: '2010-01-01',
      description: 'Testing',
      type: 'received_from_you_list',
      status: 'SUBMITTED_AWAITING_REVIEW',
      documents: [
        {
          filename: 'testfile.pdf',
          fileType: 'Test Type'
        },
        {
          filename: 'testfile2.pdf',
          fileType: 'Test 2 Type'
        }
      ]
    };

    const tree = SkinDeep.shallowRender(
      <SubmittedTrackedItem
        item={item}/>
    );

    expect(tree.everySubTree('.submission-item').length).to.equal(2);
  });
  it('should render reviewed item', () => {
    const item = {
      trackedItemId: 1,
      displayName: 'Request 1',
      date: '2010-01-01',
      description: 'Testing',
      type: 'received_from_you_list',
      status: 'ACCEPTED',
      documents: [
        {
          filename: 'testfile.pdf',
          fileType: 'Test Type'
        }
      ]
    };

    const tree = SkinDeep.shallowRender(
      <SubmittedTrackedItem
        item={item}/>
    );

    expect(tree.subTree('.submitted-file-list-item').text()).to.contain('Reviewed by VA');
  });
  it('should render no longer needed item by type', () => {
    const item = {
      trackedItemId: 1,
      displayName: 'Request 1',
      date: '2010-01-01',
      description: 'Testing',
      type: 'never_received_from_you_list',
      status: 'ACCEPTED',
      documents: [
      ]
    };

    const tree = SkinDeep.shallowRender(
      <SubmittedTrackedItem
        item={item}/>
    );

    expect(tree.subTree('.submitted-file-list-item').text()).to.contain('No longer needed');
  });
  it('should render no longer needed item by status', () => {
    const item = {
      trackedItemId: 1,
      displayName: 'Request 1',
      date: '2010-01-01',
      description: 'Testing',
      type: 'still_need_from_you_list',
      status: 'NO_LONGER_REQUIRED',
      documents: [
      ]
    };

    const tree = SkinDeep.shallowRender(
      <SubmittedTrackedItem
        item={item}/>
    );

    expect(tree.subTree('.submitted-file-list-item').text()).to.contain('No longer needed');
  });
});
