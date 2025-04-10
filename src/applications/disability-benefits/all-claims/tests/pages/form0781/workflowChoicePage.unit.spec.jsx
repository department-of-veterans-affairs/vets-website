import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import {
  $,
  $$,
} from '@department-of-veterans-affairs/platform-forms-system/ui';
import WorkflowChoicePage, {
  form0781WorkflowChoices,
  modalTitleUpload,
  modalTitleOnline,
  modalTitleSkip,
} from '../../../content/form0781/workflowChoicePage';

describe('WorkflowChoicePage', () => {
  const page = ({
    data = {},
    goBack = () => {},
    goForward = () => {},
    setFormData = () => {},
  } = {}) => {
    return (
      <div>
        <WorkflowChoicePage
          setFormData={setFormData}
          data={data}
          goBack={goBack}
          goForward={goForward}
        />
      </div>
    );
  };

  it('renders all 3 workflow options', () => {
    const data = {
      'view:mentalHealthWorkflowChoice': null,
    };
    const { container } = render(page(data));
    expect($$('va-radio-option', container).length).to.eq(3);
  });

  it('shows error if no selection is made', () => {
    const goForwardSpy = sinon.spy();
    const { container } = render(page({ goForward: goForwardSpy }));
    const radio = $('va-radio', container);

    fireEvent.click($('button[type="submit"]', container));

    expect(radio.getAttribute('error')).to.exist;
    expect(goForwardSpy.called).to.be.false;
  });

  it('advances with valid selection and no mental health data', () => {
    const goForwardSpy = sinon.spy();
    const data = {
      'view:mentalHealthWorkflowChoice':
        form0781WorkflowChoices.COMPLETE_ONLINE_FORM,
    };

    const { container } = render(page({ data, goForward: goForwardSpy }));

    fireEvent.click($('button[type="submit"]', container));
    expect(goForwardSpy.called).to.be.true;
  });

  it('opens modal when mental health data is present and choice changes', () => {
    const goForwardSpy = sinon.spy();
    const data = {
      'view:mentalHealthWorkflowChoice':
        form0781WorkflowChoices.OPT_OUT_OF_FORM0781,
      treatmentReceivedVaProvider: {
        vaPaid: true,
      },
    };

    const { container } = render(page({ data, goForward: goForwardSpy }));
    fireEvent.click($('button[type="submit"]', container));

    const modal = $('va-modal[visible="true"]', container);

    expect(modal).to.exist;
    expect(goForwardSpy.called).to.be.false;
  });

  it('clicking confirm deletes data and proceeds', () => {
    const goForwardSpy = sinon.spy();
    const setFormDataSpy = sinon.spy();
    const data = {
      'view:previousMentalHealthWorkflowChoice':
        form0781WorkflowChoices.COMPLETE_ONLINE_FORM,
      'view:mentalHealthWorkflowChoice':
        form0781WorkflowChoices.OPT_OUT_OF_FORM0781,
      treatmentReceivedVaProvider: { vaPaid: true },
      supportingEvidenceReports: { police: true },
    };

    const { container } = render(
      page({
        data,
        goForward: goForwardSpy,
        setFormData: setFormDataSpy,
      }),
    );

    fireEvent.click($('button[type="submit"]', container));

    const modal = container.querySelector('va-modal');
    modal.__events.primaryButtonClick();

    expect(setFormDataSpy.called).to.be.true;

    const cleanedData = setFormDataSpy.lastCall.args[0];
    expect(cleanedData.treatmentReceivedVaProvider).to.be.undefined;
    expect(cleanedData.supportingEvidenceReports).to.be.undefined;
  });

  it('clicking cancel in modal closes it without progressing', () => {
    const goForwardSpy = sinon.spy();
    const setFormDataSpy = sinon.spy();
    const data = {
      'view:mentalHealthWorkflowChoice':
        form0781WorkflowChoices.OPT_OUT_OF_FORM0781,
      treatmentReceivedVaProvider: { vaPaid: true },
    };

    const { container } = render(
      page({
        data,
        goForward: goForwardSpy,
        setFormData: setFormDataSpy,
      }),
    );

    fireEvent.click($('button[type="submit"]', container));

    const modal = container.querySelector('va-modal');
    modal.__events.secondaryButtonClick();

    expect($('va-modal[visible="true"]', container)).to.not.exist;
    expect(goForwardSpy.called).to.be.false;
    expect(setFormDataSpy.called).to.be.false;
  });

  it('shows alert after data deletion', () => {
    const goForwardSpy = sinon.spy();
    const setFormDataSpy = sinon.spy();
    const data = {
      'view:previousMentalHealthWorkflowChoice':
        form0781WorkflowChoices.COMPLETE_ONLINE_FORM,
      'view:mentalHealthWorkflowChoice':
        form0781WorkflowChoices.OPT_OUT_OF_FORM0781,
      treatmentReceivedVaProvider: { vaPaid: true },
      supportingEvidenceReports: { police: true },
    };

    const { container } = render(
      page({
        data,
        goForward: goForwardSpy,
        setFormData: setFormDataSpy,
      }),
    );

    fireEvent.click($('button[type="submit"]', container));

    const modal = container.querySelector('va-modal');
    modal.__events.primaryButtonClick();

    expect($('va-alert[visible="true"]', container)).to.exist;
  });

  it('removes alert on close', () => {
    const goForwardSpy = sinon.spy();
    const setFormDataSpy = sinon.spy();
    const data = {
      'view:previousMentalHealthWorkflowChoice':
        form0781WorkflowChoices.COMPLETE_ONLINE_FORM,
      'view:mentalHealthWorkflowChoice':
        form0781WorkflowChoices.OPT_OUT_OF_FORM0781,
      treatmentReceivedVaProvider: { vaPaid: true },
      supportingEvidenceReports: { police: true },
    };

    const { container } = render(
      page({
        data,
        goForward: goForwardSpy,
        setFormData: setFormDataSpy,
      }),
    );

    fireEvent.click($('button[type="submit"]', container));

    const modal = container.querySelector('va-modal');
    modal.__events.primaryButtonClick();

    const alert = $('va-alert[visible="true"]', container);
    alert.__events.closeEvent();

    expect($('va-alert[visible="true"]', container)).to.not.exist;
  });

  it('changes modal data for pdf upload', () => {
    const goForwardSpy = sinon.spy();
    const setFormDataSpy = sinon.spy();
    const data = {
      'view:previousMentalHealthWorkflowChoice':
        form0781WorkflowChoices.COMPLETE_ONLINE_FORM,
      'view:mentalHealthWorkflowChoice':
        form0781WorkflowChoices.SUBMIT_PAPER_FORM,
      treatmentReceivedVaProvider: { vaPaid: true },
    };

    const { container } = render(
      page({
        data,
        goForward: goForwardSpy,
        setFormData: setFormDataSpy,
      }),
    );

    fireEvent.click($('button[type="submit"]', container));

    const modal = container.querySelector('va-modal');
    const modalTitle = modal.getAttribute('modal-title');
    expect(modalTitle).to.equal(modalTitleUpload);
  });

  it('changes modal data for online form', () => {
    const goForwardSpy = sinon.spy();
    const setFormDataSpy = sinon.spy();
    const data = {
      'view:previousMentalHealthWorkflowChoice':
        form0781WorkflowChoices.SUBMIT_PAPER_FORM,
      'view:mentalHealthWorkflowChoice':
        form0781WorkflowChoices.COMPLETE_ONLINE_FORM,
      treatmentReceivedVaProvider: { vaPaid: true },
    };

    const { container } = render(
      page({
        data,
        goForward: goForwardSpy,
        setFormData: setFormDataSpy,
      }),
    );

    fireEvent.click($('button[type="submit"]', container));

    const modal = container.querySelector('va-modal');
    const modalTitle = modal.getAttribute('modal-title');
    expect(modalTitle).to.equal(modalTitleOnline);
  });

  it('changes modal data for skipping the form', () => {
    const goForwardSpy = sinon.spy();
    const setFormDataSpy = sinon.spy();
    const data = {
      'view:previousMentalHealthWorkflowChoice':
        form0781WorkflowChoices.SUBMIT_PAPER_FORM,
      'view:mentalHealthWorkflowChoice':
        form0781WorkflowChoices.OPT_OUT_OF_FORM0781,
      treatmentReceivedVaProvider: { vaPaid: true },
    };

    const { container } = render(
      page({
        data,
        goForward: goForwardSpy,
        setFormData: setFormDataSpy,
      }),
    );

    fireEvent.click($('button[type="submit"]', container));

    const modal = container.querySelector('va-modal');
    const modalTitle = modal.getAttribute('modal-title');
    expect(modalTitle).to.equal(modalTitleSkip);
  });
});
