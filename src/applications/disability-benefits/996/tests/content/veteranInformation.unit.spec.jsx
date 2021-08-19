import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';

import { VeteranInformation } from '../../components/VeteranInformation';
import { SELECTED } from '../../constants';

describe('veteranInformation', () => {
  // Failed on master: http://jenkins.vfs.va.gov/blue/organizations/jenkins/testing%2Fvets-website/detail/master/10215/tests
  it.skip('should add benefitType & contestedIssues to formData', () => {
    const setFormData = sinon.spy();
    const data = {
      formData: {
        // issues from previous save-in-progress
        contestedIssues: [
          {
            type: 'contestableIssue',
            attributes: {
              ratingIssueSubjectText: 'selected issue',
              ratingIssueReferenceId: '111',
              ratingIssuePercentNumber: 10,
            },
            [SELECTED]: true,
          },
          {
            type: 'contestableIssue',
            attributes: {
              ratingIssueSubjectText: 'issue to be removed',
              ratingIssueReferenceId: '555',
              ratingIssuePercentNumber: 15,
            },
          },
          {
            type: 'contestableIssue',
            attributes: {
              ratingIssueSubjectText: 'non-selected issue',
              ratingIssueReferenceId: '999',
              ratingIssuePercentNumber: 20,
            },
          },
        ],
      },
      profile: {
        dob: '2000-01-01',
        gender: 'M',
        userFullName: {
          first: 'Foo',
          last: 'Bar',
        },
        vapContactInfo: {
          mailingAddress: {
            zipCode: '94608',
          },
        },
      },
      veteran: {
        ssnLastFour: '9876',
        vaFileLastFour: '5432',
      },

      // Content added from the API
      contestableIssues: {
        benefitType: 'compensation',
        issues: [
          {
            type: 'contestableIssue',
            attributes: {
              ratingIssueSubjectText: 'should be selected issue',
              ratingIssueReferenceId: '111',
              ratingIssuePercentNumber: 10,
            },
          },
          {
            type: 'contestableIssue',
            attributes: {
              ratingIssueSubjectText: 'should be non-selected issue',
              ratingIssueReferenceId: '999',
              ratingIssuePercentNumber: 20,
            },
          },
          {
            type: 'contestableIssue',
            attributes: {
              ratingIssueSubjectText: 'new issue',
              ratingIssueReferenceId: '333',
              ratingIssuePercentNumber: 25,
            },
          },
        ],
      },
    };

    const resultingIssueList = [
      {
        type: 'contestableIssue',
        attributes: {
          ratingIssueSubjectText: 'should be selected issue',
          ratingIssueReferenceId: '111',
          ratingIssuePercentNumber: 10,
        },
        [SELECTED]: true,
      },
      {
        type: 'contestableIssue',
        attributes: {
          ratingIssueSubjectText: 'should be non-selected issue',
          ratingIssueReferenceId: '999',
          ratingIssuePercentNumber: 20,
        },
      },
      {
        type: 'contestableIssue',
        attributes: {
          ratingIssueSubjectText: 'new issue',
          ratingIssueReferenceId: '333',
          ratingIssuePercentNumber: 25,
        },
      },
    ];

    const tree = mount(
      <VeteranInformation {...data} setFormData={setFormData} />,
    );
    expect(tree.find('.name').text()).to.equal('Foo  Bar');
    expect(tree.find('.ssn').text()).to.contain('9876');
    expect(tree.find('.vafn').text()).to.contain('5432');
    expect(tree.find('.dob').text()).to.contain('January 1, 2000');
    expect(tree.find('.gender').text()).to.contain('Male');

    expect(setFormData.called).to.be.true;
    expect(setFormData.lastCall.args[0].benefitType).to.equal('compensation');
    expect(setFormData.lastCall.args[0].contestedIssues).to.deep.equal(
      resultingIssueList,
    );
    expect(setFormData.lastCall.args[0].zipCode5).to.equal('94608');
    tree.unmount();
  });
});
