export const testData = {
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
          body: 'testing 123'
        }
      },
      {
        attributes: {
          messageId: 456,
          body: 'testing 456'
        }
      },
      {
        attributes: {
          messageId: 789,
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
