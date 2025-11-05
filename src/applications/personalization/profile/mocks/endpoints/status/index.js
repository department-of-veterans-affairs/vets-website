// code for handling the status endpoint
// there are two ways that the status endpoint can be called
// 1. The status endpoint is called when the user navigates to the profile page
// 2. The status endpoint is called with an :id parameter when the application is checking the status of a transaction ie. updates for address, email, phone, etc.

// The status endpoint is called when the user navigates to the contact page
const getEmptyStatus = (_req, res) => {
  res.status(200).json({
    data: [],
  });
};

// state for retries, only used when requiredRetries > 0
let retries = 0;

const generateStatusResponse = (req, res) => {
  const { id } = req.params;

  // Special handling for VA Profile initialization transactions
  if (id.startsWith('init-vap-')) {
    // Simulate a brief initialization period
    const transactionAge = Date.now() - parseInt(id.split('-')[2], 10);
    const isInitializing = transactionAge < 3000; // 3 seconds of "initializing"

    if (isInitializing) {
      return res.json({
        data: {
          id: '',
          type: 'async_transaction_va_profile_initialize_person_transactions',
          attributes: {
            transactionId: id,
            transactionStatus: 'RECEIVED',
            type: 'AsyncTransaction::VAProfile::InitializePersonTransaction',
            metadata: [],
          },
        },
      });
    }
    return res.json({
      data: {
        id: '',
        type: 'async_transaction_va_profile_initialize_person_transactions',
        attributes: {
          transactionId: id,
          transactionStatus: 'COMPLETED_SUCCESS',
          type: 'AsyncTransaction::VAProfile::InitializePersonTransaction',
          metadata: [],
        },
      },
    });
  }

  // increase to use multiple retries
  const requiredRetries = 0;

  if (retries < requiredRetries) {
    retries += 1;
    return res.json({
      data: {
        id: '',
        type: 'async_transaction_va_profile_mock_transactions',
        attributes: {
          transactionId: id,
          transactionStatus: 'RECEIVED',
          type: 'AsyncTransaction::VAProfile::MockTransaction',
          metadata: [],
        },
      },
    });
  }

  // cases to return a failure status
  // if you want to test a failure status, add 'failure' or 'error' to the id that is returned from any transaction
  if (id.includes('failure') || id.includes('error')) {
    return res.status(200).json({
      data: {
        id: '',
        type: 'async_transaction_va_profile_mock_transactions',
        attributes: {
          transactionId: id,
          transactionStatus: 'COMPLETED_FAILURE',
          type: 'AsyncTransaction::VAProfile::MockTransaction',
          metadata: [],
        },
      },
    });
  }

  // if status params id contains 'no-changes-detected' return updateNoChangesDetected
  if (id.includes('no-changes')) {
    return res.status(200).json({
      data: {
        id: '',
        type: 'async_transaction_va_profile_mock_transactions',
        attributes: {
          transactionId: id,
          transactionStatus: 'COMPLETED_NO_CHANGES_DETECTED',
          type: 'AsyncTransaction::VAProfile::MockTransaction',
          metadata: [],
        },
      },
    });
  }

  // fallback to a successful update status
  return res.status(200).json({
    data: {
      id: '',
      type: 'async_transaction_va_profile_mock_transactions',
      attributes: {
        transactionId: id,
        transactionStatus: 'COMPLETED_SUCCESS',
        type: 'AsyncTransaction::VAProfile::MockTransaction',
        metadata: [],
      },
    },
  });
};

module.exports = { getEmptyStatus, generateStatusResponse };
