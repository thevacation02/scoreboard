'use strict'

const path = require('path')
const test = require('ava')
const db = require('../../src/db/connection')
const app = require('../../src/index')
const { add, remove, list, update, listOSMIds, addOSMId, removeOSMId, updateOSMIds } = require('../../src/models/exclusion-list')
const { prop } = require('ramda')

const { createAuthenticatedUser, createAnonymousUser } = require('./helpers')

let adminUser
let authenticatedUser
let anonymousUser

const dbDirectory = path.join(__dirname, '..', '..', 'src', 'db')
const migrationsDirectory = path.join(dbDirectory, 'migrations')
const seedsDirectory = path.join(dbDirectory, 'seeds', 'test')

test.before(async () => {
  await db.migrate.latest({ directory: migrationsDirectory })
  await db.seed.run({ directory: seedsDirectory })
  adminUser = await createAuthenticatedUser(app, [1])
  authenticatedUser = await createAuthenticatedUser(app, [])
  anonymousUser = createAnonymousUser(app)
})

test.beforeEach(async () => {
  await db('exclusion_list').truncate()
})

test.after.always(async () => {
  await db.migrate.rollback({ directory: migrationsDirectory })
  await db.destroy()
})

test.serial('add / remove / list', async t => {
  t.plan(6)
  await add(1)
  await add(2)
  let result = await list()
  t.true(result.length === 2)

  let resultSet = new Set(result.map(prop('user_id')))
  t.true(resultSet.has(1))
  t.true(resultSet.has(2))

  await remove(2)
  result = await list()
  t.true(result.length === 1)
  resultSet = new Set(result.map(prop('user_id')))
  t.true(resultSet.has(1))
  t.true(!resultSet.has(2))
})

test.serial('update exclusion list', async t => {
  await add(1)
  await add(2)
  await update([2, 3, 4])
  let result = await list()
  let resultSet = new Set(result.map(prop('user_id')))
  t.true(result.length === 3)
  t.true(!resultSet.has(1))
  t.true(resultSet.has(2))
  t.true(resultSet.has(3))
  t.true(resultSet.has(4))
})

test.serial('add / remove / list using osm ids', async t => {
  t.plan(6)
  await addOSMId(100000000)
  await addOSMId(100000001)
  let result = await listOSMIds()
  t.true(result.length === 2)

  let resultSet = new Set(result.map(prop('osm_id')))
  t.true(resultSet.has(100000000))
  t.true(resultSet.has(100000001))

  await removeOSMId(100000001)
  result = await listOSMIds()
  t.true(result.length === 1)
  resultSet = new Set(result.map(prop('osm_id')))
  t.true(resultSet.has(100000000))
  t.true(!resultSet.has(100000001))
})

test.serial('update exclusion list using osm ids', async t => {
  await addOSMId(100000000)
  await addOSMId(100000001)
  await updateOSMIds([100000001, 100000002, 100000003])
  let result = await listOSMIds()
  let resultSet = new Set(result.map(prop('osm_id')))
  t.true(result.length === 3)
  t.true(!resultSet.has(100000000))
  t.true(resultSet.has(100000001))
  t.true(resultSet.has(100000002))
  t.true(resultSet.has(100000003))
})

test.serial('get list via api', async t => {
  await updateOSMIds([100000001, 100000002, 100000003])

  const { body } = await new Promise((resolve, reject) => {
    adminUser
      .get('/scoreboard/api/exclusion')
      .expect(200)
      .end((err, res) => {
        if (err) return reject(err)
        return resolve(res)
      })
  })

  t.true(body.length === 3)
})

test.serial('get list via api - not admin', async t => {
  t.plan(0)
  await updateOSMIds([100000001, 100000002, 100000003])

  await new Promise((resolve, reject) => {
    authenticatedUser
      .get('/scoreboard/api/exclusion')
      .expect(401)
      .end((err, res) => {
        if (err) return reject(err)
        return resolve(res)
      })
  })

  await new Promise((resolve, reject) => {
    anonymousUser
      .get('/scoreboard/api/exclusion')
      .expect(401)
      .end((err, res) => {
        if (err) return reject(err)
        return resolve(res)
      })
  })
})

test.serial('update list via api', async t => {
  await new Promise((resolve, reject) => {
    adminUser
      .put('/scoreboard/api/exclusion')
      .send({ 'list': [100000001, 100000002, 100000003] })
      .expect(200)
      .end((err, res) => {
        if (err) return reject(err)
        return resolve(res)
      })
  })

  const result = await listOSMIds()
  t.true(result.length === 3)
  let resultSet = new Set(result.map(prop('osm_id')))
  t.true(resultSet.has(100000001))
  t.true(resultSet.has(100000002))
  t.true(resultSet.has(100000003))
})

test.serial('update list via api - not admin', async t => {
  t.plan(0)
  await new Promise((resolve, reject) => {
    authenticatedUser
      .put('/scoreboard/api/exclusion')
      .send({ 'list': [100000001, 100000002, 100000003] })
      .expect(401)
      .end((err, res) => {
        if (err) return reject(err)
        return resolve(res)
      })
  })

  await new Promise((resolve, reject) => {
    anonymousUser
      .put('/scoreboard/api/exclusion')
      .send({ 'list': [100000001, 100000002, 100000003] })
      .expect(401)
      .end((err, res) => {
        if (err) return reject(err)
        return resolve(res)
      })
  })
})