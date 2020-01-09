class APIFeatures {
  constructor(query, queryString){
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    let queryObject = { ...this.queryString };
    // excluding some fields
    const exludedFields = ['page', 'offset', 'sort', 'limit', 'fields'];
    exludedFields.forEach(exclude => delete queryObject[exclude]);

    // adv filtering
    const queryString = JSON.stringify(queryObject);
    queryObject = JSON.parse(queryString.replace(/\b([gl]te?)\b/gi, (match) => `$${ match }`));
    this.query = this.query.find(queryObject);

    return this;
  }

  sort() {
    // sorting
    if (this.queryString.sort) {
      // Mongoose accepts string, -string, {field: 'acs/desc/accending/deccending/-1/1'}
      this.query = this.query.sort(this.queryString.sort.split(',').join(' '));
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      this.query = this.query.select(this.queryString.fields.split(',').join(' '));
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  paginate() {
    // pagination
    const page = Number(this.queryString.page) || 1;
    const limit = Number(this.queryString.limit) || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;
