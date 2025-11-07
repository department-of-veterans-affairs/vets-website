import React from 'react';
import { act, render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect } from 'chai';
import sinon from 'sinon';

import EmploymentCheckPage from '../../../containers/EmploymentCheckPage';
import {
  employmentCheckFields,
  employedByVAFields,
} from '../../../definitions/constants';

const TestNavButtons = ({ goForward }) => (
  <button type="button" onClick={goForward}>
    Continue
  </button>
);

let sandbox;
const createSpy = () => (sandbox ? sandbox.spy() : sinon.spy());

const renderPage = (overrideProps = {}) => {
  const props = {
    data: {},
    setFormData: createSpy(),
    goBack: createSpy(),
    goForward: createSpy(),
    NavButtons: TestNavButtons,
    ...overrideProps,
  };

  const utils = render(<EmploymentCheckPage {...props} />);

  return {
    ...utils,
    props,
  };
};

describe('21-4140 container/EmploymentCheckPage', () => {
  let originalScrollTo;
  let user;
  let hadScrollTo;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    user = userEvent;
    hadScrollTo = Object.prototype.hasOwnProperty.call(
      document.body,
      'scrollTo',
    );
    originalScrollTo = document.body.scrollTo;
    if (!originalScrollTo) {
      document.body.scrollTo = () => {};
      originalScrollTo = document.body.scrollTo;
    }
    sandbox.stub(document.body, 'scrollTo');
  });

  afterEach(() => {
    sandbox.restore();
    if (hadScrollTo) {
      document.body.scrollTo = originalScrollTo;
    } else {
      delete document.body.scrollTo;
    }
  });

  it('normalizes legacy employed-by-VA data the first time the page loads', async () => {
    const legacyData = {
      [employedByVAFields.parentObject]: {
        [employedByVAFields.isEmployedByVA]: 'Y',
      },
    };
    const setFormData = sandbox.spy();

    renderPage({ data: legacyData, setFormData });

    await waitFor(() => {
      expect(
        setFormData.calledWithMatch({
          ...legacyData,
          [employmentCheckFields.parentObject]: {
            [employmentCheckFields.hasEmploymentInLast12Months]: 'yes',
          },
        }),
      ).to.be.true;
    });
  });

  it('prevents continuing without a selection and shows a validation error', async () => {
    const goForward = sandbox.spy();

    const { container, findByRole } = renderPage({ goForward });

    const continueButton = await findByRole('button', { name: /continue/i });
    await user.click(continueButton);

    const radioGroup = container.querySelector('va-radio');
    expect(radioGroup?.getAttribute('error')).to.equal(
      'Please select whether you were employed during the past 12 months.',
    );
    expect(goForward.called).to.be.false;
  });

  it('updates form data and continues when the user selects "yes"', async () => {
    const goForward = sandbox.spy();
    const setFormData = sandbox.spy();

    const { container, findByRole } = renderPage({ goForward, setFormData });

    const radio = container.querySelector('va-radio');
    act(() => {
      radio.dispatchEvent(
        new CustomEvent('vaValueChange', {
          detail: { value: 'yes' },
          bubbles: true,
        }),
      );
    });

    const continueButton = await findByRole('button', { name: /continue/i });
    await user.click(continueButton);

    const expectedData = {
      [employmentCheckFields.parentObject]: {
        [employmentCheckFields.hasEmploymentInLast12Months]: 'yes',
      },
    };

    expect(
      setFormData.calledWithMatch(expectedData),
      'setFormData should receive the updated selection',
    ).to.be.true;
    expect(
      goForward.calledWithMatch({ formData: expectedData }),
      'goForward should be invoked with the updated form data',
    ).to.be.true;
  });

  it('updates form data and continues when the user selects "no"', async () => {
    const goForward = sandbox.spy();
    const setFormData = sandbox.spy();

    const { container, findByRole } = renderPage({ goForward, setFormData });

    const radio = container.querySelector('va-radio');
    act(() => {
      radio.dispatchEvent(
        new CustomEvent('vaValueChange', {
          detail: { value: 'no' },
          bubbles: true,
        }),
      );
    });

    const continueButton = await findByRole('button', { name: /continue/i });
    await user.click(continueButton);

    const expectedData = {
      [employmentCheckFields.parentObject]: {
        [employmentCheckFields.hasEmploymentInLast12Months]: 'no',
      },
    };

    expect(
      setFormData.calledWithMatch(expectedData),
      'setFormData should receive the updated selection',
    ).to.be.true;
    expect(
      goForward.calledWithMatch({ formData: expectedData }),
      'goForward should be invoked with the updated form data',
    ).to.be.true;
  });

  it('clears unemployment data when user selects "yes"', async () => {
    const setFormData = sandbox.spy();
    const initialData = {
      [employedByVAFields.parentObject]: {
        [employedByVAFields.hasCertifiedSection3]: true,
        [employedByVAFields.hasUnderstoodSection3]: true,
      },
    };

    const { container } = renderPage({ data: initialData, setFormData });

    const radio = container.querySelector('va-radio');
    act(() => {
      radio.dispatchEvent(
        new CustomEvent('vaValueChange', {
          detail: { value: 'yes' },
          bubbles: true,
        }),
      );
    });

    await waitFor(() => {
      const callArgs = setFormData.lastCall?.args?.[0];
      expect(callArgs?.[employedByVAFields.parentObject]).to.be.undefined;
    });
  });

  it('clears employment data when user selects "no"', async () => {
    const setFormData = sandbox.spy();
    const initialData = {
      employers: [{ name: 'Test Corp' }],
      [employedByVAFields.parentObject]: {
        [employedByVAFields.employerName]: 'VA Hospital',
        [employedByVAFields.hasCertifiedSection2]: true,
      },
    };

    const { container } = renderPage({ data: initialData, setFormData });

    const radio = container.querySelector('va-radio');
    act(() => {
      radio.dispatchEvent(
        new CustomEvent('vaValueChange', {
          detail: { value: 'no' },
          bubbles: true,
        }),
      );
    });

    await waitFor(() => {
      const callArgs = setFormData.lastCall?.args?.[0];
      expect(callArgs?.employers).to.be.undefined;
      expect(
        callArgs?.[employedByVAFields.parentObject]?.[
          employedByVAFields.employerName
        ],
      ).to.be.undefined;
    });
  });

  it('handles blur event when moving away from radio group', async () => {
    const { container } = renderPage();

    const radio = container.querySelector('va-radio');

    // Test that blur doesn't cause errors
    const blurEvent = new Event('blur', { bubbles: true });
    Object.defineProperty(blurEvent, 'currentTarget', {
      value: radio,
      writable: false,
    });

    expect(() => {
      act(() => {
        radio.dispatchEvent(blurEvent);
      });
    }).to.not.throw();
  });

  it('does not show error on blur when user has made a selection', async () => {
    const { container } = renderPage();

    const radio = container.querySelector('va-radio');

    act(() => {
      radio.dispatchEvent(
        new CustomEvent('vaValueChange', {
          detail: { value: 'yes' },
          bubbles: true,
        }),
      );
    });

    const blurEvent = new Event('blur', { bubbles: true });
    Object.defineProperty(blurEvent, 'currentTarget', {
      value: radio,
      writable: false,
    });

    act(() => {
      radio.dispatchEvent(blurEvent);
    });

    await waitFor(() => {
      expect(radio?.getAttribute('error')).to.be.null;
    });
  });

  it('handles value change with empty detail', () => {
    const setFormData = sandbox.spy();
    const { container } = renderPage({ setFormData });

    const radio = container.querySelector('va-radio');
    act(() => {
      radio.dispatchEvent(
        new CustomEvent('vaValueChange', {
          detail: { value: '' },
          bubbles: true,
        }),
      );
    });

    expect(setFormData.called).to.be.false;
  });

  it('clears validation error when user makes a selection after attempted submit', async () => {
    const { container, findByRole } = renderPage();

    const continueButton = await findByRole('button', { name: /continue/i });
    await user.click(continueButton);

    const radio = container.querySelector('va-radio');
    expect(radio?.getAttribute('error')).to.equal(
      'Please select whether you were employed during the past 12 months.',
    );

    act(() => {
      radio.dispatchEvent(
        new CustomEvent('vaValueChange', {
          detail: { value: 'yes' },
          bubbles: true,
        }),
      );
    });

    await waitFor(() => {
      expect(radio?.getAttribute('error')).to.be.null;
    });
  });

  it('handles legacy "N" value normalization', async () => {
    const setFormData = sandbox.spy();
    const legacyData = {
      [employedByVAFields.parentObject]: {
        [employedByVAFields.isEmployedByVA]: 'N',
      },
    };

    renderPage({ data: legacyData, setFormData });

    await waitFor(() => {
      expect(
        setFormData.calledWithMatch({
          ...legacyData,
          [employmentCheckFields.parentObject]: {
            [employmentCheckFields.hasEmploymentInLast12Months]: 'no',
          },
        }),
      ).to.be.true;
    });
  });
});
