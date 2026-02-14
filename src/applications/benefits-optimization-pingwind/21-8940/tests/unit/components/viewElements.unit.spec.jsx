import React from 'react';
import { cleanup, render } from '@testing-library/react';
import { expect } from 'chai';

import {
  DisabilityView,
  DateRangeView,
  DoctorView,
  HospitalView,
  EmployerView,
  EmploymentHistoryView,
  EducationView,
} from '../../../components/viewElements';

describe('21-8940 component/viewElements', () => {
  afterEach(cleanup);

  it('renders the disability text or the fallback message', () => {
    const { rerender, getByText } = render(<DisabilityView formData="PTSD" />);
    expect(getByText('PTSD')).to.exist;

    rerender(<DisabilityView formData={null} />);
    expect(getByText('Disability not provided')).to.exist;
  });

  it('renders the provided date range and fallbacks', () => {
    const { rerender, getByText } = render(
      <DateRangeView
        formData={{ startDate: 'Jan 1, 2020', endDate: 'Dec 31, 2020' }}
      />,
    );

    const dateParagraph = getByText(/Duration:/);
    expect(dateParagraph.textContent).to.include('Jan 1, 2020');
    expect(dateParagraph.textContent).to.include('Dec 31, 2020');

    rerender(<DateRangeView formData={{}} />);
    expect(getByText(/Duration:/).textContent).to.include('Not provided');
  });

  it('renders doctor details with optional connected disabilities', () => {
    const formData = {
      doctorName: 'Dr. Jane Doe',
      doctorAddress: {
        street: '123 Main St',
        street2: 'Suite 4',
        city: 'Springfield',
        state: 'VA',
        postalCode: '22150',
      },
      connectedDisabilities: ['Back pain', 'PTSD'],
    };

    const { container, rerender, getByText } = render(
      <DoctorView formData={formData} />,
    );

    expect(container.querySelector('strong').textContent).to.equal(
      'Dr. Jane Doe',
    );
    expect(container.querySelector('p').textContent).to.include('123 Main St');
    const connectedList = container.querySelectorAll('li');
    expect(connectedList.length).to.equal(2);
    expect(connectedList[0].textContent).to.equal('Back pain');
    expect(connectedList[1].textContent).to.equal('PTSD');

    rerender(<DoctorView formData={{ connectedDisabilities: 'Anxiety' }} />);
    expect(container.textContent).to.include('Connected disabilities: Anxiety');

    rerender(<DoctorView formData={{}} />);
    expect(getByText('Doctor name not provided')).to.exist;
  });

  it('renders hospital details with optional connected disabilities', () => {
    const formData = {
      hospitalName: 'VA Medical Center',
      hospitalAddress: {
        street: '456 Elm St',
        city: 'Richmond',
        state: 'VA',
        postalCode: '23219',
      },
      connectedDisabilities: ['Chronic fatigue'],
    };

    const { container, rerender, getByText } = render(
      <HospitalView formData={formData} />,
    );

    expect(container.querySelector('strong').textContent).to.equal(
      'VA Medical Center',
    );
    expect(container.textContent).to.include('456 Elm St');
    expect(container.textContent).to.include(
      'Connected disabilities: Chronic fatigue',
    );

    rerender(
      <HospitalView formData={{ connectedDisabilities: 'Back pain' }} />,
    );
    expect(container.textContent).to.include(
      'Connected disabilities: Back pain',
    );

    rerender(<HospitalView formData={{}} />);
    expect(getByText('Hospital name not provided')).to.exist;
  });

  it('renders employer information with fallbacks', () => {
    const fullData = {
      employerName: 'Acme Corp',
      typeOfWork: 'Engineer',
      dateApplied: 'Feb 2024',
      employerAddress: {
        street: '789 Oak St',
        street2: 'Floor 3',
        city: 'Arlington',
        state: 'VA',
        postalCode: '22203',
      },
    };

    const { container, rerender, getByText } = render(
      <EmployerView formData={fullData} />,
    );

    expect(container.querySelector('strong').textContent).to.equal('Acme Corp');
    expect(container.textContent).to.include('Type of work: Engineer');
    expect(container.textContent).to.include('Date applied: Feb 2024');
    expect(container.textContent).to.include('789 Oak St');

    rerender(<EmployerView formData={{}} />);
    expect(getByText('Employer name not provided')).to.exist;
    expect(container.textContent).to.include('Not provided');
  });

  it('renders employment history details with numeric values', () => {
    const formData = {
      employerName: 'Widget Factory',
      typeOfWork: 'Assembler',
      hoursPerWeek: 40,
      startDate: 'Jan 2022',
      endDate: 'Dec 2023',
      lostTime: 12,
      highestIncome: 4500,
      employerAddress: {
        street: '321 Pine St',
        city: 'Norfolk',
        state: 'VA',
        postalCode: '23510',
      },
    };

    const { container } = render(<EmploymentHistoryView formData={formData} />);

    expect(container.querySelector('strong').textContent).to.equal(
      'Widget Factory',
    );
    expect(container.textContent).to.include('Hours per week: 40');
    expect(container.textContent).to.include('Employment dates: Jan 2022');
    expect(container.textContent).to.include('Dec 2023');
    expect(container.textContent).to.include(
      'Time lost from illness: 12 hours',
    );
    expect(container.textContent).to.include(
      'Highest gross earnings per month: $4500',
    );
    expect(container.textContent).to.include('321 Pine St');
  });

  it('renders education information with fallbacks', () => {
    const { container, rerender, getByText } = render(
      <EducationView
        formData={{
          typeOfEducation: 'Apprenticeship',
          datesOfTraining: { from: 'March 2020', to: 'August 2020' },
        }}
      />,
    );

    expect(container.querySelector('strong').textContent).to.equal(
      'Apprenticeship',
    );
    expect(container.textContent).to.include('Training dates: March 2020');
    expect(container.textContent).to.include('August 2020');

    rerender(<EducationView formData={{}} />);
    expect(getByText('Education type not provided')).to.exist;
    expect(container.textContent).to.include('Start date not provided');
    expect(container.textContent).to.include('End date not provided');
  });
});
