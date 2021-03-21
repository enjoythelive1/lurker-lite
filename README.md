# LurkerLite
A reddit lurker newsletter API. It is design to send the subscribers a newsletter with the most voted post in the last
24 hours from their favorite subreddits.

The newsletter is sent every day, around 8am (depending on the server time). 

## How to run
First, some environment variables have to be configured to run properly:

* `REDDIT_APP_ID` and `REDDIT_APP_SECRET`: It is the app id of a registered [Reddit] app. 
  To generate one visit: https://www.reddit.com/prefs/apps

* `SENDGRID_API_KEY`: API key from [SendGrid], used to send the newsletter. 

* `SENDGRID_SENDER`: Email to be used as "sender" of the newsletter. It has to have been verified by [SendGrid].

After that, you just need to run `npm start`!

## API documentation
This script includes a JSON api to manipulate the subscribers to the newsletter. These are the supported endpoints:

* `GET /subscribers`: Lists all subscribers.
* `POST /subscribers`: Adds a new Subscriber.
* `GET /subscribers/:email`: Gets a specific subscriber.
* `PUT /subscribers/:email`: Updates subscriber.
* `DELETE /subscribers/:email`: Deletes the subscriber.
* `POST /subscribers/:email/subreddits`: Adds a new favorite subreddit to the user.
* `DELETE /subscribers/:email/subreddits/:subreddit`: Deletes a subreddit from the user.
* `PUT /subscribers/:email/active`: Activates or deactivates the newsletter.

### Subscriber resource

The subscriber resource is the base of this script. It has the following fields:

* `email`: It is used as the id of the subscriber.
* `name`: It is included in the mail to make the newsletter a bit more personal. Otherwise, the `mail` is used.
* `active`: It dictates if a subscriber is to be sent the newsletter daily or not. It is set `true` by default.
* `subreddits`: It is a list of the subscriber subreddits from where the newsletter is going to be build.

## Data storage
This script does not use a database. It uses the filesystem to store the data. A file per subscriber.

[Reddit]: https://www.reddit.com/
[SendGrid]: https://sendgrid.com/
