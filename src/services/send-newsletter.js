const fetch = require('node-fetch');
const sgMail = require('@sendgrid/mail');
const subscribersRepo = require('../repositories/subscribers');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const redditBasicAuthToken = Buffer.from(
  `${process.env.REDDIT_APP_ID}:${process.env.REDDIT_APP_SECRET}`,
).toString('base64');

async function getRedditToken() {
  const response = await fetch(
    'https://www.reddit.com/api/v1/access_token',
    {
      method: 'POST',
      body: 'grant_type=client_credentials',
      headers: {
        Authorization: `Basic ${redditBasicAuthToken}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    },
  );

  return response.json();
}

async function getTopPostsForSubreddit(subreddit, token) {
  const response = await fetch(
    `https://oauth.reddit.com/r/${subreddit}/top?t=day&limit=3`,
    {
      method: 'GET',
      headers: { Authorization: `${token.token_type} ${token.access_token}` },
    },
  );

  if (!response.ok) return null; // TODO: deal with this scenario

  return response.json();
}

function createHTMLMailForPosts(postPerSubreddit) {
  return `<pre><code>${JSON.stringify(postPerSubreddit, null, 2)}</code></pre>`;
}

async function sendSubscriberTo(subscriber, token) {
  const postPerSubreddit = (await Promise.all(
    subscriber.subreddits.map(
      async (subreddit) => [subreddit, await getTopPostsForSubreddit(subreddit, token)],
    ),
  ));

  await sgMail.send({
    to: subscriber.email,
    from: process.env.SENDGRID_SENDER,
    subject: `Lurker Lite newsletter for Reddit for ${new Date().toDateString()}`,
    html: createHTMLMailForPosts(postPerSubreddit),
  });
}

async function sendNewsletter() {
  const token = await getRedditToken();
  const subscribers = await subscribersRepo.getAll();
  const activeSubscribers = subscribers.filter((sub) => sub.active);

  for (const subscriber of activeSubscribers) {
    await sendSubscriberTo(subscriber, token);
  }
}

module.exports = sendNewsletter;
