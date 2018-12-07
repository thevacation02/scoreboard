const countryHelp = require('i18n-iso-countries')
const connection = require('../db/connection')

function applyFilters (query, req) {
  const search = req.query.q || ''

  if (search.length > 0) {
    query = query.where('country_name', 'ilike', `%${search}%`)
  }

  return query
}

/**
 * All Users and their stats route
 * /users/stats
 *
 * The users route displays all the users from the external
 * users source
 *
 * @param {Object} req - the request object
 * @param {Object} res - the response object
 * @returns {Promise} a response
 */
async function stats (req, res) {
  const sortType = req.query.sortType || ''

  try {
    const db = connection()

    // get all the counts
    const countQuery = db('user_country_edits').countDistinct('country_name')

    // count all countries
    const totalCountries = await countQuery.clone()

    // count subtotal
    const subTotal = await applyFilters(countQuery, req)

    // Create table with ranking
    const allCountries = db('user_country_edits')
      .select('country_name as name', 'edit_count')
      .groupBy('country_name', 'edit_count')

    // apply search filter
    let recordQuery = applyFilters(allCountries.clone(), req)

    // apply sorting
    switch (sortType) {
      case 'Least total':
        recordQuery = recordQuery.orderBy('edit_count', 'asc')
        break
      default: // Most total edits
        recordQuery = recordQuery.orderBy('edit_count', 'desc')
        break
    }

    let records = await recordQuery.clone()

    // add alpha codes to each country
    records = records.map((c) => {
      c.alpha2 = countryHelp.getAlpha2Code(c.name, 'en')
      return c
    })

    return res.send({
      records,
      subTotal: parseInt(subTotal[0].count, 10),
      total: parseInt(totalCountries[0].count, 10),
      editTotal: records.reduce((sum, { edit_count }) => sum + edit_count, 0)
    })
  } catch (err) {
    console.error(err)
    return res.boom.notFound('Could not retrieve records')
  }
}

module.exports = {
  stats
}