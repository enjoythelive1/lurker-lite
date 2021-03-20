# LurkerLite
A reddit lurker newsletter API. It is design to send the subscribers a
newsletter with the most voted post in the last 24 hours from their favorite subreddits. 

## API documentation
* `GET /subscribers`: Lists all subscribers.
* `POST /subscribers`: Adds a new Subscriber.
* `GET /subscribers/:email`: Gets specific subscriber.
* `PUT /subscribers/:email`: Updates subscriber.
* `DELETE /subscribers/:email`: Deletes the subscriber.
* `POST /subscribers/:email/subreddits`: Adds a new favorite subreddit to the user.
* `DELETE /subscribers/:email/subreddits/:subreddit`: Deletes a subreddit from the user.
* `PUT /subscribers/:email/active`: Activates or deactivates the newsletter.
