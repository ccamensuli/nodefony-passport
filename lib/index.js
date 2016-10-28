/*
 * Module dependencies.
 */


/*
 *  Expose constructors.
 */
var nodefonyPassport = function(Factory){


	var passportNodefony = function(factory){

		this.factory = factory ; 
		this.failures =[];
		this.callback = null ;
		this.strategy = null ;

	}

	passportNodefony.prototype.initialize  = function(passport, options){
		return function initialize(context, next) {
			console.log(arguments)	
		}
	}

	passportNodefony.prototype.authenticate = function(passport, name, options, callback){
		if (typeof options == 'function') {
			callback = options;
			options = {};
		}
		this.options = options || {};

		var multi = true;
		this.callback = callback ;
		this.passport = passport ;

		if (!Array.isArray(name)) {
			name = [ name ];
			multi = false;
		}

		return  function authenticate ( context, next ){
			for( var i = 0 ; i<name.length; i++){
				try {
					this.setStrategy(name[i] , context, this.options, next )	
				}catch(e){
					if ( this.callback ){
						return this.callback(e, null) ;
					}
					return next(e, null) ;	
				}
			}

			if (this.callback) {
				if (!multi) {
					return this.callback(null, false, this.failures[0].challenge, this.failures[0].status);
				} else {
					var challenges = this.failures.map(function(f) { return f.challenge; });
					var statuses = this.failures.map(function(f) { return f.status; });
					return this.callback(null, false, challenges, statuses);
				}
			}


			if (this.options.failureFlash) {

			}
			if (this.options.failureMessage) {

			}
			if (this.options.failureRedirect) {
				this.redirect = this.options.failureRedirect ;
			}

			if (this.options.failWithError) {
			}


		}.bind(this)
	}

	passportNodefony.prototype.setStrategy = function(name, context, options, next){

		// Get the strategy, which will be used as prototype from which to create
      		// a new instance.  Action functions will then be bound to the strategy
      		// within the context of the HTTP request/response pair.
		var prototype = this.passport._strategy(name);
		if (!prototype) { 
			if ( this.callback){
				return this.callback(new Error('Unknown authentication strategy "' + name + '"'));	
			}
			return next(new Error('Unknown authentication strategy "' + name + '"'));
		}

		this.strategy = Object.create(prototype);


		/**
       		 * Authenticate `user`, with optional `info`.
       		 *
       		 * Strategies should call this function to successfully authenticate a
       		 * user.  `user` should be an object supplied by the application after it
       		 * has been given an opportunity to verify credentials.  `info` is an
       		 * optional argument containing additional user information.  This is
       		 * useful for third-party authentication strategies to pass profile
       		 * details.
       		 *
       		 * @param {Object} user
       		 * @param {Object} info
       		 * @api public
       		 */
		this.strategy.success = function(user, info) {
			if (this.callback) {
				return this.callback(null, user);
			}
			return next(null , user);
		}.bind(this);

		/**
       		 * Fail authentication, with optional `challenge` and `status`, defaulting
       		 * to 401.
       		 *
       		 * Strategies should call this function to fail an authentication attempt.
       		 *
       		 * @param {String} challenge
       		 * @param {Number} status
       		 * @api public
       		 */
		this.strategy.fail = function(challenge, status) {
			if (typeof challenge == 'number') {
				status = challenge;
				challenge = undefined;
			}
			if ( challenge) {
				context.response.headers["WWW-Authenticate"] =  challenge ;
				if ( this.callback ){
					return  this.callback({
						status:401,
						message:"Unauthorized"
					}, null);
				}
				return next({
					status:401,
				       message:"Unauthorized"
				}, null);
			}else{
				/*TODO*/
			}
		}.bind(this);

		/**
       		 * Redirect to `url` with optional `status`, defaulting to 302.
       		 *
       		 * Strategies should call this function to redirect the user (via their
       		 * user agent) to a third-party website for authentication.
       		 *
       		 * @param {String} url
       		 * @param {Number} status
       		 * @api public
       		 */
		this.strategy.redirect = function(url, status) {
			return context.redirect( url, status )	
		}.bind(this);


		/**
       		 * Pass without making a success or fail decision.
       		 *
       		 * Under most circumstances, Strategies should not need to call this
       		 * function.  It exists primarily to allow previous authentication state
       		 * to be restored, for example from an HTTP session.
       		 *
       		 * @api public
       		 */
		this.strategy.pass = function() {
			if ( this.callback ){
				return  this.callback();
			}
			return next();
		}.bind(this);


		/**
       		 * Internal error while performing authentication.
       		 *
       		 * Strategies should call this function when an internal error occurs
       		 * during the process of performing authentication; for example, if the
       		 * user directory is not available.
       		 *
       		 * @param {Error} err
       		 * @api public
       		 */
		this.strategy.error = function(err) {
			if (this.callback) {
				return this.callback(err);
			}
			return next(err, null);
		}.bind(this);

		this.factory.contextSecurity.logger("STRATEGY  AUTHENTICATE  passport-"+name ,"DEBUG");
		this.strategy.authenticate(context.request.request, this.options);
	} 

	return function(_factory){
		return {
			authenticate:function(passport, name, options, callback){
				var inst = new passportNodefony( _factory );
				return inst.authenticate(passport, name, options, callback)
			},
			initialize:function(){
				console.log( "initialize" )	
			},
			authorize:function(){
				console.log( "authorize" )
			}	
		}
	}(Factory)
};

exports = module.exports = nodefonyPassport ;


