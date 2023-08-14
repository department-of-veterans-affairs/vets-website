import React from 'react';
import { expect } from 'chai';
import { render, fireEvent } from '@testing-library/react';
import sinon from 'sinon';

import { $ } from 'platform/forms-system/src/js/utilities/ui';

import AreaOfDisagreement from '../../components/AreaOfDisagreement';
import { SELECTED, DISAGREEMENT_TYPES } from '../../constants';

describe('<AreaOfDisagreement>', () => {
  const aod1 = {
    issue: 'right arm',
    decisionDate: '2021-6-7',
    [SELECTED]: true,
    disagreementOptions: {},
    otherEntry: '',
  };
  const aod2 = {
    issue: 'left arm',
    decisionDate: '2022-7-8',
    [SELECTED]: true,
    disagreementOptions: {},
    otherEntry: '',
  };
  const getData = ({
    data = [aod1, aod2],
    pagePerItemIndex = 0,
    goBack = () => {},
    goForward = () => {},
    setFormData = () => {},
    contentBeforeButtons = <div>before</div>,
    contentAfterButtons = <div>after</div>,
    onReviewPage = false,
    updatePage = () => {},
  } = {}) => ({
    data: { areaOfDisagreement: data },
    pagePerItemIndex,
    goBack,
    goForward,
    setFormData,
    contentBeforeButtons,
    contentAfterButtons,
    onReviewPage,
    updatePage,
  });

  it('should render', () => {
    const data = getData();
    const { container } = render(
      <div>
        <AreaOfDisagreement {...data} />
      </div>,
    );

    expect($('h3', container).textContent).to.contain(
      'Disagreement with right arm decision on June 7, 2021',
    );
    expect($('va-checkbox-group', container)).to.exist;

    // RTL doesn't handle shadow dom
    const html = container.innerHTML;
    Object.keys(DISAGREEMENT_TYPES).forEach(type => {
      if (type === 'otherEntry') {
        expect(html).to.contain('va-text-input');
      } else {
        expect(html).to.contain(`va-checkbox name="${type}"`);
      }
    });
  });

  it('should submit with only checkboxes set', () => {
    const goSpy = sinon.spy();
    const aod = {
      ...aod1,
      disagreementOptions: {
        serviceConnection: true,
      },
    };
    const data = getData({ goForward: goSpy, data: [aod] });
    const { container } = render(
      <div>
        <AreaOfDisagreement {...data} />
      </div>,
    );

    fireEvent.click($('button.usa-button-primary', container));
    expect(goSpy.called).to.be.true;
  });

  it('should submit with only text input set', () => {
    const goSpy = sinon.spy();
    const aod = {
      ...aod2,
      otherEntry: 'something',
    };
    const data = getData({ goForward: goSpy, data: [aod] });
    const { container } = render(
      <div>
        <AreaOfDisagreement {...data} />
      </div>,
    );

    fireEvent.click($('button.usa-button-primary', container));
    expect(goSpy.called).to.be.true;
  });

  it('should submit with both checkboxes and text input set', () => {
    const goSpy = sinon.spy();
    const aod = {
      ...aod2,
      disagreementOptions: {
        serviceConnection: true,
        effectiveDate: true,
        evaluation: true,
      },
      otherEntry: 'something',
    };
    const data = getData({ goForward: goSpy, data: [aod] });
    const { container } = render(
      <div>
        <AreaOfDisagreement {...data} />
      </div>,
    );

    fireEvent.click($('button.usa-button-primary', container));
    expect(goSpy.called).to.be.true;
  });

  it('should not submit page when nothing is checked or input is empty', () => {
    const goSpy = sinon.spy();
    const data = getData({ goForward: goSpy });
    const { container } = render(
      <div>
        <AreaOfDisagreement {...data} />
      </div>,
    );

    fireEvent.click($('button.usa-button-primary', container));
    expect(goSpy.called).to.be.false;
  });

  it('should not submit page when text input is too long', () => {
    const goSpy = sinon.spy();
    const aod = {
      ...aod1,
      disagreementOptions: {
        serviceConnection: true,
        effectiveDate: true,
        evaluation: true,
      },
      otherEntry: 'something'.repeat(10),
    };
    const data = getData({ goForward: goSpy, data: [aod] });
    const { container } = render(
      <div>
        <AreaOfDisagreement {...data} />
      </div>,
    );

    fireEvent.click($('button.usa-button-primary', container));
    expect(goSpy.called).to.be.false;
  });
});
