// Disposable implementation of requirements.md. No production credentials or database.
import http from 'node:http';

const orders = new Map();

function send(response, status, body) {
  response.writeHead(status, { 'content-type': 'application/json' });
  response.end(body === undefined ? undefined : JSON.stringify(body));
}

const server = http.createServer(async (request, response) => {
  const path = new URL(request.url, 'http://localhost').pathname;
  if (path === '/health') return send(response, 200, { status: 'ok' });

  const owner = { 'Bearer alice': 'alice', 'Bearer bob': 'bob' }[request.headers.authorization];
  if (!owner) return send(response, 401, { error: 'unauthorized' });

  if (path === '/orders' && request.method === 'GET') {
    return send(response, 200, {
      orders: [...orders.values()].filter((order) => order.owner === owner),
    });
  }

  if (path === '/orders' && request.method === 'POST') {
    let input;
    try {
      let raw = '';
      for await (const chunk of request) raw += chunk;
      input = JSON.parse(raw);
    } catch {
      return send(response, 400, { error: 'invalid JSON' });
    }
    const valid =
      input &&
      typeof input.id === 'string' &&
      input.id.length > 0 &&
      Number.isInteger(input.quantity) &&
      input.quantity >= 1 &&
      input.quantity <= 10 &&
      Number.isInteger(input.unitPriceCents) &&
      input.unitPriceCents >= 1 &&
      input.unitPriceCents <= 10000;
    if (!valid) return send(response, 422, { error: 'invalid input' });
    if (orders.has(input.id)) return send(response, 409, { error: 'duplicate' });

    const order = {
      id: input.id,
      quantity: input.quantity,
      unitPriceCents: input.unitPriceCents,
      totalCents: input.quantity * input.unitPriceCents,
      owner,
      revision: 'lab-v1',
    };
    orders.set(order.id, order);
    return send(response, 201, order);
  }

  if (path.startsWith('/orders/')) {
    const id = decodeURIComponent(path.slice('/orders/'.length));
    const order = orders.get(id);
    if (!order || order.owner !== owner) return send(response, 404, { error: 'not found' });
    if (request.method === 'GET') return send(response, 200, order);
    if (request.method === 'DELETE') {
      orders.delete(id);
      return send(response, 204);
    }
  }
  send(response, 404, { error: 'not found' });
});

server.listen(Number(process.env.PORT || 33177), '127.0.0.1');
process.on('SIGTERM', () => server.close(() => process.exit(0)));
