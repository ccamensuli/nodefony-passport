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


		var prototype = this.passport._strategy(name);
		if (!prototype) { 
			if ( this.callback){
				return this.callback(new Error('Unknown authentication strategy "' + name + '"'));	
			}
			return next(new Error('Unknown authentication strategy "' + name + '"'));
		}

		this.strategy = Object.create(prototype);


		this.strategy.success = function(user, info) {
			if (this.callback) {
				return this.callback(null, user);
			}
			return next(null , user);
		}.bind(this);


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


		this.strategy.redirect = function(url, status) {
			return context.redirect( url, status )	
		}.bind(this);


		this.strategy.pass = function() {
			if ( this.callback ){
				return  this.callback();
			}
			return next();
		}.bind(this);


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


exports nodefonyPassport = nodefonyPassport ;


