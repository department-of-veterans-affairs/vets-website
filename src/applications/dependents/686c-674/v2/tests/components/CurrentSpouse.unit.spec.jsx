import React from 'react';
import { expect } from 'chai';
import { render, fireEvent, waitFor } from '@testing-library/react';
import sinon from 'sinon';

import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';

import CurrentSpouse from '../../components/CurrentSpouse';
import {
  uiSchema,
  schema,
  modalContent,
} from '../../config/chapters/report-add-a-spouse/spouse-information/spouseInformation';

describe('CurrentSpouse', () => {
  const defaultData = {
    vaDependentsDuplicateModals: true,
    spouseInformation: {
      fullName: {
        first: 'Sue',
        last: 'Foster',
      },
      birthDate: '1970-07-07',
      ssn: '333445555',
    },
  };
  const duplicateData = {
    ...defaultData,
    spouseInformation: defaultData.spouseInformation,
    dependents: {
      hasDependents: true,
      awarded: [
        {
          relationshipToVeteran: 'Spouse',
          dateOfBirth: '1970-07-07',
          fullName: {
            first: 'Mary',
            last: 'Foster',
          },
        },
      ],
    },
  };

  const renderComponent = ({
    data = defaultData,
    goBack = () => {},
    goForward = () => {},
    goToPath = () => {},
    setFormData = () => {},
    updatePage = () => {},
    onReviewPage = false,
    contentBeforeButtons = <div id="before">before</div>,
    contentAfterButtons = <div id="after">after</div>,
  } = {}) =>
    render(
      <>
        <div name="topScrollElement" />
        <CurrentSpouse
          name="currentSpouse"
          title="Spouse info"
          data={data}
          goBack={goBack}
          goForward={goForward}
          goToPath={goToPath}
          setFormData={setFormData}
          updatePage={updatePage}
          schema={schema}
          uiSchema={uiSchema}
          onReviewPage={onReviewPage}
          contentBeforeButtons={contentBeforeButtons}
          contentAfterButtons={contentAfterButtons}
        />
      </>,
    );

  it('should render the full name, date of birth fields text & navigation', () => {
    const { container } = renderComponent();

    expect($$('va-text-input', container).length).to.equal(4);
    expect($$('va-memorable-date', container).length).to.equal(1);
    expect($('.form-progress-buttons', container)).to.exist;
    expect($('#before', container)).to.exist;
    expect($('#after', container)).to.exist;
  });

  it('should render update page button on review page', async () => {
    const updatePage = sinon.spy();
    const { container } = renderComponent({ updatePage, onReviewPage: true });

    await fireEvent.click($('va-button[text="Update page"]', container));

    await waitFor(() => {
      expect(updatePage.called).to.be.true;
    });
  });

  it('should navigate to previous page', async () => {
    const goBack = sinon.spy();
    const { container } = renderComponent({ goBack });

    await fireEvent.click($('.usa-button-secondary', container));

    await waitFor(() => {
      expect(goBack.called).to.be.true;
    });
  });

  it('should not show duplicate modal if feature toggle is disabled', async () => {
    const goForward = sinon.spy();
    const goToPath = sinon.spy();

    const { container } = renderComponent({
      data: { ...duplicateData, vaDependentsDuplicateModals: false },
      goForward,
      goToPath,
    });

    await fireEvent.submit($('form', container));

    await waitFor(() => {
      expect($('va-modal[visible="true"]', container)).to.not.exist;
    });
  });

  it('should show a duplicate modal if the dob matches a current spouse on navigating forward', async () => {
    const goForward = sinon.spy();
    const goToPath = sinon.spy();

    const { container } = renderComponent({
      data: duplicateData,
      goForward,
      goToPath,
    });

    await fireEvent.submit($('form', container));

    await waitFor(() => {
      const modal = $('va-modal[visible="true"]', container);
      expect(modal).to.exist;
      expect(modal.getAttribute('modal-title')).to.eq(modalContent.title);
      expect(modal.textContent).to.contain('already listed on your benefits');
    });
  });

  it('should return to current page if modal is closed', async () => {
    const goForward = sinon.spy();
    const goToPath = sinon.spy();

    const { container } = renderComponent({
      data: duplicateData,
      goForward,
      goToPath,
    });

    await fireEvent.submit($('form', container));

    await waitFor(() => {
      const modal = $('va-modal[visible="true"]', container);
      expect(modal).to.exist;
      modal.__events.closeEvent();
    }).then(() => {
      expect(goToPath.called).to.be.false;
      expect(goForward.called).to.be.false;
      expect($('va-modal[visible="true"]', container)).to.not.exist;
    });
  });

  it('should navigate to near beginning of form if modal primary button (cancel add) is used', async () => {
    const goForward = sinon.spy();
    const goToPath = sinon.spy();

    const { container } = renderComponent({
      data: duplicateData,
      goForward,
      goToPath,
    });

    await fireEvent.submit($('form', container));

    await waitFor(() => {
      const modal = $('va-modal[visible="true"]', container);
      expect(modal).to.exist;
      modal.__events.primaryButtonClick();
    }).then(() => {
      expect($('va-modal[visible="true"]', container)).to.not.exist;
      expect(goToPath.calledWith('/options-selection/add-dependents')).to.be
        .true;
      expect(goForward.called).to.be.false;
    });
  });

  it('should navigate to forward if modal secondary button (accept add) is used', async () => {
    const goForward = sinon.spy();
    const goToPath = sinon.spy();

    const { container } = renderComponent({
      data: duplicateData,
      goForward,
      goToPath,
    });

    await fireEvent.submit($('form', container));

    await waitFor(() => {
      const modal = $('va-modal[visible="true"]', container);
      expect(modal).to.exist;
      modal.__events.secondaryButtonClick();
    }).then(() => {
      expect($('va-modal[visible="true"]', container)).to.not.exist;
      expect(goToPath.called).to.be.false;
      expect(goForward.called).to.be.true;
    });
  });
});
