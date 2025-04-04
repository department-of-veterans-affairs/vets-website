import React from 'react';
import { expect } from 'chai';
import { renderInReduxProvider } from 'platform/testing/unit/react-testing-library-helpers';
import { PersonalInformationReview } from '../../../../src/js/components/PersonalInformation/PersonalInformationReview';

const initialState = {
  user: {
    profile: {
      dob: '1990-01-01',
      gender: 'M',
      userFullName: {
        first: 'John',
        middle: 'Doe',
        last: 'Smith',
        suffix: 'Jr.',
      },
    },
  },
};

describe('PersonalInformationReview', () => {
  describe('rendering the PersonalInformationReview component when all data is present', () => {
    let view;

    beforeEach(() => {
      view = renderInReduxProvider(
        <PersonalInformationReview
          data={{ ssn: '6789', vaFileNumber: '1234' }}
          title="Personal Information"
          config={{
            name: { show: true, required: true },
            ssn: { show: true, required: true },
            vaFileNumber: { show: true, required: true },
            dateOfBirth: { show: true, required: true },
            sex: { show: true, required: true },
          }}
        />,
        {
          initialState,
        },
      );
    });

    it('should render the component title', () => {
      expect(view.getByText('Personal Information')).to.exist;
    });

    it('should render the name field correctly', () => {
      expect(view.getByText('Name')).to.exist;
      expect(view.getByText('John Doe Smith, Jr.')).to.exist;
    });

    it('should render the SSN field correctly', () => {
      expect(view.getByText('Last 4 digits of Social Security number')).to
        .exist;
      expect(view.getByText('6789')).to.exist;
    });

    it('should render the VA file number field correctly', () => {
      expect(view.getByText('Last 4 digits of VA file number')).to.exist;
      expect(view.getByText('1234')).to.exist;
    });

    it('should render the date of birth field correctly', () => {
      expect(view.getByText('Date of birth')).to.exist;
      expect(view.getByText('January 1, 1990')).to.exist;
    });

    it('should render the sex field correctly', () => {
      expect(view.getByText('Sex')).to.exist;
      expect(view.getByText('Male')).to.exist;
    });
  });

  describe('rendering the PersonalInformationReview component with custom title', () => {
    it('should render the custom title', () => {
      const view = renderInReduxProvider(
        <PersonalInformationReview
          data={{ ssn: '6789' }}
          title="Veteran Information"
          config={{
            name: { show: true, required: false },
            ssn: { show: true, required: false },
          }}
        />,
        {
          initialState,
        },
      );

      expect(view.getByText('Veteran Information')).to.exist;
    });
  });

  describe('rendering the PersonalInformationReview component with selectively shown fields', () => {
    it('should only render fields that are configured to show', () => {
      const view = renderInReduxProvider(
        <PersonalInformationReview
          data={{ ssn: '6789', vaFileNumber: '1234' }}
          title="Personal Information"
          config={{
            name: { show: true, required: false },
            ssn: { show: false, required: false },
            vaFileNumber: { show: true, required: false },
            dateOfBirth: { show: false, required: false },
            sex: { show: false, required: false },
          }}
        />,
        {
          initialState,
        },
      );

      expect(view.getByText('Name')).to.exist;
      expect(view.getByText('Last 4 digits of VA file number')).to.exist;
      expect(view.queryByText('Last 4 digits of Social Security number')).to.be
        .null;
      expect(view.queryByText('Date of birth')).to.be.null;
      expect(view.queryByText('Sex')).to.be.null;
    });
  });

  describe('rendering the PersonalInformationReview component with data adapter', () => {
    it('should use the data adapter to find the correct data', () => {
      const view = renderInReduxProvider(
        <PersonalInformationReview
          data={{
            veteran: {
              ssn: '9876',
              vaFileNumber: '5432',
            },
          }}
          title="Personal Information"
          config={{
            name: { show: true, required: false },
            ssn: { show: true, required: false },
            vaFileNumber: { show: true, required: false },
          }}
          dataAdapter={{
            ssnPath: 'veteran.ssn',
            vaFileNumberPath: 'veteran.vaFileNumber',
          }}
        />,
        {
          initialState,
        },
      );

      expect(view.getByText('Last 4 digits of Social Security number')).to
        .exist;
      expect(view.getByText('9876')).to.exist;
      expect(view.getByText('Last 4 digits of VA file number')).to.exist;
      expect(view.getByText('5432')).to.exist;
    });
  });

  describe('rendering the PersonalInformationReview component when optional field data is not present', () => {
    it('should render "not available" for missing data', () => {
      const view = renderInReduxProvider(
        <PersonalInformationReview
          data={{}}
          title="Personal Information"
          config={{
            name: { show: true, required: false },
            ssn: { show: true, required: false },
            vaFileNumber: { show: true, required: false },
            dateOfBirth: { show: true, required: false },
            sex: { show: true, required: false },
          }}
        />,
        {
          initialState: {
            user: {
              profile: {},
            },
          },
        },
      );

      expect(view.getByTestId('name-not-available')).to.exist;
      expect(view.getByTestId('ssn-not-available')).to.exist;
      expect(view.getByTestId('va-file-number-not-available')).to.exist;
      expect(view.getByTestId('dob-not-available')).to.exist;
      expect(view.getByTestId('sex-not-available')).to.exist;
    });
  });

  describe('rendering the PersonalInformationReview component with invalid date', () => {
    it('should handle invalid date of birth', () => {
      const view = renderInReduxProvider(
        <PersonalInformationReview
          data={{}}
          title="Personal Information"
          config={{
            dateOfBirth: { show: true, required: false },
          }}
        />,
        {
          initialState: {
            user: {
              profile: {
                dob: 'invalid-date',
              },
            },
          },
        },
      );

      expect(view.getByText('Date of birth')).to.exist;
      expect(view.getByTestId('dob-not-available')).to.exist;
    });
  });
});
