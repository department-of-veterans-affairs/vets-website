import React from 'react';
import {
  $$,
  $,
} from '@department-of-veterans-affairs/platform-forms-system/ui';
import { expect } from 'chai';
import sinon from 'sinon';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { AdditionalEvidenceIntroPage } from '../../components/AdditionalEvidenceIntroPage';

describe('AdditionalEvidenceIntroPage', () => {
  const page = ({
    data = {},
    goBack = () => {},
    goForward = () => {},
    setFormData = () => {},
    updatePage = () => {},
    onReviewPage = false,
  } = {}) => {
    return (
      <div>
        <AdditionalEvidenceIntroPage
          setFormData={setFormData}
          data={data}
          goBack={goBack}
          goForward={goForward}
          onReviewPage={onReviewPage}
          updatePage={updatePage}
        />
      </div>
    );
  };

  it('should render', () => {
    const { container } = render(page());

    expect($$('va-radio-option').length).to.equal(2);

    const question = container.querySelector('va-radio');
    expect(question).to.have.attribute(
      'label',
      'Are there any supporting documents or additional forms that you want us to review with your claim?',
    );

    expect(container.querySelector('va-radio-option[label="Yes"]')).to.exist;
    expect(container.querySelector('va-radio-option[label="No"]')).to.exist;
    expect(container.querySelector('va-alert-expandable')).to.exist;
  });
  it('should display additional documents in modal when the user choose No but provided additional documents and clicks continue', async () => {
    const data = {
      'view:hasEvidenceChoice': false,
      evidenceChoiceAdditionalDocuments: [
        {
          name: 'supportingDoc.pdf',
        },
      ],
    };

    const { container } = render(page({ data }));

    fireEvent.click($('button[type="submit"]', container));

    await waitFor(() => {
      const modal = container.querySelector('va-modal');
      expect(modal).to.have.attribute('visible', 'true');
      expect(modal.textContent).to.include('supportingDoc.pdf');
    });
  });

  it('should limit displayed files to maxDisplayedItems', async () => {
    const data = {
      'view:hasEvidenceChoice': false,
      evidenceChoiceAdditionalDocuments: [
        {
          name: 'supportingDoc1.pdf',
        },
        {
          name: 'supportingDoc2.pdf',
        },
        {
          name: 'supportingDoc3.pdf',
        },
        {
          name: 'supportingDoc4.pdf',
        },
        {
          name: 'supportingDoc5.pdf',
        },
      ],
    };

    const { container } = render(page({ data }));
    fireEvent.click($('button[type="submit"]', container));

    await waitFor(() => {
      const modal = container.querySelector('va-modal');
      expect(modal.textContent).to.include('supportingDoc1.pdf');
      expect(modal.textContent).to.include('supportingDoc2.pdf');
      expect(modal.textContent).to.include('supportingDoc3.pdf');
      expect(modal.textContent).to.include('2 other files');
      expect(modal.textContent).to.not.include('supportingDoc4.pdf');
    });
  });

  it('should remove additional documents when confirming modal', async () => {
    const setFormData = sinon.spy();
    const data = {
      'view:hasEvidenceChoice': false,
      evidenceChoiceAdditionalDocuments: [
        {
          name: 'supportingDoc1.pdf',
        },
        {
          name: 'supportingDoc2.pdf',
        },
      ],
    };

    const { container } = render(page({ data, setFormData }));
    fireEvent.click($('button[type="submit"]', container));

    await waitFor(() => {
      const modal = container.querySelector('va-modal');
      expect(modal).to.have.attribute('visible', 'true');
    });

    const primaryButton = container.querySelector('va-modal');
    fireEvent(primaryButton, new CustomEvent('primaryButtonClick'));

    await waitFor(() => {
      expect(setFormData.called).to.be.true;
      const updatedData = setFormData.firstCall.args[0];
      expect(updatedData).to.not.have.property(
        'evidenceChoiceAdditionalDocuments',
      );
    });
  });

  it('should show success alert after removing evidence', async () => {
    const setFormData = sinon.spy();
    const data = {
      'view:hasEvidenceChoice': false,
      evidenceChoiceAdditionalDocuments: [
        {
          name: 'supportingDoc1.pdf',
        },
        {
          name: 'supportingDoc2.pdf',
        },
      ],
    };

    const { container } = render(page({ data, setFormData }));
    fireEvent.click($('button[type="submit"]', container));

    await waitFor(() => {
      const modal = container.querySelector('va-modal');
      expect(modal).to.have.attribute('visible', 'true');
    });

    const primaryButton = container.querySelector('va-modal');
    fireEvent(primaryButton, new CustomEvent('primaryButtonClick'));

    await waitFor(() => {
      const alert = container.querySelector('va-alert');
      expect(alert).to.have.attribute('visible', 'true');
      expect(alert.textContent).to.include(
        'We’ve deleted the documents you uploaded supporting your claim.',
      );
    });
  });

  it('should cancel modal and reset selection to Yes after user click cancel change', async () => {
    const setFormData = sinon.spy();
    const data = {
      'view:hasEvidenceChoice': false,
      evidenceChoiceAdditionalDocuments: [
        {
          name: 'supportingDoc1.pdf',
        },
        {
          name: 'supportingDoc2.pdf',
        },
      ],
    };

    const { container } = render(page({ data, setFormData }));
    fireEvent.click($('button[type="submit"]', container));

    await waitFor(() => {
      const modal = container.querySelector('va-modal');
      expect(modal).to.have.attribute('visible', 'true');
    });

    const modal = container.querySelector('va-modal');
    fireEvent(modal, new CustomEvent('secondaryButtonClick'));

    await waitFor(() => {
      expect(setFormData.called).to.be.true;
      const updatedData = setFormData.lastCall.args[0];
      expect(updatedData['view:hasEvidenceChoice']).to.be.true;
      expect(modal).to.have.attribute('visible', 'false');
    });
  });

  it('should cancel modal and reset selection to Yes after user click x on the modal', async () => {
    const setFormData = sinon.spy();
    const data = {
      'view:hasEvidenceChoice': false,
      evidenceChoiceAdditionalDocuments: [
        {
          name: 'supportingDoc1.pdf',
        },
        {
          name: 'supportingDoc2.pdf',
        },
      ],
    };

    const { container } = render(page({ data, setFormData }));
    fireEvent.click($('button[type="submit"]', container));

    await waitFor(() => {
      const modal = container.querySelector('va-modal');
      expect(modal).to.have.attribute('visible', 'true');
    });

    const modal = container.querySelector('va-modal');
    fireEvent(modal, new CustomEvent('closeEvent'));

    await waitFor(() => {
      expect(setFormData.called).to.be.true;
      const updatedData = setFormData.lastCall.args[0];
      expect(updatedData['view:hasEvidenceChoice']).to.be.true;
      expect(modal).to.have.attribute('visible', 'false');
    });
  });

  it('should render update button on review page', () => {
    const { container } = render(page({ onReviewPage: true }));

    const updateButton = container.querySelector('button.usa-button-primary');
    expect(updateButton).to.exist;
    expect(updateButton.textContent).to.equal('Update page');
  });

  it('should not render mental health alert on review page', () => {
    const { container } = render(page({ onReviewPage: true }));

    const additionalInfo = container.querySelector('va-alert-expandable');
    expect(additionalInfo).to.not.exist;
  });
});
