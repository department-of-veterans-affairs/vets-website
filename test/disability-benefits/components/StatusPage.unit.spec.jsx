import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';

import { StatusPage } from '../../../src/js/disability-benefits/containers/StatusPage';

describe('<StatusPage>', () => {
  it('should render page with no alerts and a timeline', () => {
    const claim = {
      attributes: {
        phase: 2,
        documentsNeeded: false,
        decisionLetterSent: false,
        waiverSubmitted: true
      }
    };

    const tree = SkinDeep.shallowRender(
      <StatusPage
          claim={claim}/>
    );
    expect(tree.subTree('NeedFilesFromYou')).to.be.false;
    expect(tree.subTree('AskVAToDecide')).to.be.false;
    expect(tree.subTree('ClaimsDecision')).to.be.false;
    expect(tree.subTree('ClaimsTimeline')).not.to.be.false;
  });
  it('should render need files from you component', () => {
    const claim = {
      attributes: {
        phase: 2,
        documentsNeeded: true,
        decisionLetterSent: false,
        waiverSubmitted: true
      }
    };

    const tree = SkinDeep.shallowRender(
      <StatusPage
          claim={claim}/>
    );
    expect(tree.subTree('NeedFilesFromYou')).not.to.be.false;
  });
  it('should render ask va to decide component', () => {
    const claim = {
      id: 1,
      attributes: {
        phase: 3,
        documentsNeeded: false,
        decisionLetterSent: false,
        waiverSubmitted: false
      }
    };

    const tree = SkinDeep.shallowRender(
      <StatusPage
          params={{ id: 2 }}
          claim={claim}/>
    );
    expect(tree.everySubTree('AskVAToDecide')).not.to.be.empty;
  });
  it('should render claims decision alert', () => {
    const claim = {
      attributes: {
        phase: 5,
        documentsNeeded: false,
        decisionLetterSent: true,
        waiverSubmitted: true
      }
    };

    const tree = SkinDeep.shallowRender(
      <StatusPage
          claim={claim}/>
    );
    expect(tree.everySubTree('ClaimsDecision')).not.to.be.empty;
  });
  it('should not render timeline without a phase', () => {
    const claim = {
      attributes: {
        phase: null,
        documentsNeeded: false,
        decisionLetterSent: false,
        waiverSubmitted: true
      }
    };

    const tree = SkinDeep.shallowRender(
      <StatusPage
          claim={claim}/>
    );
    expect(tree.everySubTree('ClaimsTimeline')).to.be.empty;
  });
  it('should render empty content when loading', () => {
    const claim = {
    };

    const tree = SkinDeep.shallowRender(
      <StatusPage
          loading
          claim={claim}/>
    );
    expect(tree.props.children).to.be.null;
  });
});
