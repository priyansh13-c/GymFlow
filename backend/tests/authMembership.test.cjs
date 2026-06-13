const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

jest.setTimeout(30000);

let app;
let mongod = null;

const gymOwnerData = {
  name: 'Owner One',
  username: 'owner1',
  email: 'owner1@example.com',
  password: 'Password123!',
  role: 'gym_owner',
};

const memberData = {
  name: 'Member One',
  username: 'member1',
  email: 'member1@example.com',
  password: 'Password123!',
  role: 'gym_member',
};

const registerUser = (data) => request(app).post('/api/auth/register').send(data);
const loginUser = (credentials) => request(app).post('/api/auth/login').send(credentials);

async function createGym(ownerId, gymCode) {
  const { default: Gym } = await import('../src/models/Gym.js');
  return Gym.create({
    owner: ownerId,
    gymName: 'Test Gym',
    description: 'A test gym for workflows',
    address: '123 Fitness St',
    city: 'Testville',
    monthlyFee: 50,
    annualFee: 540,
    facilities: ['weights', 'cardio'],
    openingTime: '06:00',
    closingTime: '22:00',
    gymCode: gymCode.toUpperCase(),
  });
}

async function setupApp() {
  if (app) return;

  process.env.NODE_ENV = 'test';
  process.env.JWT_SECRET = 'test_jwt_secret';
  process.env.REFRESH_TOKEN_SECRET = 'test_refresh_secret';
  process.env.JWT_EXPIRY = '1h';
  process.env.REFRESH_TOKEN_EXPIRY = '7d';

  if (!process.env.MONGODB_URI) {
    mongod = await MongoMemoryServer.create();
    process.env.MONGODB_URI = mongod.getUri();
  }

  const imported = await import('../server.js');
  app = imported.default;
}

afterAll(async () => {
  if (mongoose.connection.readyState === 1) {
    await mongoose.disconnect();
  }
  if (mongod) {
    await mongod.stop();
  }
});

beforeEach(async () => {
  await setupApp();
  if (mongoose.connection.readyState === 1) {
    await mongoose.connection.db.dropDatabase();
  }
});

describe('Authentication workflows', () => {
  test('registers a new member, logs in, refreshes token, and fetches profile', async () => {
    const registerRes = await registerUser(memberData);
    expect(registerRes.status).toBe(201);
    expect(registerRes.body.user).toMatchObject({
      name: memberData.name,
      username: memberData.username,
      email: memberData.email,
      role: 'gym_member',
    });

    const loginRes = await loginUser({ email: memberData.email, password: memberData.password });
    expect(loginRes.status).toBe(200);
    expect(loginRes.body).toMatchObject({
      accessToken: expect.any(String),
      refreshToken: expect.any(String),
    });
    expect(loginRes.body.user).toMatchObject({
      email: memberData.email,
      role: 'gym_member',
    });

    const refreshRes = await request(app)
      .post('/api/auth/refresh-token')
      .send({ refreshToken: loginRes.body.refreshToken });
    expect(refreshRes.status).toBe(200);
    expect(refreshRes.body.accessToken).toBeTruthy();

    const profileRes = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${loginRes.body.accessToken}`);
    expect(profileRes.status).toBe(200);
    expect(profileRes.body.user).toMatchObject({
      email: memberData.email,
      username: memberData.username,
      role: 'gym_member',
    });
  });

  test('fails login with incorrect password', async () => {
    await registerUser(memberData);
    const loginRes = await loginUser({ email: memberData.email, password: 'WrongPassword' });
    expect(loginRes.status).toBe(401);
    expect(loginRes.body.message).toBe('Invalid credentials');
  });
});

describe('Membership workflows', () => {
  test('gym member joins a gym with a valid code and views active membership', async () => {
    await setupApp();
    const { default: User } = await import('../src/models/User.js');
    const owner = await User.create(gymOwnerData);
    const gym = await createGym(owner._id, 'TEST01');

    await registerUser(memberData);
    const loginRes = await loginUser({ email: memberData.email, password: memberData.password });
    const accessToken = loginRes.body.accessToken;

    const joinRes = await request(app)
      .post('/api/members/join-gym')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ gymCode: gym.gymCode, membershipType: 'monthly' });

    expect(joinRes.status).toBe(201);
    expect(joinRes.body.message).toBe('Successfully joined gym');
    expect(joinRes.body.membership).toMatchObject({
      membershipType: 'monthly',
      isPaid: false,
      isActive: true,
    });
    expect(joinRes.body.membership.gym).toMatchObject({
      gymName: gym.gymName,
      gymCode: gym.gymCode,
    });

    const membershipRes = await request(app)
      .get('/api/members/membership')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(membershipRes.status).toBe(200);
    expect(membershipRes.body.membership).toMatchObject({
      membershipType: 'monthly',
      isActive: true,
      gym: expect.objectContaining({ gymName: gym.gymName }),
      user: expect.objectContaining({ email: memberData.email }),
    });
    expect(typeof membershipRes.body.membership.daysRemaining).toBe('number');
  });

  test('prevents gym member from joining with an invalid gym code', async () => {
    await registerUser(memberData);
    const loginRes = await loginUser({ email: memberData.email, password: memberData.password });

    const joinRes = await request(app)
      .post('/api/members/join-gym')
      .set('Authorization', `Bearer ${loginRes.body.accessToken}`)
      .send({ gymCode: 'BADCODE' });

    expect(joinRes.status).toBe(404);
    expect(joinRes.body.message).toBe('Invalid gym code');
  });

  test('does not allow gym member to call owner-only member routes', async () => {
    await registerUser(memberData);
    const loginRes = await loginUser({ email: memberData.email, password: memberData.password });

    const response = await request(app)
      .get('/api/members/000000000000000000000000/all')
      .set('Authorization', `Bearer ${loginRes.body.accessToken}`);

    expect(response.status).toBe(403);
    expect(response.body.message).toBe('Not authorized for this action');
  });
});
