const request = require('request');
const E2eHelpers = require('./e2e-helpers');

const testData = {
  folders: {
    data: [
      {
        attributes: {
          folderId: 123,
          name: 'test folder 123'
        }
      },
      {
        attributes: {
          folderId: 456,
          name: 'test folder 456'
        }
      },
      {
        attributes: {
          folderId: 789,
          name: 'test folder 789'
        }
      }
    ]
  },

  folderMessages: {
    data: [
      {
        attributes: {
          messageId: 123,
          subject: 'subject 123',
          body: 'testing 123'
        }
      },
      {
        attributes: {
          messageId: 456,
          subject: 'subject 456',
          body: 'testing 456'
        }
      },
      {
        attributes: {
          messageId: 789,
          subject: 'subject 789',
          body: 'testing 789'
        }
      }
    ],
    meta: {
      sort: {
        sentDate: 'DESC'
      },
      pagination: {
        currentPage: 1,
        perPage: 25,
        totalEntries: 3,
        totalPages: 1
      }
    }
  },

  recipients: {
    data: [
      {
        attributes: {
          name: 'Triage Team 1',
          triageTeamId: '0'
        }
      },
      {
        attributes: {
          name: 'Triage Team 2',
          triageTeamId: '1'
        }
      },
      {
        attributes: {
          name: 'Triage Team 3',
          triageTeamId: '2'
        }
      }
    ]
  }
};

// Create API routes
function initApplicationSubmitMock() {
  request({
    uri: `${E2eHelpers.apiUrl}/mock`,
    method: 'POST',
    json: {
      path: '/v0/messaging/health/folders?per_page=100',
      verb: 'get',
      value: testData.folders,
    }
  });

  request({
    uri: `${E2eHelpers.apiUrl}/mock`,
    method: 'POST',
    json: {
      path: '/v0/messaging/health/folders/0/messages',
      verb: 'get',
      value: testData.folderMessages,
    }
  });
}

module.exports = {
  testData,
  initApplicationSubmitMock
};
