import React from 'react';
import {
  $$,
  $,
} from '@department-of-veterans-affairs/platform-forms-system/ui';
import { expect } from 'chai';
import sinon from 'sinon';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { MedicalRecordsPage } from '../../components/MedicalRecordsPage';

describe('MedicalRecordsPage', () => {
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
        <MedicalRecordsPage
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

    expect($$('va-checkbox').length).to.equal(2);

    const question = container.querySelector('va-checkbox-group');
    expect(question).to.have.attribute(
      'label',
      'What types of medical records would you like us to access on your behalf?',
    );

    expect(container.querySelector('va-checkbox[label="VA medical records"]'))
      .to.exist;
    expect(
      container.querySelector('va-checkbox[label="Private medical records"]'),
    ).to.exist;
    expect(container.querySelector('va-additional-info')).to.exist;
  });
  it('should display the VA treatment centers in modal when the user unclick the VA medical records option but provided VA treatment centers and clicks continue', async () => {
    const data = {
      'view:selectableEvidenceTypes': {
        'view:hasVaMedicalRecords': false,
        'view:hasPrivateMedicalRecords': true,
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
      expect(modal.textContent).to.include('VA Hospital 1');
      expect(modal.textContent).to.include('VA Hospital 2');
    });
  });

  it('should display the private medical records in modal when the user unclick the private medical records option but provided medical records previously and clicks continue', async () => {
    const data = {
      'view:selectableEvidenceTypes': {
        'view:hasVaMedicalRecords': true,
        'view:hasPrivateMedicalRecords': false,
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
      expect(modal.textContent).to.include('record1.pdf');
      expect(modal.textContent).to.include('record2.pdf');
    });
  });

  it('should display the private treatment centers in modal when the user unclick private medical records but provided treatment centers previously and clicks continue', async () => {
    const data = {
      'view:selectableEvidenceTypes': {
        'view:hasVaMedicalRecords': true,
        'view:hasPrivateMedicalRecords': false,
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
      expect(modal.textContent).to.include('Private Clinic 1');
      expect(modal.textContent).to.include('Private Clinic 2');
    });
  });

  it('should display the private treatment centers and private medical records in modal when the user unclick private medical records but provided treatment centers and private medical records previously and clicks continue', async () => {
    const data = {
      'view:selectableEvidenceTypes': {
        'view:hasVaMedicalRecords': true,
        'view:hasPrivateMedicalRecords': false,
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
      expect(modal.textContent).to.include('Private Clinic 1');
      expect(modal.textContent).to.include('Private Clinic 2');
      expect(modal.textContent).to.include('record1.pdf');
      expect(modal.textContent).to.include('record2.pdf');
    });
  });

  it('should limit displayed facilities to maxDisplayedItems', async () => {
    const data = {
      'view:selectableEvidenceTypes': {
        'view:hasVaMedicalRecords': false,
        'view:hasPrivateMedicalRecords': true,
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

  it('should delete vaTreatmentFacilities when confirming modal', async () => {
    const setFormData = sinon.spy();
    const data = {
      'view:selectableEvidenceTypes': {
        'view:hasVaMedicalRecords': false,
        'view:hasPrivateMedicalRecords': true,
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
    });
  });
  it('should delete privateMedicalRecordAttachments when confirming modal', async () => {
    const setFormData = sinon.spy();
    const data = {
      'view:selectableEvidenceTypes': {
        'view:hasVaMedicalRecords': true,
        'view:hasPrivateMedicalRecords': false,
      },
      privateMedicalRecordAttachments: [
        { name: 'record1.pdf' },
        { name: 'record2.pdf' },
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
        'privateMedicalRecordAttachments',
      );
    });
  });
  it('should delete providerFacility when confirming modal', async () => {
    const setFormData = sinon.spy();
    const data = {
      'view:selectableEvidenceTypes': {
        'view:hasVaMedicalRecords': true,
        'view:hasPrivateMedicalRecords': false,
      },
      providerFacility: [
        { providerFacilityName: 'Private Clinic 1' },
        { providerFacilityName: 'Private Clinic 2' },
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
      expect(updatedData).to.not.have.property('providerFacility');
    });
  });
  it('should delete both providerFacility and privateMedicalRecordAttachments when confirming modal', async () => {
    const setFormData = sinon.spy();
    const data = {
      'view:selectableEvidenceTypes': {
        'view:hasVaMedicalRecords': true,
        'view:hasPrivateMedicalRecords': false,
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
      expect(updatedData).to.not.have.property(
        'privateMedicalRecordAttachments',
      );
    });
  });

  it('should show success alert after removing evidence', async () => {
    const setFormData = sinon.spy();
    const data = {
      'view:selectableEvidenceTypes': {
        'view:hasVaMedicalRecords': false,
        'view:hasPrivateMedicalRecords': true,
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

  it('should cancel modal and reset selection after user click cancel change', async () => {
    const setFormData = sinon.spy();
    const data = {
      'view:selectableEvidenceTypes': {
        'view:hasVaMedicalRecords': true,
        'view:hasPrivateMedicalRecords': true,
      },
      providerFacility: [{ providerFacilityName: 'Private Clinic 1' }],
    };

    const { container, rerender } = render(page({ data, setFormData }));
    const checkboxGroup = container.querySelector('va-checkbox-group');

    const customEvent = new CustomEvent('vaChange', { bubbles: true });
    Object.defineProperty(customEvent, 'target', {
      value: {
        checked: false,
        getAttribute: () => 'view:hasPrivateMedicalRecords',
      },
      writable: false,
    });

    fireEvent(checkboxGroup, customEvent);

    await waitFor(() => expect(setFormData.called).to.be.true);

    const updatedData = setFormData.lastCall.args[0];
    rerender(page({ data: updatedData, setFormData }));

    fireEvent.click($('button[type="submit"]', container));

    await waitFor(() => {
      const modal = container.querySelector('va-modal');
      expect(modal).to.have.attribute('visible', 'true');
    });

    const modal = container.querySelector('va-modal');
    fireEvent(modal, new CustomEvent('secondaryButtonClick'));

    await waitFor(() => {
      expect(modal).to.have.attribute('visible', 'false');
    });

    await waitFor(() => {
      const finalData = setFormData.lastCall.args[0];
      expect(
        finalData['view:selectableEvidenceTypes'][
          'view:hasPrivateMedicalRecords'
        ],
      ).to.be.true;
    });
  });

  it('should cancel modal and reset selection after user click x on the modal', async () => {
    const setFormData = sinon.spy();
    const data = {
      'view:selectableEvidenceTypes': {
        'view:hasVaMedicalRecords': true,
        'view:hasPrivateMedicalRecords': true,
      },
      providerFacility: [{ providerFacilityName: 'Private Clinic 1' }],
    };

    const { container, rerender } = render(page({ data, setFormData }));
    const checkboxGroup = container.querySelector('va-checkbox-group');

    const customEvent = new CustomEvent('vaChange', { bubbles: true });
    Object.defineProperty(customEvent, 'target', {
      value: {
        checked: false,
        getAttribute: () => 'view:hasPrivateMedicalRecords',
      },
      writable: false,
    });

    fireEvent(checkboxGroup, customEvent);

    await waitFor(() => expect(setFormData.called).to.be.true);

    const updatedData = setFormData.lastCall.args[0];
    rerender(page({ data: updatedData, setFormData }));

    fireEvent.click($('button[type="submit"]', container));

    await waitFor(() => {
      const modal = container.querySelector('va-modal');
      expect(modal).to.have.attribute('visible', 'true');
    });

    const modal = container.querySelector('va-modal');
    fireEvent(modal, new CustomEvent('closeEvent'));

    await waitFor(() => {
      expect(modal).to.have.attribute('visible', 'false');
    });

    await waitFor(() => {
      const finalData = setFormData.lastCall.args[0];
      expect(
        finalData['view:selectableEvidenceTypes'][
          'view:hasPrivateMedicalRecords'
        ],
      ).to.be.true;
    });
  });

  it('should render update button on review page', () => {
    const { container } = render(page({ onReviewPage: true }));

    const updateButton = container.querySelector('button.usa-button-primary');
    expect(updateButton).to.exist;
    expect(updateButton.textContent).to.equal('Update page');
  });
});
