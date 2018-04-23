import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import VerifiedReviewPage from '../../../../src/js/disability-benefits/526EZ/components/VerifiedReviewPage.jsx';

const onBlur = sinon.spy();
const setData = sinon.spy();
const uploadFile = sinon.spy();
const onEdit = sinon.spy();

describe('526EZ <VerifiedReviewPage>', () => {
  it('should render verifiedViewComponent', () => {
    const form = {
      disableSave: false,
      pages: {
        pageOne: {
          schema: {},
          uiSchema: {}
        }
      },
      data: {
        prefilled: true
      }
    };

    const tree = shallow(
      <VerifiedReviewPage
        onEdit={onEdit}
        verifiedReviewComponent={() => 'testComponent'}
        pageKey={'pageOne'}
        title={() => 'testTitle'}
        onBlur={onBlur}
        uploadFile={uploadFile}
        setData={setData}
        form={form}/>
    );

    expect(tree.text()).to.contain('testComponent');
  });

  it('should toggle', () => {
    const form = {
      disableSave: false,
      pages: {
        pageOne: {
          schema: {},
          uiSchema: {}
        }
      },
      data: {}
    };

    const tree = shallow(
      <VerifiedReviewPage
        onEdit={onEdit}
        verifiedReviewComponent={() => 'testComponent'}
        pageKey={'pageOne'}
        title={() => 'testTitle'}
        onBlur={onBlur}
        uploadFile={uploadFile}
        setData={setData}
        form={form}/>
    );

    tree.instance().handleEdit('pageOne', false);
    expect(onEdit.called).to.be.true;
  });
});
