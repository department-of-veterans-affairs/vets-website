import React from 'react';
import { expect } from 'chai';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import RecordListSection from '../../../components/shared/RecordListSection';
import reducer from '../../../reducers';

describe('RecordListSection component', () => {
  const mockChildren = <div data-testid="mock-children">Child Content</div>;
  const testDate = new Date();
  let screen;

  it('renders access alert when accessAlert is true', () => {
    screen = renderWithStoreAndRouter(
      <RecordListSection
        accessAlert
        accessAlertType="error"
        initialFhirLoad={testDate}
      />,
      {
        initialState: {},
        reducers: reducer,
        path: '/',
      },
    );

    expect(screen.queryByTestId('expired-alert-message')).to.exist;
  });

  it('renders access alert when initialFhirLoadTimedOut is true', () => {
    screen = renderWithStoreAndRouter(
      <RecordListSection
        accessAlert={false}
        accessAlertType="warning"
        initialFhirLoad={testDate}
      />,
      {
        initialState: {},
        reducers: reducer,
        path: '/',
      },
    );

    expect(screen.queryByTestId('initial-fhir-loading-indicator')).to.exist;
  });

  it('renders initial FHIR loading spinner when listCurrentAsOf is undefined', () => {
    screen = renderWithStoreAndRouter(
      <RecordListSection
        accessAlert={false}
        initialFhirLoad={testDate}
        listCurrentAsOf={undefined}
      />,
      {
        initialState: {},
        reducers: reducer,
        path: '/',
      },
    );

    expect(screen.queryByTestId('initial-fhir-loading-indicator')).to.exist;
  });

  it('renders children when recordCount is 0', () => {
    screen = renderWithStoreAndRouter(
      <RecordListSection
        recordCount={0}
        accessAlert={false}
        initialFhirLoad={testDate}
        listCurrentAsOf={testDate}
      >
        {mockChildren}
      </RecordListSection>,
      {
        initialState: {},
        reducers: reducer,
        path: '/',
      },
    );

    expect(screen.getByTestId('mock-children')).to.exist;
  });

  it('renders loading spinner when no recordCount and not initial FHIR load', () => {
    screen = renderWithStoreAndRouter(
      <RecordListSection
        accessAlert={false}
        initialFhirLoad={null}
        listCurrentAsOf={null}
      />,
      {
        initialState: {},
        reducers: reducer,
        path: '/',
      },
    );

    expect(screen.queryByTestId('loading-indicator')).to.exist;
  });
});
