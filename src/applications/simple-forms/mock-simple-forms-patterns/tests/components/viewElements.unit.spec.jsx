import React from 'react';
import { render } from '@testing-library/react';
import {
  ChildViewCard,
  ChildNameHeader,
  FacilityDates,
  RecordHeading,
} from '../../components/viewElements';

describe('ChildViewCard', () => {
  it('should render', () => {
    const formData = {
      fullName: {
        first: 'First',
        last: 'Last',
      },
    };
    const { getByText } = render(<ChildViewCard formData={formData} />);
    getByText('First Last');
  });
});

describe('ChildNameHeader', () => {
  it('should render', () => {
    const formData = {
      fullName: {
        first: 'fiRSt',
        last: 'LaST',
      },
    };
    const { getByText } = render(<ChildNameHeader formData={formData} />);
    getByText('First Last');
  });
});

describe('FacilityDates', () => {
  it('should render', () => {
    const formData = {
      facilityName: 'Facility Name',
      from: '2000-01-01',
      to: '2000-01-02',
    };
    const { getByText } = render(<FacilityDates formData={formData} />);
    getByText('Facility Name');
  });
});

describe('RecordHeading', () => {
  it('should render', () => {
    const formData = {
      name: 'Name',
    };
    const { getByText } = render(<RecordHeading formData={formData} />);
    getByText('Name');
  });
});
