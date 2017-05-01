function completeServicePeriods(client, data) {
  client
    .fill('input[name="root_toursOfDuty_0_serviceBranch"]', data.toursOfDuty[0].serviceBranch)
    .fillDate('root_toursOfDuty_0_dateRange_from', data.toursOfDuty[0].dateRange.from)
    .fillDate('root_toursOfDuty_0_dateRange_to', data.toursOfDuty[0].dateRange.to)
    .fill('input[name="root_toursOfDuty_0_serviceStatus"]', data.toursOfDuty[0].serviceStatus)
    .click('button.va-growable-add-btn')
    .fill('input[name="root_toursOfDuty_1_serviceBranch"]', data.toursOfDuty[1].serviceBranch)
    .fillDate('root_toursOfDuty_1_dateRange_from', data.toursOfDuty[1].dateRange.from)
    .fillDate('root_toursOfDuty_1_dateRange_to', data.toursOfDuty[1].dateRange.to);
}
module.exports = {
  completeServicePeriods
};
