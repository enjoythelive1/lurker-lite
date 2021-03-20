const express = require('express');
const morgan = require('morgan');
const asyncHandler = require('express-async-handler');
const subscribers = require('./repositories/subscribers');
const NotFoundError = require('./repositories/errors/not-found');
const ConflictError = require('./repositories/errors/conflict-error');

const restAPI = express();

restAPI.use(express.json({ strict: false }));
restAPI.use(morgan('dev'));

restAPI.get('/subscribers', asyncHandler(async (req, res) => {
  res.send(await subscribers.getAll());
}));

restAPI.post('/subscribers', asyncHandler(async (req, res) => {
  const { subreddits, email, active } = req.body;

  try {
    await subscribers.create(email, {
      email,
      active: active != null ? active : true,
      subreddits: subreddits || [],
    });
  } catch (e) {
    if (e instanceof ConflictError) {
      return res.status(409).send({ message: e.message });
    }
    throw e;
  }

  return res.status(201).end();
}));

restAPI.get('/subscribers/:email', asyncHandler(async (req, res) => {
  const subscriber = await subscribers.get(req.params.email);

  if (!subscriber) return res.status(404).send({ message: 'not found' });

  return res.send(subscriber);
}));

restAPI.put('/subscribers/:email', asyncHandler(async (req, res) => {
  const { email } = req.params;
  const { subreddits, active } = req.body;

  try {
    await subscribers.update(email, {
      email,
      active: active != null ? active : true,
      subreddits: subreddits || [],
    });
  } catch (e) {
    if (e instanceof NotFoundError) {
      return res.status(404).send({ message: e.message });
    }
    throw e;
  }

  return res.status(204).end();
}));

restAPI.delete('/subscribers/:email', asyncHandler(async (req, res) => {
  try {
    await subscribers.remove(req.params.email);
  } catch (e) {
    if (e instanceof NotFoundError) {
      return res.status(404).send({ message: e.message });
    }
  }

  return res.status(204).end();
}));

restAPI.post('/subscribers/:email/subreddits', asyncHandler(async (req, res) => {
  const { email } = req.params;

  const subscriber = await subscribers.get(email);

  if (!subscriber) return res.status(404).send({ message: 'not found' });

  await subscribers.update(email, {
    ...subscriber,
    subreddits: [
      ...subscriber.subreddits,
      req.body,
    ],
  });

  return res.status(201).end();
}));

restAPI.delete('/subscribers/:email/subreddits/:subreddit', asyncHandler(async (req, res) => {
  const { email, subreddit } = req.params;

  const subscriber = await subscribers.get(email);

  // eslint does not like optional chaining yet
  if (!subscriber || !subscriber.subreddits || !subscriber.subreddits.includes(subreddit)) {
    return res.status(404).send({ message: 'not found' });
  }

  await subscribers.update(email, {
    ...subscriber,
    subreddits: subscriber.subreddits.filter((currentSub) => currentSub !== subreddit),
  });

  return res.status(204).end();
}));

restAPI.put('/subscribers/:email/active', asyncHandler(async (req, res) => {
  const { email } = req.params;

  const subscriber = await subscribers.get(email);

  if (!subscriber) return res.status(404).send({ message: 'not found' });

  await subscribers.update(email, {
    ...subscriber,
    active: req.body,
  });

  return res.status(204).end();
}));

module.exports = restAPI;
