import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import mongoose from 'mongoose';

describe('Book & Auth Controller (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  beforeAll(() => {
    mongoose.set("strictQuery", false);
    mongoose.connect(process.env.DB_URI, function () {
      mongoose.connection.db.dropDatabase()
    })
  })

  afterAll(() => mongoose.disconnect())

  const user = {
    name: 'Ghulam',
    email: 'ghulam@gmail.com',
    password: '12345678',
  };

  describe('Auth', () => {
    it('(POST) - Register a new user', () => {
      return request(app.getHttpServer())
        .post('/auth/signup')
        .send(user)
        .expect(201)
        .then((res) => {
          expect(res.body.token).toBeDefined();
        });
    });
  
    it('(GET) - Login user', () => {
      return request(app.getHttpServer())
        .get('/auth/login')
        .send({ email: user.email, password: user.password })
        .expect(200)
        .then((res) => {
          expect(res.body.token).toBeDefined();
        });
    });
  })
});
