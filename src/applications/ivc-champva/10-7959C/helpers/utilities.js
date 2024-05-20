import _ from 'lodash';

export function isRequiredFile(formContext, requiredFiles) {
  return Object.keys(formContext?.schema?.properties || {}).filter(v =>
    Object.keys(requiredFiles).includes(v),
  ).length >= 1
    ? '(Required)'
    : '(Optional)';
}

// Return either 'your' or the applicant's name depending
export function nameWording(formData, isPosessive = true, cap = true) {
  let retVal = '';
  if (formData?.certifierRole === 'applicant') {
    retVal = isPosessive ? 'your' : 'you';
  } else {
    // Concatenate all parts of applicant's name (first, middle, etc...)
    retVal = Object.values(formData?.applicantName || {})
      .filter(el => el)
      .join(' ');
    retVal = isPosessive ? `${retVal}’s` : retVal;
  }

  // Optionally capitalize first letter and return
  return cap ? retVal.charAt(0).toUpperCase() + retVal.slice(1) : retVal;
}

/*
For identifying all files the user has uploaded. Returns a list with
each uploaded file object (for top-level objects only), e.g.
for input:
{
    "applicantPartDCard": [
        {
            "name": "file1.png",
            "attachmentId": "Front of Part D card",
        }
    ],
    "applicantPartAPartBCard": [
        {
            "name": "file2.png",
            "attachmentId": "Back of Parts A or B card",
        }
    ],
    "someOtherKey": "other",
}

it would produce output:

[
  {
      "name": "file1.png",
      "attachmentId": "Front of Medicare Part D card",
  },
  {
      "name": "file2.png",
      "attachmentId": "Front of Medicare Parts A or B card",
  },
]
*/
export function getObjectsWithAttachmentId(obj) {
  const objectsWithAttachmentId = [];
  _.forEach(obj, value => {
    if (_.isArray(value)) {
      _.forEach(value, item => {
        if (_.isObject(item) && _.has(item, 'attachmentId')) {
          objectsWithAttachmentId.push(item);
        }
      });
    }
  });

  return objectsWithAttachmentId;
}
