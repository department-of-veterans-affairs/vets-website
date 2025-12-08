/**
 * Migration to update address street and zip code to match new schema
 */

export default function updateAddressStreetAndZip(savedData) {
  // console.log("HIT **************************", savedData)
  // Make a copy to avoid mutating the original data
  const updatedData = { ...savedData };

  // Check if mailingAddress exists and has the old field structure
  if (updatedData.mailingAddress) {
    // console.log('Migrating mailingAddress fields to new structure', updatedData.mailingAddress);
    const mailingAddress = { ...updatedData.mailingAddress };

    // Map addressLine1 -> street, addressLine2 -> street2, addressLine3 -> street3
    if ('addressLine1' in mailingAddress) {
      mailingAddress.street = mailingAddress.addressLine1;
      delete mailingAddress.addressLine1;
    }

    if ('addressLine2' in mailingAddress) {
      mailingAddress.street2 = mailingAddress.addressLine2;
      delete mailingAddress.addressLine2;
    }

    if ('addressLine3' in mailingAddress) {
      mailingAddress.street3 = mailingAddress.addressLine3;
      delete mailingAddress.addressLine3;
    }

    // Map zipCode -> postalCode
    if ('zipCode' in mailingAddress) {
      mailingAddress.postalCode = mailingAddress.zipCode;
      delete mailingAddress.zipCode;
    }

    // Update the mailingAddress in the form data
    updatedData.mailingAddress = mailingAddress;
    // console.log('Updated mailingAddress:', updatedData.mailingAddress);
  }

  return updatedData;
}
