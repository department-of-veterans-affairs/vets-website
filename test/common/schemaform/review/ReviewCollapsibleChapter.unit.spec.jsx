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
      title: '',
      schema: {
        properties: {}
      }
    }];
    const chapterKey = 'test';
    const chapter = {};
    const form = {
      pages: {
        test: {
          title: '',
          editMode: false,
          schema: {
            properties: {}
          }
        }
      },
      data: {}
    };

    const tree = SkinDeep.shallowRender(
      <ReviewCollapsibleChapter
          onEdit={onEdit}
          pages={pages}
          chapterKey={chapterKey}
          chapter={chapter}
          form={form}/>
    );

    expect(tree.everySubTree('.form-review-panel-page')).to.be.empty;

    tree.getMountedInstance().toggleChapter();

    expect(tree.everySubTree('.form-review-panel-page')).not.to.be.empty;
  });

  it('should handle editing', () => {
    const onEdit = sinon.spy();
    const pages = [{
      title: '',
      pageKey: 'test'
    }];
    const chapterKey = 'test';
    const chapter = {};
    const form = {
      pages: {
        test: {
          title: '',
          schema: {
            properties: {}
          },
          editMode: false,
        }
      },
      data: {
      }
    };

    const tree = SkinDeep.shallowRender(
      <ReviewCollapsibleChapter
          onEdit={onEdit}
          pages={pages}
          chapterKey={chapterKey}
          chapter={chapter}
          form={form}/>
    );

    tree.getMountedInstance().handleEdit('test', true);

    expect(onEdit.calledWith('test', true)).to.be.true;
  });

  it('should not display conditional pages with unfulfilled conditions', () => {
    const pages = [{
      pageKey: 'test1',
      title: '',
      schema: {
        properties: {
          condition1: 'boolean',
          condition2: 'boolean'
        }
      }
    }, {
      pageKey: 'test2',
      title: '',
      depends: {
        condition1: true,
        condition2: true
      },
      schema: {}
    }];
    const chapterKey = 'test';
    const chapter = {};
    const form = {
      pages: {
        test1: {
          editMode: false,
          schema: {
            properties: {
              condition1: 'boolean',
              condition2: 'boolean'
            }
          }
        },
        test2: {
          editMode: false,
          schema: {}
        }
      },
      data: {
        condition1: true,
        condition2: false
      }
    };

    const tree = SkinDeep.shallowRender(
      <ReviewCollapsibleChapter
          onEdit={() => {}}
          pages={pages}
          chapterKey={chapterKey}
          chapter={chapter}
          form={form}/>
    );

    tree.getMountedInstance().toggleChapter();

    expect(tree.everySubTree('.form-review-panel-page')).to.have.length(1);
  });

  it('should display condition pages with fulfilled conditions', () => {
    const pages = [{
      pageKey: 'test1',
      title: '',
      schema: {
        properties: {
          condition1: 'boolean',
          condition2: 'boolean'
        }
      }
    }, {
      pageKey: 'test2',
      title: '',
      depends: {
        condition1: true,
      },
      schema: {}
    }];
    const chapterKey = 'test';
    const chapter = {};
    const form = {
      pages: {
        test1: {
          editMode: false,
          schema: {
            properties: {
              condition1: 'boolean',
              condition2: 'boolean'
            }
          },
        },
        test2: {
          editMode: false,
          schema: {}
        }
      },
      data: {
        condition1: true,
        condition2: true
      }
    };

    const tree = SkinDeep.shallowRender(
      <ReviewCollapsibleChapter
          onEdit={() => {}}
          pages={pages}
          chapterKey={chapterKey}
          chapter={chapter}
          form={form}/>
    );

    tree.getMountedInstance().toggleChapter();

    expect(tree.everySubTree('.form-review-panel-page')).to.have.length(2);
  });
});
