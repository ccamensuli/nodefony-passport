# nodefony-passport

##  **Passport Strategy connector to Nodefony Framework**

####-  **[Nodefony Documentation](https://nodefony.net/documentation)**  
####-  **[Nodefony Demo](https://nodefony.net)**  

####- [Passport](http://passportjs.org/)  authentication middleware for [Node.js](http://nodejs.org/).


By default, Passport exposes middleware that operate using Connect-style
middleware using a `fn(req, res, next)` signature.  Nodefony framework
have different expectations, and this connector allows Passport to be adapted
to operate within nodefony environment.


## EXAMPLE STRATEGY passport-local

####- [Passport](http://passportjs.org/) strategy for authenticating with [Local](https://github.com/jaredhanson/passport-local)

ROUTING NODEFONY with passport-local 
```yaml
local-Area: 
  pattern:  /local
  defaults: {controller: "frameworkBundle:default:401"}

```

FIREWALL NODEFONY with passport-local
```yaml
local_area:
  pattern:                    ^/local
  provider:                   nodefony
  form_login:
    login_path:               /login/passport-local
    default_target_path:      /
  passport-local:
    usernameField: 'email'
    passwordField: 'passwd'
  context:                    ~
  redirectHttps:              true
```

## EXAMPLE STRATEGY passport-google-oauth 

####- [Passport](http://passportjs.org/) strategy for authenticating with [Google Api](https://github.com/jaredhanson/passport-google-oauth)

ROUTING NODEFONY with passport-google-oauth 
```yaml

google-Area: 
  pattern:  /auth/google
  defaults: {controller: "frameworkBundle:default:401"}

googleCallBack-Area: 
  pattern:  /auth/google/callback
  defaults: {controller: "frameworkBundle:default:401"}

```

FIREWALL NODEFONY with passport-google-oauth 

```yaml
github_area:
  pattern:                    ^/auth/google
  provider:                   nodefony
  form_login:
    default_target_path:      /
    check_path:               /auth/google
  passport-google-oauth20:
    clientID:                 'GOOGLE_CLIENT_ID'
    clientSecret:             "GOOGLE_CLIENT_SECRET" 
    callbackURL:              "https://domain.com/auth/google/callback" 
    scopes:                   [ 'profile','email' ]
  context:                    google
  crossDomain: 
    allow-origin:	      {"google":"accounts.google.com"}
      Access-Control:         {
        "access-control-allow-methods":"GET",
      }
```

## EXAMPLE STRATEGY Passport-GitHub2 

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
    default_target_path:      /
    check_path:               /auth/github
  passport-github2:
    clientID:                 'GITHUB_CLIENT_ID'
    clientSecret:             "GITHUB_CLIENT_SECRET" 
    callbackURL:              "https://domain.com/auth/github/callback" 
    scopes:                   [ 'user:email' ]
  context:                    github
  crossDomain: 
    allow-origin:	      {"github":"github.com"}
      Access-Control:         {
        "access-control-allow-methods":"GET",
      }
```

