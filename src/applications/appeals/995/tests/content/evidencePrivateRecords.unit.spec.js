import { expect } from 'chai';

import { content } from '../../content/evidencePrivateRecords';

describe('title', () => {
  it('should show title with add or edit and spelled out index', () => {
    const { title } = content;
    expect(title('add')).to.contain('Add the first provider where');
    expect(title('add', 0)).to.contain('Add the first provider where');
    expect(title('add', 3)).to.contain('Add the third provider where');
    expect(title('', 0)).to.contain('Edit the first provider where');
    expect(title('edit', 6)).to.contain('Edit the sixth provider where');
  });
});
