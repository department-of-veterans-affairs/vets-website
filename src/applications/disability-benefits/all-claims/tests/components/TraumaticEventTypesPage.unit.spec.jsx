import React from 'react';
import {
  $,
  $$,
} from '@department-of-veterans-affairs/platform-forms-system/ui';
import { fireEvent, render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import { TRAUMATIC_EVENT_TYPES } from '../../constants';
import TraumaticEventTypesPage from '../../components/TraumaticEventTypesPage';

describe('TraumaticEventTypesPage', () => {
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
        <TraumaticEventTypesPage
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

  describe('Traumatic events selection', () => {
    it('should render checkboxes for each selectable traumatic event type', () => {
      const data = {
        eventTypes: {},
      };

      const { container } = render(page({ data }));

      Object.values(TRAUMATIC_EVENT_TYPES).forEach(option => {
        expect($$(`va-checkbox[label="${option}"]`, container)).to.exist;
      });
    });

    it('should submit when selecting one or more event types', () => {
      const goForwardSpy = sinon.spy();

      const data = {
        eventTypes: {
          combat: true,
          mst: true,
          nonMst: false,
          other: false,
        },
      };
      const { container } = render(page({ data, goForward: goForwardSpy }));
      fireEvent.click($('button[type="submit"]', container));

      expect(goForwardSpy.called).to.be.true;
    });

    it('should submit without selecting an event type', () => {
      const goForwardSpy = sinon.spy();

      const data = {
        eventTypes: {},
      };
      const { container } = render(page({ data, goForward: goForwardSpy }));
      fireEvent.click($('button[type="submit"]', container));

      expect(goForwardSpy.called).to.be.true;
    });

    it('should submit when boxes are unchecked', () => {
      const goForwardSpy = sinon.spy();

      const data = {
        eventTypes: {
          combat: false,
          mst: false,
          nonMst: false,
          other: false,
        },
      };
      const { container } = render(page({ data, goForward: goForwardSpy }));
      fireEvent.click($('button[type="submit"]', container));

      expect(goForwardSpy.called).to.be.true;
    });
  });
});
