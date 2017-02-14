import React from 'react';
import { expect } from 'chai';
import SkinDeep from 'skin-deep';

import { ConfirmationPage } from '../../../../src/js/edu-benefits/1995/containers/ConfirmationPage';

describe('<ConfirmationPage>', () => {
  it('should render', () => {
    const form = {
      submission: {
        response: {
          attributes: {

          }
        }
      },
      veteranInformation: {
        data: {
          veteranFullName: {
            first: 'Jane',
            last: 'Doe'
          }
        }
      },
      benefitSelection: {
        data: {
          benefit: 'chapter30'
        }
      }
    };

    const tree = SkinDeep.shallowRender(
      <ConfirmationPage form={form}/>
    );

    expect(tree.subTree('.edu-page-title').text()).to.equal('Claim received');
    expect(tree.everySubTree('span')[1].text().trim()).to.equal('for Jane Doe');
  });
  it('should expand documents', () => {
    const form = {
      submission: {
        response: {
          attributes: {

          }
        }
      },
      veteranInformation: {
        data: {
          veteranFullName: {
            first: 'Jane',
            last: 'Doe'
          }
        }
      },
      benefitSelection: {
        data: {
          benefit: 'chapter30'
        }
      }
    };

    const tree = SkinDeep.shallowRender(
      <ConfirmationPage form={form}/>
    );

    expect(tree.subTree('ExpandingGroup').props.open).to.be.false;

    tree.getMountedInstance().handleClick({ preventDefault: f => f });

    expect(tree.subTree('ExpandingGroup').props.open).to.be.true;
  });
});
