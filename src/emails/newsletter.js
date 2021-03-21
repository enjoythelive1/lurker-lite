const { abbreviateNumber } = require('js-abbreviation-number');

function hasImage(data) {
  return !!(data.preview && data.preview.images[0]);
}

function getImage(data) {
  return data.preview.images[0].source.url;
}

const styles = {
  body: `
    text-align: center;
    padding: 1em;
  `,
  section: `
    width: 100%;
    max-width: 700px;
    text-align: start;
    margin: 0 auto;
  `,
  article: 'margin-bottom: 3em',
  thumbnail: `
    text-align: center;
    display: block;
  `,
  thumbnailImg: `
    max-height: 300px;
    position: relative;
  `,
  title: 'margin: 1em 0;',
  titleNScore: `
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
  `,
  score: 'margin-right: 1em;',
  titleH3: 'margin: 0;',
};

function createNewsletterMail(subscriber, postPerSubreddit) {
  return `
    <div style="${styles.body}">
      <h1>Lurker Lite newsletter for Reddit for ${new Date().toDateString()}</h1>
      <p>
        Hi ${subscriber.name || subscriber.email},
        here I give you the top 3 post of your favorite subreddits, you lurker.
      </p>
      ${postPerSubreddit.map(([subreddit, listing]) => `
        <section style="${styles.section}">
          <h2><a href="https://www.reddit.com/r/${subreddit}/top">r/${subreddit}</a></h2>
          ${listing.data.children.map(({ data }) => `
            <article style="${styles.article}">
              ${!hasImage(data) ? '' : `
                <a href="https://www.reddit.com${data.permalink}" style="${styles.thumbnail}">
                  <img src="${getImage(data)}" alt="${data.title}" style="${styles.thumbnailImg}" />
                </a>
              `}
              <div style="${styles.title}">
                <div style="${styles.titleNScore}">
                  <span style="${styles.score}">${abbreviateNumber(data.score, 2, { padding: false })}</span>
                  <h3 style="${styles.titleH3}"><a href="https://www.reddit.com${data.permalink}">${data.title}</a></h3>
                </div>
                <small>
                  posted by
                  <a href="https://www.reddit.com/u/${data.author}">u/${data.author}</a>
                </small>
              </div>
            </article>
          `).join('\n')}
        </section>
      `).join('\n')}
    </div>
  `;
}

module.exports = createNewsletterMail;
