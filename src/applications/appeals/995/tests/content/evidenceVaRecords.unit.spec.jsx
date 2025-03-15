import { expect } from 'chai';

import { content, contentOld } from '../../content/evidenceVaRecords';

describe('title', () => {
  it('should show new title with add or edit and spelled out index', () => {
    const { title } = content;
    expect(title('add')).to.contain(
      'Add a first VA or military treatment location',
    );
    expect(title('add', 3)).to.contain(
      'Add a third VA or military treatment location',
    );
    expect(title('edit', 0)).to.contain(
      'Edit the first VA or military treatment location',
    );
    expect(title('edit', 6)).to.contain(
      'Edit the sixth VA or military treatment location',
    );
  });

  it('should show old title content with add or edit and spelled out index', () => {
    const { title } = contentOld;
    expect(title('add')).to.contain('Add the first VA facility');
    expect(title('add', 3)).to.contain('Add the third VA facility');
    expect(title('edit', 0)).to.contain('Edit the first VA facility');
    expect(title('edit', 6)).to.contain('Edit the sixth VA facility');
  });
});
