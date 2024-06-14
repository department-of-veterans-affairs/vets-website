/* eslint-disable camelcase */
export const replyMessage = {
  attributes: {
    inquiryNumber: 'A123-4567',
    processingStatus: 'Closed',
    lastUpdate: '08/07/23',
    question:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex voluptatibus repudiandae quis? Vitae cumque aut, explicabo quidem magni pariatur quibusdam.',
    attachments: [
      {
        id: '012345',
        name: 'File_ABC.pdf',
      },
      {
        id: '06789',
        name: 'File Testing_attachment.pdf',
      },
      {
        id: '01112',
        name: 'Picture.jpg',
      },
    ],
    reply: {
      data: [
        {
          id: 'a6c3af1b-ec8c-ee11-8178-001dd804e106',
          modifiedon: '08/09/23',
          status_reason: 'Completed/Sent',
          message_type: '722310001: Response from VA',
          enable_reply: true,
          attributes: {
            reply:
              'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Deserunt recusandae eaque placeat provident excepturi dignissimos nam corporis quod ullam voluptas eos, non doloremque dolor necessitatibus ab odio? Non ad eligendi fuga voluptates possimus. At enim nam dolore quasi quis. Rem a, voluptas nihil esse commodi culpa veritatis voluptates laborum sequi natus praesentium voluptatibus corporis nesciunt distinctio libero aspernatur sed fugiat?',
            attachmentNames: [
              {
                id: '012345',
                name: 'File A.pdf',
              },
              {
                id: '06789',
                name: 'File Testing_attachment.pdf',
              },
            ],
          },
        },
        {
          id: 'a6c3af1b-ec8c-ee11-8178-001dd804e177',
          modifiedon: '08/10/23',
          status_reason: 'Completed/Sent',
          message_type: '722310000: Reply to VA',
          enable_reply: true,
          attributes: {
            reply:
              'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Deserunt recusandae eaque placeat provident excepturi dignissimos nam corporis quod ullam voluptas eos, non doloremque dolor necessitatibus ab odio? Non ad eligendi fuga voluptates possimus. At enim nam dolore quasi quis. Rem a, voluptas nihil esse commodi culpa veritatis voluptates laborum sequi natus praesentium voluptatibus corporis nesciunt distinctio libero aspernatur sed fugiat?',
            attachmentNames: [],
          },
        },
        {
          id: 'a6c3af1b-ec8c-ee11-8178-001dd804e188',
          modifiedon: '08/11/23',
          status_reason: 'Completed/Sent',
          message_type: '722310001: Response from VA',
          enable_reply: true,
          attributes: {
            reply:
              'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Deserunt recusandae eaque placeat provident excepturi dignissimos nam corporis quod ullam voluptas eos, non doloremque dolor necessitatibus ab odio? Non ad eligendi fuga voluptates possimus. At enim nam dolore quasi quis. Rem a, voluptas nihil esse commodi culpa veritatis voluptates laborum sequi natus praesentium voluptatibus corporis nesciunt distinctio libero aspernatur sed fugiat?',
            attachmentNames: [],
          },
        },
      ],
    },
  },
};

export const replyMessage2 = {
  attributes: {
    inquiryNumber: 'AA987-543',
    processingStatus: 'In Progress',
    lastUpdate: '08/07/23',
    question:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex voluptatibus repudiandae quis? Vitae cumque aut, explicabo quidem magni pariatur quibusdam.',
    attachments: [],
    reply: {
      data: [],
    },
  },
};
