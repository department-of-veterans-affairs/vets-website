import React from 'react';
import { expect } from 'chai';
import SkinDeep from 'skin-deep';
import sinon from 'sinon';

import { ReviewPage } from '../../../../src/js/common/schemaform/review/ReviewPage';

describe('Schemaform review: ReviewPage', () => {
  const location = {
    pathname: '/testing/0'
  };

  it('should render chapters', () => {
    const formConfig = {
      chapters: {
        chapter1: {
          pages: {
            page1: {}
          }
        },
        chapter2: {
          pages: {
            page2: {}
          }
        }
      }
    };

    const pageList = [
      {
        path: 'previous-page'
      },
      {
        path: 'testing',
        pageKey: 'testPage'
      },
      {
        path: 'next-page'
      }
    ];

    const form = {
      submission: {
        hasAttemptedSubmit: false
      },
      data: {
        privacyAgreementAccepted: false
      }
    };

    const user = {
      profile: {
        savedForms: []
      },
      login: {
        currentlyLoggedIn: true
      }
    };

    const tree = SkinDeep.shallowRender(
      <ReviewPage
        form={form}
        user={user}
        route={{ formConfig, pageList }}
        setEditMode={f => f}
        setPrivacyAgreement={f => f}
        location={location}/>
    );

    expect(tree.everySubTree('ReviewCollapsibleChapter').length).to.equal(2);
  });
  it('should go back', () => {
    const setData = sinon.spy();
    const onSubmit = sinon.spy();
    const router = {
      push: sinon.spy()
    };
    const route = {
      path: 'testPage',
      pageList: [
        {
          path: 'previous-page'
        },
        {
          path: 'testing',
          pageKey: 'testPage'
        },
        {
          path: 'next-page'
        }
      ],
      formConfig: {
        chapters: {
          chapter1: {
            pages: {
              page1: {
                schema: {}
              }
            }
          },
          chapter2: {
            pages: {
              page2: {
              }
            }
          }
        }
      }
    };
    const form = {
      submission: {
        hasAttemptedSubmit: false
      },
      page1: {
        schema: {},
      },
      page2: {
        schema: {},
      },
      data: {
        privacyAgreementAccepted: true
      }
    };

    const user = {
      profile: {
        savedForms: []
      },
      login: {
        currentlyLoggedIn: true
      }
    };

    const tree = SkinDeep.shallowRender(
      <ReviewPage
        router={router}
        setData={setData}
        form={form}
        user={user}
        onSubmit={onSubmit}
        setEditMode={f => f}
        setPrivacyAgreement={f => f}
        route={route}
        location={location}/>
    );

    tree.getMountedInstance().goBack();

    expect(router.push.calledWith('previous-page'));
  });
  it('should submit when valid', () => {
    const formConfig = {
      chapters: {
        chapter1: {
          pages: {
            page1: {
              schema: {}
            }
          }
        },
        chapter2: {
          pages: {
            page2: {
            }
          }
        }
      }
    };

    const form = {
      submission: {
        hasAttemptedSubmit: false
      },
      pages: {
        page1: {
          schema: {},
        },
        page2: {
          schema: {},
        },
      },
      data: {
        privacyAgreementAccepted: true
      }
    };

    const user = {
      profile: {
        savedForms: []
      },
      login: {
        currentlyLoggedIn: true
      }
    };

    const pageList = [
      {
        path: 'previous-page'
      },
      {
        path: 'testing',
        pageKey: 'testPage'
      },
      {
        path: 'next-page'
      }
    ];

    const submitForm = sinon.spy();

    const tree = SkinDeep.shallowRender(
      <ReviewPage
        submitForm={submitForm}
        form={form}
        user={user}
        setEditMode={f => f}
        setPrivacyAgreement={f => f}
        route={{ formConfig, pageList }}
        location={location}/>
    );

    tree.getMountedInstance().handleSubmit();

    expect(submitForm.called).to.be.true;
  });
  it('should not submit when invalid', () => {
    const formConfig = {
      chapters: {
        chapter1: {
          pages: {
            page1: {
              schema: {}
            }
          }
        },
        chapter2: {
          pages: {
            page2: {
              schema: {}
            }
          }
        }
      }
    };

    const form = {
      submission: {
        hasAttemptedSubmit: false
      },
      pages: {
        page1: {},
        page2: {},
      },
      data: {
        privacyAgreementAccepted: false
      }
    };

    const user = {
      profile: {
        savedForms: []
      },
      login: {
        currentlyLoggedIn: true
      }
    };

    const pageList = [
      {
        path: 'previous-page'
      },
      {
        path: 'testing',
        pageKey: 'testPage'
      },
      {
        path: 'next-page'
      }
    ];

    const submitForm = sinon.spy();
    const setSubmission = sinon.spy();

    const tree = SkinDeep.shallowRender(
      <ReviewPage
        setSubmission={setSubmission}
        submitForm={submitForm}
        form={form}
        user={user}
        setEditMode={f => f}
        setPrivacyAgreement={f => f}
        route={{ formConfig, pageList }}
        location={location}/>
    );

    tree.getMountedInstance().handleSubmit();

    expect(submitForm.called).to.be.false;
    expect(setSubmission.called).to.be.true;
  });
  it('should not submit when privacy agreement not accepted', () => {
    const formConfig = {
      chapters: {
        chapter1: {
          pages: {
            page1: {}
          }
        },
        chapter2: {
          pages: {
            page2: {}
          }
        }
      }
    };

    const form = {
      submission: {
        hasAttemptedSubmit: false
      },
      pages: {
        page1: {},
        page2: {},
      },
      data: {
        privacyAgreementAccepted: false
      }
    };

    const user = {
      profile: {
        savedForms: []
      },
      login: {
        currentlyLoggedIn: true
      }
    };

    const pageList = [
      {
        path: 'previous-page'
      },
      {
        path: 'testing',
        pageKey: 'testPage'
      },
      {
        path: 'next-page'
      }
    ];

    const submitForm = sinon.spy();
    const setSubmission = sinon.spy();

    const tree = SkinDeep.shallowRender(
      <ReviewPage
        setSubmission={setSubmission}
        submitForm={submitForm}
        form={form}
        user={user}
        setEditMode={f => f}
        setPrivacyAgreement={f => f}
        route={{ formConfig, pageList }}
        location={location}/>
    );

    tree.getMountedInstance().handleSubmit();

    expect(submitForm.called).to.be.false;
    expect(setSubmission.called).to.be.true;
  });
  it('should route to confirmation page after submit', () => {
    const formConfig = {
      chapters: {
        chapter1: {
          pages: {
            page1: {}
          }
        },
        chapter2: {
          pages: {
            page2: {}
          }
        }
      }
    };

    const form = {
      submission: {
        hasAttemptedSubmit: false
      },
      data: {
        privacyAgreementAccepted: false
      }
    };

    const user = {
      profile: {
        savedForms: []
      },
      login: {
        currentlyLoggedIn: true
      }
    };

    const router = {
      push: sinon.spy()
    };

    const pageList = [
      {
        path: 'previous-page'
      },
      {
        path: 'testing',
        pageKey: 'testPage'
      },
      {
        path: 'next-page'
      }
    ];

    const tree = SkinDeep.shallowRender(
      <ReviewPage
        router={router}
        form={form}
        user={user}
        setEditMode={f => f}
        setPrivacyAgreement={f => f}
        route={{ formConfig, pageList }}
        location={location}/>
    );

    tree.getMountedInstance().componentWillReceiveProps({
      route: {
        formConfig: {}
      },
      form: {
        submission: {
          status: 'applicationSubmitted'
        },
        data: {
          privacyAgreementAccepted: false
        }
      }
    });

    expect(router.push.calledWith('confirmation'));
  });
  it('should handle editing', () => {
    const formConfig = {
      chapters: {
        chapter1: {
          pages: {
            page1: {}
          }
        },
        chapter2: {
          pages: {
            page2: {}
          }
        }
      }
    };

    const pageList = [
      {
        path: 'previous-page'
      },
      {
        path: 'next-page'
      }
    ];

    const form = {
      submission: {
        hasAttemptedSubmit: false
      },
      data: {
        privacyAgreementAccepted: false
      }
    };

    const user = {
      profile: {
        savedForms: []
      },
      login: {
        currentlyLoggedIn: true
      }
    };

    const setEditMode = sinon.spy();

    const tree = SkinDeep.shallowRender(
      <ReviewPage
        form={form}
        user={user}
        route={{ formConfig, pageList }}
        setEditMode={setEditMode}
        setPrivacyAgreement={f => f}
        location={location}/>
    );

    expect(tree.getMountedInstance().state.viewedPages.has('testPage')).to.be.false;
    tree.getMountedInstance().handleEdit('testPage', true);
    expect(tree.getMountedInstance().state.viewedPages.has('testPage')).to.be.true;
    expect(setEditMode.calledWith('testPage', true, null));
  });
});
