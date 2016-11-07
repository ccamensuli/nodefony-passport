# nodefony-passport


##  **Passport Strategy connector to nodefony Framework**

####-  **[Nodefony Documentation](https://nodefony.net/documentation)**  
####-  **[Nodefony Demo](https://nodefony.net)**  

####- [Passport](http://passportjs.org/)  authentication middleware for [Node.js](http://nodejs.org/).


By default, Passport exposes middleware that operate using Connect-style
middleware using a `fn(req, res, next)` signature.  Nodefony framework
have different expectations, and this connector allows Passport to be adapted
to operate within nodefony environment.










### EXAMPLE STRATEGY Passport-GitHub2 

####- [Passport](http://passportjs.org/) strategy for authenticating with [GitHub](https://github.com/cfsghost/passport-github)

ROUTING NODEFONY with Passport-GitHub2 
```yaml

github-Area: 
  pattern:  /auth/github
  defaults: {controller: "frameworkBundle:default:401"}

githubCallBack-Area: 
  pattern:  /auth/github/callback
  defaults: {controller: "frameworkBundle:default:401"}

```

FIREWALL NODEFONY with Passport-GitHub2 

```yaml
github_area:
  pattern:                    ^/auth/github
  provider:                   nodefony
  form_login:
    login_path:               /
    default_target_path:      /
  passport-github2:
    clientID:                 'GITHUB_CLIENT_ID'
    clientSecret:             "GITHUB_CLIENT_SECRET" 
    callbackURL:              "https://domain.com/auth/github/callback" 
    scopes:                   [ 'user:email' ]
  context:                    github
  redirectHttps:              true
  crossDomain: 
    allow-origin:	      {"github":"github.com"}
      Access-Control:         {
        "access-control-allow-methods":"GET",
      }
```
