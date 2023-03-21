import React from 'react';
import { expect } from 'chai';
import { render, fireEvent, waitFor } from '@testing-library/react';
import sinon from 'sinon';

import EvidencePrivateRecords from '../../components/EvidencePrivateRecords';
import {
  errorMessages,
  SELECTED,
  EVIDENCE_PRIVATE_PATH,
} from '../../constants';
import { getDate } from '../../utils/dates';
import { $, $$ } from '../../utils/ui';

describe('<EvidencePrivateRecords>', () => {
  const validDate = getDate({ offset: { months: -2 } });
  const mockData = {
    contestedIssues: [
      {
        type: 'contestableIssue',
        attributes: {
          ratingIssueSubjectText: 'test 1',
          approxDecisionDate: validDate,
        },
        [SELECTED]: true,
      },
    ],
    additionalIssues: [
      { issue: 'test 2', decisionDate: validDate, [SELECTED]: true },
    ],
  };
  const mockAddress = {
    country: 'USA',
    street: '123 Main',
    street2: '',
    city: 'City',
    state: 'CA',
    postalCode: '90210',
  };
  const mockFacility = {
    providerFacilityName: 'Location 1',
    providerFacilityAddress: mockAddress,
    issues: ['Ankylosis of knee'],
    treatmentDateRange: { from: '2001-01-01', to: '2011-01-01' },
  };
  const mockFacility2 = {
    providerFacilityName: 'Location 2',
    providerFacilityAddress: mockAddress,
    issues: ['Tinnitus'],
    treatmentDateRange: { from: '2002-02-02', to: '2012-02-02' },
  };

  const setup = ({
    index = 0,
    method = '',
    data = mockData,
    goBack = () => {},
    goForward = () => {},
    goToPath = () => {},
    setFormData = () => {},
  } = {}) => (
    <div>
      <EvidencePrivateRecords
        testingIndex={index}
        testingMethod={method}
        data={data}
        goBack={goBack}
        goForward={goForward}
        goToPath={goToPath}
        setFormData={setFormData}
        contentBeforeButtons={<div>before</div>}
        contentAfterButtons={<div>after</div>}
      />
    </div>
  );

  const testAndCloseModal = async container => {
    // modal visible
    await waitFor(() =>
      expect($('va-modal', container).getAttribute('visible')).to.eq('true'),
    );

    // close modal by clicking method-assigned hidden button
    fireEvent.click($('#test-method', container));

    await waitFor(() =>
      expect($('va-modal', container).getAttribute('visible')).to.eq('false'),
    );
  };

  const getErrorElements = container =>
    $$(
      [
        'va-text-input[error]',
        'va-select[error]',
        'va-checkbox-group[error]',
        'va-memorable-date[error]',
      ].join(','),
      container,
    );

  const getAndTestAllErrors = (container, options = {}) => {
    const errors = errorMessages.evidence;
    const errorEls = getErrorElements(container);
    [
      errors.facilityMissing,
      options.ignoreCountry ? null : errors.country, // default set to USA
      errors.street,
      errors.city,
      errors.state,
      errors.postal,
      errors.issuesMissing,
      errors.missingDate,
      errors.missingDate,
    ]
      .filter(Boolean)
      .forEach((error, index) => {
        expect(errorEls[index].error).to.eq(error);
      });
  };

  it('should render', () => {
    const { container } = render(setup());
    expect($('va-modal', container)).to.exist;
    expect($$('va-text-input', container).length).to.eq(5);
    expect($$('va-select', container).length).to.eq(2);
    expect($('va-checkbox-group', container)).to.exist;
    expect($$('va-checkbox', container).length).to.eq(2);
    expect($$('va-memorable-date', container).length).to.eq(2);
    expect($('.vads-c-action-link--green', container)).to.exist;
  });

  // *** CLOSE MODAL ***
  it('should show error messages after closing modal after submitting empty page', async () => {
    const goSpy = sinon.spy();
    const index = 1;
    const data = {
      ...mockData,
      providerFacility: [mockFacility, {}, mockFacility2],
    };
    const page = setup({
      index,
      method: 'onModalClose',
      goForward: goSpy,
      goToPath: goSpy,
      data,
    });
    const { container } = render(page);

    // continue
    fireEvent.click($('.usa-button-primary', container));
    await testAndCloseModal(container);

    expect(goSpy.called).to.be.false;
    await waitFor(() => getAndTestAllErrors(container));
  });

  // *** FORWARD ***
  it('should navigate forward to limitation page with valid data', async () => {
    const goSpy = sinon.spy();
    const data = { ...mockData, providerFacility: [mockFacility] };
    const page = setup({
      index: 0,
      goForward: goSpy,
      data,
    });
    const { container } = render(page);

    // continue
    fireEvent.click($('.usa-button-primary', container));
    await waitFor(() => expect(goSpy.calledWith(data)).to.be.true);
  });

  it('should show modal when submitting an empty page', async () => {
    const goSpy = sinon.spy();
    const data = { ...mockData, providerFacility: [mockFacility, {}] };
    const page = setup({
      index: 1,
      goForward: goSpy,
      data,
    });
    const { container } = render(page);
    fireEvent.submit($('form', container));

    await waitFor(() => {
      expect($('va-modal', container).getAttribute('visible')).to.eq('true');
      expect(goSpy.called).to.be.false;
    });
  });

  it('should not show modal (reveal errors) when going forward on an empty page on first entry only', async () => {
    const goSpy = sinon.spy();
    const index = 0;
    const page = setup({ index, goForward: goSpy });
    const { container } = render(page);

    // back
    fireEvent.click($('.usa-button-primary', container));

    await waitFor(() => {
      expect(goSpy.called).to.be.false;
      getAndTestAllErrors(container, { ignoreCountry: true });
    });
  });

  it('should not navigate, but will show errors when choosing "Yes" after continuing', async () => {
    const goSpy = sinon.spy();
    const index = 1;
    const data = {
      ...mockData,
      providerFacility: [mockFacility, {}, mockFacility2],
    };
    const page = setup({
      index,
      method: 'onModalYes',
      goForward: goSpy,
      goToPath: goSpy,
      data,
    });
    const { container } = render(page);

    // continue
    fireEvent.click($('.usa-button-primary', container));
    await testAndCloseModal(container);

    await waitFor(() => {
      expect(goSpy.called).to.be.false;
      getAndTestAllErrors(container);
    });
  });

  it('should navigate forward to next index when choosing "No" after continuing', async () => {
    const goSpy = sinon.spy();
    const index = 2;
    const data = {
      ...mockData,
      providerFacility: [mockFacility, mockFacility2],
    };
    const page = setup({
      index,
      method: 'onModalNo',
      goForward: goSpy,
      data,
    });
    const { container } = render(page);

    // continue
    fireEvent.click($('.usa-button-primary', container));
    await testAndCloseModal(container);

    await waitFor(() => {
      expect(getErrorElements(container).length).to.eq(0);

      // going forward requires passing the form data
      expect(goSpy.calledWith(data)).to.be.true;
      // index still at 2, because we've moved beyond the indexed pages
      expect(goSpy.firstCall.args[1]).to.eq(index);
    });
  });

  it('should navigate forward to private limitation page when choosing "No" after continuing', async () => {
    const goSpy = sinon.spy();
    const data = {
      ...mockData,
      providerFacility: [
        mockFacility,
        mockFacility2,
        { providerFacilityName: 'Location 3' },
      ],
    };
    const page = setup({
      index: 2,
      method: 'onModalNo',
      goForward: goSpy,
      data,
    });
    const { container } = render(page);

    // continue
    fireEvent.click($('.usa-button-primary', container));

    await testAndCloseModal(container);
    await waitFor(() => expect(goSpy.calledWith(data)).to.be.true);
  });

  // *** BACK ***
  it('should navigate back to private records request page with valid data', async () => {
    const goSpy = sinon.spy();
    const data = { ...mockData, providerFacility: [mockFacility] };
    const index = 0;
    const page = setup({
      index,
      goBack: goSpy,
      data,
    });
    const { container } = render(page);

    // back
    fireEvent.click($('.usa-button-secondary', container));
    // passing a negative index is okay, we're leaving the indexed pages
    await waitFor(() => expect(goSpy.calledWith(index - 1)).to.be.true);
  });

  it('should not show modal when going back on an empty page on first entry only', async () => {
    const goSpy = sinon.spy();
    const index = 0;
    const page = setup({ index, goBack: goSpy, goToPath: goSpy });
    const { container } = render(page);

    // back
    fireEvent.click($('.usa-button-secondary', container));

    await waitFor(() => {
      expect(goSpy.called).to.be.true;
      expect(goSpy.calledWith(index - 1)).to.be.true;
    });
  });

  it('should navigate back to previous index page, after choosing "Yes" in modal', async () => {
    const goSpy = sinon.spy();
    const index = 1;
    const data = {
      ...mockData,
      providerFacility: [mockFacility, {}, mockFacility2],
    };
    const page = setup({
      index,
      method: 'onModalYes',
      goBack: goSpy,
      goToPath: goSpy,
      data,
    });
    const { container } = render(page);

    // continue
    fireEvent.click($('.usa-button-secondary', container));
    await testAndCloseModal(container);

    await waitFor(() => {
      expect(goSpy.calledWith(`/${EVIDENCE_PRIVATE_PATH}?index=${index - 1}`))
        .to.be.true;
    });
  });

  it('should navigate back one index when choosing "No" after continuing', async () => {
    const goSpy = sinon.spy();
    const index = 1;
    const page = setup({
      index,
      method: 'onModalNo',
      goToPath: goSpy,
      data: { ...mockData, providerFacility: [mockFacility, {}] },
    });
    const { container } = render(page);

    // back
    fireEvent.click($('.usa-button-secondary', container));
    await testAndCloseModal(container);

    await waitFor(() => {
      expect(goSpy.called).to.be.true;
      expect(goSpy.calledWith(`/${EVIDENCE_PRIVATE_PATH}?index=${index - 1}`))
        .to.be.true;
    });
  });

  // *** ADD ANOTHER ***
  it('should navigate from zero index to a new empty facility page, of index 1, with valid data', async () => {
    const goSpy = sinon.spy();
    const data = {
      ...mockData,
      providerFacility: [mockFacility, {}, mockFacility2],
    };
    const index = 0;
    const page = setup({
      index,
      goToPath: goSpy,
      data,
    });
    const { container } = render(page);

    // add
    fireEvent.click($('.vads-c-action-link--green', container));

    await waitFor(() => {
      expect($('va-modal', container).getAttribute('visible')).to.eq('false');
      expect(goSpy.calledWith(`/${EVIDENCE_PRIVATE_PATH}?index=${index + 1}`))
        .to.be.true;
    });
  });

  it('should navigate from zero index, with valid data, to next index when inserting another entry', async () => {
    const goSpy = sinon.spy();
    const providerFacility = [mockFacility, mockFacility2, {}];
    const data = { ...mockData, providerFacility };
    const index = 0;
    const page = setup({
      index,
      goToPath: goSpy,
      data,
    });
    const { container } = render(page);

    // add
    fireEvent.click($('.vads-c-action-link--green', container));

    await waitFor(() => {
      expect($('va-modal', container).getAttribute('visible')).to.eq('false');
      expect(goSpy.calledWith(`/${EVIDENCE_PRIVATE_PATH}?index=${index + 1}`))
        .to.be.true;
    });
  });

  it('should show modal when adding another on an empty page', async () => {
    const goSpy = sinon.spy();
    const index = 1;
    const page = setup({
      index,
      method: 'onModalNo',
      goToPath: goSpy,
      data: { ...mockData, providerFacility: [mockFacility, {}] },
    });
    const { container } = render(page);
    fireEvent.click($('.vads-c-action-link--green', container));

    await waitFor(() => {
      expect($('va-modal', container).getAttribute('visible')).to.eq('true');
      expect(goSpy.called).to.be.false;
    });
  });

  it('should not navigate, but show errors after adding another and choosing "Yes" on an empty page', async () => {
    const goSpy = sinon.spy();
    const index = 1;
    const page = setup({
      index,
      method: 'onModalYes',
      goToPath: goSpy,
      data: { ...mockData, providerFacility: [mockFacility, {}] },
    });
    const { container } = render(page);

    // add
    fireEvent.click($('.vads-c-action-link--green', container));

    await testAndCloseModal(container);

    await waitFor(() => {
      getAndTestAllErrors(container);
      expect(goSpy.called).to.be.false;
    });
  });

  it('should not navigate, but clear all data after adding another and choosing "No" on an empty page', async () => {
    const goSpy = sinon.spy();
    const data = {
      ...mockData,
      providerFacility: [mockFacility, { providerFacilityName: 'test' }, {}],
    };
    const index = 1;
    const page = setup({
      index,
      method: 'onModalNo',
      goToPath: goSpy,
      data,
    });
    const { container } = render(page);

    // continue
    fireEvent.click($('.vads-c-action-link--green', container));

    await testAndCloseModal(container);

    await waitFor(() => {
      // stay on the same index, but clear all fields
      expect(goSpy.calledWith(`/${EVIDENCE_PRIVATE_PATH}?index=${index}`)).to.be
        .true;
      expect(getErrorElements(container).length).to.eq(0);
    });
  });

  it('should show error when start treatment date is in the future', async () => {
    const from = getDate({ offset: { years: +1 } });
    const data = {
      ...mockData,
      providerFacility: [{ treatmentDateRange: { from } }],
    };
    const page = setup({ index: 0, data, method: 'onBlur:from' });
    const { container } = render(page);

    const dateFrom = $('va-memorable-date', container);
    // blur date inputs - va-text-input blur works, but not the va-memorable-date?
    // fireEvent.blur(dateFrom);
    fireEvent.click($('#test-method', container));

    await waitFor(() => {
      expect(dateFrom.error).to.contain(errorMessages.evidence.pastDate);
    });
  });

  it('should show error when last treatment date is in the future', async () => {
    const to = getDate({ offset: { years: +1 } });
    const data = {
      ...mockData,
      providerFacility: [{ treatmentDateRange: { to } }],
    };
    const page = setup({ index: 0, data, method: 'onBlur:to' });
    const { container } = render(page);

    const dateTo = $$('va-memorable-date', container)[1];
    // blur date inputs - va-text-input blur works, but not the va-memorable-date?
    // fireEvent.blur(dateFrom);
    fireEvent.click($('#test-method', container));

    await waitFor(() => {
      expect(dateTo.error).to.contain(errorMessages.evidence.pastDate);
    });
  });

  it('should show an error when the start treament date is too far in the past', async () => {
    const from = getDate({ offset: { years: -101 } });
    const data = {
      ...mockData,
      providerFacility: [{ treatmentDateRange: { from } }],
    };
    const page = setup({ index: 0, data, method: 'onBlur:from' });
    const { container } = render(page);

    const dateFrom = $('va-memorable-date', container);
    // blur date inputs - va-text-input blur works, but not the va-memorable-date?
    // fireEvent.blur(dateFrom);
    fireEvent.click($('#test-method', container));

    await waitFor(() => {
      expect(dateFrom.error).to.contain(errorMessages.evidence.newerDate);
    });
  });

  it('should show an error when the last treatment date is too far in the past', async () => {
    const to = getDate({ offset: { years: -101 } });
    const data = {
      ...mockData,
      providerFacility: [{ treatmentDateRange: { to } }],
    };
    const page = setup({ index: 0, data, method: 'onBlur:to' });
    const { container } = render(page);

    const dateTo = $$('va-memorable-date', container)[1];
    // blur date inputs - va-text-input blur works, but not the va-memorable-date?
    // fireEvent.blur(dateTo);
    fireEvent.click($('#test-method', container));

    await waitFor(() => {
      expect(dateTo.error).to.contain(errorMessages.evidence.newerDate);
    });
  });

  it('should show an error when the last treatment date is before the start', async () => {
    const from = getDate({ offset: { years: -5 } });
    const to = getDate({ offset: { years: -10 } });
    const data = {
      ...mockData,
      providerFacility: [{ treatmentDateRange: { from, to } }],
    };
    const page = setup({ index: 0, data, method: 'onBlur:to' });
    const { container } = render(page);

    const dateTo = $$('va-memorable-date', container)[1];
    // blur date inputs - va-text-input blur works, but not the va-memorable-date?
    // fireEvent.blur(dateTo);
    fireEvent.click($('#test-method', container));

    await waitFor(() => {
      expect(dateTo.error).to.contain(errorMessages.endDateBeforeStart);
    });
  });

  it('should show an error when the issue is not unique', async () => {
    const data = {
      ...mockData,
      providerFacility: [mockFacility, mockFacility],
    };
    const page = setup({ index: 1, data });
    const { container } = render(page);

    const input = $('va-text-input', container);
    fireEvent.blur(input);

    await waitFor(() => {
      expect(input.error).to.contain(errorMessages.evidence.unique);
    });
  });
});
