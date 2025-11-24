import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { $$ } from 'platform/forms-system/src/js/utilities/ui';

import { uiSchema, schema } from '../../pages/previouslyEnteredPoc';
import formConfig from '../../config/form';

const createMockStore = initialState => {
  const mockReducer = (state = initialState) => state;
  return createStore(mockReducer);
};

describe('Previously Entered POC page', () => {
  const renderPage = (formData = {}) => {
    const initialState = { form: { data: formData } };
    const store = createMockStore(initialState);
    return render(
      <Provider store={store}>
        <DefinitionTester
          definitions={formConfig.defaultDefinitions}
          schema={schema}
          uiSchema={uiSchema}
          data={formData}
        />
      </Provider>,
    );
  };

  describe('Schema and UI Schema', () => {
    it('should have correct schema structure', () => {
      expect(schema).to.have.property('type', 'object');
      expect(schema.properties).to.have.property('pointOfContact');
      expect(schema.properties.pointOfContact.type).to.equal('object');
      expect(schema.properties.pointOfContact.properties).to.have.property(
        'key',
      );
      expect(schema.properties.pointOfContact.properties).to.have.property(
        'fullName',
      );
      expect(schema.properties.pointOfContact.properties).to.have.property(
        'email',
      );
      expect(schema.properties.pointOfContact.properties).to.have.property(
        'phone',
      );
      expect(schema.required).to.include('pointOfContact');
    });

    it('should have correct UI schema structure', () => {
      expect(uiSchema).to.have.property('pointOfContact');
      expect(uiSchema.pointOfContact).to.have.property('ui:field');
      expect(uiSchema.pointOfContact).to.have.property('ui:required');
      expect(uiSchema.pointOfContact['ui:required']()).to.equal(true);
    });
  });

  describe('Widget rendering with empty form data', () => {
    it('should render with only "none" option when form data is empty', () => {
      const { container } = renderPage({});
      const radioOptions = $$('va-radio-option', container);
      expect(radioOptions.length).to.equal(1);
      expect(radioOptions[0].getAttribute('label')).to.include(
        'None of the above',
      );
    });

    it('should render title and description', () => {
      const { container } = renderPage({});
      expect(container.textContent).to.include(
        'Use a previously entered point of contact',
      );
    });
  });

  describe('Widget rendering with School Certifying Official', () => {
    it('should include SCO in options when present', () => {
      const formData = {
        newCommitment: {
          schoolCertifyingOfficial: {
            fullName: {
              first: 'John',
              middle: 'Middle',
              last: 'Doe',
            },
            email: 'john.doe@example.com',
            usPhone: '1234567890',
            title: 'SCO Title',
          },
        },
      };
      const { container } = renderPage(formData);
      const radioOptions = $$('va-radio-option', container);
      expect(radioOptions.length).to.equal(2);
      expect(radioOptions[0].getAttribute('label')).to.equal('John Middle Doe');
    });

    it('should handle SCO with international phone', () => {
      const formData = {
        newCommitment: {
          schoolCertifyingOfficial: {
            fullName: {
              first: 'Jane',
              last: 'Smith',
            },
            email: 'jane@example.com',
            internationalPhone: '+1-555-123-4567',
            title: 'Director',
          },
        },
      };
      const { container } = renderPage(formData);
      const radioOptions = $$('va-radio-option', container);
      expect(radioOptions.length).to.equal(2);
      expect(radioOptions[0].getAttribute('label')).to.equal('Jane Smith');
    });

    it('should handle SCO with phoneNumber field', () => {
      const formData = {
        newCommitment: {
          schoolCertifyingOfficial: {
            fullName: {
              first: 'Bob',
              last: 'Johnson',
            },
            phoneNumber: '9876543210',
          },
        },
      };
      const { container } = renderPage(formData);
      const radioOptions = $$('va-radio-option', container);
      expect(radioOptions.length).to.equal(2);
      expect(radioOptions[0].getAttribute('label')).to.equal('Bob Johnson');
    });

    it('should handle SCO with internationalPhoneNumber field', () => {
      const formData = {
        newCommitment: {
          schoolCertifyingOfficial: {
            fullName: {
              first: 'Alice',
              last: 'Williams',
            },
            internationalPhoneNumber: '+44-20-1234-5678',
          },
        },
      };
      const { container } = renderPage(formData);
      const radioOptions = $$('va-radio-option', container);
      expect(radioOptions.length).to.equal(2);
    });

    it('should skip SCO when name is missing', () => {
      const formData = {
        newCommitment: {
          schoolCertifyingOfficial: {
            email: 'test@example.com',
          },
        },
      };
      const { container } = renderPage(formData);
      const radioOptions = $$('va-radio-option', container);
      expect(radioOptions.length).to.equal(1);
    });
  });

  describe('Widget rendering with Principles of Excellence POC', () => {
    it('should include POE in options when present', () => {
      const formData = {
        newCommitment: {
          principlesOfExcellencePointOfContact: {
            fullName: {
              first: 'POE',
              last: 'Contact',
            },
            email: 'poe@example.com',
            usPhone: '5555555555',
          },
        },
      };
      const { container } = renderPage(formData);
      const radioOptions = $$('va-radio-option', container);
      expect(radioOptions.length).to.equal(2);
      expect(radioOptions[0].getAttribute('label')).to.equal('POE Contact');
    });

    it('should handle POE with middle name', () => {
      const formData = {
        newCommitment: {
          principlesOfExcellencePointOfContact: {
            fullName: {
              first: 'First',
              middle: 'Middle',
              last: 'Last',
            },
            email: 'test@example.com',
          },
        },
      };
      const { container } = renderPage(formData);
      const radioOptions = $$('va-radio-option', container);
      expect(radioOptions[0].getAttribute('label')).to.equal(
        'First Middle Last',
      );
    });
  });
  describe('Widget rendering with Authorized Official', () => {
    it('should include authorized official in options when present', () => {
      const formData = {
        authorizedOfficial: {
          fullName: {
            first: 'Authorized',
            last: 'Official',
          },
          email: 'ao@example.com',
          usPhone: '1111111111',
          title: 'CEO',
        },
      };
      const { container } = renderPage(formData);
      const radioOptions = $$('va-radio-option', container);
      expect(radioOptions.length).to.equal(2);
      expect(radioOptions[0].getAttribute('label')).to.equal(
        'Authorized Official',
      );
    });

    it('should skip authorized official when name is missing', () => {
      const formData = {
        authorizedOfficial: {
          email: 'test@example.com',
        },
      };
      const { container } = renderPage(formData);
      const radioOptions = $$('va-radio-option', container);
      expect(radioOptions.length).to.equal(1);
    });
  });
  describe('Widget rendering with additional locations', () => {
    it('should include additional location POCs in options', () => {
      const formData = {
        additionalLocations: [
          {
            fullName: {
              first: 'Location',
              last: 'One',
            },
            email: 'location1@example.com',
            usPhone: '2222222222',
          },
          {
            fullName: {
              first: 'Location',
              middle: 'Two',
              last: 'Contact',
            },
            email: 'location2@example.com',
          },
        ],
      };
      const { container } = renderPage(formData);
      const radioOptions = $$('va-radio-option', container);
      expect(radioOptions.length).to.equal(3);
      expect(radioOptions[0].getAttribute('label')).to.equal('Location One');
      expect(radioOptions[1].getAttribute('label')).to.equal(
        'Location Two Contact',
      );
    });

    it('should include additional location with only email (no name)', () => {
      const formData = {
        additionalLocations: [
          {
            email: 'emailonly@example.com',
          },
        ],
      };
      const { container } = renderPage(formData);
      const radioOptions = $$('va-radio-option', container);
      expect(radioOptions.length).to.equal(2);
    });

    it('should skip additional location when both name and email are missing', () => {
      const formData = {
        additionalLocations: [
          {
            usPhone: '3333333333',
          },
        ],
      };
      const { container } = renderPage(formData);
      const radioOptions = $$('va-radio-option', container);
      expect(radioOptions.length).to.equal(1);
    });

    it('should handle additional location with international phone', () => {
      const formData = {
        additionalLocations: [
          {
            fullName: {
              first: 'Intl',
              last: 'Contact',
            },
            email: 'intl@example.com',
            internationalPhone: '+33-1-2345-6789',
          },
        ],
      };
      const { container } = renderPage(formData);
      const radioOptions = $$('va-radio-option', container);
      expect(radioOptions.length).to.equal(2);
    });
  });

  describe('Widget rendering with multiple contacts', () => {
    it('should include all available contacts in options', () => {
      const formData = {
        authorizedOfficial: {
          fullName: {
            first: 'Auth',
            last: 'Official',
          },
          email: 'auth@example.com',
        },
        newCommitment: {
          schoolCertifyingOfficial: {
            fullName: {
              first: 'SCO',
              last: 'Contact',
            },
            email: 'sco@example.com',
          },
          principlesOfExcellencePointOfContact: {
            fullName: {
              first: 'POE',
              last: 'Contact',
            },
            email: 'poe@example.com',
          },
        },
        additionalLocations: [
          {
            fullName: {
              first: 'Location',
              last: 'One',
            },
            email: 'loc1@example.com',
          },
        ],
      };
      const { container } = renderPage(formData);
      const radioOptions = $$('va-radio-option', container);
      expect(radioOptions.length).to.equal(5);
    });

    it('should order options correctly', () => {
      const formData = {
        authorizedOfficial: {
          fullName: {
            first: 'Auth',
            last: 'Official',
          },
        },
        newCommitment: {
          schoolCertifyingOfficial: {
            fullName: {
              first: 'SCO',
              last: 'Contact',
            },
          },
        },
      };
      const { container } = renderPage(formData);
      const radioOptions = $$('va-radio-option', container);
      expect(radioOptions[0].getAttribute('label')).to.equal('Auth Official');
      expect(radioOptions[1].getAttribute('label')).to.equal('SCO Contact');
      expect(radioOptions[2].getAttribute('label')).to.include(
        'None of the above',
      );
    });
  });

  describe('Name extraction', () => {
    it('should handle missing middle name', () => {
      const formData = {
        newCommitment: {
          schoolCertifyingOfficial: {
            fullName: {
              first: 'First',
              last: 'Last',
            },
            email: 'test@example.com',
          },
        },
      };
      const { container } = renderPage(formData);
      const radioOptions = $$('va-radio-option', container);
      expect(radioOptions[0].getAttribute('label')).to.equal('First Last');
    });

    it('should handle empty string names', () => {
      const formData = {
        newCommitment: {
          schoolCertifyingOfficial: {
            fullName: {
              first: 'First',
              middle: '',
              last: 'Last',
            },
            email: 'test@example.com',
          },
        },
      };
      const { container } = renderPage(formData);
      const radioOptions = $$('va-radio-option', container);
      expect(radioOptions[0].getAttribute('label')).to.equal('First Last');
    });
  });

  describe('Validation', () => {
    it('should require selection', async () => {
      const formData = {};
      const { container, getByRole } = renderPage(formData);
      const submitButton = getByRole('button', { name: /submit/i });
      submitButton.click();
      await new Promise(resolve => setTimeout(resolve, 100));

      const radio = $$('va-radio', container)[0];
      expect(radio).to.exist;
    });
  });
});
