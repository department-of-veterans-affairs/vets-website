import { expect } from 'chai';
import sinon from 'sinon';
import {
  uiSchema,
  schema,
  applicantMailingAddressStateTitleWrapper,
} from '../../config/pages/applicantContactInformation';
import * as helpers from '../../utils/helpers';

describe('Applicant Address Component', () => {
  describe('applicantsMailingAddressHasState', () => {
    let applicantsMailingAddressHasStateStub;
    beforeEach(() => {
      applicantsMailingAddressHasStateStub = sinon.stub(
        helpers,
        'applicantsMailingAddressHasState',
      );
    });
    afterEach(() => {
      applicantsMailingAddressHasStateStub.restore();
    });

    it('should hide state field if applicantsMailingAddressHasState returns false', () => {
      applicantsMailingAddressHasStateStub.returns(false);
      const formData = {
        application: { claimant: { address: { country: 'France' } } },
      };
      const { hideIf } = uiSchema().application.claimant.address.state[
        'ui:options'
      ];
      expect(hideIf(formData)).to.be.true;
    });

    it('should show state field if applicantsMailingAddressHasState returns true', () => {
      applicantsMailingAddressHasStateStub.returns(true);
      const formData = {
        application: { claimant: { address: { country: 'USA' } } },
      };
      const { hideIf } = uiSchema().application.claimant.address.state[
        'ui:options'
      ];
      expect(hideIf(formData)).to.be.false;
    });
  });

  describe('uiSchema', () => {
    it('should use custom title when addressTitle provided', () => {
      const customTitle = 'Custom Address Title';
      const result = uiSchema(customTitle);
      expect(result.application.claimant.address['ui:title']).to.equal(
        customTitle,
      );
    });

    it('should use custom contactInfoSubheader when provided', () => {
      const customSubheader = 'Custom Subheader';
      const result = uiSchema(undefined, customSubheader);
      expect(
        result.application.claimant['view:contactInfoSubheader'][
          'ui:description'
        ],
      ).to.equal(customSubheader);
    });

    it('should use custom contactInfoDescription when provided', () => {
      const customDescription = 'Custom Description';
      const result = uiSchema(undefined, undefined, customDescription);
      expect(
        result.application.claimant['view:contactInfoDescription'][
          'ui:description'
        ],
      ).to.equal(customDescription);
    });

    it('should have displayEmptyObjectOnReview option for contactInfoSubheader', () => {
      const result = uiSchema();
      expect(
        result.application.claimant['view:contactInfoSubheader']['ui:options']
          .displayEmptyObjectOnReview,
      ).to.be.true;
    });

    it('should have displayEmptyObjectOnReview option for contactInfoDescription', () => {
      const result = uiSchema();
      expect(
        result.application.claimant['view:contactInfoDescription']['ui:options']
          .displayEmptyObjectOnReview,
      ).to.be.true;
    });

    it('should have displayEmptyObjectOnReview option for bottomPadding', () => {
      const result = uiSchema();
      expect(
        result.application.claimant['view:bottomPadding']['ui:options']
          .displayEmptyObjectOnReview,
      ).to.be.true;
    });

    it('should use correct title for street field', () => {
      const result = uiSchema();
      expect(result.application.claimant.address.street['ui:title']).to.equal(
        'Street address',
      );
    });

    it('should use correct title for street2 field', () => {
      const result = uiSchema();
      expect(result.application.claimant.address.street2['ui:title']).to.equal(
        'Street address line 2',
      );
    });
  });

  describe('schema', () => {
    it('should require email and phoneNumber fields', () => {
      expect(
        schema.properties.application.properties.claimant.required,
      ).to.include('email');
      expect(
        schema.properties.application.properties.claimant.required,
      ).to.include('phoneNumber');
    });
    it('should have address schema property', () => {
      expect(
        schema.properties.application.properties.claimant.properties,
      ).to.have.property('address');
    });
    it('should have phoneNumber property', () => {
      expect(
        schema.properties.application.properties.claimant.properties,
      ).to.have.property('phoneNumber');
    });
    it('should have email property', () => {
      expect(
        schema.properties.application.properties.claimant.properties,
      ).to.have.property('email');
    });
    it('should have view:contactInfoSubheader with empty properties', () => {
      const subheader =
        schema.properties.application.properties.claimant.properties[
          'view:contactInfoSubheader'
        ];
      expect(subheader).to.have.property('type', 'object');
      expect(subheader.properties).to.deep.equal({});
    });
    it('should have view:contactInfoDescription with empty properties', () => {
      const description =
        schema.properties.application.properties.claimant.properties[
          'view:contactInfoDescription'
        ];
      expect(description).to.have.property('type', 'object');
      expect(description.properties).to.deep.equal({});
    });
    it('should have view:bottomPadding with empty properties', () => {
      const padding =
        schema.properties.application.properties.claimant.properties[
          'view:bottomPadding'
        ];
      expect(padding).to.have.property('type', 'object');
      expect(padding.properties).to.deep.equal({});
    });
  });
  describe('MailingAddressStateTitle component', () => {
    it('should exist in the wrapper component', () => {
      expect(applicantMailingAddressStateTitleWrapper).to.exist;
      expect(applicantMailingAddressStateTitleWrapper.type.name).to.equal(
        'MailingAddressStateTitle',
      );
    });
    it('should pass correct path to MailingAddressStateTitle', () => {
      expect(
        applicantMailingAddressStateTitleWrapper.props.elementPath,
      ).to.equal('application.claimant.address.country');
    });
  });
});
