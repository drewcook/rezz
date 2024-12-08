describe('Reservations', () => {
  let jwt: string;

  // Create a new user and authenticate before each test
  beforeAll(async () => {
    const user = {
      email: 'altheawebservices@gmail.com',
      password: 'ThisStrongPassword123!!!',
    };
    await fetch('http://auth:3001/users', {
      method: 'POST',
      body: JSON.stringify(user),
      headers: { 'Content-Type': 'application/json' },
    });
    const response = await fetch('http://auth:3001/auth/login', {
      method: 'POST',
      body: JSON.stringify(user),
      headers: { 'Content-Type': 'application/json' },
    });
    // Set the JWT to be used as the Authorization header for future requests
    jwt = await response.text();
  });

  test('Create and Get a new reservation', async () => {
    // Create the new reservation
    const createdReservation = await createReservation();
    // Verify that the reservation was created successfully
    const resGet = await fetch(
      `http://reservations:3000/reservations/${createdReservation._id}`,
      { headers: { Authentication: jwt } },
    );
    const reservation = await resGet.json();
    expect(reservation).toEqual(createdReservation);
  });

  const createReservation = async () => {
    // Send a new HTTP request to the reservations service to create a new reservation
    const resCreate = await fetch('http://reservations:3000/reservations', {
      method: 'POST',
      body: JSON.stringify({
        startDate: '2025-02-01',
        endDate: '2025-02-31',
        charge: {
          amount: 420,
          card: {
            cvc: '555',
            exp_month: 12,
            exp_year: 2028,
            number: '4242424242424242',
          },
        },
      }),
      headers: {
        'Content-Type': 'application/json',
        Authentication: jwt,
      },
    });
    expect(resCreate.ok).toBeTruthy();
    return await resCreate.json();
  };
});
