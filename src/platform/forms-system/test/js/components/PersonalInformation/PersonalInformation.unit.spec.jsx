import React from 'react';
import { expect } from 'chai';
import { renderInReduxProvider } from 'platform/testing/unit/react-testing-library-helpers';
import {
  PersonalInformation,
  PersonalInformationFooter,
  PersonalInformationHeader,
  PersonalInformationNote,
} from '../../../../src/js/components/PersonalInformation/PersonalInformation';

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

const NavButtons = () => {
  return <div>NavButtons</div>;
};

describe('PersonalInformation', () => {
  describe('rendering the PersonalInformation component when default data is present', () => {
    let view;

    beforeEach(() => {
      view = renderInReduxProvider(
        <PersonalInformation
          NavButtons={NavButtons}
          data={{ ssn: '6789', vaFileNumber: '1234' }}
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

    it('should render the component and main content', () => {
      expect(view.getByText('Personal information')).to.exist;

      expect(view.getByText('Name:')).to.exist;
      expect(view.getByText('John Doe Smith, Jr.')).to.exist;

      expect(view.getByText('Last 4 digits of Social Security number:')).to
        .exist;
      expect(view.getByText('6789')).to.exist;

      expect(view.getByText('Last 4 digits of VA file number:')).to.exist;
      expect(view.getByText('1234')).to.exist;

      expect(view.getByText('Date of birth:')).to.exist;
      expect(view.getByText('January 1, 1990')).to.exist;
    });

    it('should render the default note and NavButtons', () => {
      expect(view.getByTestId('default-note')).to.exist;
      expect(view.getByText('NavButtons')).to.exist;
    });
  });

  describe('rendering the PersonalInformation component when error message is a string', () => {
    it('should render the error message as a string', () => {
      const errorMessage = 'error message as a string';
      const view = renderInReduxProvider(
        <PersonalInformation
          NavButtons={NavButtons}
          data={{}}
          errorMessage={errorMessage}
          config={{
            ssn: { show: true, required: true },
          }}
        />,
        {
          initialState,
        },
      );
      expect(view.getByText(errorMessage)).to.exist;
    });
  });

  describe('rendering the PersonalInformation component when error message is a function', () => {
    it('should render the error message functional component', () => {
      const CustomErrorMessage = () => {
        return <div>CustomErrorMessage</div>;
      };

      const view = renderInReduxProvider(
        <PersonalInformation
          NavButtons={NavButtons}
          data={{}}
          errorMessage={CustomErrorMessage}
          config={{
            ssn: { show: true, required: true },
          }}
        />,
        {
          initialState,
        },
      );

      expect(view.getByText('CustomErrorMessage')).to.exist;
    });
  });

  describe('rendering the PersonalInformation component and error message when no data is present', () => {
    it('should render the error message', () => {
      const view = renderInReduxProvider(
        <PersonalInformation
          NavButtons={NavButtons}
          data={{}}
          config={{
            ssn: { show: true, required: true },
          }}
        />,
        {
          initialState,
        },
      );

      expect(view.getByText('We need more information')).to.exist;
    });
  });

  describe('rendering the PersonalInformation component when optional field data is not present', () => {
    it('should render the component and main content including "not available" values', () => {
      const view = renderInReduxProvider(
        <PersonalInformation
          NavButtons={NavButtons}
          data={{}}
          config={{
            name: { show: true, required: false },
            ssn: { show: true, required: false },
            sex: { show: true, required: false },
            vaFileNumber: { show: true, required: false },
            dateOfBirth: { show: true, required: false },
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

      expect(view.getByText('Personal information')).to.exist;
      expect(view.getByTestId('name-not-available')).to.exist;
      expect(view.getByTestId('ssn-not-available')).to.exist;
      expect(view.getByTestId('va-file-number-not-available')).to.exist;
      expect(view.getByTestId('dob-not-available')).to.exist;
      expect(view.getByTestId('sex-not-available')).to.exist;
    });
  });

  describe('rendering the PersonalInformation component with named children components', () => {
    it('should render all provided children when using the correct named components', () => {
      const view = renderInReduxProvider(
        <PersonalInformation NavButtons={NavButtons} data={{ ssn: 6789 }}>
          <PersonalInformationHeader>
            <h1>Custom Header</h1>
          </PersonalInformationHeader>
          <PersonalInformationNote>
            <p>Custom Note</p>
          </PersonalInformationNote>
          <PersonalInformationFooter>
            <p>Custom Footer</p>
          </PersonalInformationFooter>
        </PersonalInformation>,
        {
          initialState,
        },
      );

      expect(view.getByText('Custom Header')).to.exist;
      expect(view.getByText('Custom Note')).to.exist;
      expect(view.getByText('Custom Footer')).to.exist;
    });
  });
});
