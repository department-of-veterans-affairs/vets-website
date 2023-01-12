export default function prefillTransformer(pages, formData, metadata) {
  console.log({pages})
  console.log({formData})
  console.log({metadata})
  return {
    pages,
    formData: {
      veteran: {
        fullName: formData.veteranInformation.fullName,
      }
      // sponsorFields: {
      //   address: ,
      //   dob: ,
      //   dom: ,
      //   isDeceased: ,
      //   dod: ,
      //   isActiveServiceDeath: ,
      //   fullName: ,
      //   claim: ,
      //   phone: ,
      //   ssn: 
      // },
      // applicantFields: [
      //   {
      //     address: ,
      //     fullName: ,
      //     phone: ,
      //     ssn: ,
      //     gender: ,
      //     email: ,
      //     dob: ,
      //     isEnrolledInMedicare: ,
      //     hasOtherHealthInsurance: ,
      //     vetRelationship: 
      //   }
      // ]
    },
    metadata,
  };
}
