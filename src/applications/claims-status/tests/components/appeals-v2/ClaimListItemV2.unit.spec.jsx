import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import ClaimsListItemV2 from '../../../components/appeals-v2/ClaimsListItemV2';


describe('<ClaimsListItemV2>', () => {
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
    const tree = shallow(<ClaimsListItemV2 claim={claim}/>);
    expect(tree.find('.communications').text()).to.equal('');
  });

  test('should show closed status', () => {
    const claim = {
      id: 1,
      attributes: {
        phase: 8
      }
    };
    const tree = shallow(<ClaimsListItemV2 claim={claim}/>);
    expect(tree.find('.status-circle + p').first().text()).to.equal('Status: Closed');
  });

  test('should show the status', () => {
    const claim = {
      id: 1,
      attributes: {
        phase: 2
      }
    };
    const tree = shallow(<ClaimsListItemV2 claim={claim}/>);
    expect(tree.find('.status-circle + p').first().text()).to.equal('Status: Initial review');
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
    const tree = shallow(<ClaimsListItemV2 claim={claim}/>);
    expect(tree.find('.communications').text()).to.contain('We sent you a development letter');
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
    const tree = shallow(<ClaimsListItemV2 claim={claim}/>);
    expect(tree.find('.communications').text()).to.contain('We sent you a decision letter');
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
    const tree = shallow(<ClaimsListItemV2 claim={claim}/>);
    expect(tree.find('.communications').text()).to.contain('Items need attention');
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
    const tree = shallow(<ClaimsListItemV2 claim={claim}/>);
    expect(tree.find('.communications').text()).to.equal('');
  });

  test('should render a status circle with the `open` class', () => {
    const claim = {
      id: 1,
      attributes: {
        phase: 2,
        open: true
      }
    };
    const tree = shallow(<ClaimsListItemV2 claim={claim}/>);
    const circle = tree.find('.status-circle').first();
    expect(circle.hasClass('open')).to.be.true;
    expect(circle.hasClass('closed')).to.be.false;
  });

  test('should render a status circle with the `closed` class', () => {
    const claim = {
      id: 1,
      attributes: {
        phase: 8,
        open: false
      }
    };
    const tree = shallow(<ClaimsListItemV2 claim={claim}/>);
    const circle = tree.find('.status-circle').first();
    expect(circle.hasClass('open')).to.be.false;
    expect(circle.hasClass('closed')).to.be.true;
  });

  test('should render a link to the claim status page', () => {
    const claim = {
      id: 1,
      attributes: {
        phase: 8,
        open: false
      }
    };
    const tree = shallow(<ClaimsListItemV2 claim={claim}/>);
    expect(tree.find('Link').first().props().to).to.equal(`your-claims/${claim.id}/status`);
  });
});
