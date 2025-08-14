import React from 'react';
import { expect } from 'chai';
import { render, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { SummaryOfDisabilitiesDescription } from '../../content/summaryOfDisabilities';
import { NULL_CONDITION_STRING } from '../../constants';
import { DISABILITY_SHARED_CONFIG } from '../../utils';

describe('summaryOfDisabilitiesDescription', () => {
  it('renders selected rated disabilities when claiming increase', () => {
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

    const tree = render(
      <MemoryRouter>
        <SummaryOfDisabilitiesDescription formData={formData} />
      </MemoryRouter>,
    );
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

    const tree = render(
      <MemoryRouter>
        <SummaryOfDisabilitiesDescription formData={formData} />
      </MemoryRouter>,
    );

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

    const tree = render(
      <MemoryRouter>
        <SummaryOfDisabilitiesDescription formData={formData} />
      </MemoryRouter>,
    );

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

    const tree = render(
      <MemoryRouter>
        <SummaryOfDisabilitiesDescription formData={formData} />
      </MemoryRouter>,
    );

    const ptsd = tree.getByText('PTSD (Post Traumatic Stress Disorder)');
    within(ptsd).getByText('Combat');
    tree.getByText('Condition 2');
  });

  it('renders both new conditions and selected rated disabilities when both claim types selected', () => {
    const formData = {
      'view:claimType': {
        'view:claimingNew': true,
        'view:claimingIncrease': true,
      },
      newDisabilities: [
        {
          cause: 'NEW',
          'view:serviceConnectedDisability': {},
          condition: 'asthma',
        },
      ],
      ratedDisabilities: [
        {
          name: 'Diabetes mellitus0',
          ratedDisabilityId: '0',
          ratingDecisionId: '63655',
          diagnosticCode: 5238,
          decisionCode: 'SVCCONNCTED',
          decisionText: 'Service Connected',
          ratingPercentage: 100,
          disabilityActionType: 'NONE',
          'view:selected': true,
        },
        {
          name: 'Diabetes mellitus1',
          ratedDisabilityId: '1',
          ratingDecisionId: '63655',
          diagnosticCode: 5238,
          decisionCode: 'SVCCONNCTED',
          decisionText: 'Service Connected',
          ratingPercentage: 100,
          disabilityActionType: 'NONE',
        },
      ],
    };

    const tree = render(
      <MemoryRouter>
        <SummaryOfDisabilitiesDescription formData={formData} />
      </MemoryRouter>,
    );

    tree.getByText('Diabetes Mellitus0');
    tree.getByText('Asthma');
    expect(tree.queryByText('Diabites Mellitus1')).to.be.null;
  });

  it('renders link to rated disabilities page when both new and increase are selected', () => {
    const formData = {
      'view:claimType': {
        'view:claimingNew': true,
        'view:claimingIncrease': true,
      },
    };

    const tree = render(
      <MemoryRouter>
        <SummaryOfDisabilitiesDescription formData={formData} />
      </MemoryRouter>,
    );

    const link = tree.getByText('go back and add it');
    expect(link.getAttribute('aria-label')).to.equal(
      'go back and add any missing disabilities',
    );
    expect(link.getAttribute('data-testid')).to.equal(
      `redirect-link-${DISABILITY_SHARED_CONFIG.ratedDisabilities.path}`,
    );
  });

  it('renders link to rated disabilities page when only increase is selected', () => {
    const formData = {
      'view:claimType': {
        'view:claimingNew': false,
        'view:claimingIncrease': true,
      },
    };

    const tree = render(
      <MemoryRouter>
        <SummaryOfDisabilitiesDescription formData={formData} />
      </MemoryRouter>,
    );

    const link = tree.getByText('go back and add it');
    expect(link.getAttribute('data-testid')).to.equal(
      `redirect-link-${DISABILITY_SHARED_CONFIG.ratedDisabilities.path}`,
    );
  });

  it('renders link to add disabilities page when only new is selected', () => {
    const formData = {
      'view:claimType': {
        'view:claimingNew': true,
        'view:claimingIncrease': false,
      },
    };

    const tree = render(
      <MemoryRouter>
        <SummaryOfDisabilitiesDescription formData={formData} />
      </MemoryRouter>,
    );

    const link = tree.getByText('go back and add it');
    expect(link.getAttribute('data-testid')).to.equal(
      `redirect-link-${DISABILITY_SHARED_CONFIG.addDisabilities.path}`,
    );
  });
});
