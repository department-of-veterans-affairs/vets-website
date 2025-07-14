import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import { Provider } from 'react-redux';

import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';

import { DependentsInformation } from '../../../components/DependentsInformation';
import { defaultData } from './dependent-data';

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
      dependents: { data: defaultData.dependents },
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
  it('renders all sections with prefilled data', () => {
    const { container } = renderPage();

    const cards = $$('va-card', container);
    expect(cards).to.have.lengthOf(2);
    const firstList = $$('div.item', cards[0]);
    expect($('h4', cards[0]).textContent).to.include('Morty Smith');
    expect(firstList[0].textContent).to.include('Relationship:\u00a0Child');
    expect(firstList[1].textContent).to.include(
      'Date of birth:\u00a0January 4, 2011',
    );
    expect(firstList[2].textContent).to.include('Age:\u00a014 years old');
    expect(firstList[3].textContent).to.include('SSN:\u00a0●●●–●●-6791');

    expect($('h4', cards[1]).textContent).to.include('Summer Smith');
    expect($('.removal-date', cards[1]).textContent).to.include(
      'Automatic removal date:\u00a0August 1, 2026',
    );
    expect($('va-alert[status="info"]', cards[1]));

    expect($$('va-radio-option', container)).to.have.lengthOf(2);
    expect(
      $$('.dd-privacy-hidden[data-dd-action-name]', container),
    ).to.have.lengthOf(11);
  });

  it('should set form data with radio choice', () => {
    const setFormDataSpy = sinon.spy();
    const { container } = renderPage({ data: {}, setFormData: setFormDataSpy });

    $('va-radio', container).__events.vaValueChange({
      detail: { value: defaultData.hasDependentsStatusChanged },
    });

    expect(setFormDataSpy.calledWith(defaultData)).to.be.true;
  });

  it('shows error if no selection is made', () => {
    const { container } = renderPage({ data: {} });

    fireEvent.click($('button[type="submit"]', container));

    expect($('va-radio', container).getAttribute('error')).to.eq(
      'Select an option',
    );
  });

  it('navigates forward when "No" is selected', () => {
    const goToPathSpy = sinon.spy();
    const goForwardSpy = sinon.spy();
    const { container } = renderPage({
      data: { hasDependentsStatusChanged: 'N' },
      goToPath: goToPathSpy,
      goForward: goForwardSpy,
    });

    fireEvent.click($('button[type="submit"]', container));

    expect(goToPathSpy.notCalled).to.be.true;
    expect(goForwardSpy.called).to.be.true;
  });

  it('navigates forward when "Yes" is selected', () => {
    const goToPathSpy = sinon.spy();
    const goForwardSpy = sinon.spy();
    const { container } = renderPage({
      data: { hasDependentsStatusChanged: 'Y' },
      goToPath: goToPathSpy,
      goForward: goForwardSpy,
    });

    fireEvent.click($('button[type="submit"]', container));

    expect(goToPathSpy.notCalled).to.be.true;
    expect(goForwardSpy.called).to.be.true;
  });

  it('navigates back to Veteran info page', () => {
    const goToPathSpy = sinon.spy();
    const { container } = renderPage({ data: {}, goToPath: goToPathSpy });

    fireEvent.click($('button.usa-button-secondary', container));

    expect(goToPathSpy.calledWith('/veteran-contact-information')).to.be.true;
  });
});
