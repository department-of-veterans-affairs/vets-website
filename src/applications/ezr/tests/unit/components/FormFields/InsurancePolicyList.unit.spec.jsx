import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import InsurancePolicyList from '../../../../components/FormFields/InsurancePolicyList';

describe('ezr <InsurancePolicyList>', () => {
  const props = {
    labelledBy: '#root__title',
    list: [
      {
        insuranceName: 'Cigna',
        insurancePolicyHolderName: 'John Smith',
        'view:policyOrGroup': {
          insurancePolicyNumber: '006655',
        },
      },
      {
        insuranceName: 'Aetna',
        insurancePolicyHolderName: 'Mary Smith',
        'view:policyOrGroup': {
          insuranceGroupCode: '006655',
        },
      },
    ],
    mode: 'edit',
    onDelete: () => {},
  };

  describe('when the component renders', () => {
    it('should render with default props', () => {
      const { container } = render(<InsurancePolicyList {...props} />);
      const selector = container.querySelector('.ezr-listloop--list');
      expect(selector).to.exist;
      expect(selector).to.have.attr('aria-labelledby', props.labelledBy);
    });

    it('should render the correct amount of list items', () => {
      const { container } = render(<InsurancePolicyList {...props} />);
      const selector = container.querySelectorAll('.ezr-listloop--tile');
      expect(selector).to.have.lengthOf(2);
    });

    it('should render the correct list item data', () => {
      const { container } = render(<InsurancePolicyList {...props} />);
      const tiles = container.querySelectorAll('.ezr-listloop--tile');
      tiles.forEach((item, index) => {
        const policy = props.list[index];
        const { insuranceName, insurancePolicyHolderName } = policy;
        const selectors = {
          provider: item.querySelector(
            '[data-testid="ezr-listloop-tile--title"]',
          ),
          policyholder: item.querySelector(
            '[data-testid="ezr-listloop-tile--subtitle"]',
          ),
        };
        expect(selectors.provider).to.contain.text(insuranceName);
        expect(selectors.policyholder).to.contain.text(
          insurancePolicyHolderName,
        );
      });
    });
  });
});
