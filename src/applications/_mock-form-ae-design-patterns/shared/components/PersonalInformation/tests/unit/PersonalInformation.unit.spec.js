import React from 'react';
import { expect } from 'chai';
import { renderInReduxProvider } from 'platform/testing/unit/react-testing-library-helpers';
import { PersonalInformation } from '../../PersonalInformation';

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
        <PersonalInformation NavButtons={NavButtons} data={{ ssn: '6789' }} />,
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

      expect(view.getByText('Date of birth:')).to.exist;
      expect(view.getByText('January 1, 1990')).to.exist;
    });

    it('should render the default note and NavButtons', () => {
      expect(view.getByTestId('default-note')).to.exist;
      expect(view.getByText('NavButtons')).to.exist;
    });
  });

  describe('rendering the PersonalInformation component when no data is present', () => {
    let view;

    beforeEach(() => {
      view = renderInReduxProvider(
        <PersonalInformation NavButtons={NavButtons} data={{}} />,
        {
          initialState,
        },
      );
    });

    it('should render the error message', () => {
      expect(view.getByText('We need more information')).to.exist;
    });
  });
});
