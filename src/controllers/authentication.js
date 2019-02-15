var guid = require('guid');
var config = require('../config');
var qs = require('querystring');
var request = require('request');
const Mustache  = require('mustache');
const fs = require('fs');
var csrf_guid;

function loadLogin() {
    return fs.readFileSync('src/controllers/dist/logint.html').toString();
  }

module.exports = {
    
    showDataAccountKit: async (req, res, next) => {
        
        csrf_guid = guid.raw();
        var view = { 
            appId: config.APP_ID, 
            csrf: csrf_guid, 
            version: config.ACCOUNT_KIT_API_VERSION
        };

        //var html = Mustache.to_html(loadLogin(), view);
        res.status(200).send(view);
        
    },

    sendCode : (req, res) => {
        //console.log(req);
        console.log(req.body.csrf);
        console.log(csrf_guid);
        const me_endpoint_base_url = 'https://graph.accountkit.com/' + config.ACCOUNT_KIT_API_VERSION + '/me';
        const token_exchange_base_url = 'https://graph.accountkit.com/' + config.ACCOUNT_KIT_API_VERSION + '/access_token';

        // CSRF check
        
        
        if (req.body.csrf === csrf_guid) {
            
            var app_access_token = ['AA', config.APP_ID, config.APP_SECRET].join('|');
            var params = {
            grant_type: 'authorization_code',
            code: req.body.code,
            access_token: app_access_token
            };

            // exchange tokens
            var token_exchange_url = token_exchange_base_url + '?' + qs.stringify(params);
            request.get({ url: token_exchange_url, json: true }, function (err, resp, respBody) {
            console.log(respBody);
            var data = {
                user_access_token: respBody.access_token,
                expires_at: respBody.expires_at,
                user_id: respBody.id,
            };

            // get account details at /me endpoint
            var me_endpoint_url = me_endpoint_base_url + '?access_token=' + respBody.access_token;
            request.get({ url: me_endpoint_url, json: true }, function (err, resp, respBody) {
                // send login_success.html
                if (respBody.phone) {
                console.log(respBody.phone);
                data.phone_num = respBody.phone.number;
                } else if (respBody.email) {
                data.email_addr = respBody.email.address;
                }
                res.status(200).send(data);
            });
            });
        }
        else {
            // login failed
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end("Something went wrong. :( ");
        }
    }


};
