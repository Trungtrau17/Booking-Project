module.exports.pagination = (objectpagination, query, countProducts) => {
  if (query.page) {
    objectpagination.currentPage = parseInt(query.page);
    // console.log(req.query);
  }
  objectpagination.skip =
    (objectpagination.currentPage - 1) * objectpagination.limit;
  const allPages = Math.ceil(countProducts / objectpagination.limit);
  objectpagination.allPages = allPages;

  return objectpagination;
};
