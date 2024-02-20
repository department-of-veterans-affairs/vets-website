import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import DependentList from '../../../../components/FormFields/DependentList';
import { normalizeFullName } from '../../../../utils/helpers';

describe('hca <DependentList>', () => {
  const getData = () => ({
    props: {
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
    },
  });

  context('when the component renders', () => {
    const { props } = getData();

    it('should render with default props', () => {
      const { container } = render(<DependentList {...props} />);
      const selector = container.querySelector('.hca-dependent-list');
      expect(selector).to.exist;
      expect(selector).to.have.attribute('aria-labelledby', props.labelledBy);
    });

    it('should render the correct amount of list items', () => {
      const { container } = render(<DependentList {...props} />);
      const selector = container.querySelectorAll('.hca-dependent-list--card');
      expect(selector).to.have.lengthOf(2);
    });

    it('should render the correct list item data', () => {
      const { container } = render(<DependentList {...props} />);
      const tiles = container.querySelectorAll('.hca-dependent-list--card');
      tiles.forEach((item, index) => {
        const dependent = props.list[index];
        const { fullName, dependentRelation } = dependent;
        const selectors = {
          name: item.querySelector('[data-testid="hca-dependent-tile-name"]'),
          relationship: item.querySelector(
            '[data-testid="hca-dependent-tile-relationship"]',
          ),
        };
        expect(selectors.name).to.contain.text(normalizeFullName(fullName));
        expect(selectors.relationship).to.contain.text(dependentRelation);
      });
    });
  });
});
