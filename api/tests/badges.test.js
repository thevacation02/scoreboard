
const test = require('ava')
const request = require('supertest')
const app = require('../src/index')

test('Pull all badges', async (t) => {
  const res = await request(app)
    .get('/scoreboard/api/badges')
    .expect(200)
  const numBadges = res.body.badges.length
  if (numBadges > 0) {
    // name should always be included
    t.true('name' in res.body.badges[numBadges - 1])
  }
  t.true(numBadges === 10)
})

test('Getting a badge from the db', async (t) => {
  const res = await request(app)
    .get('/scoreboard/api/badges/1')
    .expect(200)
  // name should always be included
  t.true('name' in res.body.badges[0])
})

test.serial('Inserting a badge into the db', async (t) => {
  let res = await request(app)
    .get('/scoreboard/api/badges')
    .expect(200)
  const numBadges = res.body.badges.length
  await request(app)
    .post('/scoreboard/api/badges')
    .send({ name: 'Test Badge', operations: [['>', 'daysTotal', '100']] })
    .expect(200)
  res = await request(app)
    .get(`/scoreboard/api/badges/${numBadges + 1}`)
    .expect(200)
  t.true(res.body.badges[0].name === 'Test Badge')
  t.deepEqual(res.body.badges[0].operations, [['>', 'daysTotal', '100']])
})

test.serial('Updating a badge in the db', async (t) => {
  let res = await request(app)
    .get('/scoreboard/api/badges')
    .expect(200)
  const numBadges = res.body.badges.length
  await request(app)
    .put(`/scoreboard/api/badges/${numBadges}`)
    .send({
      name: 'Test Badge Edit',
      operations: [['>', 'daysTotal', '100'], ['>=', 'daysInRow', '200']]
    })
    .expect(200)
  res = await request(app)
    .get(`/scoreboard/api/badges/${numBadges}`)
    .expect(200)
  t.true(res.body.badges[0].name === 'Test Badge Edit')
  t.deepEqual(res.body.badges[0].operations,
    [['>', 'daysTotal', '100'], ['>=', 'daysInRow', '200']])
})

test.serial('Deleting a badge from the db', async (t) => {
  let res = await request(app)
    .get('/scoreboard/api/badges')
    .expect(200)
  const numBadges = res.body.badges.length
  await request(app)
    .delete(`/scoreboard/api/badges/${numBadges}`)
    .expect(200)
  res = await request(app)
    .get('/scoreboard/api/badges')
    .expect(200)
  t.true(res.body.badges.length === numBadges - 1)
})