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
  expect(true).toBe(true)
})

describe('[POST] /api/auth/register', () => {
  test('responds with the new user', async () => {
    const res = await request(server)
      .post('/api/auth/register')
      .send({ username: 'hey', password: 'wefredgb' })
    expect(res.body).toMatchObject({ id: 3, username: 'hey' })
  }, 600)
  test('responds with a 422 on missing password', async () => {
    const res = await request(server)
      .post('/api/auth/register')
      .send({ username: 'heey' })
    expect(res.status).toBe(422)
  }, 600)
})

describe('[POST] /api/auth/login', () => {
  test('responds with the user info on successful login', async () => {
    const res = await request(server)
      .post('/api/auth/login')
      .send({ username: 'bob', password: '1234' })
    expect(res.body).toMatchObject({message: "welcome, bob!"})
  }, 600)
  test('responds with a 401 on bad credentials', async () => {
    const res = await request(server)
      .post('/api/auth/login')
      .send({ username: 'wefr', password: '1234' })
    expect(res.status).toBe(401)
  }, 600)
})

describe('[GET] /api/jokes', () => {
  test('restricts access to jokes if not logged in', async () => {
    const res = await request(server)
      .get('/api/jokes')
    expect(res.status).toBe(401)
  }, 600)
})