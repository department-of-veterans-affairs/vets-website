import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import HowDoIPay from '../components/HowDoIPay';

describe('HowDoIPay', () => {
  describe('receivableId display logic', () => {
    it('should display Receivable ID when receivableId is present', () => {
      const userData = {
        fileNumber: '123456789',
        receivableId: '987654321012',
        payeeNumber: '00',
        personEntitled: 'JDOE',
        deductionCode: '71',
      };

      const { container } = render(<HowDoIPay userData={userData} />);
      const content = container.textContent;

      expect(content).to.include('Receivable ID');
      expect(content).to.include('987654321012');
      expect(content).to.not.include('File Number');
    });

    it('should display File Number when receivableId is not present', () => {
      const userData = {
        fileNumber: '123456789',
        payeeNumber: '00',
        personEntitled: 'JDOE',
        deductionCode: '30',
      };

      const { container } = render(<HowDoIPay userData={userData} />);
      const content = container.textContent;

      expect(content).to.include('File Number');
      expect(content).to.include('123456789');
      expect(content).to.not.include('Receivable ID');
    });

    it('should display File Number when both are present but receivableId is null', () => {
      const userData = {
        fileNumber: '123456789',
        receivableId: null,
        payeeNumber: '00',
        personEntitled: 'JDOE',
        deductionCode: '30',
      };

      const { container } = render(<HowDoIPay userData={userData} />);
      const content = container.textContent;

      expect(content).to.include('File Number');
      expect(content).to.include('123456789');
      expect(content).to.not.include('Receivable ID');
    });
  });
});
