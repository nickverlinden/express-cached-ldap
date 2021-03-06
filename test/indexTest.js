var index = require("../lib/index");
var sinon = require("sinon");
var ldap = require("../lib/ldap");
require("should");


describe("Index", function(){
    
    var config = {
        ldapUrl: 'ldap://test.domain.com',
        baseDN: 'dc=domain,dc=com',
        ldapUsername: 'test',
        ldapPassword: 'test'
    };
    
    describe("Validate configuration", function(){
        it("if configuration not provided, throw exception", function(){
            index.should.throw("Configuration not provided");
        });
        
        it("if ldap url not provided, throw exception", function() {
            (function(){
                index({});
            }).should.throw("ldapUrl parameter not provided");
        });
        
        it("if baseDN not provided, throw exception", function() {
            (function(){
                index({
                    ldapUrl: 'ldap://test.domain.com'
                });
            }).should.throw("baseDN parameter not provided");
        });
        
        it("if ldapUsername not provided, throw exception", function() {
            (function(){
                index({
                    ldapUrl: 'ldap://test.domain.com',
                    baseDN: 'dc=domain,dc=com'
                });
            }).should.throw("ldapUsername parameter not provided");
        });
        
        it("if ldapPassword not provided, throw exception", function() {
            (function(){
                index({
                    ldapUrl: 'ldap://test.domain.com',
                    baseDN: 'dc=domain,dc=com',
                    ldapUsername: 'test'
                });
            }).should.throw("ldapPassword parameter not provided");
        });
        
        it("if ttl not provided, chose the default value", function(){
            var cache = require("../lib/cache");
            var spy = sinon.spy(cache, "initialize");
            index(config);
            spy.calledWith(1800).should.be.true();
            spy.restore();
        });
        
        it("if ttl provided, assign it", function(){
            var ttlConfig = {
                    ldapUrl: 'ldap://test.domain.com',
                    baseDN: 'dc=domain,dc=com',
                    ldapUsername: 'test',
                    ldapPassword: 'test',
                    ttl: 600
                };
            var cache = require("../lib/cache");
            var spy = sinon.spy(cache, "initialize");
            index(ttlConfig);
            spy.calledWith(600).should.be.true();
            spy.restore();
        });
        
        it("if cacheCheckPeriod not provided, chose the default value", function(){
            var cache = require("../lib/cache");
            var spy = sinon.spy(cache, "initialize");
            index(config);
            spy.calledWith(1800, 600).should.be.true();
            spy.restore();
        });
        
        it("if cacheCheckPeriod provided, assign it", function(){
            var checkPeriodConfig = {
                    ldapUrl: 'ldap://test.domain.com',
                    baseDN: 'dc=domain,dc=com',
                    ldapUsername: 'test',
                    ldapPassword: 'test',
                    cacheCheckPeriod: 1800
                };
            var cache = require("../lib/cache");
            var spy = sinon.spy(cache, "initialize");
            index(checkPeriodConfig);
            spy.calledWith(1800, 1800).should.be.true();
            spy.restore();
        });
   }); 
   
   describe("Validate request", function() {
       
       it("if connection is undefined, throw exception", function(){
       
           var middleware = index(config);
            
            (function(){
                middleware({});    
            }).should.throw("The request does not contain NTLM info. Please install express-ntlm first and include it as express middleware");
       });
       
       it("if ntlm is undefined, throw exception", function(){
       
           var middleware = index(config);
            
            (function(){
                middleware({connection:{}});    
            }).should.throw("The request does not contain NTLM info. Please install express-ntlm first and include it as express middleware");
       });
   });
});