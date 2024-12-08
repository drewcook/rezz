import { ping } from 'tcp-ping';

describe('Health Checks', () => {
  test('Reservations', async () => {
    const res = await fetch('http://reservations:3000');
    expect(res.ok).toBeTruthy();
  });

  test('Auth', async () => {
    const res = await fetch('http://auth:3001');
    expect(res.ok).toBeTruthy();
  });

  test('Payments', (done) => {
    ping({ address: 'payments', port: 3003 }, (err) => {
      if (err) fail();
      done();
    });
  });

  test('Notifications', (done) => {
    ping({ address: 'notifications', port: 3004 }, (err) => {
      if (err) fail();
      done();
    });
  });
});
