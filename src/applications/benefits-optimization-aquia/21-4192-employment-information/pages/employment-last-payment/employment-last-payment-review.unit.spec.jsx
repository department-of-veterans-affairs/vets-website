/**
 * @module tests/pages/employment-last-payment-review.unit.spec
 * @description Unit tests for Employment Last Payment review component
 */

import { expect } from 'chai';
import React from 'react';
import { render } from '@testing-library/react';
import { EmploymentLastPaymentReview } from './employment-last-payment-review';

describe('EmploymentLastPaymentReview', () => {
  const mockEditPage = () => {};
  const mockTitle = 'Employment last payment';

  describe('Component Rendering', () => {
    it('should render the component', () => {
      const data = {
        employmentLastPayment: {
          dateOfLastPayment: '2015-12-15',
          grossAmountLastPayment: '5000',
          lumpSumPayment: 'no',
          grossAmountPaid: '',
          datePaid: '',
        },
      };
      const { container } = render(
        <EmploymentLastPaymentReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );
      expect(container).to.exist;
    });

    it('should display title', () => {
      const data = {
        employmentLastPayment: {},
      };
      const { container } = render(
        <EmploymentLastPaymentReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );
      const heading = container.querySelector('h4');
      expect(heading).to.exist;
      expect(heading.textContent).to.equal(mockTitle);
    });

    it('should display edit button', () => {
      const data = {
        employmentLastPayment: {},
      };
      const { container } = render(
        <EmploymentLastPaymentReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );
      const editButton = container.querySelector('va-button');
      expect(editButton).to.exist;
      expect(editButton.getAttribute('text')).to.equal('Edit');
    });
  });

  describe('Data Display', () => {
    it('should display formatted date of last payment', () => {
      const data = {
        employmentLastPayment: {
          dateOfLastPayment: '2015-12-15',
        },
      };
      const { container } = render(
        <EmploymentLastPaymentReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );
      const text = container.textContent;
      expect(text).to.include('Date of last payment');
      expect(text).to.include('2015');
    });

    it('should display gross amount of last payment', () => {
      const data = {
        employmentLastPayment: {
          grossAmountLastPayment: '5000',
        },
      };
      const { container } = render(
        <EmploymentLastPaymentReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );
      const text = container.textContent;
      expect(text).to.include('Gross amount of last payment');
      expect(text).to.include('5000');
    });

    it('should display lump sum payment as "Yes"', () => {
      const data = {
        employmentLastPayment: {
          lumpSumPayment: 'yes',
        },
      };
      const { container } = render(
        <EmploymentLastPaymentReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );
      const text = container.textContent;
      expect(text).to.include('Was a lump sum payment made?');
      expect(text).to.include('Yes');
    });

    it('should display lump sum payment as "No"', () => {
      const data = {
        employmentLastPayment: {
          lumpSumPayment: 'no',
        },
      };
      const { container } = render(
        <EmploymentLastPaymentReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );
      const text = container.textContent;
      expect(text).to.include('No');
    });

    it('should show lump sum fields only when lumpSumPayment is yes', () => {
      const data = {
        employmentLastPayment: {
          lumpSumPayment: 'yes',
          grossAmountPaid: '50000',
          datePaid: '2015-12-31',
        },
      };
      const { container } = render(
        <EmploymentLastPaymentReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );
      const text = container.textContent;
      expect(text).to.include('Gross amount paid');
      expect(text).to.include('50000');
      expect(text).to.include('When was the lump sum paid?');
      expect(text).to.include('2015');
    });

    it('should hide lump sum fields when lumpSumPayment is no', () => {
      const data = {
        employmentLastPayment: {
          lumpSumPayment: 'no',
          grossAmountPaid: '50000',
          datePaid: '2015-12-31',
        },
      };
      const { container } = render(
        <EmploymentLastPaymentReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );
      const text = container.textContent;
      expect(text).to.not.include('Gross amount paid');
      expect(text).to.not.include('50000');
      expect(text).to.not.include('When was the lump sum paid?');
    });

    it('should display all themed payment data', () => {
      const data = {
        employmentLastPayment: {
          dateOfLastPayment: '2020-12-25',
          grossAmountLastPayment: '7500',
          lumpSumPayment: 'yes',
          grossAmountPaid: '75000',
          datePaid: '2020-12-31',
        },
      };
      const { container } = render(
        <EmploymentLastPaymentReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );
      const text = container.textContent;
      expect(text).to.include('7500');
      expect(text).to.include('Yes');
      expect(text).to.include('75000');
    });
  });

  describe('Missing Data Handling', () => {
    it('should display "Not provided" for missing date of last payment', () => {
      const data = {
        employmentLastPayment: {
          dateOfLastPayment: '',
        },
      };
      const { container } = render(
        <EmploymentLastPaymentReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );
      const text = container.textContent;
      expect(text).to.include('Not provided');
    });

    it('should display "Not provided" for missing gross amount', () => {
      const data = {
        employmentLastPayment: {
          grossAmountLastPayment: '',
        },
      };
      const { container } = render(
        <EmploymentLastPaymentReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );
      const text = container.textContent;
      expect(text).to.include('Not provided');
    });

    it('should display "Not provided" for missing lump sum payment', () => {
      const data = {
        employmentLastPayment: {
          lumpSumPayment: '',
        },
      };
      const { container } = render(
        <EmploymentLastPaymentReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );
      const text = container.textContent;
      expect(text).to.include('Not provided');
    });

    it('should handle undefined employmentLastPayment', () => {
      const data = {};
      const { container } = render(
        <EmploymentLastPaymentReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );
      const text = container.textContent;
      expect(text).to.include('Not provided');
    });

    it('should handle null data', () => {
      const data = {
        employmentLastPayment: null,
      };
      const { container } = render(
        <EmploymentLastPaymentReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );
      expect(container).to.exist;
    });

    it('should handle partial data', () => {
      const data = {
        employmentLastPayment: {
          dateOfLastPayment: '2015-12-15',
        },
      };
      const { container } = render(
        <EmploymentLastPaymentReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );
      const text = container.textContent;
      expect(text).to.include('2015');
      expect(text).to.include('Not provided');
    });
  });

  describe('Date Formatting', () => {
    it('should format date in US locale', () => {
      const data = {
        employmentLastPayment: {
          dateOfLastPayment: '2015-12-15',
        },
      };
      const { container } = render(
        <EmploymentLastPaymentReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );
      const text = container.textContent;
      expect(text).to.include('December');
      expect(text).to.include('15');
      expect(text).to.include('2015');
    });

    it('should format dates correctly', () => {
      const data = {
        employmentLastPayment: {
          lumpSumPayment: 'yes',
          datePaid: '2020-12-31',
        },
      };
      const { container } = render(
        <EmploymentLastPaymentReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );
      const text = container.textContent;
      expect(text).to.include('December');
      expect(text).to.include('31');
      expect(text).to.include('2020');
    });

    it('should handle invalid date gracefully', () => {
      const data = {
        employmentLastPayment: {
          dateOfLastPayment: 'invalid-date',
        },
      };
      const { container } = render(
        <EmploymentLastPaymentReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );
      expect(container).to.exist;
    });
  });

  describe('Yes/No Formatting', () => {
    it('should format "yes" as "Yes"', () => {
      const data = {
        employmentLastPayment: {
          lumpSumPayment: 'yes',
        },
      };
      const { container } = render(
        <EmploymentLastPaymentReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );
      const text = container.textContent;
      expect(text).to.include('Yes');
      expect(text).to.not.include('yes');
    });

    it('should format "no" as "No"', () => {
      const data = {
        employmentLastPayment: {
          lumpSumPayment: 'no',
        },
      };
      const { container } = render(
        <EmploymentLastPaymentReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );
      const text = container.textContent;
      expect(text).to.include('No');
    });
  });

  describe('Edit Functionality', () => {
    it('should accept editPage prop', () => {
      const data = {
        employmentLastPayment: {},
      };
      const { container } = render(
        <EmploymentLastPaymentReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );
      const editButton = container.querySelector('va-button');
      expect(editButton).to.exist;
    });

    it('should have secondary button styling', () => {
      const data = {
        employmentLastPayment: {},
      };
      const { container } = render(
        <EmploymentLastPaymentReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );
      const editButton = container.querySelector('va-button');
      expect(editButton.hasAttribute('secondary')).to.be.true;
    });
  });
});
