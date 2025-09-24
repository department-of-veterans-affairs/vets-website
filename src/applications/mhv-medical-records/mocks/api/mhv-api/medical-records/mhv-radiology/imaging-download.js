const all = [
  {
    '184b3a0a-b5bc-44eb-9131-4ad806045313': ['Series 02 - Image 01.jpg'],
  },
  {
    '2184acee-280a-493b-91a1-c7914f3eaf97': [
      'Series 01 - Image 01.jpg',
      'Series 02 - Image 01.jpg',
      'Series 03 - Image 01.jpg',
      'Series 1842 - Image 01.jpg',
    ],
  },
  {
    '5df3a7b7-7ead-45ff-b466-8b29a01ba94d': [
      'Series 01 - Image 01.jpg',
      'Series 02 - Image 01.jpg',
    ],
  },
  {
    '2184acee-280a-493b-91a1-c7914f3eaf98': ['Series 01 - Image 01.jpg'],
  },
];

const imagingDownload = (req, res) => {
  const { studyId } = req.params;
  const response = all.find(r => r[studyId]);
  if (!response) {
    return res.status(404).json({
      errors: [
        {
          title: 'Record not found',
          detail: `The record identified by ${studyId} could not be found`,
          code: '404',
          status: '404',
        },
      ],
    });
  }
  return res.json(response[req.params.studyId]);
};

module.exports = imagingDownload;
