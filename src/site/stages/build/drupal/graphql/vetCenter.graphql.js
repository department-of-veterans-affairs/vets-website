const vetCenterFragment = `
 fragment vetCenterFragment on NodeVetCenter {
        entityId
        entityUrl {
          path
          routed
        }
        entityBundle
        entityLabel
        fieldIntroText
        fieldOfficeHours {
          day
          starthours
          endhours
          comment
        }
        fieldHealthServices {
          entity {
            ... on NodeVetCenterFacilityHealthServi {
              fieldBody {
                value
                format
                processed
              }
            }
          }
        }
      }`;

const GetVetCenters = `
  ${vetCenterFragment}
  
  query GetVetCenters {
    nodeQuery(limit: 1000, filter: {
      conditions: [
        { field: "type", value: ["vet_center"] }
      ]
    }) {
      entities {
        ... vetCenterFragment
      }
    }
  }
`;

module.exports = {
  fragment: vetCenterFragment,
  GetVetCenters,
};
