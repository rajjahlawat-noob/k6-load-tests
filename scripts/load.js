// Load test: ramp to 10 users, hold, ramp down. "Does it hold up under normal traffic?"
import http from 'k6/http';
import { check, sleep, group } from 'k6';

const BASE = __ENV.BASE_URL || 'https://quickpizza.grafana.com';

export const options = {
  stages: [
    { duration: '30s', target: 10 }, // ramp up
    { duration: '1m', target: 10 },  // steady
    { duration: '20s', target: 0 },  // ramp down
  ],
  thresholds: {
    http_req_failed: ['rate<0.02'],
    'http_req_duration{group:::homepage}': ['p(95)<800'],
    'http_req_duration{group:::get pizza}': ['p(95)<1500'],
    checks: ['rate>0.98'],
  },
};

export default function () {
  group('homepage', () => {
    const r = http.get(`${BASE}/`);
    check(r, { 'status 200': (res) => res.status === 200 });
  });

  group('get pizza', () => {
    const r = http.post(
      `${BASE}/api/pizza`,
      JSON.stringify({ maxCaloriesPerSlice: 1000, mustBeVegetarian: Math.random() < 0.5 }),
      { headers: { 'Content-Type': 'application/json', Authorization: 'token abcdef0123456789' } },
    );
    check(r, { 'status 200': (res) => res.status === 200 });
  });

  sleep(Math.random() * 2 + 1); // think time 1-3s
}
