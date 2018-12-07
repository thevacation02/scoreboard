'use strict'

const path = require('path')
const test = require('ava')
const request = require('supertest')
const connection = require('../src/db/connection')
const app = require('../src/index')
const userClocks = require('../src/users_clock')

let db
const dbDirectory = path.join(__dirname, '..', 'src', 'db')
const migrationsDirectory = path.join(dbDirectory, 'migrations')
const seedsDirectory = path.join(dbDirectory, 'seeds', 'test')

test.before(async () => {
  db = connection()
  await db.migrate.latest({ directory: migrationsDirectory })
  await db.seed.run({ directory: seedsDirectory })

  // run users clock
  await userClocks()
})

test.after.always(async () => {
  await db.migrate.rollback({ directory: migrationsDirectory })
  await db.destroy()
})

test('Test countries list endpoint', async (t) => {
  const res = await request(app)
    .get('/scoreboard/api/countries')
    .expect(200)
  t.is(res.body.subTotal, res.body.records.length)
  t.is(res.body.total, res.body.records.length)
  t.is(res.body.editTotal, res.body.records.reduce((total, { edit_count }) => total + edit_count, 0))
})

test('Test countries list endpoint with search', async (t) => {
  const res = await request(app)
    .get('/scoreboard/api/countries?q=sud')
    .expect(200)
  t.is(res.body.records[0].name, 'Sudan')
  t.is(res.body.subTotal, res.body.records.length)
  t.is(res.body.total, 6)
  t.is(res.body.editTotal, res.body.records.reduce((total, { edit_count }) => total + edit_count, 0))
})

test('Test countries list endpoint sorting', async (t) => {
  const res = await request(app)
    .get('/scoreboard/api/countries?sortType=Least total')
    .expect(200)
  t.is(res.body.records[0].name, 'Romania')
  t.is(res.body.records[res.body.records.length - 1].alpha2, 'PG')
})

test('Test getting one country', async (t) => {
  const res = await request(app)
    .get('/scoreboard/api/countries/RO')
    .expect(200)
  t.is(res.body.alpha2, 'RO')
  t.is(res.body.users.length, 8)
  t.is(res.body.edit_count, 528)
})

test('Test getting a country that doesnt exist', async (t) => {
  const res = await request(app)
    .get('/scoreboard/api/countries/RU')
    .expect(200)
  t.is(res.body.alpha2, 'RU')
  t.is(res.body.users.length, 0)
  t.is(res.body.edit_count, 0)
})