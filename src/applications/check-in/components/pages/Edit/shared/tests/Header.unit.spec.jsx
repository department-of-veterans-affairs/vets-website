import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { axeCheck } from 'platform/forms-system/test/config/helpers';
import Header from '../Header';

describe('pre-check-in experience', () => {
  describe('shared components', () => {
    describe('Header', () => {
      it('passes axeCheck', () => {
        axeCheck(<Header />);
      });
      it('renders the prop what', () => {
        const { getByTestId } = render(<Header what="test" />);
        expect(getByTestId('edit-header').innerHTML).to.contains('test');
      });
      it('if value is a prop, then it renders Edit', () => {
        const { getByTestId } = render(<Header value="test" />);
        expect(getByTestId('edit-header').innerHTML).to.contains('Edit');
      });
      it('if value is a undefined, then it renders Add', () => {
        const { getByTestId } = render(<Header />);
        expect(getByTestId('edit-header').innerHTML).to.contains('Add');
      });
      it('shows message for editing demographics', () => {
        const { getByTestId } = render(<Header editingPage="demographics" />);
        expect(getByTestId('edit-header').innerHTML).to.contains('your');
      });
      it('shows message for editing next of kin', () => {
        const { getByTestId } = render(<Header editingPage="nextOfKin" />);
        expect(getByTestId('edit-header').innerHTML).to.contains('next of kin');
      });
      it('shows message for editing emergency contact', () => {
        const { getByTestId } = render(
          <Header editingPage="emergencyContact" />,
        );
        expect(getByTestId('edit-header').innerHTML).to.contains('contact');
      });
    });
  });
});
