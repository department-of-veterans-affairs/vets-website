import React from 'react';
import { expect } from 'chai';
import { render, fireEvent, waitFor } from '@testing-library/react';
import sinon from 'sinon';

import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';
import { slugifyText } from 'platform/forms-system/src/js/patterns/array-builder';

import PicklistRemoveDependents from '../../../components/picklist/PicklistRemoveDependents';

import { PICKLIST_DATA } from '../../../config/constants';
import { createDoB } from '../../test-helpers';

describe('PicklistRemoveDependents', () => {
  const defaultData = (checked = false) => ({
    dependents: {
      hasDependents: true,
      awarded: [
        {
          key: 'spousy-1234',
          fullName: {
            first: 'SPOUSY',
            last: 'FOSTER',
          },
          dateOfBirth: createDoB(45),
          ssn: '000111234',
          relationshipToVeteran: 'Spouse',
          selected: false,
          awardIndicator: 'Y',
        },
        {
          key: 'penny-1234',
          fullName: {
            first: 'PENNY',
            last: 'FOSTER',
          },
          dateOfBirth: createDoB(11),
          ssn: '000111234',
          relationshipToVeteran: 'Child',
          selected: checked,
          awardIndicator: 'Y',
        },
        {
          key: 'stacy-1234',
          fullName: {
            first: 'STACY',
            last: 'FOSTER',
          },
          dateOfBirth: createDoB(0, 3),
          ssn: '000111234',
          relationshipToVeteran: 'Child',
          selected: false,
          awardIndicator: 'Y',
        },
        {
          key: 'peter-1234',
          fullName: {
            first: 'PETER',
            last: 'FOSTER',
          },
          dateOfBirth: createDoB(82),
          ssn: '000111234',
          relationshipToVeteran: 'Parent',
          selected: false,
          awardIndicator: 'Y',
        },
      ],
      notAwarded: [],
    },
  });

  const renderComponent = ({
    data = defaultData(),
    goBack = () => {},
    goToPath = () => {},
    onSubmit = () => {},
    setFormData = () => {},
    updatePage = () => {},
    onReviewPage = false,
    contentBeforeButtons = <div id="before">before</div>,
    contentAfterButtons = <div id="after">after</div>,
  } = {}) =>
    render(
      <>
        <div name="topScrollElement" />
        <PicklistRemoveDependents
          name="PicklistRemoveDependents"
          title="Spouse info"
          data={data}
          goBack={goBack}
          goToPath={goToPath}
          onSubmit={onSubmit}
          setFormData={setFormData}
          updatePage={updatePage}
          onReviewPage={onReviewPage}
          contentBeforeButtons={contentBeforeButtons}
          contentAfterButtons={contentAfterButtons}
        />
      </>,
    );

  it('should render dependent picklist checkboxes', () => {
    const { container } = renderComponent();

    const checkboxes = $$('va-checkbox', container);
    expect(checkboxes.length).to.equal(4);
    expect(checkboxes.map(cb => cb.getAttribute('label'))).to.deep.equal([
      'SPOUSY FOSTER',
      'PENNY FOSTER',
      'STACY FOSTER',
      'PETER FOSTER',
    ]);
    expect(checkboxes.map(cb => cb.textContent)).to.deep.equal([
      'Spouse, 45 years old',
      'Child, 11 years old',
      'Child, 3 months old',
      'Parent, 82 years oldNote: You can only use this form to remove a dependent parent if they died.',
    ]);
    expect($('va-additional-info', container)).to.exist;
    expect($('.form-progress-buttons', container)).to.exist;
    expect($('#before', container)).to.exist;
    expect($('#after', container)).to.exist;
  });

  it('should update PICKLIST_DATA in form data on change', () => {
    const setFormData = sinon.spy();
    const { container } = renderComponent({ setFormData });

    $('va-checkbox-group', container).__events.vaChange({
      detail: { checked: true },
      target: { getAttribute: () => 'penny-1234' },
    });

    const result = defaultData().dependents.awarded.map((dep, index) => ({
      ...dep,
      key: slugifyText(
        `${dep.fullName.first.toLowerCase()}-${dep.ssn.slice(-4)}`,
        { convertCamelCase: false },
      ),
      selected: index === 1,
    }));

    expect(setFormData.calledOnce).to.be.true;
    expect(setFormData.firstCall.args[0][PICKLIST_DATA]).to.deep.equal(result);
  });

  it('should clear error message after form submitted with no checkboxes checked then one is checked', async () => {
    const goToPath = sinon.spy();
    const { container } = renderComponent({ goToPath });

    fireEvent.submit($('form', container));

    $('va-checkbox-group', container).__events.vaChange({
      detail: { checked: true },
      target: { getAttribute: () => 'penny-1234' },
    });

    await waitFor(() => {
      expect(goToPath.called).to.be.false;
      expect($('va-checkbox-group[error]', container)).to.not.exist;
    });
  });

  it('should show error message if form submitted with no checkboxes checked', async () => {
    const goToPath = sinon.spy();
    const { container } = renderComponent({ goToPath });

    fireEvent.submit($('form', container));
    await waitFor(() => {
      expect(goToPath.called).to.be.false;
      expect($('va-checkbox-group[error]', container)).to.exist;
    });
  });

  it('should show error message if form submitted with no checkboxes checked', async () => {
    const goToPath = sinon.spy();
    const { container } = renderComponent({ goToPath });

    fireEvent.submit($('form', container));
    await waitFor(() => {
      expect(goToPath.called).to.be.false;
      expect($('va-checkbox-group[error]', container)).to.exist;
    });
  });

  it('should proceed when form is submitted with a checkbox checked', async () => {
    const onSubmit = sinon.spy();
    const goToPath = sinon.spy();
    const { container } = renderComponent({
      data: defaultData(true),
      onSubmit,
      goToPath,
    });

    fireEvent.submit($('form', container));

    await waitFor(() => {
      expect(goToPath.called).to.be.true;
      expect(onSubmit.called).to.be.true;
    });
  });

  it('should show parent additional info when parent dependent is present', () => {
    const { container } = renderComponent();

    const additionalInfo = $('va-additional-info', container);
    expect(additionalInfo).to.exist;
    expect(additionalInfo.getAttribute('trigger')).to.equal(
      'How can I remove a dependent parent for reasons other than death?',
    );
  });

  it('should not show parent additional info when no parent dependent is present', () => {
    const dataWithoutParent = {
      dependents: {
        hasDependents: true,
        awarded: [
          {
            key: 'spousy-1234',
            fullName: {
              first: 'SPOUSY',
              last: 'FOSTER',
            },
            dateOfBirth: createDoB(45),
            ssn: '000111234',
            relationshipToVeteran: 'Spouse',
            selected: false,
            awardIndicator: 'Y',
          },
          {
            key: 'penny-1234',
            fullName: {
              first: 'PENNY',
              last: 'FOSTER',
            },
            dateOfBirth: createDoB(11),
            ssn: '000111234',
            relationshipToVeteran: 'Child',
            selected: false,
            awardIndicator: 'Y',
          },
        ],
        notAwarded: [],
      },
    };

    const { container } = renderComponent({ data: dataWithoutParent });

    const additionalInfo = $('va-additional-info', container);
    expect(additionalInfo).to.not.exist;
  });
});
