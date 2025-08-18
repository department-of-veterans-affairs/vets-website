import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { beforeEach } from 'mocha';
import { fireEvent, waitFor } from '@testing-library/dom';
import reducer from '../../reducers';
import ChemHemDetails from '../../components/LabsAndTests/ChemHemDetails';
import chemHem from '../fixtures/chemHem.json';
import chemHemWithDateMissing from '../fixtures/chemHemWithDateMissing.json';
import { convertLabsAndTestsRecord } from '../../reducers/labsAndTests';

describe('Chem Hem details component', () => {
  const initialState = {
    mr: {
      labsAndTests: {
        labsAndTestsDetails: convertLabsAndTestsRecord(chemHem),
      },
    },
  };

  let screen;
  beforeEach(() => {
    screen = renderWithStoreAndRouter(
      <ChemHemDetails
        record={convertLabsAndTestsRecord(chemHem)}
        fullState={initialState}
        runningUnitTest
      />,
      {
        initialState,
        reducers: reducer,
        path: '/labs-and-tests/ex-MHV-chReport-1',
      },
    );
  });

  it('renders without errors', () => {
    expect(screen).to.exist;
  });

  it('should display the test name', () => {
    const header = screen.getAllByText('POTASSIUM, SODIUM', {
      exact: true,
      selector: 'h1',
    });
    expect(header).to.exist;
  });

  it('should display the test results', () => {
    const results = screen.getByText('POTASSIUM', {
      exact: true,
      selector: 'h3',
    });
    expect(results).to.exist;
  });

  it('should display the date label', () => {
    expect(screen.getByText('Date and time collected', { exact: false })).to
      .exist;
  });

  it('should display the formatted date', () => {
    const dateElement = screen.getByText('January 20, 2021, 4:38 p.m.', {
      exact: true,
      selector: 'span',
    });
    expect(dateElement).to.exist;
  });

  it('should display the site or sample tested', () => {
    expect(screen.getByText('Site or sample tested', { selector: 'h3' })).to
      .exist;
    expect(screen.getByText('SERUM', { exact: false })).to.exist;
  });

  it('displays who the test was ordered by', () => {
    expect(screen.getByText('Ordered by', { selector: 'h3' })).to.exist;
    expect(screen.getByText('JANE A DOE', { exact: false })).to.exist;
  });

  it('displays the location', () => {
    expect(screen.getByText('Location', { selector: 'h3' })).to.exist;
    expect(screen.getByText('Lab Site 989', { exact: false })).to.exist;
  });

  it('displays lab comments', () => {
    expect(screen.getByText('Lab comments', { selector: 'h3' })).to.exist;
    expect(screen.getByText("Jane's Test 1/20/2021 - Second lab")).to.exist;
    expect(screen.getByText('Added Potassium test')).to.exist;
    expect(screen.getAllByTestId('list-item-multiple')).to.have.length(2);
  });

  it('displays results label', () => {
    expect(screen.getByText('Results', { exact: true, selector: 'h2' })).to
      .exist;
  });

  it('displays a list of results', () => {
    expect(screen.getAllByRole('listitem')).to.exist;
  });

  it('should display the result and interpretation in parentheses', () => {
    expect(screen.getAllByText('Result', { selector: 'h4' }).length).to.eq(2);
    expect(screen.getByText('138 mEq/L (Low)', { selector: 'p' })).to.exist;
  });

  it('should display the reference range with units', () => {
    expect(
      screen.getAllByText('Reference range', { selector: 'h4' }).length,
    ).to.eq(2);
    expect(screen.getByText('3.6-5.1 mEq/L', { selector: 'p' })).to.exist;
  });

  it('should display lab comments', () => {
    expect(
      screen.getAllByText('Lab comments', { selector: 'h4' }).length,
    ).to.eq(2);
    expect(
      screen.getByText('Normal Range Prior to 8-22-02 was: 3.6 - 5.0 mEq/L.', {
        selector: 'p',
      }),
    ).to.exist;
  });

  it('should display a download started message when the download pdf button is clicked', () => {
    fireEvent.click(screen.getByTestId('printButton-1'));
    expect(screen.getByTestId('download-success-alert-message')).to.exist;
  });

  it('should display a download started message when the download txt file button is clicked', () => {
    fireEvent.click(screen.getByTestId('printButton-2'));
    expect(screen.getByTestId('download-success-alert-message')).to.exist;
  });
});

describe('Chem hem details component with no date', () => {
  const initialState = {
    mr: {
      labsAndTests: {
        labsAndTestsDetails: convertLabsAndTestsRecord(chemHemWithDateMissing),
      },
    },
  };

  const screen = renderWithStoreAndRouter(
    <ChemHemDetails
      record={convertLabsAndTestsRecord(chemHemWithDateMissing)}
      fullState={initialState}
      runningUnitTest
    />,
    {
      initialState,
      reducers: reducer,
      path: '/labs-and-tests/123',
    },
  );

  it('should not display the formatted date if effectiveDateTime is missing', () => {
    waitFor(() => {
      expect(screen.queryByTestId('header-time').innerHTML).to.contain(
        'None recorded',
      );
    });
  });
});
