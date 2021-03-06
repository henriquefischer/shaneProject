/*jslint node: true, sloppy: true, bitwise: true, vars: true, eqeq: true, plusplus: true, nomen: true, es5:true */
/* Pervasive Nation */
/* 23rd June 2016 */





var args = process.argv;

var debug = false;
var action = null;

if (args.length == 3 && args[2] == "stop") {
    action = "stop";
} else if (args.length < 4) {
    console.log("invalid arguments, usage: ");
    console.log("  - Starting push mode: node server.js port host");
    console.log("  - Starting push mode with debug log: node server.js port host debug_log");
    console.log("  - Stopping push mode: node server.js stop");
    process.exit();
} else {
    action = "start";
}


if (args[4] && args[4] == "debug_log") {
    debug = true;
}


/* 

   PACKAGES DECLARATION 
   
   To install packages, run npm install, e.g.
     npm install http
     npm install express
     npm install basic-auth
     npm install url

*/

var http = require('http');
var express = require('express');
var basicAuth = require('basic-auth');
var rest = require('./doRest.js');
var u = require('url');


var log = function (o) {
    if (debug) {
        console.log(o);
    }
};

// allow to do HTTPS to self signed servers.
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";





/* Credentials to DASS server */
/* Enter credentials for pn.orbiwse.com here*/

var dass_user = "sitespy";
var dass_password = "pentagon123    ";

var dassConfig = {
    "protocol": "https",
    "host": "pn.orbiwise.com",
    "host_user": dass_user,
    "host_password": dass_password,
    "port": 443
};



/*
   PUSH REGISTER / UNREGISTER functions
*/

if (action == "stop") {
    /* Stop Push function */
    var stopPush = function () {
        rest.doRest("PUT", "/rest/pushmode/stop", null, function (status, m) {
            if (status == 200) {
                console.log("*** stopping pushmode to app server");
            } else {
                console.log("Error with status " + status + " -> Push Mode not stopped -> received : " + JSON.stringify(m));
            }
        }, dassConfig);
    };

    // Stropping Push mode
    stopPush();



} else {


    /* Building StartPush Object, application server and starting server
    // JSON object to put for PUSH registration */
    /* {
        “host”: “hostname”,      // Hostname or IP address of App server interface
        “port”: 1234,            // port number of DASS HTTPS host interface
        “path_prefix”: “/abc”,   // path prefix
        “auth_string”: “string”, // see below
        “retry_policy”: 0        // see details in the API specification
    } */

    var appSrvrPort = parseInt(args[2], 10);
    var appSrvrHost = args[3];
    var appSrvrUsr = "pevi2pin1234";
    var appSrvrPwd = "eon34eonuf*on!";
    var appServrProtocol = "http";

    // Authorisation string, "Basic " followed by "user:password" base64 encoded
    var auth_string = "Basic " + new Buffer(appSrvrUsr + ":" + appSrvrPwd).toString('base64');

    var pushRegObject = {
        host: appSrvrHost,
        port: appSrvrPort,
        path_prefix: "/console",
        auth_string: auth_string,
        retry_policy: 0 // no retry
    };


    /* Start Push function */
    var startPush = function (server) {

        pushRegObject.host = appServrProtocol + "://" + appSrvrHost;
        log(pushRegObject);

        rest.doRest("PUT", "/rest/pushmode/start", pushRegObject, function (status, m) {

            if (status == 200) {
                console.log("***  app server registered for push");
            } else {
                log("Error with status " + status + " -> Push Mode not started -> received : " + JSON.stringify(m));
            }


        }, dassConfig);
    };


    /* 
     *
     *  APPLICATION SERVER 
     *  -> creating a http server that forwards all received payloads to a server
     *
     */



    var cfg;
    var userName;

    // Application server declaration, using express.js
    var appServer = express();
    var httpServer = http.createServer(appServer).listen(appSrvrPort, function () {
        var host = httpServer.address().address;
        var port = httpServer.address().port;
        console.log('Starting server listening on port ' + port);

        // Registration for PUSH
        startPush(null, host);

    });



    // http://pervasivenation.com - no authentication 
    var ruBanServerCfg = {
        "protocol": "http",
        "host": "pervasivenation.com",
        "host_user": null,
        "host_password": null,
        "port": 58000
    };


    // PUT management from DASS
    appServer.put('/console/*', function (req, res) {

        log("--------------");
        log("Received Message put on URL : " + req.url);
        var url = u.parse(req.url);
        log(url);

        req.setEncoding('utf8');

        var payload = '';
        req.on('data', function (chunk) {
            payload += chunk;
        });

        // When the message body is available we can do the query.
        req.on('end', function () {
            try {
                var obj = JSON.parse(payload);
                if (obj.dataFrame) {
                    obj.dataFrame = new Buffer(obj.dataFrame, 'Base64').toString("hex");
                }

                if (obj.timestamp) {
                    if (obj.timestamp.toUpperCase().search("Z") >= 0) {
                        obj.timestamp = new Date(obj.timestamp).toJSON();
                    } else {
                        obj.timestamp = new Date(obj.timestamp + "Z").toJSON();
                    }
                }


                if (obj.gtw_json) {
                    obj.gtw_json = JSON.parse(obj.gtw_json);
                }

                obj.type = req.url.replace("/console/rest/callback/", "");


                rest.doRest("PUT", "/sideapi/nodes/" + obj.deveui, obj, function (status, m) {
                    log("******** Response from Server with status :" + status);
                    log(m);
                }, ruBanServerCfg);




                log(obj);
                //io.emit("push", obj);
            } catch (ex) {
                console.log("error in payload - no json object found");
                console.log("received payload: " + payload);
            }

        });
        res.status(202).json({}); // Returning empty body & 202 in order to keep payloads on the DASS
    });




    // POST managament from DASS 
    appServer.post('/console/*', function (req, res) {

        log("--------------");
        log("Received Message posted on URL : " + req.url);

        req.setEncoding('utf8');

        var payload = '';
        req.on('data', function (chunk) {
            payload += chunk;
        });

        // When the message body is available we can do the query.
        req.on('end', function () {
            try {
                var obj = JSON.parse(payload);
                if (obj.dataFrame) {
                    obj.dataFrame = new Buffer(obj.dataFrame, 'Base64').toString("hex");
                }
                if (obj.timestamp) {
                    obj.timestamp = new Date(obj.timestamp).toJSON();
                }

                if (obj.gtw_json) {
                    obj.gtw_json = JSON.parse(obj.gtw_json);
                }

                obj.type = req.url.replace("/console/rest/callback/", "");
                log(obj);


                rest.doRest("POST", "/sideapi/nodes/" + obj.deveui, obj, function (status, m) {
                    log("******** Response from Server with status :" + status);
                    log(m);

                }, ruBanServerCfg);


            } catch (ex) {
                log("error in payload - no json object found");
                log(payload);
            }
        });
        res.status(202).json({}); // Returning empty body & 202 in order to keep payloads on the DASS 
    });
}