import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { Trend, Rate } from 'k6/metrics';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:8080';

const loginDuration   = new Trend('login_duration');
const coursesDuration = new Trend('courses_list_duration');
const enrollDuration  = new Trend('enroll_duration');
const errorRate       = new Rate('error_rate');

export const options = {
  stages: [
    { duration: '30s', target: 10  },
    { duration: '1m',  target: 50  },
    { duration: '30s', target: 100 },
    { duration: '30s', target: 0   },
  ],
  thresholds: {
    http_req_duration:     ['p(95)<500'],
    http_req_failed:       ['rate<0.01'],
    login_duration:        ['p(95)<300'],
    courses_list_duration: ['p(95)<400'],
    error_rate:            ['rate<0.05'],
  },
};

const JSON_HEADERS = { 'Content-Type': 'application/json' };

function authHeaders(token) {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
}

function uniqueEmail() {
  return `loadtest_vu${__VU}_iter${__ITER}@test.com`;
}

export default function () {
  group('Auth', () => {
    const email    = uniqueEmail();
    const password = 'Test@12345';

    const registerRes = http.post(
      `${BASE_URL}/auth/register`,
      JSON.stringify({ name: 'Load Tester', email, password, role: 'LEARNER' }),
      { headers: JSON_HEADERS }
    );
    const registerOk = check(registerRes, {
      '[Register] status 200':      (r) => r.status === 200,
      '[Register] success message': (r) => r.body.includes('successfully'),
    });
    errorRate.add(!registerOk);
    sleep(0.3);

    const loginRes = http.post(
      `${BASE_URL}/auth/login`,
      JSON.stringify({ email, password }),
      { headers: JSON_HEADERS }
    );
    loginDuration.add(loginRes.timings.duration);
    const loginOk = check(loginRes, {
      '[Login] status 200':  (r) => r.status === 200,
      '[Login] has token':   (r) => r.json('token') !== null && r.json('token') !== undefined,
      '[Login] has message': (r) => r.json('message') === 'Login successful',
    });
    errorRate.add(!loginOk);

    if (!loginOk) return;
    const token = loginRes.json('token');
    sleep(0.3);

    group('User', () => {
      const meRes = http.get(`${BASE_URL}/users/me`, { headers: authHeaders(token) });
      check(meRes, {
        '[GET /users/me] status 200': (r) => r.status === 200,
        '[GET /users/me] has email':  (r) => r.json('email') === email,
      });
      sleep(0.3);
    });

    group('Courses', () => {
      const allCoursesRes = http.get(`${BASE_URL}/courses`, { headers: authHeaders(token) });
      coursesDuration.add(allCoursesRes.timings.duration);
      check(allCoursesRes, {
        '[GET /courses] status 200':    (r) => r.status === 200,
        '[GET /courses] returns array': (r) => Array.isArray(r.json()),
      });
      sleep(0.3);

      const searchRes = http.get(`${BASE_URL}/courses?search=java&sort=price`, {
        headers: authHeaders(token),
      });
      check(searchRes, {
        '[GET /courses?search] status 200': (r) => r.status === 200,
      });
      sleep(0.3);

      const courseByIdRes = http.get(`${BASE_URL}/courses/1`, { headers: authHeaders(token) });
      check(courseByIdRes, {
        '[GET /courses/1] status 200 or 404': (r) => r.status === 200 || r.status === 404,
      });

      const materialsRes = http.get(`${BASE_URL}/courses/1/materials`, {
        headers: authHeaders(token),
      });
      check(materialsRes, {
        '[GET /courses/1/materials] status 200 or 403': (r) =>
          r.status === 200 || r.status === 403 || r.status === 404,
      });
      sleep(0.3);
    });

    group('Enrollments', () => {
      const enrollRes = http.post(
        `${BASE_URL}/enrollments/courses/1`,
        null,
        { headers: authHeaders(token) }
      );
      enrollDuration.add(enrollRes.timings.duration);
      check(enrollRes, {
        '[POST /enrollments/courses/1] status 201 or 400 or 404': (r) =>
          r.status === 201 || r.status === 400 || r.status === 404,
      });
      sleep(0.3);

      const myCoursesRes = http.get(`${BASE_URL}/enrollments/my-courses`, {
        headers: authHeaders(token),
      });
      check(myCoursesRes, {
        '[GET /enrollments/my-courses] status 200': (r) => r.status === 200,
        '[GET /enrollments/my-courses] is array':   (r) => Array.isArray(r.json()),
      });

      const enrollments = myCoursesRes.json();
      if (Array.isArray(enrollments) && enrollments.length > 0) {
        const enrollmentId = enrollments[0].id;

        const progressRes = http.put(
          `${BASE_URL}/enrollments/${enrollmentId}/progress?progress=50`,
          null,
          { headers: authHeaders(token) }
        );
        check(progressRes, {
          '[PUT /enrollments/{id}/progress] status 200': (r) => r.status === 200,
        });
        sleep(0.2);

        const ratingRes = http.put(
          `${BASE_URL}/enrollments/${enrollmentId}/rate?rating=4`,
          null,
          { headers: authHeaders(token) }
        );
        check(ratingRes, {
          '[PUT /enrollments/{id}/rate] status 200': (r) => r.status === 200,
        });
      }

      sleep(0.3);
    });
  });

  sleep(1);
}
