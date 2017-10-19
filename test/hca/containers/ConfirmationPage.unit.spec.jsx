import React from 'react';
import { expect } from 'chai';
import SkinDeep from 'skin-deep';

import { ConfirmationPage } from '../../../src/js/hca/containers/ConfirmationPage';

describe('hca <ConfirmationPage>', () => {
  it('should render', () => {
    const form = {
      submission: {
        response: {
          timestamp: '2010-01-01',
          formSubmissionId: '3702390024'
        }
      },
      data: {
        veteranFullName: {
          first: 'Joe',
          middle: 'Marjorie',
          last: 'Smith',
          suffix: 'Sr.'
        }
      }
    };

    const tree = SkinDeep.shallowRender(
      <ConfirmationPage form={form}/>
    );

    expect(tree.subTree('.confirmation-page-title').text()).to.contain('Claim received');
    expect(tree.subTree('.claim-list')).to.exist;
    expect(tree.everySubTree('span')[2].text()).to.contain('Jan. 1, 2010');
    expect(tree.everySubTree('span')[3].text()).to.contain('3702390024');
    expect(tree.everySubTree('p')[0].text()).to.contain('We usually process claims within a week.');
    expect(tree.everySubTree('.confirmation-guidance-message')[0].text()).to.contain('Find out what happens after you apply.');
    expect(tree.everySubTree('.confirmation-guidance-message')[1].text()).to.contain('If you have questions, please call 1-877-222-VETS (8387) and press 2, Monday - Friday, 8:00 a.m. - 7:00 p.m. (ET).');
  });
  it('should render without response properties', () => {
    const form = {
      submission: {
      },
      data: {
        veteranFullName: {
          first: 'Joe',
          middle: 'Marjorie',
          last: 'Smith',
          suffix: 'Sr.'
        }
      }
    };
    const tree = SkinDeep.shallowRender(
      <ConfirmationPage form={form}/>
    );
    expect(tree.subTree('.confirmation-page-title').text()).to.contain('Claim received');
    expect(tree.everySubTree('p')[0].text()).to.contain('We usually process claims within a week.');
    expect(tree.subTree('.claim-list')).to.be.false;
    expect(tree.everySubTree('.confirmation-guidance-message')[0].text()).to.contain('Find out what happens after you apply.');
    expect(tree.everySubTree('.confirmation-guidance-message')[1].text()).to.contain('If you have questions, please call 1-877-222-VETS (8387) and press 2, Monday - Friday, 8:00 a.m. - 7:00 p.m. (ET).');
  });
});
