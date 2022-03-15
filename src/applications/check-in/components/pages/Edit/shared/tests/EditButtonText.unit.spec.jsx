import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { axeCheck } from 'platform/forms-system/test/config/helpers';
import EditButtonText from '../EditButtonText';

describe('pre-check-in experience', () => {
  describe('shared components', () => {
    describe('EditButtonText', () => {
      it('passes axeCheck', () => {
        axeCheck(<EditButtonText />);
      });
      it('renders the edit text when given a value', () => {
        const { getByText } = render(<EditButtonText value="foo" />);
        expect(getByText('Edit')).to.exist;
      });
      it('renders the add text when no value is given', () => {
        const { getByText } = render(<EditButtonText />);
        expect(getByText('Add')).to.exist;
      });
    });
  });
});
