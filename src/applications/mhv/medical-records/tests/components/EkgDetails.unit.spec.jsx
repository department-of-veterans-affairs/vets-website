import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import reducer from '../../reducers';
import EkgDetails from '../../components/LabsAndTests/EkgDetails';

describe('EKG details component', () => {
  const mockEkg = {
    name: 'Electrocardiogram (EKG)',
    category: '',
    orderedBy: 'Beth M. Smith',
    requestedBy: 'John J. Lydon',
    id: 123,
    date: '2022-04-13T17:42:46.000Z',
    facility: 'school parking lot',
  };

  const initialState = {
    mr: {
      labsAndTests: {
        labsAndTestsDetails: mockEkg,
      },
    },
  };

  const setup = (state = initialState) => {
    return renderWithStoreAndRouter(<EkgDetails record={mockEkg} />, {
      initialState: state,
      reducers: reducer,
      path: '/labs-and-tests/123',
    });
  };

  it('renders without errors', () => {
    const screen = setup();
    expect(screen);
  });

  it('should display the test name', () => {
    const screen = setup();
    const header = screen.getAllByText(mockEkg.name, {
      exact: true,
      selector: 'h1',
    });
    expect(header).to.exist;
  });

  it('should display the formatted date', () => {
    const screen = setup();

    const dateElement = screen.getByText('April 13, 2022', {
      exact: true,
      selector: 'span',
    });
    expect(dateElement).to.exist;
  });
});
