const db = require('../db/connection')
const { validateRole } = require('../utils/roles')

async function get (req, res) {
  try {
    const { id } = req.params
    let fromDB = null
    if (!id) {
      fromDB = await db('badges').select()
    } else {
      fromDB = await db('badges').where('id', '=', id)
    }
    return res.send({
      badges: fromDB
    })
  } catch (e) {
    return res.sendStatus(500)
  }
}

async function post (req, res) {
  const { user, body } = req

  if (!user || !user.roles || !validateRole(user.roles, 'admin')) {
    return res.boom.unauthorized('Not authorized')
  }

  try {
    let [ id ] = await db('badges').insert(body).returning('id')
    return res.send({ id })
  } catch (e) {
    if (e.code === '23505') { // Uniqueness constraint
      return res.boom.badRequest('Badge name already exists')
    }
    return res.sendStatus(500)
  }
}

async function del (req, res) {
  const { user, params: { id } } = req

  if (!user || !user.roles || !validateRole(user.roles, 'admin')) {
    return res.boom.unauthorized('Not authorized')
  }

  if (!id) {
    return res.boom.badRequest('Invalid id')
  }

  try {
    await db('badges').where('id', '=', id).del()
    return res.sendStatus(200)
  } catch (e) {
    return res.sendStatus(500)
  }
}

async function put (req, res) {
  const { user, body, params: { id } } = req

  if (!user || !user.roles || !validateRole(user.roles, 'admin')) {
    return res.boom.unauthorized('Not authorized')
  }

  if (!id) {
    return res.boom.badRequest('Invalid id')
  }

  try {
    await db('badges').where('id', '=', id).update(body)
    return res.sendStatus(200)
  } catch (err) {
    if (err.code === '23505') { // Uniqueness constraint
      return res.boom.badRequest('Badge name already exists')
    }
    console.error(err)
    return res.sendStatus(500)
  }
}

module.exports = {
  get,
  post,
  put,
  del
}
