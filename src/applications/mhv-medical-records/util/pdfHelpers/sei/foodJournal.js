export const generateFoodJournalContent = record => {
  const content = {
    title: record.date,
    details: [
      {
        items: [
          {
            title: 'Day of week',
            value: record.dayOfWeek,
            inline: true,
          },
          {
            title: 'Water consumed (number of 8oz glasses)',
            value: record.waterConsumed,
            inline: true,
          },
          {
            title: 'Comments',
            value: record.comments,
            inline: true,
          },
        ],
      },
    ],
  };

  const createItems = (item, lineGap) => {
    const items = [
      {
        title: 'Food/beverage item',
        value: item.item,
        inline: true,
      },
      {
        title: 'Quantity',
        value: item.quantity,
        inline: true,
      },
      {
        title: 'Serving size',
        value: item.servingSize,
        inline: true,
      },
      {
        title: 'Method of preparation',
        value: item.methodOfPreparation,
        inline: true,
      },
    ];
    if (lineGap) items[3].lineGap = 20;
    return items;
  };

  const multipleAndNotLast = (items, idx) => {
    return items.length > 1 && idx !== items.length - 1;
  };

  if (record.breakfastItems.length) {
    content.details = [
      ...content.details,
      {
        header: 'Breakfast',
        items: record.breakfastItems
          .map((item, idx) => {
            const lineGap = multipleAndNotLast(record.breakfastItems, idx);
            return createItems(item, lineGap);
          })
          .flat(),
      },
    ];
  }

  if (record.lunchItems.length) {
    content.details = [
      ...content.details,
      {
        header: 'Lunch',
        items: record.lunchItems
          .map((item, idx) => {
            const lineGap = multipleAndNotLast(record.lunchItems, idx);
            return createItems(item, lineGap);
          })
          .flat(),
      },
    ];
  }

  if (record.dinnerItems.length) {
    content.details = [
      ...content.details,
      {
        header: 'Dinner',
        items: record.dinnerItems
          .map((item, idx) => {
            const lineGap = multipleAndNotLast(record.dinnerItems, idx);
            return createItems(item, lineGap);
          })
          .flat(),
      },
    ];
  }

  if (record.snackItems.length) {
    content.details = [
      ...content.details,
      {
        header: 'Snack',
        items: record.snackItems
          .map((item, idx) => {
            const lineGap = multipleAndNotLast(record.snackItems, idx);
            return createItems(item, lineGap);
          })
          .flat(),
      },
    ];
  }

  return content;
};
