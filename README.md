# k6 Load Tests

![k6](https://github.com/rajjahlawat-noob/k6-load-tests/actions/workflows/k6.yml/badge.svg)

Performance tests for the [QuickPizza demo app](https://quickpizza.grafana.com) (Grafana's public test target) using **[k6](https://k6.io)**.

| Script | Purpose | Load |
|---|---|---|
| `scripts/smoke.js` | Sanity check that the system works | 1 user, 30s |
| `scripts/load.js` | Normal expected traffic | ramp to 10 users, ~2 min |

**Thresholds** (test fails if broken): error rate < 1–2%, p95 latency per endpoint, check pass rate > 98%.
Smoke test runs in CI on every push.

## Run locally
```bash
# install: https://grafana.com/docs/k6/latest/set-up/install-k6/
k6 run scripts/smoke.js
k6 run scripts/load.js
k6 run -e BASE_URL=https://your-app scripts/smoke.js   # point at another env
```

> Only load-test systems you own or have permission to test.
