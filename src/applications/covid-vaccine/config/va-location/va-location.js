export const schema = {
  vaLocation: {
    type: 'object',
    properties: {
      location: {
        type: 'string',
      },
    },
  },
};

const fakeJSON = [
  {
    id: 1,
    state: 'Michigan',
    name: 'My VA Location',
  },
];

let executed = false;

export const uiSchema = {
  vaLocation: {
    location: {
      'ui:options': {
        updateSchema(formData, schema, uiSchema, index, pathToCurrentData) {
          let prevZip = null;
          const pathArray = window.location.pathname.split('/');
          console.log(pathArray[2]);
          // This function returns an object with the properties you want to update. Instead of
          // replacing the existing schema, it updates the individual properties.
          if (formData.zipCode != undefined && formData.zipCode.length === 5) {
            executed = true;
            console.log(formData.zipCode);
            const titleArray = [];
            titleArray.push(fakeJSON[0].state);
            return {
              type: 'string',
              enum: titleArray,
            };
          }
          prevZip = formData.zipCode;
          return {
            type: 'string',
          };
        },
      },
    },
  },
};
