const dsn =
  'mongodb+srv://' +
  (process.env.MONGODB_USERNAME || 'root') +
  ':' +
  encodeURIComponent(process.env.MONGODB_PASSWORD || "root") +
  '@' +
  (process.env.MONGODB_HOST || 'localhost') +
  '/' +
  (process.env.MONGODB_DB || 'flowr_api')

module.exports = dsn;