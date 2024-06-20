import { render } from '@testing-library/react';
import { uploadDescription } from '../../content/uploadUnemployabilitySupportingDocuments';

describe('uploadUnemployabilitySupportingDocuments.', () => {
  it('renders', () => {
    const tree = render(uploadDescription());

    tree.getByText('Supporting Documents');
    tree.getByText('Some examples of supporting documents include:');
  });
});
