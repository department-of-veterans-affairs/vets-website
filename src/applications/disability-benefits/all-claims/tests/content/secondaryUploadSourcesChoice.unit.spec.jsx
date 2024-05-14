import { render } from '@testing-library/react';
import { uploadDescription } from '../../content/secondaryUploadSourcesChoice';

describe('secondaryUploadSourcesChoice', () => {
  it('renders', () => {
    const tree = render(uploadDescription());

    tree.getByText('Supporting documents');
  });
});
