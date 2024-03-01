import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import reducers from '../../reducers';
import PrintOnlyPage from '../../containers/PrintOnlyPage';
import rxDetailsResponse from '../fixtures/prescriptionDetails.json';
import PrescriptionPrintOnly from '../../components/PrescriptionDetails/PrescriptionPrintOnly';

describe('Medications List Print Page', () => {
  const setup = (params = {}) => {
    return renderWithStoreAndRouter(
      <PrintOnlyPage>
        <span>This is the page content.</span>
      </PrintOnlyPage>,
      {
        initialState: {},
        reducers,
        path: '/1',
        ...params,
      },
    );
  };

  it('renders without errors', () => {
    const screen = setup();
    expect(screen);
  });

  it('renders content as body of table', () => {
    setup();
    const text = document.querySelector('span').textContent;
    expect(text).to.contain('This is the page content.');
  });
});

describe('Medications detail page with PrintOnlyPage component wrapper', () => {
  const prescription = {
    ...rxDetailsResponse.data.attributes,
  };
  const setup = (rx = prescription) => {
    return renderWithStoreAndRouter(
      <PrintOnlyPage
        title="Medication details"
        preface={
          rx
            ? 'This is a single medication record from your VA medical records. When you download a medication record, we also include a list of allergies and reactions in your VA medical records.'
            : "We're sorry. There's a problem with our system. Check back later. If you need help now, call your VA pharmacy. You can find the pharmacy phone number on the prescription label."
        }
      >
        {rx && (
          <>
            <PrescriptionPrintOnly
              hideLineBreak
              rx={rx}
              refillHistory={[]}
              isDetailsRx
            />
          </>
        )}
      </PrintOnlyPage>,
      {
        initialState: {},
        reducers: {},
        path: '/prescriptions/1234567891',
      },
    );
  };
  it('renders without errors', () => {
    const screen = setup();
    expect(screen);
  });
  it('shows error message if the API call fails', () => {
    const screen = setup(null);
    const text =
      "We're sorry. There's a problem with our system. Check back later.";
    const el = screen.getByTestId('print-only-preface');
    expect(el).to.exist;
    expect(el.textContent).to.include(text);
  });
  it('displays crisis line text', () => {
    const screen = setup();
    const el = screen.getByTestId('crisis-line-print-only');
    const text =
      'If you’re ever in crisis and need to talk to someone right away';
    expect(el).to.exist;
    expect(el.textContent).to.include(text);
  });
});
