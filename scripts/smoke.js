// Smoke test: 1 user, 30s. "Does it work at all?"
import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE = __ENV.BASE_URL || 'https://quickpizza.grafana.com';

export const options = {
  vus: 1,
  duration: '30s',
  thresholds: {
    http_req_failed: ['rate<0.01'],    // <1% errors
    http_req_duration: ['p(95)<1000'], // 95% of requests under 1s
  },
};

export default function () {
  const home = http.get(`${BASE}/`);
  check(home, { 'home is 200': (r) => r.status === 200 });

  const pizza = http.post(
    `${BASE}/api/pizza`,
    JSON.stringify({ maxCaloriesPerSlice: 1000, mustBeVegetarian: false }),
    { headers: { 'Content-Type': 'application/json', Authorization: 'token abcdef0123456789' } },
  );
  check(pizza, {
    'pizza is 200': (r) => r.status === 200,
    'pizza has a name': (r) => !!r.json('pizza.name'),
  });

  sleep(1);
}
