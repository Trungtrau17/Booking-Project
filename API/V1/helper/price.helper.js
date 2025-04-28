module.exports.priceList = (records) => {
  const newRecords = records.map((item) => {
    item.newPrice = item.price - (item.price * item.discountPersent) / 100;
    return item;
  });
  return newRecords;
};
module.exports.priceItem = (record) => {
  record.newPrice =
    record.price - (record.price * record.discountPersent) / 100;
  return record;
};
