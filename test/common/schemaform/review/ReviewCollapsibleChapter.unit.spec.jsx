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
          viewedPages={new Set()}
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
          viewedPages={new Set()}
          onEdit={onEdit}
          pages={pages}
          chapterKey={chapterKey}
          chapter={chapter}
          form={form}/>
    );

    tree.getMountedInstance().handleEdit('test', true);

    expect(onEdit.calledWith('test', true)).to.be.true;
  });

  it('should handle editing array page', () => {
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
          showPagePerItem: true,
          arrayPath: 'testing',
          title: '',
          schema: {
            properties: {}
          },
          editMode: [false],
        }
      },
      data: {
        testing: [{}]
      }
    };

    const tree = SkinDeep.shallowRender(
      <ReviewCollapsibleChapter
          viewedPages={new Set()}
          onEdit={onEdit}
          pages={pages}
          chapterKey={chapterKey}
          chapter={chapter}
          form={form}/>
    );

    tree.getMountedInstance().handleEdit('test', true, 0);

    expect(onEdit.calledWith('test', true, 0)).to.be.true;
  });

  it('should display a page for each item for an array page', () => {
    const onEdit = sinon.spy();
    const pages = [{
      title: '',
      pageKey: 'test',
      showPagePerItem: true,
      arrayPath: 'testing',
      path: 'path/:index'
    }];
    const chapterKey = 'test';
    const chapter = {};
    const form = {
      pages: {
        test: {
          showPagePerItem: true,
          arrayPath: 'testing',
          title: '',
          schema: {
            properties: {
              testing: {
                items: [{}, {}]
              }
            }
          },
          uiSchema: {
            testing: {
              items: {}
            }
          },
          editMode: [false, false],
        }
      },
      data: {
        testing: [{}, {}]
      }
    };

    const tree = SkinDeep.shallowRender(
      <ReviewCollapsibleChapter
          viewedPages={new Set()}
          onEdit={onEdit}
          pages={pages}
          chapterKey={chapterKey}
          chapter={chapter}
          form={form}/>
    );

    tree.getMountedInstance().toggleChapter();
    expect(tree.everySubTree('.form-review-panel-page').length).to.equal(2);
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
          viewedPages={new Set()}
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
          viewedPages={new Set()}
          onEdit={() => {}}
          pages={pages}
          chapterKey={chapterKey}
          chapter={chapter}
          form={form}/>
    );

    tree.getMountedInstance().toggleChapter();

    expect(tree.everySubTree('.form-review-panel-page')).to.have.length(2);
  });
  it('should mark chapter and page as unviewed', () => {
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
    const setPagesViewed = sinon.spy();

    const tree = SkinDeep.shallowRender(
      <ReviewCollapsibleChapter
          setPagesViewed={setPagesViewed}
          viewedPages={new Set()}
          onEdit={onEdit}
          pages={pages}
          chapterKey={chapterKey}
          chapter={chapter}
          form={form}/>
    );

    tree.getMountedInstance().toggleChapter();
    expect(tree.everySubTree('.schemaform-review-chapter-warning').length).to.equal(1);
    expect(tree.everySubTree('.schemaform-review-page-warning').length).to.equal(1);

    // Closing chapter should mark as viewed
    tree.getMountedInstance().toggleChapter();
    expect(setPagesViewed.firstCall.args[0]).to.eql(['test']);
  });
  it('should handle submitting array page', () => {
    const onEdit = sinon.spy();
    const setData = sinon.spy();
    const pages = [{
      title: '',
      pageKey: 'test'
    }];
    const chapterKey = 'test';
    const chapter = {};
    const form = {
      pages: {
        test: {
          showPagePerItem: true,
          arrayPath: 'testing',
          title: '',
          schema: {
            properties: {}
          },
          editMode: [false],
        }
      },
      data: {
        testing: [{}]
      }
    };

    const tree = SkinDeep.shallowRender(
      <ReviewCollapsibleChapter
          viewedPages={new Set()}
          onEdit={onEdit}
          setData={setData}
          pages={pages}
          chapterKey={chapterKey}
          chapter={chapter}
          form={form}/>
    );

    tree.getMountedInstance().handleSubmit({ test: 2 }, 'test', 'testing', 0);

    expect(onEdit.calledWith('test', false, 0)).to.be.true;
    expect(setData.firstCall.args[0]).to.eql({
      testing: [{
        test: 2
      }]
    });
  });
});
