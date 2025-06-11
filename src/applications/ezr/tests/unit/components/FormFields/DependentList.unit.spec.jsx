import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import DependentList from '../../../../components/FormFields/DependentList';
import { normalizeFullName } from '../../../../utils/helpers/general';

describe('ezr <DependentList>', () => {
  const props = {
    labelledBy: '#root__title',
    list: [
      {
        fullName: { first: 'John', last: 'Smith' },
        dependentRelation: 'Son',
      },
      {
        fullName: { first: 'Mary', last: 'Smith' },
        dependentRelation: 'Daughter',
      },
    ],
    mode: 'edit',
    onDelete: sinon.spy(),
  };

  describe('when the component renders', () => {
    it('should render with default props', () => {
      const { container } = render(<DependentList {...props} />);
      const selector = container.querySelector('.ezr-listloop--list');
      expect(selector).to.exist;
      expect(selector).to.have.attribute('aria-labelledby', props.labelledBy);
    });

    it('should render the correct amount of list items', () => {
      const { container } = render(<DependentList {...props} />);
      const selector = container.querySelectorAll('.ezr-listloop--tile');
      expect(selector).to.have.lengthOf(2);
    });

    it('should render the correct list item data', () => {
      const { container } = render(<DependentList {...props} />);
      const tiles = container.querySelectorAll('.ezr-listloop--tile');
      tiles.forEach((item, index) => {
        const dependent = props.list[index];
        const { fullName, dependentRelation } = dependent;
        const selectors = {
          name: item.querySelector('[data-testid="ezr-listloop-tile--title"]'),
          relationship: item.querySelector(
            '[data-testid="ezr-listloop-tile--subtitle"]',
          ),
        };
        expect(selectors.name).to.contain.text(normalizeFullName(fullName));
        expect(selectors.relationship).to.contain.text(dependentRelation);
      });
    });
  });
});
