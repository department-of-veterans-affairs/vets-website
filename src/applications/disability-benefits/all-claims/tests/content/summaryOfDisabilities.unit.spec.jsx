import { expect } from 'chai';
import { render, within } from '@testing-library/react';
import { SummaryOfDisabilitiesDescription } from '../../content/summaryOfDisabilities';
import { NULL_CONDITION_STRING } from '../../constants';

describe('summaryOfDisabilitiesDescription', () => {
  it('renders selected rated disabilities', () => {
    const formData = {
      newDisabilities: [],
      ratedDisabilities: [
        {
          'view:selected': true,
          name: 'condition 1',
        },
        {
          'view:selected': true,
          name: undefined,
        },
      ],
      'view:claimType': {
        'view:claimingIncrease': true,
        'view:claimingNew': false,
      },
    };

    const tree = render(SummaryOfDisabilitiesDescription({ formData }));
    tree.getByText('Condition 1');
    tree.getByText(NULL_CONDITION_STRING);
  });

  it('does not render unselected rated disabilities', () => {
    const formData = {
      newDisabilities: [],
      ratedDisabilities: [
        {
          'view:selected': true,
          name: 'condition 1',
        },
        {
          'view:selected': false,
          name: 'condition 2',
        },
      ],
      'view:claimType': {
        'view:claimingIncrease': true,
        'view:claimingNew': false,
      },
    };

    const tree = render(SummaryOfDisabilitiesDescription({ formData }));

    tree.getByText('Condition 1');
    expect(tree.queryByText('Condition 2')).to.be.null;
  });

  it('renders new disabilities', () => {
    const formData = {
      'view:claimType': {
        'view:claimingIncrease': false,
        'view:claimingNew': true,
      },
      newDisabilities: [
        { condition: 'condition 1' },
        { condition: 'Condition 2' },
        { condition: undefined },
      ],
    };

    const tree = render(SummaryOfDisabilitiesDescription({ formData }));

    tree.getByText('Condition 1');
    tree.getByText('Condition 2');
    tree.getByText('Unknown Condition');
  });

  it('renders with ptsd types', () => {
    const formData = {
      'view:claimType': {
        'view:claimingIncrease': false,
        'view:claimingNew': true,
      },
      'view:selectablePtsdTypes': {
        'view:combatPtsdType': true,
      },
      newDisabilities: [
        { condition: 'PTSD (post traumatic stress disorder)' },
        { condition: 'Condition 2' },
      ],
    };

    const tree = render(SummaryOfDisabilitiesDescription({ formData }));

    const ptsd = tree.getByText('PTSD (Post Traumatic Stress Disorder)');
    within(ptsd).getByText('Combat');
    tree.getByText('Condition 2');
  });
});
