# messenger-bot

After deploying the webserver, add a page(on Facebook) and post its token with curl 

curl -X POST "https://graph.facebook.com/v2.6/me/subscribed_apps?access_token=<PAGE_ACCESS_TOKEN>"
 
In the index file the Page_Access_Token is calling an enviromental variable (for local development) or a config var (if using Heroku). The value associated to this variable is the Page Access Token retrieved on facebook.
