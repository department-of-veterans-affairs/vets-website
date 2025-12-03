import React from 'react';
import { expect } from 'chai';
import { render, fireEvent } from '@testing-library/react';
import sinon from 'sinon';
import { $$ } from 'platform/forms-system/src/js/utilities/ui';
import { content } from '../../../content/evidence/summary';
import {
  VaDetailsDisplay,
  getFormattedTreatmentDate,
} from '../../../components/evidence/VaDetailsDisplay';
import { records } from '../../data/evidence-records';
import { verifyHeader, verifyProviderVA } from '../../unit-test-helpers';

const vaEvidence = records().locations;

describe('VaDetailsDisplay', () => {
  describe('on the evidence review page', () => {
    it('should render the proper (editable) content', () => {
      const { container } = render(
        <VaDetailsDisplay
          isOnReviewPage={false}
          list={vaEvidence}
          reviewMode={false}
          testing
        />,
      );

      const h4s = $$('h4', container);
      const h5s = $$('h5', container);
      const listItems = $$('li', container);

      verifyHeader(h4s, 0, content.vaTitle);
      verifyProviderVA(
        h5s,
        listItems,
        {
          providerName: 'South Texas VA Facility',
          issues: 'Hypertension',
          dates: 'February 2000',
        },
        0,
        0,
        false,
      );

      verifyProviderVA(
        h5s,
        listItems,
        {
          providerName: 'Midwest Alabama VA Facility',
          issues: 'Hypertension and Gluten Intolerance',
          dates: `I don’t have the date`,
        },
        1,
        1,
        false,
      );
    });
  });

  describe('on the review & submit page', () => {
    it('should render the proper (non-editable) content', () => {
      const { container } = render(
        <VaDetailsDisplay
          isOnReviewPage
          list={vaEvidence}
          reviewMode
          testing
        />,
      );

      const h5s = $$('h5', container);
      const h6s = $$('h6', container);
      const listItems = $$('li', container);

      verifyHeader(h5s, 0, content.vaTitle);
      verifyProviderVA(
        h6s,
        listItems,
        {
          providerName: 'South Texas VA Facility',
          issues: 'Hypertension',
          dates: 'February 2000',
        },
        0,
        0,
        true,
      );

      verifyProviderVA(
        h6s,
        listItems,
        {
          providerName: 'Midwest Alabama VA Facility',
          issues: 'Hypertension and Gluten Intolerance',
          dates: `I don’t have the date`,
        },
        1,
        1,
        true,
      );
    });

    describe('on the app confirmation page', () => {
      it('should render the proper (non-editable) content', () => {
        const { container } = render(
          <VaDetailsDisplay
            isOnReviewPage={false}
            list={vaEvidence}
            reviewMode
            testing
          />,
        );

        const h4s = $$('h4', container);
        const h5s = $$('h5', container);
        const listItems = $$('li', container);

        verifyHeader(h4s, 0, content.vaTitle);
        verifyProviderVA(
          h5s,
          listItems,
          {
            providerName: 'South Texas VA Facility',
            issues: 'Hypertension',
            dates: 'February 2000',
          },
          0,
          0,
          true,
        );

        verifyProviderVA(
          h5s,
          listItems,
          {
            providerName: 'Midwest Alabama VA Facility',
            issues: 'Hypertension and Gluten Intolerance',
            dates: `I don’t have the date`,
          },
          1,
          1,
          true,
        );
      });
    });

    describe('when there is no list data', () => {
      it('should render nothing', () => {
        const { container } = render(<VaDetailsDisplay testing />);

        expect(container.innerHTML).to.eq('');
      });
    });
  });

  describe('when parts of the data are missing', () => {
    const fullData = {
      locationAndName: 'South Texas VA Facility',
      issues: ['Hypertension'],
      treatmentDate: '2000-02',
      noDate: false,
    };

    const getContainer = partialData => {
      return render(
        <VaDetailsDisplay
          list={[partialData]}
          isOnReviewPage={false}
          reviewMode
          testing={false}
        />,
      );
    };

    describe('when the provider name is missing', () => {
      it('should render the proper errors', () => {
        const partialData = { ...fullData, locationAndName: '' };
        getContainer(partialData);

        const error = $$('.usa-input-error-message')[0];
        expect(error.textContent).to.contain('Missing location name');
      });
    });

    describe('when the issues are missing', () => {
      it('should render the proper errors', () => {
        const partialData = { ...fullData, issues: [] };
        getContainer(partialData);

        const error = $$('.usa-input-error-message')[0];
        expect(error.textContent).to.contain('Missing condition');
      });
    });

    describe('when the treatmentDate is missing', () => {
      it('should render the proper errors', () => {
        const partialData = {
          ...fullData,
          treatmentDate: '',
        };

        getContainer(partialData);

        const error = $$('.usa-input-error-message')[0];
        expect(error.textContent).to.contain('Missing treatment date');
      });
    });

    describe('when the treatmentDate is missing but noDate is checked', () => {
      it('should not render an error', () => {
        const partialData = {
          ...fullData,
          treatmentDate: '',
          noDate: true,
        };

        getContainer(partialData);

        const error = $$('.usa-input-error-message')[0];
        expect(error).to.be.undefined;
      });
    });
  });

  it('should execute callback when removing an entry', () => {
    const removeSpy = sinon.spy();
    const handlers = { showModal: removeSpy };

    const { container } = render(
      <VaDetailsDisplay list={vaEvidence} handlers={handlers} testing />,
    );

    const buttons = $$('.remove-item', container);
    fireEvent.click(buttons[0]);

    expect(removeSpy.calledOnce).to.be.true;
    expect(removeSpy.args[0][0].target.getAttribute('data-index')).to.eq('0');
    expect(removeSpy.args[0][0].target.getAttribute('data-type')).to.eq('va');

    fireEvent.click(buttons[1]);

    expect(removeSpy.calledTwice).to.be.true;
    expect(removeSpy.args[1][0].target.getAttribute('data-index')).to.eq('1');
    expect(removeSpy.args[1][0].target.getAttribute('data-type')).to.eq('va');
  });

  describe('getFormattedTreatmentDate', () => {
    it('should return the proper output', () => {
      expect(getFormattedTreatmentDate(false, '2020-05')).to.eq('May 2020');
      expect(getFormattedTreatmentDate(true, '')).to.eq(null);
    });
  });
});
