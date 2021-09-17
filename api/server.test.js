const request = require('supertest')
const server = require('./server')
const db = require('../data/dbConfig')

beforeAll(async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
})

beforeEach(async () => {
  await db.seed.run()
})

afterAll(async () => {
  await db.destroy()
})

test('sanity', () => {
  expect(true).toBe(false)
})

describe('[POST] /api/auth/register', () => {
  test('responds with the new user', async () => {
    const res = await request(server)
      .post('/api/auth/register')
      .send({ username: 'hey', password: 'wefredgb' })
    expect(res.body).toMatchObject({ id: 1, username: 'hey' })
  }, 600)
  test('responds with a 422 on missing username', async () => {
    const res = await request(server)
      .post('/api/auth/register')
      .send({ usrname: 'heey' })
    expect(res.status).toBe(422)
  }, 600)
})