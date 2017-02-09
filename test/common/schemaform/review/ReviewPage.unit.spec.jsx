import React from 'react';
import { expect } from 'chai';
import SkinDeep from 'skin-deep';
import sinon from 'sinon';

import { ReviewPage } from '../../../../src/js/common/schemaform/review/ReviewPage';

describe('Schemaform review: ReviewPage', () => {
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

    const form = {
      submission: {
        hasAttemptedSubmit: false
      }
    };

    const tree = SkinDeep.shallowRender(
      <ReviewPage form={form} route={{ formConfig }}/>
    );

    expect(tree.everySubTree('ReviewCollapsibleChapter').length).to.equal(2);
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
      page1: {
        data: {
        }
      },
      page2: {
        data: {
        }
      },
      privacyAgreementAccepted: true
    };

    const submitForm = sinon.spy();

    const tree = SkinDeep.shallowRender(
      <ReviewPage submitForm={submitForm} form={form} route={{ formConfig }}/>
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
      page1: {
        data: {}
      },
      page2: {
        data: {}
      },
      privacyAgreementAccepted: false
    };

    const submitForm = sinon.spy();
    const setSubmission = sinon.spy();

    const tree = SkinDeep.shallowRender(
      <ReviewPage
          setSubmission={setSubmission}
          submitForm={submitForm}
          form={form}
          route={{ formConfig }}/>
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
      page1: {
        isValid: true
      },
      page2: {
        isValid: true
      },
      privacyAgreementAccepted: false
    };

    const submitForm = sinon.spy();
    const setSubmission = sinon.spy();

    const tree = SkinDeep.shallowRender(
      <ReviewPage
          setSubmission={setSubmission}
          submitForm={submitForm}
          form={form}
          route={{ formConfig }}/>
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
      }
    };

    const router = {
      push: sinon.spy()
    };

    const tree = SkinDeep.shallowRender(
      <ReviewPage router={router} form={form} route={{ formConfig }}/>
    );

    tree.getMountedInstance().componentWillReceiveProps({
      route: {
        formConfig: {}
      },
      form: {
        submission: {
          status: 'applicationSubmitted'
        }
      }
    });

    expect(router.push.calledWith('confirmation'));
  });
});
