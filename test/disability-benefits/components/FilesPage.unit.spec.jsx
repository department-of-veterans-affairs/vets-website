import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';
import sinon from 'sinon';

import { FilesPage } from '../../../src/js/disability-benefits/containers/FilesPage';

describe('<FilesPage>', () => {
  it('should render notification', () => {
    const claim = {};

    const tree = SkinDeep.shallowRender(
      <FilesPage
          loading
          message={{ title: 'Test', body: 'Body' }}
          claim={claim}/>
    );
    expect(tree.props.message).not.to.be.null;
  });
  it('should display no documents messages', () => {
    const claim = {
      attributes: {
        eventsTimeline: []
      }
    };

    const tree = SkinDeep.shallowRender(
      <FilesPage
          claim={claim}/>
    );
    expect(tree.everySubTree('.no-documents')).not.to.be.empty;
    expect(tree.everySubTree('.no-documents-turned-in')).not.to.be.empty;
  });
  it('should display requested items', () => {
    const claim = {
      attributes: {
        eventsTimeline: [{
          type: 'still_need_from_you_list',
          displayName: 'Request 1',
          description: 'Some description',
          status: 'NEEDED'
        }]
      }
    };

    const tree = SkinDeep.shallowRender(
      <FilesPage
          claim={claim}/>
    );
    expect(tree.everySubTree('.file-request-list-item')).not.to.be.empty;
    expect(tree.everySubTree('.file-request-list-item')[0].text()).to.contain(claim.attributes.eventsTimeline[0].displayName);
    expect(tree.everySubTree('.file-request-list-item')[0].text()).to.contain(claim.attributes.eventsTimeline[0].description);
    expect(tree.everySubTree('.file-request-list-item')[0].text()).to.contain('<Link />');
  });
  it('should display optional files', () => {
    const claim = {
      attributes: {
        eventsTimeline: [{
          type: 'still_need_from_others_list',
          status: 'NEEDED'
        }]
      }
    };

    const tree = SkinDeep.shallowRender(
      <FilesPage
          claim={claim}/>
    );
    expect(tree.everySubTree('.file-request-list-item')).not.to.be.empty;
    expect(tree.everySubTree('.file-request-list-item')[0].text()).to.contain('we requested this from others');
    expect(tree.everySubTree('.file-request-list-item')[0].text()).to.contain('<Link />');
  });
  it('should display turned in docs', () => {
    const claim = {
      attributes: {
        eventsTimeline: [
          {
            type: 'received_from_you_list',
            documents: [{
              filename: 'Filename'
            }],
            trackedItemId: 2,
            status: 'ACCEPTED'
          },
        ]
      }
    };

    const tree = SkinDeep.shallowRender(
      <FilesPage
          claim={claim}/>
    );
    expect(tree.everySubTree('SubmittedTrackedItem').length).to.equal(1);
  });
  it('should display additional evidence docs', () => {
    const claim = {
      attributes: {
        eventsTimeline: [
          {
            filename: 'Filename',
            fileType: 'Testing',
            type: 'other_documents_list'
          }
        ]
      }
    };

    const tree = SkinDeep.shallowRender(
      <FilesPage
          claim={claim}/>
    );
    expect(tree.everySubTree('AdditionalEvidenceItem').length).to.equal(1);
  });
  it('should render decision message', () => {
    const claim = {
      attributes: {
        waiverSubmitted: true,
        eventsTimeline: [{
          type: 'still_need_from_you_list',
          status: 'NEEDED'
        }]
      }
    };

    const tree = SkinDeep.shallowRender(
      <FilesPage
          claim={claim}/>
    );
    expect(tree.everySubTree('.va-to-make-decision')).not.to.be.empty;
  });
  it('should clear alert', () => {
    const claim = {
      attributes: {
        eventsTimeline: []
      }
    };
    const clearNotification = sinon.spy();
    const message = {
      title: 'Test',
      body: 'Test'
    };

    const tree = SkinDeep.shallowRender(
      <FilesPage
          clearNotification={clearNotification}
          message={message}
          claim={claim}/>
    );
    expect(clearNotification.called).to.be.false;
    tree.subTree('ClaimDetailLayout').props.clearNotification();
    expect(clearNotification.called).to.be.true;
  });
  it('should clear notification when leaving', () => {
    const claim = {
      attributes: {
        eventsTimeline: []
      }
    };
    const clearNotification = sinon.spy();
    const message = {
      title: 'Test',
      body: 'Test'
    };

    const tree = SkinDeep.shallowRender(
      <FilesPage
          clearNotification={clearNotification}
          message={message}
          claim={claim}/>
    );
    expect(clearNotification.called).to.be.false;
    tree.getMountedInstance().componentWillUnmount();
    expect(clearNotification.called).to.be.true;
  });
});
