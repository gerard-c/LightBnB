const properties = require('./json/properties.json');
const users = require('./json/users.json');

const { Pool } = require('pg');

const pool = new Pool({
  user: 'gerard',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});


/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = (email) => {
  return pool
    .query(`
    SELECT *
    FROM users
    WHERE email = $1;
    `, [email])
    .then(res => res.rows.length > 0 ? res.rows[0] : null)
    .catch(err => console.log(err.message));
}
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = (id) => {
  return pool
    .query(`
  SELECT *
  FROM users
  WHERE id = $1;
  `, [id])
    .then(res => res.rows.length > 0 ? res.rows[0] : null)
    .catch(err => console.log(err.message));
}
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = (user) => {
  const queryString = `
  INSERT INTO users (name, email, password)
  VALUES ($1, $2, $3)
  RETURNING *;
  `

  const values = [user.name, user.email, user.password];

  return pool
    .query(queryString, values)
    .catch(err => console.log(err.message));
}
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = (guest_id, limit = 10) => {
  const values = [guest_id, limit];
  return pool
    .query(`
    SELECT *
    FROM reservations
    JOIN properties ON reservations.property_id = properties.id
    WHERE guest_id = $1 AND end_date < now()::date
    LIMIT $2;
    `, values)
    .then(res => res.rows.length > 0 ? res.rows : null)
    .catch(err => console.log(err.message));
};
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = (options, limit = 10) => {
  // 1
  const queryParams = [];
  // 2
  let queryString = `
   SELECT properties.*, avg(property_reviews.rating) as average_rating
   FROM properties
   JOIN property_reviews ON properties.id = property_id
   `;

  // 3
  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryString += `WHERE city LIKE $${queryParams.length} `;
  }

  if (options.owner_id) {
    queryString += `${!queryParams.length ? 'WHERE' : 'AND'}`;
    queryParams.push(options.owner_id);
    queryString += ` properties.owner_id = $${queryParams.length} `;
  }

  if (options.minimum_price_per_night) {
    queryString += `${!queryParams.length ? 'WHERE' : 'AND'}`;
    queryParams.push(options.minimum_price_per_night*100);
    queryString += ` properties.cost_per_night >= $${queryParams.length} `;
  }

  if (options.maximum_price_per_night) {
    queryString += `${!queryParams.length ? 'WHERE' : 'AND'}`;
    queryParams.push(options.maximum_price_per_night*100);
    queryString += ` properties.cost_per_night <= $${queryParams.length} `;
  }
  
  if (options.minimum_rating) {
    queryString += `${!queryParams.length ? 'WHERE' : 'AND'}`;
    queryParams.push(options.minimum_rating);
    queryString += ` property_reviews.rating >= $${queryParams.length} `;
  }

  // 4
  queryParams.push(limit);
  queryString += `
   GROUP BY properties.id
   ORDER BY cost_per_night
   LIMIT $${queryParams.length};
   `;

  // 5
  console.log(queryString, queryParams);

  // 6
  return pool.query(queryString, queryParams)
    .then((res) => res.rows);
};
exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function (property) {
  const queryString = `
  INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
  RETURNING *;
  `

  const values = [property.owner_id, property.title, property.description, property.thumbnail_photo_url, property.cover_photo_url, property.cost_per_night*100, property.parking_spaces, property.number_of_bathrooms, property.number_of_bedrooms, property.country, property.street, property.city, property.province, property.post_code];

  return pool
    .query(queryString, values)
    .then(res => console.log(res))
    .catch(err => console.log(err.message));
}
exports.addProperty = addProperty;
