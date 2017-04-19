// I really don't want to duplicate this, but the lack of view:veteranId really
//  throws a wrench into it.
function completeVeteranInformation(client, data, onlyRequiredFields, root = 'root') {
  client
    .fill(`input[name="${root}_veteranFullName_first"]`, data.veteranFullName.first)
    .fill(`input[name="${root}_veteranFullName_middle"]`, data.veteranFullName.middle)
    .fill(`input[name="${root}_veteranFullName_last"]`, data.veteranFullName.last)
    .fill(`select[name="${root}_veteranFullName_suffix"]`, data.veteranFullName.suffix)
    .fill(`input[name="${root}_veteranSocialSecurityNumber"]`, data.veteranSocialSecurityNumber)
    .fillDate('root_veteranDateOfBirth', data.veteranDateOfBirth);
}

// Wrap them all up in an object we can use
module.exports = {
  completeVeteranInformation
};
