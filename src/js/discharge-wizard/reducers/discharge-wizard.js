
const initialState = {
  reason: null, // 1
  dischargeType: null, // 1a
  intention: null, // 1b
  dischargeYear: null, // 2
  dischargeMonth: null, // 2a
  courtMartial: null, // 3
  branchOfService: null, // 4
  prevApplication: null, // 5
  prevApplicationYear: null, // 5a
  prevApplicationType: null, // 5b
};

function dischargeWizard(state = initialState, action) {
  switch (action.type) {
    default:
      return state;
  }
}

export default dischargeWizard;
