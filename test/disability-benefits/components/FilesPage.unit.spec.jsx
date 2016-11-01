import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';
import sinon from 'sinon';

import { FilesPage } from '../../../src/js/disability-benefits/containers/FilesPage';

describe('<FilesPage>', () => {
  it('should render evidence submitted component', () => {
    const claim = {};

    const tree = SkinDeep.shallowRender(
      <FilesPage
          loading
          uploadedItem="Test"
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
          description: 'Some description'
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
          type: 'still_need_from_others_list'
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
        eventsTimeline: [{
          type: 'received_from_you_list',
          documents: [{
            filename: 'Filename'
          }],
          status: 'ACCEPTED'
        }]
      }
    };

    const tree = SkinDeep.shallowRender(
      <FilesPage
          claim={claim}/>
    );
    expect(tree.everySubTree('.submitted-file-list-item')).not.to.be.empty;
    expect(tree.everySubTree('.submitted-file-list-item')[0].text()).to.contain('Filename');
    expect(tree.everySubTree('.submitted-file-list-item')[0].text()).to.contain('Reviewed by VA');
  });
  it('should render decision message', () => {
    const claim = {
      attributes: {
        waiverSubmitted: true,
        eventsTimeline: [{
          type: 'still_need_from_you_list'
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
    const clearUploadedItem = sinon.spy();

    const tree = SkinDeep.shallowRender(
      <FilesPage
          uploadedItem="Test"
          clearUploadedItem={clearUploadedItem}
          claim={claim}/>
    );
    expect(clearUploadedItem.called).to.be.false;
    tree.props.message.props.onClose();
    expect(clearUploadedItem.called).to.be.true;
  });
});
