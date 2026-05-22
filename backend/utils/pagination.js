export const getPaginationParams = (query) => {
  
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 40;
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

export const getPaginationInfo = (totalDocs, page, limit) => {
  const totalPages = Math.ceil(totalDocs / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  return {
    totalDocs,
    totalPages,
    currentPage: page,
    hasNextPage,
    hasPrevPage,
    nextPage: hasNextPage ? page + 1 : null,
    prevPage: hasPrevPage ? page - 1 : null
  };
};
