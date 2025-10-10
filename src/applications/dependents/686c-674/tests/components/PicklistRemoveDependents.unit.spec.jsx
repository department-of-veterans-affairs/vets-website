import React from 'react';
import { expect } from 'chai';
import { render, fireEvent, waitFor } from '@testing-library/react';
import sinon from 'sinon';
import { sub, format } from 'date-fns';

import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';
import { slugifyText } from 'platform/forms-system/src/js/patterns/array-builder';

import PicklistRemoveDependents from '../../components/PicklistRemoveDependents';
import optionPage from '../../config/chapters/picklist/removeDependentPicklist';

describe('PicklistRemoveDependents', () => {
  const createDoB = (yearsAgo = 0, monthsAgo = 0) =>
    format(
      sub(new Date(), { years: yearsAgo, months: monthsAgo }),
      'yyyy-MM-dd',
    );
  const defaultData = {
    dependents: {
      hasDependents: true,
      awarded: [
        {
          fullName: {
            first: 'SPOUSY',
            last: 'FOSTER',
          },
          dateOfBirth: createDoB(45),
          ssn: '702023332',
          relationshipToVeteran: 'Spouse',
          awardIndicator: 'Y',
        },
        {
          fullName: {
            first: 'PENNY',
            last: 'FOSTER',
          },
          dateOfBirth: createDoB(11),
          ssn: '793473479',
          relationshipToVeteran: 'Child',
          awardIndicator: 'Y',
        },
        {
          fullName: {
            first: 'STACY',
            last: 'FOSTER',
          },
          dateOfBirth: createDoB(0, 3),
          ssn: '798703232',
          relationshipToVeteran: 'Child',
          awardIndicator: 'Y',
        },
        {
          fullName: {
            first: 'PETER',
            last: 'FOSTER',
          },
          dateOfBirth: createDoB(82),
          ssn: '997010104',
          relationshipToVeteran: 'Parent',
          awardIndicator: 'Y',
        },
      ],
      notAwarded: [],
    },
  };

  const renderComponent = ({
    data = defaultData,
    goBack = () => {},
    goForward = () => {},
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
          goForward={goForward}
          setFormData={setFormData}
          updatePage={updatePage}
          schema={optionPage.schema}
          uiSchema={optionPage.uiSchema}
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
      'Parent, 82 years oldNote: A parent dependent can only be removed if they have died',
    ]);
    expect($('va-additional-info', container)).to.exist;
    expect($('.form-progress-buttons', container)).to.exist;
    expect($('#before', container)).to.exist;
    expect($('#after', container)).to.exist;
  });

  it('should update "view:removeDependentPickList" in form data on change', () => {
    const setFormData = sinon.spy();
    const { container } = renderComponent({ setFormData });

    $('va-checkbox-group', container).__events.vaChange({
      detail: { checked: true },
      target: { getAttribute: () => 'penny-3479' },
    });

    const result = defaultData.dependents.awarded.map((dep, index) => ({
      ...dep,
      key: slugifyText(
        `${dep.fullName.first.toLowerCase()}-${dep.ssn.slice(-4)}`,
      ),
      selected: index === 1,
    }));

    expect(setFormData.calledOnce).to.be.true;
    expect(
      setFormData.firstCall.args[0]['view:removeDependentPickList'],
    ).to.deep.equal(result);
  });

  it('should show error message if form submitted with no checkboxes checked', async () => {
    const goForward = sinon.spy();
    const { container } = renderComponent({ goForward });

    fireEvent.submit($('form', container));
    await waitFor(() => {
      expect(goForward.called).to.be.false;
      expect($('va-checkbox-group[error]', container)).to.exist;
    });
  });
});
