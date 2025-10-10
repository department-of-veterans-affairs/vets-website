import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import { Provider } from 'react-redux';

import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';

import { DependentsInformation } from '../../../components/DependentsInformation';
import { defaultData } from './dependent-data';
import { calculateAge } from '../../../../shared/utils';

function renderPage({
  data = defaultData,
  goBack = () => {},
  goForward = () => {},
  goToPath = () => {},
  setFormData = () => {},
  contentBeforeButtons = null,
  contentAfterButtons = null,
} = {}) {
  const mockStore = {
    getState: () => ({
      dependents: { data: data.dependents },
    }),
    dispatch: () => {},
    subscribe: () => {},
  };
  return render(
    <Provider store={mockStore}>
      <DependentsInformation
        data={data}
        goBack={goBack}
        goToPath={goToPath}
        goForward={goForward}
        setFormData={setFormData}
        contentBeforeButtons={contentBeforeButtons}
        contentAfterButtons={contentAfterButtons}
      />
    </Provider>,
  );
}

describe('DependentsInformation', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    if (sandbox) {
      sandbox.restore();
    }
  });

  it('should render no dependents found message', () => {
    // You shouldn't be able to see this because we don't allow starting the
    // form without
    const { getByText } = renderPage({ data: { dependents: [] } });
    expect(getByText('No dependents found')).to.exist;
  });

  it('renders all sections with prefilled data', () => {
    const { container } = renderPage();
    const child1 = calculateAge(defaultData.dependents[0].dateOfBirth);

    const cards = $$('va-card', container);
    expect(cards).to.have.lengthOf(2);
    const firstList = $$('div.item', cards[0]);
    expect($('h4', cards[0]).textContent).to.include('Morty Smith');
    expect(firstList[0].textContent).to.include('Relationship:\u00a0Child');
    expect(firstList[1].textContent).to.include(
      `Date of birth:\u00a0${child1.dobStr}`,
    );
    expect(firstList[2].textContent).to.include('Age:\u00a011 months old');
    expect(firstList[3].textContent).to.include('SSN:\u00a0●●●–●●-6791');

    expect($('h4', cards[1]).textContent).to.include('Summer Smith');
    expect($('.removal-date', cards[1]).textContent).to.include(
      `Automatic removal date:\u00a0${defaultData.dependents[1].removalDate}`,
    );
    expect($('va-alert[status="info"]', cards[1]));

    expect($$('va-radio-option', container)).to.have.lengthOf(2);
    expect(
      $$('.dd-privacy-hidden[data-dd-action-name]', container),
    ).to.have.lengthOf(11);
  });

  it('should set form data with radio choice', async () => {
    const setFormDataSpy = sandbox.spy();
    const { container } = renderPage({
      data: { dependents: defaultData.dependents },
      setFormData: setFormDataSpy,
    });

    await waitFor(() => {
      $('va-radio', container).__events.vaValueChange({
        detail: { value: defaultData.hasDependentsStatusChanged },
      });
      expect(setFormDataSpy.calledWith(defaultData)).to.be.true;
    });
  });

  it('shows error if no selection is made', async () => {
    const { container } = renderPage({ data: {} });

    await waitFor(() => {
      fireEvent.click($('va-button[continue]', container));
      expect($('va-radio', container).getAttribute('error')).to.eq(
        'Select an option',
      );
    });
  });

  it('navigates forward to review page when "No" is selected', async () => {
    const goToPathSpy = sandbox.spy();
    const goForwardSpy = sandbox.spy();
    const { container } = renderPage({
      data: { hasDependentsStatusChanged: 'N' },
      goToPath: goToPathSpy,
      goForward: goForwardSpy,
    });

    fireEvent.click($('va-button[continue]', container));
    await waitFor(() => {
      expect(goToPathSpy.notCalled).to.be.true;
      expect(goForwardSpy.called).to.be.true;
    });
  });

  it('navigates to exit page when "Yes" is selected', async () => {
    const goToPathSpy = sandbox.spy();
    const goForwardSpy = sandbox.spy();
    const { container } = renderPage({
      data: { hasDependentsStatusChanged: 'Y' },
      goToPath: goToPathSpy,
      goForward: goForwardSpy,
    });

    fireEvent.click($('va-button[continue]', container));

    await waitFor(() => {
      expect(goToPathSpy.called).to.be.true;
      expect(goForwardSpy.notCalled).to.be.true;
    });
  });

  it('navigates back to Veteran info page', async () => {
    const goToPathSpy = sandbox.spy();
    const { container } = renderPage({ data: {}, goToPath: goToPathSpy });

    await waitFor(() => {
      fireEvent.click($('va-button[secondary]', container));
      expect(goToPathSpy.calledWith('/veteran-contact-information')).to.be.true;
    });
  });
});
