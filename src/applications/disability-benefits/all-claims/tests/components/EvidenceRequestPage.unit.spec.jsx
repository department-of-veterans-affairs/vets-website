import React from 'react';
import {
  $$,
  $,
} from '@department-of-veterans-affairs/platform-forms-system/ui';
import { expect } from 'chai';
import sinon from 'sinon';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { EvidenceRequestPage } from '../../components/EvidenceRequestPage';

describe('EvidenceRequestPage', () => {
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
        <EvidenceRequestPage
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
      'Are there medical records related to your claim that you’d like us to access on your behalf from VA or private medical centers?',
    );
    expect(question).to.have.attribute(
      'hint',
      'If you select “Yes,” we’ll request these records from VA or private medical centers. Or you can upload copies of your private medical records.',
    );
    expect(container.querySelector('va-radio-option[label="Yes"]')).to.exist;
    expect(container.querySelector('va-radio-option[label="No"]')).to.exist;
    expect(container.querySelector('va-additional-info')).to.exist;
  });
  it('should display the VA treatment centers in modal when the user choose No but provided VA treatment centers and clicks continue', async () => {
    const data = {
      'view:hasMedicalRecords': false,
      'view:selectableEvidenceTypes': {
        'view:hasVaMedicalRecords': true,
      },
      vaTreatmentFacilities: [
        { treatmentCenterName: 'VA Hospital 1' },
        { treatmentCenterName: 'VA Hospital 2' },
      ],
    };

    const { container } = render(page({ data }));

    fireEvent.click($('button[type="submit"]', container));

    await waitFor(() => {
      const modal = container.querySelector('va-modal');
      expect(modal).to.have.attribute('visible', 'true');
      expect(modal.textContent).to.include(
        'You can choose not to submit medical records to support your claim. If you do so, we’ll remove the information you shared about these VA medical centers:',
      );
      expect(modal.textContent).to.include('VA Hospital 1');
      expect(modal.textContent).to.include('VA Hospital 2');
    });
  });

  it('should display the private medical records in modal when the user choose No but provided medical records previously and clicks continue', async () => {
    const data = {
      'view:hasMedicalRecords': false,
      'view:selectableEvidenceTypes': {
        'view:hasPrivateMedicalRecords': true,
      },
      privateMedicalRecordAttachments: [
        { name: 'record1.pdf' },
        { name: 'record2.pdf' },
      ],
    };

    const { container } = render(page({ data }));
    fireEvent.click($('button[type="submit"]', container));

    await waitFor(() => {
      const modal = container.querySelector('va-modal');
      expect(modal).to.have.attribute('visible', 'true');
      expect(modal.textContent).to.include(
        'You can choose not to submit medical records to support your claim. If you do so, we’ll delete these medical records you uploaded:',
      );
      expect(modal.textContent).to.include('record1.pdf');
      expect(modal.textContent).to.include('record2.pdf');
    });
  });

  it('should display the private treatment centers in modal when the user choose No but provided treatment centers previously and clicks continue', async () => {
    const data = {
      'view:hasMedicalRecords': false,
      'view:selectableEvidenceTypes': {
        'view:hasPrivateMedicalRecords': true,
      },
      providerFacility: [
        { providerFacilityName: 'Private Clinic 1' },
        { providerFacilityName: 'Private Clinic 2' },
      ],
    };

    const { container } = render(page({ data }));
    fireEvent.click($('button[type="submit"]', container));

    await waitFor(() => {
      const modal = container.querySelector('va-modal');
      expect(modal).to.have.attribute('visible', 'true');
      expect(modal.textContent).to.include(
        'You can choose not to submit medical records to support your claim. If you do so, we’ll remove the information you shared about these private medical centers:',
      );
      expect(modal.textContent).to.include('Private Clinic 1');
      expect(modal.textContent).to.include('Private Clinic 2');
    });
  });

  it('should display the private treatment centers and private medical records with records on the bottom in modal when the user choose No but provided treatment centers and private medical records previously and clicks continue', async () => {
    const data = {
      'view:hasMedicalRecords': false,
      'view:selectableEvidenceTypes': {
        'view:hasPrivateMedicalRecords': true,
      },
      providerFacility: [
        { providerFacilityName: 'Private Clinic 1' },
        { providerFacilityName: 'Private Clinic 2' },
      ],
      privateMedicalRecordAttachments: [
        { name: 'record1.pdf' },
        { name: 'record2.pdf' },
      ],
    };

    const { container } = render(page({ data }));
    fireEvent.click($('button[type="submit"]', container));

    await waitFor(() => {
      const modal = container.querySelector('va-modal');
      expect(modal).to.have.attribute('visible', 'true');
      expect(modal.textContent).to.include(
        'You can choose not to submit medical records to support your claim. If you do so, we’ll remove the information you shared about these private medical centers:',
      );
      expect(modal.textContent).to.include(
        'We’ll also delete these medical records you uploaded:',
      );
      const lists = modal.querySelectorAll('ul');
      expect(lists.length).to.equal(2);

      const facilityItems = lists[0].querySelectorAll('li');
      const facilityTexts = Array.from(facilityItems).map(li => li.textContent);

      expect(facilityTexts).to.include('Private Clinic 1');
      expect(facilityTexts).to.include('Private Clinic 2');

      const recordItems = lists[1].querySelectorAll('li');
      const recordTexts = Array.from(recordItems).map(li => li.textContent);
      expect(recordTexts).to.include('record1.pdf');
      expect(recordTexts).to.include('record2.pdf');
    });
  });

  it('should limit displayed facilities to maxDisplayedItems', async () => {
    const data = {
      'view:hasMedicalRecords': false,
      'view:selectableEvidenceTypes': {
        'view:hasVaMedicalRecords': true,
      },
      vaTreatmentFacilities: [
        { treatmentCenterName: 'VA Hospital 1' },
        { treatmentCenterName: 'VA Hospital 2' },
        { treatmentCenterName: 'VA Hospital 3' },
        { treatmentCenterName: 'VA Hospital 4' },
        { treatmentCenterName: 'VA Hospital 5' },
      ],
    };

    const { container } = render(page({ data }));
    fireEvent.click($('button[type="submit"]', container));

    await waitFor(() => {
      const modal = container.querySelector('va-modal');
      expect(modal.textContent).to.include('VA Hospital 1');
      expect(modal.textContent).to.include('VA Hospital 2');
      expect(modal.textContent).to.include('VA Hospital 3');
      expect(modal.textContent).to.include('2 other medical centers');
      expect(modal.textContent).to.not.include('VA Hospital 4');
    });
  });

  it('should remove evidence when confirming modal', async () => {
    const setFormData = sinon.spy();
    const data = {
      'view:hasMedicalRecords': false,
      'view:selectableEvidenceTypes': {
        'view:hasVaMedicalRecords': true,
      },
      vaTreatmentFacilities: [{ treatmentCenterName: 'VA Hospital 1' }],
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
      expect(updatedData).to.not.have.property('vaTreatmentFacilities');
      expect(
        updatedData['view:selectableEvidenceTypes']['view:hasVaMedicalRecords'],
      ).to.be.false;
    });
  });

  it('should delete privateMedicalRecordAttachments when confirming modal (private uploads only)', async () => {
    const setFormData = sinon.spy();
    const data = {
      'view:hasMedicalRecords': false,
      'view:selectableEvidenceTypes': {
        'view:hasPrivateMedicalRecords': true,
      },
      privateMedicalRecordAttachments: [{ name: 'record1.pdf' }],
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
        'privateMedicalRecordAttachments',
      );
      const selectableTypes1 = updatedData['view:selectableEvidenceTypes'];
      expect(selectableTypes1['view:hasPrivateMedicalRecords']).to.be.false;
    });
  });

  it('should delete providerFacility when confirming modal (private facilities only)', async () => {
    const setFormData = sinon.spy();
    const data = {
      'view:hasMedicalRecords': false,
      'view:selectableEvidenceTypes': {
        'view:hasPrivateMedicalRecords': true,
      },
      providerFacility: [{ providerFacilityName: 'Private Clinic 1' }],
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
      expect(updatedData).to.not.have.property('providerFacility');
      const selectableTypes2 = updatedData['view:selectableEvidenceTypes'];
      expect(selectableTypes2['view:hasPrivateMedicalRecords']).to.be.false;
    });
  });

  it('should delete both private evidence keys when confirming modal (uploads and facilities)', async () => {
    const setFormData = sinon.spy();
    const data = {
      'view:hasMedicalRecords': false,
      'view:selectableEvidenceTypes': {
        'view:hasPrivateMedicalRecords': true,
      },
      privateMedicalRecordAttachments: [{ name: 'record1.pdf' }],
      providerFacility: [{ providerFacilityName: 'Private Clinic 1' }],
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
        'privateMedicalRecordAttachments',
      );
      expect(updatedData).to.not.have.property('providerFacility');
      const selectableTypes3 = updatedData['view:selectableEvidenceTypes'];
      expect(selectableTypes3['view:hasPrivateMedicalRecords']).to.be.false;
    });
  });

  it('should delete vaTreatmentFacilities when confirming modal even when hasVAEvidence is false', async () => {
    const setFormData = sinon.spy();
    const data = {
      'view:hasMedicalRecords': false,
      'view:selectableEvidenceTypes': {},
      vaTreatmentFacilities: [{ treatmentCenterName: 'VA Hospital 1' }],
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
      expect(updatedData).to.not.have.property('vaTreatmentFacilities');
      const selectableTypes = updatedData['view:selectableEvidenceTypes'] || {};
      expect(selectableTypes['view:hasVaMedicalRecords']).to.be.false;
    });
  });

  it('should delete providerFacility when confirming modal even when hasPrivateEvidence is false', async () => {
    const setFormData = sinon.spy();
    const data = {
      'view:hasMedicalRecords': false,
      'view:selectableEvidenceTypes': {},
      providerFacility: [{ providerFacilityName: 'Private Clinic 1' }],
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
      expect(updatedData).to.not.have.property('providerFacility');
      const selectableTypes = updatedData['view:selectableEvidenceTypes'] || {};
      expect(selectableTypes['view:hasPrivateMedicalRecords']).to.be.false;
    });
  });

  it('should delete privateMedicalRecordAttachments when confirming modal even when hasPrivateEvidence is false', async () => {
    const setFormData = sinon.spy();
    const data = {
      'view:hasMedicalRecords': false,
      'view:selectableEvidenceTypes': {},
      privateMedicalRecordAttachments: [{ name: 'record1.pdf' }],
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
        'privateMedicalRecordAttachments',
      );
      const selectableTypes = updatedData['view:selectableEvidenceTypes'] || {};
      expect(selectableTypes['view:hasPrivateMedicalRecords']).to.be.false;
    });
  });

  it('should show success alert after removing evidence', async () => {
    const setFormData = sinon.spy();
    const data = {
      'view:hasMedicalRecords': false,
      'view:selectableEvidenceTypes': {
        'view:hasVaMedicalRecords': true,
      },
      vaTreatmentFacilities: [{ treatmentCenterName: 'VA Hospital 1' }],
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
        'We’ve removed information about your medical centers from this claim.',
      );
    });
  });

  it('should cancel modal and reset selection to Yes after user click cancel change', async () => {
    const setFormData = sinon.spy();
    const data = {
      'view:hasMedicalRecords': false,
      'view:selectableEvidenceTypes': {
        'view:hasVaMedicalRecords': true,
      },
      vaTreatmentFacilities: [{ treatmentCenterName: 'VA Hospital 1' }],
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
      expect(updatedData['view:hasMedicalRecords']).to.be.true;
      expect(modal).to.have.attribute('visible', 'false');
    });
  });

  it('should cancel modal and reset selection to Yes after user click x on the modal', async () => {
    const setFormData = sinon.spy();
    const data = {
      'view:hasMedicalRecords': false,
      'view:selectableEvidenceTypes': {
        'view:hasVaMedicalRecords': true,
      },
      vaTreatmentFacilities: [{ treatmentCenterName: 'VA Hospital 1' }],
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
      expect(updatedData['view:hasMedicalRecords']).to.be.true;
      expect(modal).to.have.attribute('visible', 'false');
    });
  });

  it('should set evidence flags and patient4142Acknowledgement to false and go forward when No selected after evidence removed', () => {
    const setFormData = sinon.spy();
    const goForward = sinon.spy();
    const data = {
      'view:hasMedicalRecords': false,
      'view:selectableEvidenceTypes': {
        'view:hasVaMedicalRecords': true,
        'view:hasPrivateMedicalRecords': true,
      },
      patient4142Acknowledgement: true,
    };

    const { container } = render(page({ data, setFormData, goForward }));
    fireEvent.click($('button[type="submit"]', container));

    expect(setFormData.called).to.be.true;
    const updatedData = setFormData.firstCall.args[0];
    const selectableTypes = updatedData['view:selectableEvidenceTypes'] || {};
    expect(selectableTypes['view:hasVaMedicalRecords']).to.be.false;
    expect(selectableTypes['view:hasPrivateMedicalRecords']).to.be.false;
    expect(updatedData.patient4142Acknowledgement).to.be.false;

    expect(goForward.called).to.be.true;
    expect(goForward.firstCall.args[0]).to.deep.equal(updatedData);
  });

  it('should render update button on review page', () => {
    const { container } = render(page({ onReviewPage: true }));

    const updateButton = container.querySelector('button.usa-button-primary');
    expect(updateButton).to.exist;
    expect(updateButton.textContent).to.equal('Update page');
  });

  it('should not render additional info on review page', () => {
    const { container } = render(page({ onReviewPage: true }));

    const additionalInfo = container.querySelector('va-additional-info');
    expect(additionalInfo).to.not.exist;
  });
});
