import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';

import ClaimDetailLayout from '../../../src/js/disability-benefits/components/ClaimDetailLayout';

describe('<ClaimDetailLayout>', () => {
  it('should render loading indicator', () => {
    const tree = SkinDeep.shallowRender(
      <ClaimDetailLayout
          loading/>
    );

    expect(tree.everySubTree('LoadingIndicator')).not.to.be.empty;
  });
  it('should render contention list', () => {
    const claim = {
      attributes: {
        contentionList: [
          'Condition 1',
          'Condition 2'
        ]
      }
    };

    const tree = SkinDeep.shallowRender(
      <ClaimDetailLayout
          claim={claim}/>
    );

    expect(tree.subTree('.list').text()).to.contain('Condition 1, Condition 2');
  });
  it('should render not available if no contention list', () => {
    const claim = {
      attributes: {
        contentionList: [
        ]
      }
    };

    const tree = SkinDeep.shallowRender(
      <ClaimDetailLayout
          claim={claim}/>
    );

    expect(tree.subTree('.list').text()).to.contain('Not available');
  });
  it('should render adding details info', () => {
    const claim = {
      attributes: {
        contentionList: [
          'Condition 1',
          'Condition 2'
        ]
      }
    };

    const tree = SkinDeep.shallowRender(
      <ClaimDetailLayout
          claim={claim}/>
    );

    expect(tree.everySubTree('AddingDetails')).not.to.be.empty;
  });
  it('should render normal info', () => {
    const claim = {
      attributes: {
        claimType: 'Compensation',
        dateFiled: '2010-05-05',
        vaRepresentative: 'Somebody',
        contentionList: [
          'Condition 1',
          'Condition 2'
        ]
      }
    };

    const tree = SkinDeep.shallowRender(
      <ClaimDetailLayout
          claim={claim}>
        <div className="child-content"/>
      </ClaimDetailLayout>
    );

    expect(tree.everySubTree('AddingDetails')).to.be.empty;
    expect(tree.everySubTree('.child-content')).not.to.be.empty;
  });
  it('should render message', () => {
    const claim = {
      attributes: {
        contentionList: [
          'Condition 1',
          'Condition 2'
        ]
      }
    };
    const message = {
      title: 'Test',
      body: 'Testing'
    };

    const tree = SkinDeep.shallowRender(
      <ClaimDetailLayout
          message={message}
          claim={claim}/>
    );

    expect(tree.subTree('Notification')).not.to.be.false;
  });
});
