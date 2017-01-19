import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';
import sinon from 'sinon';

import ReviewCollapsibleChapter from '../../../../src/js/common/schemaform/review/ReviewCollapsibleChapter';

describe('<ReviewCollapsibleChapter>', () => {
  it('should handle toggling chapter', () => {
    const onEdit = sinon.spy();
    const pages = [{
      pageKey: 'test',
      schema: {
        properties: {}
      }
    }];
    const chapterKey = 'test';
    const chapter = {};
    const data = {
      test: {
        editMode: false
      }
    };

    const tree = SkinDeep.shallowRender(
      <ReviewCollapsibleChapter
          onEdit={onEdit}
          pages={pages}
          chapterKey={chapterKey}
          chapter={chapter}
          data={data}/>
    );

    expect(tree.everySubTree('.form-review-panel-page')).to.be.empty;

    tree.getMountedInstance().toggleChapter();

    expect(tree.everySubTree('.form-review-panel-page')).not.to.be.empty;
  });
  it('should handle editing', () => {
    const onEdit = sinon.spy();
    const pages = [{
      pageKey: 'test'
    }];
    const chapterKey = 'test';
    const chapter = {};
    const data = {
      test: {
        editMode: false
      }
    };

    const tree = SkinDeep.shallowRender(
      <ReviewCollapsibleChapter
          onEdit={onEdit}
          pages={pages}
          chapterKey={chapterKey}
          chapter={chapter}
          data={data}/>
    );

    tree.getMountedInstance().handleEdit('test', true);

    expect(onEdit.calledWith('test', true)).to.be.true;
  });
});
