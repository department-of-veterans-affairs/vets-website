import { expect } from 'chai';

import { content } from '../../content/evidenceVaRecords';

describe('title', () => {
  it('should show title with add or edit and spelled out index', () => {
    const { title } = content;
    expect(title('add')).to.contain('Add the first VA facility');
    expect(title('add', 3)).to.contain('Add the third VA facility');
    expect(title('edit', 0)).to.contain('Edit the first VA facility');
    expect(title('edit', 6)).to.contain('Edit the sixth VA facility');
  });
});
