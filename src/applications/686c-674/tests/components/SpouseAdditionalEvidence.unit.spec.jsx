import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import configureStore from 'redux-mock-store';
import { SpouseAdditionalEvidence } from '../../components/SpouseAdditionalEvidence';

const mockStore = configureStore([]);

const renderWithStore = (state = {}) => {
  const store = mockStore({
    form: { data: state }, // Ensure `form.data` is always available
  });

  return render(
    <Provider store={store}>
      <SpouseAdditionalEvidence />
    </Provider>,
  );
};

describe('SpouseAdditionalEvidence', () => {
  it('should render the introductory text', () => {
    const { container } = renderWithStore({});
    const introText = container.querySelector('p');

    expect(introText).to.not.be.null;
    expect(introText.textContent).to.include(
      'Based on your answers, you’ll need to submit supporting evidence to add your spouse as your dependent.',
    );
  });

  it('should render the supporting evidence accordion', () => {
    const { container } = renderWithStore({});
    const evidenceAccordion = container.querySelector('#supporting-evidence');

    expect(evidenceAccordion).to.not.be.null;
    expect(evidenceAccordion.getAttribute('header')).to.equal(
      'Supporting evidence you need to submit',
    );
  });

  it('should display common-law marriage requirements', () => {
    const { container } = renderWithStore({
      currentMarriageInformation: { type: 'COMMON-LAW' },
    });

    const listItems = [...container.querySelectorAll('li')].map(
      li => li.textContent,
    );

    expect(
      listItems.some(text =>
        text.includes('2 Statements of Marital Relationship'),
      ),
    ).to.be.true;
    expect(listItems.some(text => text.includes('Download VA Form 21-4170'))).to
      .be.true;
    expect(listItems.some(text => text.includes('Download VA Form 21-4171'))).to
      .be.true;
  });

  it('should display tribal marriage requirements', () => {
    const { container } = renderWithStore({
      currentMarriageInformation: { type: 'TRIBAL' },
    });

    const listItems = [...container.querySelectorAll('li')].map(
      li => li.textContent,
    );

    expect(
      listItems.some(text =>
        text.includes('Signed statements from you and your spouse'),
      ),
    ).to.be.true;
    expect(
      listItems.some(text =>
        text.includes('Signed statements from at least two people'),
      ),
    ).to.be.true;
    expect(
      listItems.some(text =>
        text.includes(
          'A signed statement from the person who performed the ceremony',
        ),
      ),
    ).to.be.true;
  });

  it('should display proxy marriage requirements', () => {
    const { container } = renderWithStore({
      currentMarriageInformation: { type: 'PROXY' },
    });

    const listItems = [...container.querySelectorAll('li')].map(
      li => li.textContent,
    );

    expect(
      listItems.some(text =>
        text.includes(
          'Copies of all documents and certificates issued in connection with your proxy marriage',
        ),
      ),
    ).to.be.true;
  });

  it('should render the submit your files section', () => {
    const { container } = renderWithStore({});
    const submitFilesHeader = container.querySelector('h3');

    expect(submitFilesHeader).to.not.be.null;
    expect(submitFilesHeader.textContent).to.include(
      'Submit your files online',
    );
  });

  it('should render the document upload instructions', () => {
    const { container } = renderWithStore({});
    const uploadInstructions = container.querySelector('va-additional-info');

    expect(uploadInstructions).to.not.be.null;
    expect(uploadInstructions.getAttribute('trigger')).to.equal(
      'Document upload instructions',
    );
  });
});
