import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';

import ClaimsListItem from '../../../src/js/disability-benefits/components/ClaimsListItem';

describe('<ClaimsListItem>', () => {
  it('should not show any flags', () => {
    const claim = {
      id: 1,
      attributes: {
        phase: 2,
        decisionLetterSent: false,
        developmentLetterSent: false,
        documentsNeeded: false
      }
    };

    const tree = SkinDeep.shallowRender(
      <ClaimsListItem
          claim={claim}/>
    );
    expect(tree.subTree('.communications').text()).to.equal('');
  });
  it('should show development letter flag', () => {
    const claim = {
      id: 1,
      attributes: {
        phase: 2,
        decisionLetterSent: false,
        developmentLetterSent: true,
        documentsNeeded: false
      }
    };

    const tree = SkinDeep.shallowRender(
      <ClaimsListItem
          claim={claim}/>
    );
    expect(tree.subTree('.communications').text()).to.contain('We sent you a development letter');
  });
  it('should show decision letter flag', () => {
    const claim = {
      id: 1,
      attributes: {
        phase: 2,
        decisionLetterSent: true,
        developmentLetterSent: true,
        documentsNeeded: false
      }
    };

    const tree = SkinDeep.shallowRender(
      <ClaimsListItem
          claim={claim}/>
    );
    expect(tree.subTree('.communications').text()).to.contain('We sent you a decision letter');
  });
  it('should show items needed flag', () => {
    const claim = {
      id: 1,
      attributes: {
        phase: 2,
        decisionLetterSent: false,
        developmentLetterSent: false,
        documentsNeeded: true
      }
    };

    const tree = SkinDeep.shallowRender(
      <ClaimsListItem
          claim={claim}/>
    );
    expect(tree.subTree('.communications').text()).to.contain('Items need attention');
  });
  it('should hide flags when complete', () => {
    const claim = {
      id: 1,
      attributes: {
        phase: 8,
        decisionLetterSent: false,
        developmentLetterSent: true,
        documentsNeeded: true
      }
    };

    const tree = SkinDeep.shallowRender(
      <ClaimsListItem
          claim={claim}/>
    );
    expect(tree.subTree('.communications').text()).to.equal('');
  });
});
