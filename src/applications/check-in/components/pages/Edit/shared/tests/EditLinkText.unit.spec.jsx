import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { axeCheck } from 'platform/forms-system/test/config/helpers';
import EditLinkText from '../EditLinkText';

describe('pre-check-in experience', () => {
  describe('shared components', () => {
    describe('EditLinkText', () => {
      it('passes axeCheck', () => {
        axeCheck(<EditLinkText />);
      });
      it('renders the edit text when given a value', () => {
        const { getByText } = render(<EditLinkText value="foo" />);
        expect(getByText('Edit')).to.exist;
      });
      it('renders the add text when no value is given', () => {
        const { getByText } = render(<EditLinkText />);
        expect(getByText('Add')).to.exist;
      });
    });
  });
});
