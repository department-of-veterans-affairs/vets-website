import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';

import ClaimsListItem from '../../components/ClaimsListItem';

describe('<ClaimsListItem>', () => {
  test('should not show any flags', () => {
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
  test('should show closed status', () => {
    const claim = {
      id: 1,
      attributes: {
        phase: 8
      }
    };

    const tree = SkinDeep.shallowRender(
      <ClaimsListItem
        claim={claim}/>
    );
    expect(tree.subTree('.status').text()).to.equal('Status: Closed');
  });
  test('should show the status', () => {
    const claim = {
      id: 1,
      attributes: {
        phase: 2
      }
    };

    const tree = SkinDeep.shallowRender(
      <ClaimsListItem
        claim={claim}/>
    );
    expect(tree.subTree('.status').text()).to.equal('Status: Initial review');
  });
  test('should show development letter flag', () => {
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
  test('should show decision letter flag', () => {
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
  test('should show items needed flag', () => {
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
  test('should hide flags when complete', () => {
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
