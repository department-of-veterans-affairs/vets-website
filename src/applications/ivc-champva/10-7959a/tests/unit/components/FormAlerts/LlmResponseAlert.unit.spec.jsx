import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import LlmResponseAlert from '../../../../components/FormAlerts/LlmResponseAlert';

const TOGGLE_KEY = 'view:champvaClaimsLlmValidation';
const UPLOAD_KEY = 'documents';

const makeFile = (name, missingFields) => ({
  name,
  ...(missingFields === undefined ? {} : { llmResponse: { missingFields } }),
});

describe('10-7959a <LlmResponseAlert>', () => {
  const subject = ({ enabled = true, files = [], schema = {} } = {}) => {
    const formContext = {
      data: { [TOGGLE_KEY]: enabled },
      fullData: { [UPLOAD_KEY]: files },
      schema: {
        properties: {
          [UPLOAD_KEY]: { type: 'array' },
          ...schema,
        },
      },
    };
    const { container } = render(
      <LlmResponseAlert formContext={formContext} />,
    );
    return {
      vaAlert: container.querySelector('va-alert'),
      listItems: container.querySelectorAll('li'),
    };
  };

  context('feature toggle behavior', () => {
    it('should not render when toggle is disabled', () => {
      const { vaAlert } = subject({ enabled: false });
      expect(vaAlert).to.not.exist;
    });

    it('should not render when no upload key exists', () => {
      const { vaAlert } = subject({ schema: {} });
      expect(vaAlert).to.not.exist;
    });

    it('should not render when no files uploaded', () => {
      const { vaAlert } = subject({ files: [] });
      expect(vaAlert).to.not.exist;
    });
  });

  context('alert variants', () => {
    it('should render warning status when llmResponse is missing', () => {
      const files = [makeFile('test.pdf')];
      const { vaAlert } = subject({ files });
      expect(vaAlert).to.have.attr('status', 'warning');
    });

    it('should render success status when no fields are missing', () => {
      const files = [makeFile('test.pdf', [])];
      const { vaAlert } = subject({ files });
      expect(vaAlert).to.have.attr('status', 'success');
    });

    it('should render error status when fields are missing', () => {
      const files = [makeFile('test.pdf', ['Service Date', 'Provider'])];
      const { vaAlert, listItems } = subject({ files });
      expect(vaAlert).to.have.attr('status', 'error');
      expect(listItems).to.have.lengthOf(2);
    });
  });

  describe('multiple files', () => {
    it('should show alert status for most recent file only', () => {
      const files = [
        makeFile('old.pdf', ['Provider']),
        makeFile('recent.pdf', []),
      ];
      const { vaAlert } = subject({ files });
      expect(vaAlert).to.have.attr('status', 'success');
    });
  });
});
