import React from 'react';
import { expect } from 'chai';
import { render, fireEvent } from '@testing-library/react';
import sinon from 'sinon';

import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';

import PicklistRemoveDependentFollowup from '../../components/PicklistRemoveDependentFollowup';

import { PICKLIST_DATA } from '../../config/constants';
import { createDoB } from '../test-helpers';

describe('PicklistRemoveDependentFollowup', () => {
  const defaultData = (options = {}, parentSelected = true) => ({
    [PICKLIST_DATA]: [
      {
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
      {
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
        fullName: {
          first: 'SPOUSY',
          last: 'FOSTER',
        },
        dateOfBirth: createDoB(45),
        ssn: '000111234',
        relationshipToVeteran: 'Spouse',
        selected: true,
        awardIndicator: 'Y',
        ...options,
      },
      {
        fullName: {
          first: 'PETER',
          last: 'FOSTER',
        },
        dateOfBirth: createDoB(82),
        ssn: '000111234',
        relationshipToVeteran: 'Parent',
        selected: parentSelected,
        awardIndicator: 'Y',
      },
    ],
  });

  const renderComponent = ({
    data = defaultData(),
    goBack = () => {},
    goForward = () => {},
    goToPath = () => {},
    setFormData = () => {},
    contentBeforeButtons = <div id="before">before</div>,
    contentAfterButtons = <div id="after">after</div>,
    testUrl = '?index=2',
  } = {}) =>
    render(
      <>
        <div name="topScrollElement" />
        <PicklistRemoveDependentFollowup
          name="PicklistRemoveDependentFollowup"
          title="Spouse info"
          data={data}
          goBack={goBack}
          goForward={goForward}
          goToPath={goToPath}
          setFormData={setFormData}
          contentBeforeButtons={contentBeforeButtons}
          contentAfterButtons={contentAfterButtons}
          urlTestingOnly={testUrl}
        />
      </>,
    );

  it('should render dependent picklist checkboxes', () => {
    const { container } = renderComponent();

    const radioWrap = $('va-radio', container);
    expect(radioWrap).to.exist;
    expect(radioWrap.getAttribute('label')).to.equal(
      'Do any of these apply to SPOUSY?',
    );
    const options = $$('va-radio-option', container);
    expect(options.length).to.equal(2);
    expect(options.map(cb => cb.getAttribute('label'))).to.deep.equal([
      'Your marriage to SPOUSY ended',
      'SPOUSY died',
    ]);
    expect(radioWrap).to.exist;
    expect($('.form-progress-buttons', container)).to.exist;
    expect($('#before', container)).to.exist;
    expect($('va-button[back]', container)).to.exist;
    expect($('va-button[continue]', container)).to.exist;
    expect($('#after', container)).to.exist;
  });

  it('should not render continue button on exit page', () => {
    const { container } = renderComponent({
      testUrl: '?index=3&page=parent-exit',
    });

    expect($('va-button[back]', container)).to.exist;
    expect($('va-button[continue]', container)).to.not.exist;
  });

  it('should update PICKLIST_DATA in form data on change', () => {
    const setFormData = sinon.spy();
    const { container } = renderComponent({ setFormData });

    $('va-radio', container).__events.vaValueChange({
      detail: { value: 'marriedEnded' },
      target: { getAttribute: () => 'stacy-1234' },
    });

    const result = defaultData()[PICKLIST_DATA].map(
      (dep, index) =>
        index === 2 ? { ...dep, removalReason: 'marriedEnded' } : dep,
    );

    expect(setFormData.calledOnce).to.be.true;
    expect(setFormData.firstCall.args[0][PICKLIST_DATA]).to.deep.equal(result);
  });

  it('should navigate to spouse follow up page', () => {
    const goToPath = sinon.spy();
    const { container } = renderComponent({
      goToPath,
      data: defaultData({ removalReason: 'marriageEnded' }),
    });

    fireEvent.submit($('form', container));

    expect(goToPath.calledOnce).to.be.true;
    expect(goToPath.firstCall.args[0]).to.equal(
      'remove-dependent?index=2&page=spouse-marriage-ended',
    );
  });

  it('should navigate to spouse follow up page', () => {
    const goToPath = sinon.spy();
    const { container } = renderComponent({
      goToPath,
      data: defaultData({ removalReason: 'death' }),
    });

    fireEvent.submit($('form', container));

    expect(goToPath.calledOnce).to.be.true;
    expect(goToPath.firstCall.args[0]).to.equal(
      'remove-dependent?index=2&page=spouse-death',
    );
  });

  it('should navigate to spouse marriage ended follow up page', () => {
    const goToPath = sinon.spy();
    const { container } = renderComponent({
      goToPath,
      testUrl: '?index=2&page=spouse-reason-to-remove',
      data: defaultData({
        removalReason: 'marriageEnded',
      }),
    });

    fireEvent.submit($('form', container));

    expect(goToPath.calledOnce).to.be.true;
    expect(goToPath.firstCall.args[0]).to.equal(
      'remove-dependent?index=2&page=spouse-marriage-ended',
    );
  });

  it('should navigate using goForward after continuing past last spouse marriage ended page when there are further selected dependents', () => {
    const goToPath = sinon.spy();
    const goForward = sinon.spy();
    const { container } = renderComponent({
      goToPath,
      goForward,
      testUrl: '?index=2&page=spouse-marriage-ended',
      data: defaultData(
        {
          removalReason: 'marriageEnded',
          endType: 'divorce',
          endDate: '2020-1-1',
          endCity: 'Test',
          endState: 'AK',
        },
        false, // unselect parent
      ),
    });

    fireEvent.submit($('form', container));

    expect(goToPath.notCalled).to.be.true;
    expect(goForward.calledOnce).to.be.true;
  });

  it('should navigate to parent removal follow up page', () => {
    const goToPath = sinon.spy();
    const { container } = renderComponent({
      goToPath,
      testUrl: '?index=2&page=spouse-marriage-ended',
      data: defaultData({
        removalReason: 'marriageEnded',
        endType: 'divorce',
        endDate: '2020-1-1',
        endCity: 'Test',
        endState: 'AK',
      }),
    });

    fireEvent.submit($('form', container));

    expect(goToPath.calledOnce).to.be.true;
    expect(goToPath.firstCall.args[0]).to.equal('remove-dependent?index=3');
  });

  it('should navigate to parent removal follow up page', () => {
    const goToPath = sinon.spy();
    const { container } = renderComponent({
      goToPath,
      testUrl: '?index=2&page=spouse-marriage-ended',
      data: defaultData({
        removalReason: 'marriageEnded',
        endType: 'divorce',
        endDate: '2020-1-1',
        endCity: 'Test',
        endState: 'AK',
      }),
    });

    fireEvent.submit($('form', container));

    expect(goToPath.calledOnce).to.be.true;
    expect(goToPath.firstCall.args[0]).to.equal('remove-dependent?index=3');
  });

  it('should navigate back to main picklist page', () => {
    const goToPath = sinon.spy();
    const goBack = sinon.spy();
    const { container } = renderComponent({
      goToPath,
      goBack,
      testUrl: '?index=0',
    });

    fireEvent.click($('va-button[back]', container));

    expect(goToPath.notCalled).to.be.true;
    expect(goBack.calledOnce).to.be.true;
  });

  it('should navigate back to first page of previous selected dependent', () => {
    const goToPath = sinon.spy();
    const { container } = renderComponent({
      goToPath,
      testUrl: '?index=3&page=parent-reason-to-remove',
    });

    fireEvent.click($('va-button[back]', container));

    expect(goToPath.calledOnce).to.be.true;
    expect(goToPath.firstCall.args[0]).to.equal(
      'remove-dependent?index=2&page=spouse-death',
    );
  });

  it('should navigate back to spouse reason to remove page', () => {
    const goToPath = sinon.spy();
    const { container } = renderComponent({
      goToPath,
      testUrl: '?index=2&page=spouse-death',
    });

    fireEvent.click($('va-button[back]', container));

    expect(goToPath.calledOnce).to.be.true;
    expect(goToPath.firstCall.args[0]).to.equal(
      'remove-dependent?index=2&page=spouse-reason-to-remove',
    );
  });

  it('should render last spouse marriage ended page when the url doesnt have any parameters (navigating back from review & submit)', () => {
    const goToPath = sinon.spy();
    const goForward = sinon.spy();
    const { container } = renderComponent({
      goToPath,
      goForward,
      testUrl: '?',
      data: defaultData(
        {
          removalReason: 'marriageEnded',
          endType: 'divorce',
          endDate: '2020-1-1',
          endCity: 'Test',
          endState: 'AK',
        },
        false, // unselect parent
      ),
    });

    expect($('h3', container).textContent).to.contain('end of your marriage');
  });

  it('should redirect back to the main picklist page if the URL is invalid', () => {
    const goToPath = sinon.spy();
    renderComponent({ goToPath, testUrl: '?index=12&page=something' });

    expect(goToPath.called).to.be.true;
    expect(goToPath.firstCall.args[0]).to.equal(
      'options-selection/remove-active-dependents',
    );
  });
});
