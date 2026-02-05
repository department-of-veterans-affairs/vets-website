import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { MemoryRouter } from 'react-router-dom-v5-compat';
import InProgressMedicationsProcessList from '../../../components/PrescriptionsInProgress/InProgressMedicationsProcessList';

describe('InProgressMedicationsProcessList Component', () => {
  const mockPrescriptions = [
    {
      prescriptionId: 1,
      prescriptionName: 'Medication A',
      status: 'submitted',
      lastUpdated: '2025-01-10T10:00:00Z',
    },
    {
      prescriptionId: 2,
      prescriptionName: 'Medication B',
      status: 'submitted',
      lastUpdated: '2025-01-11T10:00:00Z',
    },
    {
      prescriptionId: 3,
      prescriptionName: 'Medication C',
      status: 'in-progress',
      lastUpdated: '2025-01-12T10:00:00Z',
    },
    {
      prescriptionId: 4,
      prescriptionName: 'Medication D',
      status: 'shipped',
      lastUpdated: '2025-01-13T10:00:00Z',
    },
    {
      prescriptionId: 5,
      prescriptionName: 'Medication E',
      status: 'shipped',
      lastUpdated: '2025-01-14T10:00:00Z',
    },
  ];

  const setup = (prescriptions = mockPrescriptions) =>
    render(
      <MemoryRouter>
        <InProgressMedicationsProcessList prescriptions={prescriptions} />
      </MemoryRouter>,
    );

  it('renders without errors', () => {
    const screen = setup();
    expect(screen).to.exist;
  });

  it('renders three va-process-list-item elements', () => {
    const { container } = setup();
    const processListItems = container.querySelectorAll('va-process-list-item');
    expect(processListItems.length).to.equal(3);
  });

  describe('SubmittedStep', () => {
    it('renders the submitted step with correct header', () => {
      const { container } = setup();
      const processListItems = container.querySelectorAll(
        'va-process-list-item',
      );
      const submittedStep = processListItems[0];
      expect(submittedStep.getAttribute('header')).to.equal(
        'Request submitted',
      );
    });

    it('displays singular text when one prescription is submitted', () => {
      const singleSubmittedPrescription = [
        {
          prescriptionId: 1,
          prescriptionName: 'Medication A',
          status: 'submitted',
          lastUpdated: '2025-01-10T10:00:00Z',
        },
      ];
      const screen = setup(singleSubmittedPrescription);
      expect(screen.getByText(/this medication/)).to.exist;
    });

    it('displays plural text when multiple prescriptions are submitted', () => {
      const multipleSubmittedPrescriptions = [
        {
          prescriptionId: 1,
          prescriptionName: 'Medication A',
          status: 'submitted',
          lastUpdated: '2025-01-10T10:00:00Z',
        },
        {
          prescriptionId: 2,
          prescriptionName: 'Medication B',
          status: 'submitted',
          lastUpdated: '2025-01-11T10:00:00Z',
        },
      ];
      const screen = setup(multipleSubmittedPrescriptions);
      expect(screen.getByText(/these medications/)).to.exist;
    });

    it('displays the note about medications prescribed in the last 24 hours', () => {
      const screen = setup();
      expect(
        screen.getByText(
          /Medications prescribed in the last 24 hours may not be here yet/,
        ),
      ).to.exist;
    });
  });

  describe('InProgressStep', () => {
    it('renders the submitted step with correct header', () => {
      const { container } = setup();
      const processListItems = container.querySelectorAll(
        'va-process-list-item',
      );
      const inProgressStep = processListItems[1];
      expect(inProgressStep.getAttribute('header')).to.equal(
        'Fill in progress',
      );
    });

    it('displays singular text when one prescription is in progress', () => {
      const singleInProgressPrescription = [
        {
          prescriptionId: 1,
          prescriptionName: 'Medication A',
          status: 'in-progress',
          lastUpdated: '2025-01-10T10:00:00Z',
        },
      ];
      const screen = setup(singleInProgressPrescription);
      expect(screen.getByText(/this medication request/)).to.exist;
    });

    it('displays plural text when multiple prescriptions are in progress', () => {
      const multipleInProgressPrescriptions = [
        {
          prescriptionId: 1,
          prescriptionName: 'Medication A',
          status: 'in-progress',
          lastUpdated: '2025-01-10T10:00:00Z',
        },
        {
          prescriptionId: 2,
          prescriptionName: 'Medication B',
          status: 'in-progress',
          lastUpdated: '2025-01-11T10:00:00Z',
        },
      ];
      const screen = setup(multipleInProgressPrescriptions);
      expect(screen.getByText(/these medication requests/)).to.exist;
    });
  });

  describe('ShippedStep', () => {
    it('renders the submitted step with correct header', () => {
      const { container } = setup();
      const processListItems = container.querySelectorAll(
        'va-process-list-item',
      );
      const shippedStep = processListItems[2];
      expect(shippedStep.getAttribute('header')).to.equal('Medication shipped');
    });

    it('displays singular text when one prescription is shipped', () => {
      const singleShippedPrescription = [
        {
          prescriptionId: 1,
          prescriptionName: 'Medication A',
          status: 'shipped',
          lastUpdated: '2025-01-10T10:00:00Z',
        },
      ];
      const screen = setup(singleShippedPrescription);
      expect(
        screen.getByText(
          /This medication is on its way to you or has already arrived/,
        ),
      ).to.exist;
    });

    it('displays plural text when multiple prescriptions are shipped', () => {
      const multipleShippedPrescriptions = [
        {
          prescriptionId: 1,
          prescriptionName: 'Medication A',
          status: 'shipped',
          lastUpdated: '2025-01-10T10:00:00Z',
        },
        {
          prescriptionId: 2,
          prescriptionName: 'Medication B',
          status: 'shipped',
          lastUpdated: '2025-01-11T10:00:00Z',
        },
      ];
      const screen = setup(multipleShippedPrescriptions);
      expect(
        screen.getByText(
          /These medications are on their way to you or have already arrived/,
        ),
      ).to.exist;
    });
  });

  describe('Data parsing', () => {
    it('correctly categorizes prescriptions by status', () => {
      const { container } = setup();
      // All three steps should be rendered regardless of prescription count
      const processListItems = container.querySelectorAll(
        'va-process-list-item',
      );
      expect(processListItems.length).to.equal(3);
    });

    it('handles empty prescriptions array', () => {
      const screen = setup([]);
      const { container } = screen;
      const processList = container.querySelector('va-process-list');
      expect(processList).to.exist;
    });

    it('handles prescriptions with only one status type', () => {
      const onlySubmitted = [
        {
          prescriptionId: 1,
          prescriptionName: 'Medication A',
          status: 'submitted',
          lastUpdated: '2025-01-10T10:00:00Z',
        },
      ];
      const { container } = setup(onlySubmitted);
      const processListItems = container.querySelectorAll(
        'va-process-list-item',
      );
      expect(processListItems.length).to.equal(3);
    });
  });
});
