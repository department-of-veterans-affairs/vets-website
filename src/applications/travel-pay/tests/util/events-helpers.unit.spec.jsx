import { expect } from 'chai';
import sinon from 'sinon';
import * as recordEventModule from 'platform/monitoring/record-event';

import {
  recordButtonClick,
  recordLinkClick,
  recordCheckboxEvent,
  recordRadioOptionClick,
  recordSmocPageview,
  recordSmocButtonClick,
  recordSmocLinkClick,
} from '../../util/events-helpers';

// Disable camelcase rule for testing analytics snake_case property names
/* eslint-disable camelcase */
describe('events-helpers', () => {
  let recordEventSpy;
  let recordEventStub;

  beforeEach(() => {
    recordEventSpy = sinon.spy();
    recordEventStub = sinon
      .stub(recordEventModule, 'default')
      .callsFake(recordEventSpy);
  });

  afterEach(() => {
    recordEventStub.restore();
  });

  describe('recordButtonClick', () => {
    it('should call recordEvent with correct button click event structure', () => {
      recordButtonClick('complex-claims', 'Test Page', 'Submit claim');

      expect(recordEventSpy.calledOnce).to.be.true;
      expect(recordEventSpy.firstCall.args[0]).to.deep.equal({
        event: 'complex-claims-button',
        action: 'click',
        heading_1: 'Test Page',
        link_text: 'Submit claim',
      });
    });

    it('should handle different variants and button text', () => {
      recordButtonClick('smoc', 'Review Page', 'Continue');

      expect(recordEventSpy.firstCall.args[0]).to.deep.equal({
        event: 'smoc-button',
        action: 'click',
        heading_1: 'Review Page',
        link_text: 'Continue',
      });
    });
  });

  describe('recordLinkClick', () => {
    it('should call recordEvent with correct link click event structure with url', () => {
      recordLinkClick(
        'complex-claims',
        'Test Page',
        'Learn more',
        'https://example.com',
      );

      expect(recordEventSpy.calledOnce).to.be.true;
      expect(recordEventSpy.firstCall.args[0]).to.deep.equal({
        event: 'complex-claims-link',
        action: 'click',
        heading_1: 'Test Page',
        link_text: 'Learn more',
        link_url: 'https://example.com',
      });
    });

    it('should set link_url to undefined when url is not provided', () => {
      recordLinkClick('complex-claims', 'Test Page', 'Back');

      expect(recordEventSpy.firstCall.args[0]).to.deep.equal({
        event: 'complex-claims-link',
        action: 'click',
        heading_1: 'Test Page',
        link_text: 'Back',
        link_url: undefined,
      });
    });

    it('should handle null url parameter', () => {
      recordLinkClick('complex-claims', 'Test Page', 'Back', null);

      expect(recordEventSpy.firstCall.args[0].link_url).to.be.undefined;
    });
  });

  describe('recordCheckboxEvent', () => {
    it('should call recordEvent with correct checkbox event structure', () => {
      recordCheckboxEvent(
        'complex-claims',
        'Accept beneficiary travel agreement',
      );

      expect(recordEventSpy.calledOnce).to.be.true;
      expect(recordEventSpy.firstCall.args[0]).to.deep.equal({
        event: 'complex-claims-checkbox',
        action: 'check',
        'checkbox-label': 'Accept beneficiary travel agreement',
      });
    });

    it('should handle different variants', () => {
      recordCheckboxEvent('smoc', 'I agree to terms');

      expect(recordEventSpy.firstCall.args[0]).to.deep.equal({
        event: 'smoc-checkbox',
        action: 'check',
        'checkbox-label': 'I agree to terms',
      });
    });
  });

  describe('recordRadioOptionClick', () => {
    it('should call recordEvent with correct radio option event structure', () => {
      recordRadioOptionClick('Select expense type', 'Mileage');

      expect(recordEventSpy.calledOnce).to.be.true;
      expect(recordEventSpy.firstCall.args[0]).to.deep.equal({
        event: 'int-radio-option-click',
        'radio-button-label': 'Select expense type',
        'radio-button-optionLabel': 'Mileage',
        'radio-button-required': true,
      });
    });

    it('should handle required parameter when false', () => {
      recordRadioOptionClick('Select trip type', 'Round trip', false);

      expect(recordEventSpy.firstCall.args[0]).to.deep.equal({
        event: 'int-radio-option-click',
        'radio-button-label': 'Select trip type',
        'radio-button-optionLabel': 'Round trip',
        'radio-button-required': false,
      });
    });

    it('should default required to true when not provided', () => {
      recordRadioOptionClick('Select departure', 'Home address');

      expect(recordEventSpy.firstCall.args[0]['radio-button-required']).to.be
        .true;
    });
  });

  describe('Legacy wrapper functions', () => {
    describe('recordSmocPageview', () => {
      it('should call recordPageview with smoc variant', () => {
        recordSmocPageview('Test Page');

        expect(recordEventSpy.calledOnce).to.be.true;
        expect(recordEventSpy.firstCall.args[0].event).to.equal(
          'smoc-pageview',
        );
        expect(recordEventSpy.firstCall.args[0].heading_1).to.equal(
          'Test Page',
        );
      });
    });

    describe('recordSmocButtonClick', () => {
      it('should call recordButtonClick with smoc variant', () => {
        recordSmocButtonClick('Test Page', 'Submit');

        expect(recordEventSpy.calledOnce).to.be.true;
        expect(recordEventSpy.firstCall.args[0].event).to.equal('smoc-button');
        expect(recordEventSpy.firstCall.args[0].heading_1).to.equal(
          'Test Page',
        );
        expect(recordEventSpy.firstCall.args[0].link_text).to.equal('Submit');
      });
    });

    describe('recordSmocLinkClick', () => {
      it('should call recordLinkClick with smoc variant', () => {
        recordSmocLinkClick('Test Page', 'Learn more', 'https://example.com');

        expect(recordEventSpy.calledOnce).to.be.true;
        expect(recordEventSpy.firstCall.args[0].event).to.equal('smoc-link');
        expect(recordEventSpy.firstCall.args[0].heading_1).to.equal(
          'Test Page',
        );
        expect(recordEventSpy.firstCall.args[0].link_text).to.equal(
          'Learn more',
        );
        expect(recordEventSpy.firstCall.args[0].link_url).to.equal(
          'https://example.com',
        );
      });
    });
  });
});
