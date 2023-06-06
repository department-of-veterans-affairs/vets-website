import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import DependentList from '../../../components/FormFields/DependentList';

describe('hca <DependentList>', () => {
  const defaultProps = {
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

  describe('dependent list container', () => {
    it('should render with default attributes', () => {
      const view = render(<DependentList {...defaultProps} />);
      const selector = view.container.querySelector('.hca-dependent-list');
      expect(selector).to.exist;
      expect(selector).to.have.attribute(
        'aria-labelledby',
        defaultProps.labelledBy,
      );
    });
  });

  describe('dependent list items', () => {
    it('should render the correct amount of list items', () => {
      const view = render(<DependentList {...defaultProps} />);
      const selector = view.container.querySelectorAll(
        '.hca-dependent-list--tile',
      );
      expect(selector).to.have.lengthOf(2);
    });

    it('should render the first list item with the correct name and relationship', () => {
      const view = render(<DependentList {...defaultProps} />);
      const tiles = view.container.querySelectorAll(
        '.hca-dependent-list--tile',
      );
      const selectors = {
        name: tiles[0].querySelector('[data-testid="hca-dependent-tile-name"]'),
        relationship: tiles[0].querySelector(
          '[data-testid="hca-dependent-tile-relationship"]',
        ),
      };
      const dependent = defaultProps.list[0];
      const normalizedText = `${dependent.fullName.first} ${
        dependent.fullName.last
      } ${dependent.fullName.suffix || ''}`.replace(/ +(?= )/g, '');
      expect(selectors.name).to.contain.text(normalizedText);
      expect(selectors.relationship).to.contain.text(
        dependent.dependentRelation,
      );
    });

    it('should render the last list item with the correct name and relationship', () => {
      const view = render(<DependentList {...defaultProps} />);
      const tiles = view.container.querySelectorAll(
        '.hca-dependent-list--tile',
      );
      const selectors = {
        name: tiles[1].querySelector('[data-testid="hca-dependent-tile-name"]'),
        relationship: tiles[1].querySelector(
          '[data-testid="hca-dependent-tile-relationship"]',
        ),
      };
      const dependent = defaultProps.list[1];
      const normalizedText = `${dependent.fullName.first} ${
        dependent.fullName.last
      } ${dependent.fullName.suffix || ''}`.replace(/ +(?= )/g, '');
      expect(selectors.name).to.contain.text(normalizedText);
      expect(selectors.relationship).to.contain.text(
        dependent.dependentRelation,
      );
    });
  });
});
