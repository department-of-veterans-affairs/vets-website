import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';

import { focusFileCard, evidenceUploadUI } from '../../utils/upload';

describe('evidenceUploadUI', () => {
  describe('focusFileCard', () => {
    const { container } = render(
      <div>
        <ul className="schemaform-file-list">
          <li>test-file.png</li>
          <li>test-file.pdf</li>
        </ul>
      </div>,
    );

    focusFileCard('test-file.pdf', container);
    expect(document.activeElement).to.eq($('li:last-child', container));
  });

  describe('parseResponse', () => {
    it('should return undefined', () => {
      const { parseResponse } = evidenceUploadUI['ui:options'];

      const result = parseResponse(
        { data: { attributes: { guid: 'uuid-1234' } } },
        { name: 'test-file.pdf' },
      );
      expect(result).to.deep.equal({
        name: 'test-file.pdf',
        confirmationCode: 'uuid-1234',
      });
    });
  });
});
