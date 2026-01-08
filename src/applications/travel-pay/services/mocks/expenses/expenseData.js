const mileage = {
  id: 'a48d48d4-cdc5-4922-8355-c1a9b2742feb',
  expenseType: 'Mileage',
  name: 'Mileage Expense',
  dateIncurred: '2025-09-16T08:30:00Z',
  description: 'mileage',
  costRequested: 1.16,
  costSubmitted: 0,
  tripType: 'RoundTrip',
  requestedMileage: 2.0,
  challengeMileage: false,
  challengeRequestedMileage: 0,
  challengeReason: '',
  address: {
    addressLine1: '345 Home Address St.',
    addressLine2: 'Apt. 123',
    city: 'San Francisco',
    stateCode: 'CA',
    zipCode: '94118',
    countryName: 'United States',
  },
};

const parking = {
  id: 'e82h82h8-ghg9-8e66-c799-g5ed16186jif',
  expenseType: 'Parking',
  name: 'Parking Expense',
  dateIncurred: '2025-09-16T08:30:00Z',
  description: 'Hospital parking',
  costRequested: 15.0,
  costSubmitted: 15.0,
};

const toll = {
  id: 'f93i93i9-hih0-9f77-d800-h6fe27297kjg',
  expenseType: 'Toll',
  name: 'Toll Expense',
  dateIncurred: '2025-09-16T08:30:00Z',
  description: 'Highway toll',
  costRequested: 5.5,
  costSubmitted: 5.5,
};

const commoncarrier = {
  id: 'g04j04j0-iji1-0g88-e911-i7gf38308lkh',
  expenseType: 'CommonCarrier',
  name: 'Common Carrier Expense',
  dateIncurred: '2025-09-16T08:30:00Z',
  description: 'Taxi to appointment',
  costRequested: 45.0,
  costSubmitted: 45.0,
  carrierType: 'Taxi',
  reasonNotUsingPOV: 'PrivatelyOwnedVehicleNotAvailable',
};

const airtravel = {
  id: 'h15k15k1-jkj2-1h99-f022-j8hg49419mli',
  expenseType: 'AirTravel',
  name: 'Air Travel Expense',
  dateIncurred: '2025-09-16T08:30:00Z',
  description: 'Flight to medical appointment',
  costRequested: 350.0,
  costSubmitted: 350.0,
  tripType: 'RoundTrip',
  vendorName: 'United Airlines',
  departedFrom: 'San Francisco, CA',
  departureDate: '2025-09-15T06:00:00Z',
  arrivedTo: 'Los Angeles, CA',
  returnDate: '2025-09-15T08:00:00Z',
};

const lodging = {
  id: 'b59e59e5-ded6-5b33-9466-d2ba83853gfc',
  expenseType: 'Lodging',
  name: 'Lodging Expense',
  dateIncurred: '2025-09-16T08:30:00Z',
  description: 'Hotel stay',
  costRequested: 125.0,
  costSubmitted: 125.0,
  vendor: 'Holiday Inn',
  checkInDate: '2025-09-15',
  checkOutDate: '2025-09-16',
};

const meal = {
  id: 'c60f60f6-efe7-6c44-a577-e3cb94964hgd',
  expenseType: 'Meal',
  name: 'Meal Expense',
  dateIncurred: '2025-09-16T08:30:00Z',
  description: 'Breakfast and lunch',
  costRequested: 35.0,
  costSubmitted: 35.0,
  vendorName: 'Restaurant Name',
};

const other = {
  id: 'd71g71g7-fgf8-7d55-b688-f4dc05075ihe',
  expenseType: 'Other',
  name: 'Other Expense',
  dateIncurred: '2025-09-16T08:30:00Z',
  description: 'Medical supplies',
  costRequested: 50.0,
  costSubmitted: 50.0,
};

const expenseByType = {
  mileage,
  parking,
  toll,
  commoncarrier,
  airtravel,
  lodging,
  meal,
  other,
};

module.exports = {
  mileage,
  parking,
  toll,
  commoncarrier,
  airtravel,
  lodging,
  meal,
  other,
  expenseByType,
};
