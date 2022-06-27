define({ "api": [
  {
    "type": "post",
    "url": "https://health29.org/api/signin/registerUserInAuthy",
    "title": "Register in Authy: old users",
    "name": "Register_in_Authy",
    "version": "1.0.0",
    "group": "Access_token",
    "description": "<p>This method gets the response about update the phone information of the user and the registration in Authy application. An email will be sent to indicate the next steps for the user.</p>",
    "examples": [
      {
        "title": "Example usage",
        "content": " var passwordsha512 = sha512(\"fjie76?vDh\");\n var param={email:\"aa@aa.com\", password:passwordsha512, countryselectedPhoneCode:\"+34\",phone:\"66666666\",device:{id:this.deviceId,info:this.deviceInformation}};\n this.http.post('https://health29.org/api/signin/registerUserInAuthy',params)\n .subscribe( (res : any) => {\n\t\tif(res.message==\"User Registered in Authy\"){\n\t    \t// User registration OK\n\t\t}\n\t\telse{\n\t\t\t// User registration KO\n\t\t}\n });",
        "type": "js"
      },
      {
        "title": "Obtain device id and information.",
        "content": " // DeviceID:\n if(localStorage.getItem('deviceid')){\n \tthis.deviceId=localStorage.getItem('deviceid')\n }else{\n \tthis.deviceId = sha512(Math.random().toString(36).substr(2, 9));\n \tlocalStorage.setItem('deviceid', this.deviceId)\n }\n // Device information:\n\tsetTimeout(() =>{\n\t\tFingerprint2.get((components:any) => {\n\t\t\tconsole.log(components)\n\t\t\tvar timezone=\"\";\n\t\t\tvar platform=\"\";\n\t\t\tvar userAgent=\"\";\n\t\t\tfor(var i=0;i<components.length;i++){\n\t\t\t\tif(components[i].key==\"timezone\"){\n\t\t\t\t\ttimezone=components[i].value;\n\t\t\t\t}\n\t\t\t\telse if(components[i].key==\"platform\"){\n\t\t\t\t\tplatform=components[i].value;\n\t\t\t\t}\n\t \t\t\telse if(components[i].key==\"userAgent\"){\n\t\t\t\t\tuserAgent=components[i].value;\n\t\t\t\t}\n\t\t\t}\n\t\t\tthis.deviceInformation={timezone:timezone,platform:platform,userAgent:userAgent}\n\t\t})\n\t}, 500)",
        "type": "js"
      }
    ],
    "parameter": {
      "fields": {
        "body": [
          {
            "group": "body",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>User email.</p>"
          },
          {
            "group": "body",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>User password using hash <a href=\"https://es.wikipedia.org/wiki/SHA-2\" target=\"_blank\">sha512</a></p>"
          },
          {
            "group": "body",
            "type": "String",
            "optional": false,
            "field": "phone",
            "description": "<p>The phone number</p>"
          },
          {
            "group": "body",
            "type": "String",
            "optional": false,
            "field": "countryselectedPhoneCode",
            "description": "<p>The country code</p>"
          },
          {
            "group": "body",
            "type": "Object",
            "optional": false,
            "field": "device",
            "description": "<p>A json object with information about device id, timezone, platform and userAgent.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "\t\t{\n\t\t\t\"email\":\"aa@aa.com\",\n \t\t\"password\":passwordsha512,\n\t\t\t\"countryselectedPhoneCode\":\"+34\",\n\t\t\t\"phone\":\"666666666\",\n\t\t\t\"device\":{\n\t\t\t\t\"id\":\"1234\",\n\t\t\t\t\"info\": {\n\t\t\t\t\t\"timezone\":\"Europe/Madrid\",\n\t\t\t\t\t\"platform\":\"Win32\",\n\t\t\t\t\t\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWeb…ML, like Gecko) Chrome/85.0.4183.83 Safari/537.36\"\n\t\t\t\t}\n\t\t\t}\n\t\t}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>If all goes well, the system should return &quot;User Registered in Authy&quot; and the token.</p>"
          }
        ],
        "Failed 500": [
          {
            "group": "Failed 500",
            "type": "String",
            "optional": false,
            "field": "string",
            "description": "<p>Information about the request was failed: <ul> Error finding the user </ul> <ul> User not found </ul> <ul> Error finding the group </ul> <ul> Group not found </ul> <ul> Error registering the user in Authy </ul> <ul> Error updating the user </ul> <ul> Fail sending email </ul></p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n \"message\": \"User Registered in Authy\",\n}",
          "type": "json"
        }
      ]
    },
    "filename": "controllers/all/user.js",
    "groupTitle": "Access_token"
  },
  {
    "type": "post",
    "url": "https://health29.org/api/api/signin2FA/",
    "title": "Get the token with 2FA",
    "name": "Request_approval",
    "version": "1.0.0",
    "group": "Access_token",
    "description": "<p>This method gets the token and the language for the user with 2FA. This token includes the encrypt id of the user, token expiration date, role, and the group to which it belongs. The token are encoded using <a href=\"https://en.wikipedia.org/wiki/JSON_Web_Token\" target=\"_blank\">jwt</a> <br> <br> We use the <a href=\"https://www.npmjs.com/package/fingerprintjs2\" target=\"_blank\">fingerprintjs2 library</a> for configuring the params.</p>",
    "examples": [
      {
        "title": "Example usage",
        "content": " var passwordsha512 = sha512(\"fjie76?vDh\");\n var body={\n\t\t\"email\":\"aa@aa.com\",\n\t\t\"password\":passwordsha512,\n\t\t\"deviceInformation\":{\n\t\t\t\"timezone\":\"Europe/Madrid\",\n\t\t\t\"platform\":\"Win32\",\n\t\t\t\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWeb…ML, like Gecko) Chrome/85.0.4183.83 Safari/537.36\"\n\t\t },\n\t\t\"deviceId\":\"1234\"};\n\n this.http.post('https://health29.org/api/signin2FA/',body)\n .subscribe( (res : any) => {\n\t\tif(res.type==\"2FA approved\"){\n\t\t\t// In this case the application has been correctly sent to Authy. Now, to continue, you must use the status2FA method described in \"SignIn 2FA\" section to check the user's response.\n\t\t\t// The login is not yet complete since Authy authorization is required by the user.\n\t\t}\n\t\telse{\n\t\t\tthis.isloggedIn = false;\n\t\t}\n });",
        "type": "js"
      },
      {
        "title": "Obtain device id and information.",
        "content": " // DeviceID:\n if(localStorage.getItem('deviceid')){\n \tthis.deviceId=localStorage.getItem('deviceid')\n }else{\n \tthis.deviceId = sha512(Math.random().toString(36).substr(2, 9));\n \tlocalStorage.setItem('deviceid', this.deviceId)\n }\n // Device information:\n\tsetTimeout(() =>{\n\t\tFingerprint2.get((components:any) => {\n\t\t\tconsole.log(components)\n\t\t\tvar timezone=\"\";\n\t\t\tvar platform=\"\";\n\t\t\tvar userAgent=\"\";\n\t\t\tfor(var i=0;i<components.length;i++){\n\t\t\t\tif(components[i].key==\"timezone\"){\n\t\t\t\t\ttimezone=components[i].value;\n\t\t\t\t}\n\t\t\t\telse if(components[i].key==\"platform\"){\n\t\t\t\t\tplatform=components[i].value;\n\t\t\t\t}\n\t \t\t\telse if(components[i].key==\"userAgent\"){\n\t\t\t\t\tuserAgent=components[i].value;\n\t\t\t\t}\n\t\t\t}\n\t\t\tthis.deviceInformation={timezone:timezone,platform:platform,userAgent:userAgent}\n\t\t})\n\t}, 500)",
        "type": "js"
      }
    ],
    "parameter": {
      "fields": {
        "body": [
          {
            "group": "body",
            "type": "string",
            "optional": false,
            "field": "email",
            "description": "<p>User email.</p>"
          },
          {
            "group": "body",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>User password using hash <a href=\"https://es.wikipedia.org/wiki/SHA-2\" target=\"_blank\">sha512</a></p>"
          },
          {
            "group": "body",
            "type": "Object",
            "optional": false,
            "field": "deviceInformation",
            "description": "<p>timezone, platform and user Agent of the user device.</p>"
          },
          {
            "group": "body",
            "type": "String",
            "optional": false,
            "field": "deviceId",
            "description": "<p>The unique identifier of the device.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n\t\"email\":\"aa@aa.com\",\n\t\"password\":passwordsha512,\n\t\"deviceInformation\":{\n\t\t\"timezone\":\"Europe/Madrid\",\n\t\t\"platform\":\"Win32\",\n\t\t\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWeb…ML, like Gecko) Chrome/85.0.4183.83 Safari/537.36\"\n \t},\n\t\"deviceId\":\"1234\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<ul> If the request is approved by the user: \"You have successfully logged in\" </ul> <ul> If the request is denied by the user \"Authentication denied\" </ul>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": "<ul> If the request is approved by the user - the unique token for the user access to Health29 </ul> <ul> If the request is denied by the user: null </ul>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "lang",
            "description": "<ul> If the request is approved by the user - Lang of the User. </ul> <ul> If the request is denied by the user: null </ul>"
          }
        ],
        "Failed 500": [
          {
            "group": "Failed 500",
            "type": "Object",
            "optional": false,
            "field": "json",
            "description": "<p>Some errors could return 500 error (specified in message field of the object result) <ul> {message: &quot;Bad Request sending approval&quot;} </ul> <ul> {message: &quot;Bad Request for checking approval status&quot;} </ul> <ul> {message: &quot;User not found&quot;} </ul></p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200  OK\n{\n \"message\": \"You have successfully logged in\",\n \"token\": \"eyJ0eXAiOiJKV1QiLCJhbGciPgDIUzI1NiJ9.eyJzdWIiOiI1M2ZlYWQ3YjY1YjM0ZTQ0MGE4YzRhNmUyMzVhNDFjNjEyOThiMWZjYTZjMjXkZTUxMTA9OGVkN2NlODMxYWY3IiwiaWF0IjoxNTIwMzUzMDMwLCJlcHAiOjE1NTE4ODkwMzAsInJvbGUiOiJVc2VyIiwiZ3JvdDEiOiJEdWNoZW5uZSBQYXJlbnQgUHJfrmVjdCBOZXRoZXJsYW5kcyJ9.MloW8eeJ857FY7-vwxJaMDajFmmVStGDcnfHfGJx05k\",\n \"lang\": \"en\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "controllers/all/user.js",
    "groupTitle": "Access_token"
  },
  {
    "type": "post",
    "url": "https://health29.org/api/signin",
    "title": "Get the token (and the userId)",
    "name": "signIn",
    "version": "1.0.0",
    "group": "Access_token",
    "description": "<p>This method gets the token and the language for the user. This token includes the encrypt id of the user, token expiration date, role, and the group to which it belongs. The token are encoded using <a href=\"https://en.wikipedia.org/wiki/JSON_Web_Token\" target=\"_blank\">jwt</a> <br> <br> The functionality of this method is directly related to the second authentication factor. That is, you have to take into account if the user you want to perform the operation with belongs or not to a patient group that has configured the 2FA.According to this, the answers obtained will be different. In this case, you will have to use the methods: <a href=\"#api-Access_token-Request_approval\">Get token 2FA</a> and <a href=\"#api-Access_token-Register_in_Authy\">Register in Authy</a>. <br> <br> We use the <a href=\"https://www.npmjs.com/package/fingerprintjs2\" target=\"_blank\">fingerprintjs2 library</a> for configuring the params.</p>",
    "examples": [
      {
        "title": "Example for general usage",
        "content": "// Obtain device id and information previously\nvar formValue = { email: \"aa@aa.com\", password: passwordsha512, device: {id:this.deviceId,info:this.deviceInformation} };\nvar passwordsha512 = sha512(\"fjie76?vDh\");\nthis.http.post('https://health29.org/api/signin',formValue)\n  .subscribe( (res : any) => {\n    if(res.message == \"You have successfully logged in\"){\n      console.log(res.lang);\n      console.log(res.token);\n    }else{\n      this.isloggedIn = false;\n    }\n }, (err) => {\n   this.isloggedIn = false;\n }",
        "type": "js"
      },
      {
        "title": "Example for users with 2FA",
        "content": " // Obtain device id and information previously\n var passwordsha512 = sha512(\"fjie76?vDh\");\n var formValue = { email: \"aa@aa.com\", password: passwordsha512, device: {id:this.deviceId,info:this.deviceInformation} };\n this.http.post('https://health29.org/api/signin',formValue)\n .subscribe( (res : any) => {\n     if(res.message == \"You have successfully logged in\"){\n       console.log(res.lang);\n       console.log(res.token);\n     }\n\t\telse if(res.type==\"2FA request approval\"){\n\t\t\t// Use the requestApproval method described in \"SignIn 2FA\" section to continue. The login is not yet complete since Authy authorization is required by the user.\n\t\t}\n     else if(res.type==\"Update Phone\"){\n\t\t\t//In this case the user has not yet provided information about his telephone number, so  use the updatePhone method described in \"SignIn 2FA\" section and then retry login with this method.\n\t\t}\n\t\telse{\n       this.isloggedIn = false;\n     }\n  }, (err) => {\n    this.isloggedIn = false;\n  }",
        "type": "js"
      },
      {
        "title": "Obtain device id and information.",
        "content": " // DeviceID:\n if(localStorage.getItem('deviceid')){\n \tthis.deviceId=localStorage.getItem('deviceid')\n }else{\n \tthis.deviceId = sha512(Math.random().toString(36).substr(2, 9));\n \tlocalStorage.setItem('deviceid', this.deviceId)\n }\n // Device information:\n\tsetTimeout(() =>{\n\t\tFingerprint2.get((components:any) => {\n\t\t\tconsole.log(components)\n\t\t\tvar timezone=\"\";\n\t\t\tvar platform=\"\";\n\t\t\tvar userAgent=\"\";\n\t\t\tfor(var i=0;i<components.length;i++){\n\t\t\t\tif(components[i].key==\"timezone\"){\n\t\t\t\t\ttimezone=components[i].value;\n\t\t\t\t}\n\t\t\t\telse if(components[i].key==\"platform\"){\n\t\t\t\t\tplatform=components[i].value;\n\t\t\t\t}\n\t \t\t\telse if(components[i].key==\"userAgent\"){\n\t\t\t\t\tuserAgent=components[i].value;\n\t\t\t\t}\n\t\t\t}\n\t\t\tthis.deviceInformation={timezone:timezone,platform:platform,userAgent:userAgent}\n\t\t})\n\t}, 500)",
        "type": "js"
      }
    ],
    "parameter": {
      "fields": {
        "body": [
          {
            "group": "body",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>User email</p>"
          },
          {
            "group": "body",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>User password using hash <a href=\"https://es.wikipedia.org/wiki/SHA-2\" target=\"_blank\">sha512</a></p>"
          },
          {
            "group": "body",
            "type": "json",
            "optional": false,
            "field": "device",
            "description": "<p>Device information: timezone, platform and userAgent.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "    {\n      \"email\": \"example@ex.com\",\n      \"password\": \"f74f2603939a53656948480ce71f1ce46457b6654fd22c61c1f2ccd3e2c96d1cd02d162b560c4beaf1ae45f4574571dc5cbc1ce040701c0b5c38457988aa00fe97f\",\n\t\t \"device\":{\n\t\t\t\"timezone\":\"Europe/Madrid\",\n\t\t\t\"platform\":\"Win32\",\n\t\t\t\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWeb…ML, like Gecko) Chrome/85.0.4183.83 Safari/537.36\"\n\t\t  }\n    }",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>If all goes well, the system should return 'You have successfully logged in'</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": "<p>You will need this <strong>token</strong> in the header of almost all requests to the API. Whenever the user wants to access a protected route or resource, the user agent should send the JWT, in the Authorization header using the Bearer schema.</p> <p>The data contained in the token are: encrypted <strong>userId</strong>, expiration token, group, and role. To decode them, you you must use some jwt decoder <a href=\"https://en.wikipedia.org/wiki/JSON_Web_Token\" target=\"_blank\">jwt</a>. There are multiple options to do it, for example for javascript: <a href=\"https://github.com/hokaccha/node-jwt-simple\" target=\"_blank\">Option 1</a> <a href=\"https://github.com/auth0/jwt-decode\" target=\"_blank\">Option 2</a> When you decode, you will see that it has several values, these are:</p> <p> <ul>  <li>sub: the encrypted userId. This value will also be used in many API queries. It is recommended to store only the token, and each time the userId is required, decode the token.</li>  <li>exp: The expiration time claim identifies the expiration time on or after which the JWT must not be accepted for processing.</li>  <li>group: Group to which the user belongs, if it does not have a group, it will be 'None'. </li>  <li>role: Role of the user. Normally it will be 'User'.</li> </ul> </p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "lang",
            "description": "<p>Lang of the User.</p>"
          }
        ],
        "Success 200 2FA": [
          {
            "group": "Success 200 2FA",
            "type": "String",
            "optional": false,
            "field": "type",
            "description": "<p>Information that 2FA is required: &quot;2FA request approval&quot;</p>"
          }
        ],
        "Success 200 UpdatePhone": [
          {
            "group": "Success 200 UpdatePhone",
            "type": "String",
            "optional": false,
            "field": "type",
            "description": "<p>Information that update phone information for the user is required: &quot;Update Phone&quot;</p>"
          }
        ],
        "Success 202": [
          {
            "group": "Success 202",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Information about the request. The credentials are incorrect or something has gone wrong. One of the following answers will be obtained:</p> <ul> <li>Not found</li> <li>Login failed</li> <li>Account is temporarily locked</li> <li>Account is unactivated</li> </ul>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n \"message\": \"You have successfully logged in\",\n \"token\": \"eyJ0eXAiOiJKV1QiLCJhbGciPgDIUzI1NiJ9.eyJzdWIiOiI1M2ZlYWQ3YjY1YjM0ZTQ0MGE4YzRhNmUyMzVhNDFjNjEyOThiMWZjYTZjMjXkZTUxMTA9OGVkN2NlODMxYWY3IiwiaWF0IjoxNTIwMzUzMDMwLCJlcHAiOjE1NTE4ODkwMzAsInJvbGUiOiJVc2VyIiwiZ3JvdDEiOiJEdWNoZW5uZSBQYXJlbnQgUHJfrmVjdCBOZXRoZXJsYW5kcyJ9.MloW8eeJ857FY7-vwxJaMDajFmmVStGDcnfHfGJx05k\",\n \"lang\": \"en\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "controllers/all/user.js",
    "groupTitle": "Access_token"
  },
  {
    "type": "post",
    "url": "https://health29.org/api/api/newPass",
    "title": "New password",
    "name": "newPass",
    "version": "1.0.0",
    "group": "Account",
    "description": "<p>This method allows you to change the password of an account. It is another way to change the password, but in this case, you need to provide the current and the new password, and it does not require validation through the mail account. In this case, it requires authentication in the header.</p>",
    "examples": [
      {
        "title": "Example usage:",
        "content": "var passwordsha512 = sha512(\"fjie76?vDh\");\nvar newpasswordsha512 = sha512(\"jisd?87Tg\");\nvar formValue = { email: \"example@ex.com\", actualpassword: passwordsha512, newpassword: newpasswordsha512 };\n this.http.post('https://health29.org/api/newPass',formValue)\n  .subscribe( (res : any) => {\n    if(res.message == \"password changed\"){\n      console.log(\"Password changed successfully\");\n    }else if(res.message == 'Login failed'){\n      console.log('The current password is incorrect');\n    }else if(res.message == 'Account is temporarily locked'){\n      console.log('Account is temporarily locked');\n    }else if(res.message == 'Account is unactivated'){\n      ...\n    }\n }, (err) => {\n   ...\n }",
        "type": "js"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Users unique access-key. For this, go to  <a href=\"#api-Access_token-signIn\">Get token</a></p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n  \"authorization\": \"Bearer eyJ0eXAiOiJKV1QiLCJhbGciPgDIUzI1NiJ9.eyJzdWIiOiI1M2ZlYWQ3YjY1YjM0ZTQ0MGE4YzRhNmUyMzVhNDFjNjEyOThiMWZjYTZjMjXkZTUxMTA9OGVkN2NlODMxYWY3IiwiaWF0IjoxNTIwMzUzMDMwLCJlcHAiOjE1NTE4ODkwMzAsInJvbGUiOiJVc2VyIiwiZ3JvdDEiOiJEdWNoZW5uZSBQYXJlbnQgUHJfrmVjdCBOZXRoZXJsYW5kcyJ9.MloW8eeJ857FY7-vwxJaMDajFmmVStGDcnfHfGJx05k\"\n}",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "body": [
          {
            "group": "body",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>User email. In the link to request a change of password sent to the email, there is an email parameter. The value of this parameter will be the one to be assigned to email.</p>"
          },
          {
            "group": "body",
            "type": "String",
            "optional": false,
            "field": "actualpassword",
            "description": "<p>Actual password using hash <a href=\"https://es.wikipedia.org/wiki/SHA-2\" target=\"_blank\">sha512</a></p>"
          },
          {
            "group": "body",
            "type": "String",
            "optional": false,
            "field": "newpassword",
            "description": "<p>New password using hash <a href=\"https://es.wikipedia.org/wiki/SHA-2\" target=\"_blank\">sha512</a></p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n  \"email\": \"example@ex.com\",\n  \"actualpassword\": \"f74f2603939a53656948480ce71f1ce46457b6654fd22c61c1f2ccd3e2c96d1cd02d162b560c4beaf1ae45f4574571dc5cbc1ce040701c0b5c38457988aa00fe97f\",\n  \"newpassword\": \"k847y603939a53656948480ce71f1ce46457b4745fd22c61c1f2ccd3e2c96d1cd02d162b560c4beaf1ae45f4574571dc5cbc1ce040701c0b5c38457988aa00fe45t\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Information about the request. If everything went correctly, return 'password changed'</p>"
          }
        ],
        "Success 202": [
          {
            "group": "Success 202",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Information about the request. The credentials are incorrect or something has gone wrong. One of the following answers will be obtained:</p> <ul> <li>Not found</li> <li>Login failed (if the current password is incorrect)</li> <li>Account is temporarily locked</li> <li>Account is unactivated</li> </ul>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n \"message\": \"password changed\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "controllers/all/user.js",
    "groupTitle": "Account"
  },
  {
    "type": "post",
    "url": "https://health29.org/api/api/recoverpass",
    "title": "Request password change",
    "name": "recoverPass",
    "version": "1.0.0",
    "group": "Account",
    "description": "<p>This method allows you to send a request to change the password. At the end of this call, you need to check the email account to call <a href=\"#api-Account-updatePass\">update password</a>.</p>",
    "examples": [
      {
        "title": "Example usage:",
        "content": "var formValue = { email: \"example@ex.com\"};\nthis.http.post('https://health29.org/api/recoverpass',formValue)\n .subscribe( (res : any) => {\n   if(res.message == \"Email sent\"){\n     console.log(\"Account recovery email sent. Check the email to change the password\");\n   }\n}, (err) => {\n  if(err.error.message == 'Fail sending email'){\n     //contact with health29\n   }else if(err.error.message == 'user not exists'){\n    ...\n   }else if(err.error.message == 'account not activated'){\n    ...\n   }\n}",
        "type": "js"
      }
    ],
    "parameter": {
      "fields": {
        "body": [
          {
            "group": "body",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>User email</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n  \"email\": \"example@ex.com\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Information about the request. If everything went correctly, return 'Email sent'</p>"
          }
        ],
        "Eror 500": [
          {
            "group": "Eror 500",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Information about the request. The credentials are incorrect or something has gone wrong. One of the following answers will be obtained:</p> <ul> <li>Fail sending email</li> <li>user not exists</li> <li>account not activated</li> </ul>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n \"message\": \"Email sent\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "controllers/all/user.js",
    "groupTitle": "Account"
  },
  {
    "type": "post",
    "url": "https://health29.org/api/api/signUp",
    "title": "New account",
    "name": "signUp",
    "version": "1.0.0",
    "group": "Account",
    "description": "<p>This method allows you to create a user account in health 29</p>",
    "examples": [
      {
        "title": "Example usage:",
        "content": "var passwordsha512 = sha512(\"fjie76?vDh\");\nvar formValue = { email: \"example@ex.com\", userName: \"Peter\", password: passwordsha512, lang: \"en\", group: \"None\"};\n this.http.post('https://health29.org/api/signup',formValue)\n  .subscribe( (res : any) => {\n    if(res.message == \"Account created\"){\n      console.log(\"Check the email to activate the account\");\n    }else if(res.message == 'Fail sending email'){\n      //contact with health29\n    }else if(res.message == 'user exists'){\n     ...\n    }\n }, (err) => {\n   ...\n }",
        "type": "js"
      }
    ],
    "parameter": {
      "fields": {
        "body": [
          {
            "group": "body",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>User email</p>"
          },
          {
            "group": "body",
            "type": "String",
            "optional": false,
            "field": "userName",
            "description": "<p>User name</p>"
          },
          {
            "group": "body",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>User password using hash <a href=\"https://es.wikipedia.org/wiki/SHA-2\" target=\"_blank\">sha512</a></p>"
          },
          {
            "group": "body",
            "type": "String",
            "optional": false,
            "field": "lang",
            "description": "<p>Lang of the User. For this, go to  <a href=\"#api-Languages-getLangs\">Get the available languages</a>. We currently have 5 languages, but we will include more. The current languages are:</p> <ul> <li>English: en</li> <li>Spanish: es</li> <li>German: de</li> <li>Dutch: nl</li> <li>Portuguese: pt</li> </ul>"
          },
          {
            "group": "body",
            "type": "String",
            "optional": true,
            "field": "group",
            "description": "<p>Group to which the user belongs, if it does not have a group or do not know the group to which belongs, it will be 'None'. If the group is not set, it will be set to 'None' by default.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n  \"email\": \"example@ex.com\",\n  \"userName\": \"Peter\",\n  \"password\": \"f74f2603939a53656948480ce71f1ce46457b6654fd22c61c1f2ccd3e2c96d1cd02d162b560c4beaf1ae45f4574571dc5cbc1ce040701c0b5c38457988aa00fe97f\",\n  \"group\": \"None\",\n  \"lang\": \"en\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Information about the request. One of the following answers will be obtained:</p> <ul> <li>Account created (The user should check the email to activate the account)</li> <li>Fail sending email</li> <li>user exists</li> </ul>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n \"message\": \"Account created\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "controllers/all/user.js",
    "groupTitle": "Account"
  },
  {
    "type": "post",
    "url": "https://health29.org/api/api/updatepass",
    "title": "Update password",
    "name": "updatePass",
    "version": "1.0.0",
    "group": "Account",
    "description": "<p>This method allows you to change the password of an account. Before changing the password, you previously had to make a <a href=\"#api-Account-recoverPass\">request for password change</a>.</p>",
    "examples": [
      {
        "title": "Example usage:",
        "content": "var passwordsha512 = sha512(\"fjie76?vDh\");\nvar param = this.router.parseUrl(this.router.url).queryParams;\nvar formValue = { email: param.email, password: passwordsha512, randomCodeRecoverPass: param.key };\n this.http.post('https://health29.org/api/updatepass',formValue)\n  .subscribe( (res : any) => {\n    if(res.message == \"password changed\"){\n      console.log(\"Password changed successfully\");\n    }\n }, (err) => {\n   if(err.error.message == 'invalid link'){\n      ...\n    }else if(err.error.message == 'link expired'){\n      console.log('The link has expired after more than 15 minutes since you requested it. Re-request a password change.');\n    }else if(err.error.message == 'Error saving the pass'){\n      ...\n    }\n }",
        "type": "js"
      }
    ],
    "parameter": {
      "fields": {
        "body": [
          {
            "group": "body",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>User email. In the link to request a change of password sent to the email, there is an email parameter. The value of this parameter will be the one to be assigned to email.</p>"
          },
          {
            "group": "body",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>User password using hash <a href=\"https://es.wikipedia.org/wiki/SHA-2\" target=\"_blank\">sha512</a></p>"
          },
          {
            "group": "body",
            "type": "String",
            "optional": false,
            "field": "randomCodeRecoverPass",
            "description": "<p>In the password change request link sent to the email, there is a key parameter. The value of this parameter will be the one that must be assigned to randomCodeRecoverPass.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n  \"email\": \"example@ex.com\",\n  \"password\": \"f74f2603939a53656948480ce71f1ce46457b6654fd22c61c1f2ccd3e2c96d1cd02d162b560c4beaf1ae45f4574571dc5cbc1ce040701c0b5c38457988aa00fe97f\",\n  \"randomCodeRecoverPass\": \"0.xkwta99hoy\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Information about the request. If everything went correctly, return 'password changed'</p>"
          }
        ],
        "Eror 500": [
          {
            "group": "Eror 500",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Information about the request. The credentials are incorrect or something has gone wrong. One of the following answers will be obtained:</p> <ul> <li>invalid link</li> <li>link expired (The link has expired after more than 15 minutes since you requested it. Re-request a password change.)</li> <li>Account is temporarily locked</li> <li>Error saving the pass</li> </ul>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n \"message\": \"password changed\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "controllers/all/user.js",
    "groupTitle": "Account"
  },
  {
    "type": "delete",
    "url": "https://health29.org/api/clinicaltrial/:clinicalTrialId",
    "title": "Delete ClinicalTrial",
    "name": "deleteClinicalTrial",
    "description": "<p>This method deletes a ClinicalTrial of a patient</p>",
    "group": "ClinicalTrial",
    "version": "1.0.0",
    "examples": [
      {
        "title": "Example usage:",
        "content": "this.http.delete('https://health29.org/api/clinicaltrial/'+clinicalTrialId)\n .subscribe( (res : any) => {\n   console.log('Delete ClinicalTrial ok');\n  }, (err) => {\n   ...\n  }",
        "type": "js"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Users unique access-key. For this, go to  <a href=\"#api-Access_token-signIn\">Get token</a></p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n  \"authorization\": \"Bearer eyJ0eXAiOiJKV1QiLCJhbGciPgDIUzI1NiJ9.eyJzdWIiOiI1M2ZlYWQ3YjY1YjM0ZTQ0MGE4YzRhNmUyMzVhNDFjNjEyOThiMWZjYTZjMjXkZTUxMTA9OGVkN2NlODMxYWY3IiwiaWF0IjoxNTIwMzUzMDMwLCJlcHAiOjE1NTE4ODkwMzAsInJvbGUiOiJVc2VyIiwiZ3JvdDEiOiJEdWNoZW5uZSBQYXJlbnQgUHJfrmVjdCBOZXRoZXJsYW5kcyJ9.MloW8eeJ857FY7-vwxJaMDajFmmVStGDcnfHfGJx05k\"\n}",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "clinicalTrialId",
            "description": "<p>ClinicalTrial unique ID.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>If the clinicaltrial has been deleted correctly, it returns the message 'The clinicalTrial has been deleted'.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n\t\tmessage: \"The clinicalTrial has been deleted\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "controllers/user/patient/clinical-trial.js",
    "groupTitle": "ClinicalTrial"
  },
  {
    "type": "get",
    "url": "https://health29.org/api/clinicaltrial/:patientId",
    "title": "Get ClinicalTrial",
    "name": "getClinicalTrial",
    "description": "<p>This method read ClinicalTrial of a patient</p>",
    "group": "ClinicalTrial",
    "version": "1.0.0",
    "examples": [
      {
        "title": "Example usage:",
        "content": "this.http.get('https://health29.org/api/clinicaltrial/'+patientId)\n .subscribe( (res : any) => {\n   console.log('Get ClinicalTrial ok');\n  }, (err) => {\n   ...\n  }",
        "type": "js"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Users unique access-key. For this, go to  <a href=\"#api-Access_token-signIn\">Get token</a></p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n  \"authorization\": \"Bearer eyJ0eXAiOiJKV1QiLCJhbGciPgDIUzI1NiJ9.eyJzdWIiOiI1M2ZlYWQ3YjY1YjM0ZTQ0MGE4YzRhNmUyMzVhNDFjNjEyOThiMWZjYTZjMjXkZTUxMTA9OGVkN2NlODMxYWY3IiwiaWF0IjoxNTIwMzUzMDMwLCJlcHAiOjE1NTE4ODkwMzAsInJvbGUiOiJVc2VyIiwiZ3JvdDEiOiJEdWNoZW5uZSBQYXJlbnQgUHJfrmVjdCBOZXRoZXJsYW5kcyJ9.MloW8eeJ857FY7-vwxJaMDajFmmVStGDcnfHfGJx05k\"\n}",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "patientId",
            "description": "<p>Patient unique ID. More info here:  <a href=\"#api-Patients-getPatientsUser\">Get patientId</a></p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "_id",
            "description": "<p>ClinicalTrial unique ID.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "nameClinicalTrial",
            "description": "<p>ClinicalTrial name.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "drugName",
            "description": "<p>Name of the drug.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "takingClinicalTrial",
            "description": "<p>State of taking the drug.</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "date",
            "description": "<p>Date on which the ClinicalTrial was saved.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n[\n \t {\n    \t\t\"_id\": <clinicalTrialId>,\n    \t\t\"date\" : {\n    \t\t\t\"$date\" : 1549843200000\n    \t\t},\n    \t\t\"drugName\" : \"qwe\",\n    \t\t\"takingClinicalTrial\" : \"Yes, currently\",\n    \t\t\"nameClinicalTrial\" : \"adsa\",\n  \t}\n]",
          "type": "json"
        }
      ]
    },
    "filename": "controllers/user/patient/clinical-trial.js",
    "groupTitle": "ClinicalTrial"
  },
  {
    "type": "post",
    "url": "https://health29.org/api/clinicaltrial/:patientId",
    "title": "New ClinicalTrial",
    "name": "saveClinicalTrial",
    "description": "<p>This method create a ClinicalTrial of a patient</p>",
    "group": "ClinicalTrial",
    "version": "1.0.0",
    "examples": [
      {
        "title": "Example usage:",
        "content": "var ClinicalTrial = {\n  \t\t\"date\" : {\n  \t\t\t\"$date\" : 1549843200000\n  \t\t},\n  \t\t\"drugName\" : \"qwe\",\n  \t\t\"takingClinicalTrial\" : \"Yes, currently\",\n  \t\t\"nameClinicalTrial\" : \"adsa\",\n\t}\nthis.http.post('https://health29.org/api/clinicaltrial/'+patientId, ClinicalTrial)\n .subscribe( (res : any) => {\n   console.log('Save ClinicalTrial ok');\n  }, (err) => {\n   ...\n  }",
        "type": "js"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Users unique access-key. For this, go to  <a href=\"#api-Access_token-signIn\">Get token</a></p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n  \"authorization\": \"Bearer eyJ0eXAiOiJKV1QiLCJhbGciPgDIUzI1NiJ9.eyJzdWIiOiI1M2ZlYWQ3YjY1YjM0ZTQ0MGE4YzRhNmUyMzVhNDFjNjEyOThiMWZjYTZjMjXkZTUxMTA9OGVkN2NlODMxYWY3IiwiaWF0IjoxNTIwMzUzMDMwLCJlcHAiOjE1NTE4ODkwMzAsInJvbGUiOiJVc2VyIiwiZ3JvdDEiOiJEdWNoZW5uZSBQYXJlbnQgUHJfrmVjdCBOZXRoZXJsYW5kcyJ9.MloW8eeJ857FY7-vwxJaMDajFmmVStGDcnfHfGJx05k\"\n}",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "patientId",
            "description": "<p>Patient unique ID. More info here:  <a href=\"#api-Patients-getPatientsUser\">Get patientId</a></p>"
          }
        ],
        "body": [
          {
            "group": "body",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>Patient's clinicaltrial.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "_id",
            "description": "<p>ClinicalTrial unique ID.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "nameClinicalTrial",
            "description": "<p>ClinicalTrial name.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "drugName",
            "description": "<p>Name of the drug.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "takingClinicalTrial",
            "description": "<p>State of taking the drug.</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "date",
            "description": "<p>Date on which the ClinicalTrial was saved.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>If the clinicaltrial has been created correctly, it returns the message 'Clinical trial created'.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\"clinicalTrial\":\n  {\n    \t\t\"_id\": <clinicalTrialId>,\n    \t\t\"date\" : {\n    \t\t\t\"$date\" : 1549843200000\n    \t\t},\n    \t\t\"drugName\" : \"qwe\",\n    \t\t\"takingClinicalTrial\" : \"Yes, currently\",\n    \t\t\"nameClinicalTrial\" : \"adsa\",\n  },\n\tmessage: \"Clinical trial created\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "controllers/user/patient/clinical-trial.js",
    "groupTitle": "ClinicalTrial"
  },
  {
    "type": "put",
    "url": "https://health29.org/api/clinicaltrial/:patientId",
    "title": "Update ClinicalTrial",
    "name": "updateClinicalTrial",
    "description": "<p>This method updates a ClinicalTrial of a patient</p>",
    "group": "ClinicalTrial",
    "version": "1.0.0",
    "examples": [
      {
        "title": "Example usage:",
        "content": "var ClinicalTrial = {\n  \t\t\"date\" : {\n  \t\t\t\"$date\" : 1549843200000\n  \t\t},\n  \t\t\"drugName\" : \"qwe\",\n  \t\t\"takingClinicalTrial\" : \"Yes, currently\",\n  \t\t\"nameClinicalTrial\" : \"adsa\",\n\t}\nthis.http.put('https://health29.org/api/clinicaltrial/'+patientId, ClinicalTrial)\n .subscribe( (res : any) => {\n   console.log('Update ClinicalTrial ok');\n  }, (err) => {\n   ...\n  }",
        "type": "js"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Users unique access-key. For this, go to  <a href=\"#api-Access_token-signIn\">Get token</a></p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n  \"authorization\": \"Bearer eyJ0eXAiOiJKV1QiLCJhbGciPgDIUzI1NiJ9.eyJzdWIiOiI1M2ZlYWQ3YjY1YjM0ZTQ0MGE4YzRhNmUyMzVhNDFjNjEyOThiMWZjYTZjMjXkZTUxMTA9OGVkN2NlODMxYWY3IiwiaWF0IjoxNTIwMzUzMDMwLCJlcHAiOjE1NTE4ODkwMzAsInJvbGUiOiJVc2VyIiwiZ3JvdDEiOiJEdWNoZW5uZSBQYXJlbnQgUHJfrmVjdCBOZXRoZXJsYW5kcyJ9.MloW8eeJ857FY7-vwxJaMDajFmmVStGDcnfHfGJx05k\"\n}",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "patientId",
            "description": "<p>Patient unique ID. More info here:  <a href=\"#api-Patients-getPatientsUser\">Get patientId</a></p>"
          }
        ],
        "body": [
          {
            "group": "body",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>Patient's clinicaltrial.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "_id",
            "description": "<p>ClinicalTrial unique ID.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "nameClinicalTrial",
            "description": "<p>ClinicalTrial name.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "drugName",
            "description": "<p>Name of the drug.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "takingClinicalTrial",
            "description": "<p>State of taking the drug.</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "date",
            "description": "<p>Date on which the ClinicalTrial was saved.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>If the clinicaltrial has been updated correctly, it returns the message 'Clinical trial updated'.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\"clinicalTrial\":\n  {\n    \t\t\"_id\": <clinicalTrialId>,\n    \t\t\"date\" : {\n    \t\t\t\"$date\" : 1549843200000\n    \t\t},\n    \t\t\"drugName\" : \"qwe\",\n    \t\t\"takingClinicalTrial\" : \"Yes, currently\",\n    \t\t\"nameClinicalTrial\" : \"adsa\",\n  },\n\tmessage: \"Clinical trial updated\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "controllers/user/patient/clinical-trial.js",
    "groupTitle": "ClinicalTrial"
  },
  {
    "type": "get",
    "url": "https://health29.org/api/promshistory",
    "title": "Get the history prom",
    "name": "getPromHistory_from_patient",
    "description": "<p>This method return the history records of a prom of an specific patient</p>",
    "group": "Datapoints",
    "version": "1.0.0",
    "examples": [
      {
        "title": "Example usage:",
        "content": "var query = {\"promId\":<promId>,\"patientId\":<patientId>}\nthis.http.get('https://health29.org/api/promshistory'+query)\n .subscribe( (res : any) => {\n   console.log('Get prom hbistory ok');\n  }, (err) => {\n   ...\n  }",
        "type": "js"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Users unique access-key. For this, go to  <a href=\"#api-Access_token-signIn\">Get token</a></p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n  \"authorization\": \"Bearer eyJ0eXAiOiJKV1QiLCJhbGciPgDIUzI1NiJ9.eyJzdWIiOiI1M2ZlYWQ3YjY1YjM0ZTQ0MGE4YzRhNmUyMzVhNDFjNjEyOThiMWZjYTZjMjXkZTUxMTA9OGVkN2NlODMxYWY3IiwiaWF0IjoxNTIwMzUzMDMwLCJlcHAiOjE1NTE4ODkwMzAsInJvbGUiOiJVc2VyIiwiZ3JvdDEiOiJEdWNoZW5uZSBQYXJlbnQgUHJfrmVjdCBOZXRoZXJsYW5kcyJ9.MloW8eeJ857FY7-vwxJaMDajFmmVStGDcnfHfGJx05k\"\n}",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "promId",
            "description": "<p>A string with the information of the prom unique id <a href=\"#api-Datapoints-getProms_from_patient\">Get promId</a></p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "patientId",
            "description": "<p>The patient id</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "Result",
            "description": "<p>Returns an object with the information of the history records for one prom. [{&quot;data&quot;:&quot;&quot;, &quot;date&quot;: &quot;&quot;}]</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n[\n {\n    \"data\": \"Intermediate\",\n    \"date\": \"2021-02-15T17:37:44.872Z\"\n },\n {\n    \"data\": \"Becker Muscular Dystrophy\",\n    \"date\": \"2019-12-26T12:14:13.080Z\"\n },\n {\n    \"data\": \"Duchenne Muscular Dystrophy\",\n    \"date\": \"2019-11-28T17:25:49.426Z\"\n }\n]",
          "type": "json"
        }
      ]
    },
    "filename": "controllers/user/patient/patient-prom.js",
    "groupTitle": "Datapoints"
  },
  {
    "type": "get",
    "url": "https://health29.org/api/proms",
    "title": "Get the proms from patient",
    "name": "getProms_from_patient",
    "description": "<p>This method return the proms of an specific patient</p>",
    "group": "Datapoints",
    "version": "1.0.0",
    "examples": [
      {
        "title": "Example usage:",
        "content": "var query = {\"groupId\":<groupId>,\"patientId\":<patientId>}\nthis.http.get('https://health29.org/api/proms'+query)\n .subscribe( (res : any) => {\n   console.log('Get proms ok');\n  }, (err) => {\n   ...\n  }",
        "type": "js"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Users unique access-key. For this, go to  <a href=\"#api-Access_token-signIn\">Get token</a></p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n  \"authorization\": \"Bearer eyJ0eXAiOiJKV1QiLCJhbGciPgDIUzI1NiJ9.eyJzdWIiOiI1M2ZlYWQ3YjY1YjM0ZTQ0MGE4YzRhNmUyMzVhNDFjNjEyOThiMWZjYTZjMjXkZTUxMTA9OGVkN2NlODMxYWY3IiwiaWF0IjoxNTIwMzUzMDMwLCJlcHAiOjE1NTE4ODkwMzAsInJvbGUiOiJVc2VyIiwiZ3JvdDEiOiJEdWNoZW5uZSBQYXJlbnQgUHJfrmVjdCBOZXRoZXJsYW5kcyJ9.MloW8eeJ857FY7-vwxJaMDajFmmVStGDcnfHfGJx05k\"\n}",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "groupId",
            "description": "<p>A string with the information of the group unique id <a href=\"#api-Groups-getGroup\">Get groupId</a></p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "patientId",
            "description": "<p>The patient id</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "Result",
            "description": "<p>Returns an object with the information for one section, the list of proms associated and the answer of the patient. [{&quot;section&quot;:(section data),&quot;promsStructure&quot;:[{&quot;structure&quot;:(prom generic data),&quot;data&quot;:(patient prom answer)}]]</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n[\n\t\t{\n\t\t\t\"section\": {\n    \t\t\t\"_id\":<section_id>,\n    \t\t\t\"description\":<section description>,\n    \t\t\t\"name\":<section name>,\n    \t\t\t\"enabled\":true,\n\t   \t\t\t\"order\":2\n\t\t\t},\n\t\t\t\"promsStructure\": {\n\t\t\t\t\"structure\": {\n\t\t\t\t\t\"_id\" : <prom id>,\n\t\t\t\t\t\"relatedTo\" : <prom id related>,\n\t\t\t\t\t\"width\" : \"12\",\n\t\t\t\t\t\"periodicity\" : 1,\n\t\t\t\t\t\"order\" : 2,\n\t\t\t\t\t\"section\" : <section id>,\n\t\t\t\t\t\"question\" : \"I don’t know\",\n\t\t\t\t\t\"responseType\" : \"Toogle\",\n\t\t\t\t\t\"name\" : \"PI don’t know\",\n\t\t\t\t\t\"enabled\" : true,\n\t\t\t\t\t\"isRequired\" : false,\n\t\t\t\t\t\"values\" : [ ],\n\t\t\t\t\t\"marginTop\" : false,\n\t\t\t\t\t\"hideQuestion\" : false,\n\t\t\t\t\t\"__v\" : 0\n\t\t\t\t},\n\t\t\t\t\"data\": true\n\t\t\t}\n\t\t}\n]",
          "type": "json"
        }
      ]
    },
    "filename": "controllers/user/patient/patient-prom.js",
    "groupTitle": "Datapoints"
  },
  {
    "type": "post",
    "url": "https://health29.org/api/proms/",
    "title": "Save or update patient proms",
    "name": "saveProms",
    "description": "<p>This method save or update the proms answers of the patient: patient proms</p>",
    "group": "Datapoints",
    "version": "1.0.0",
    "examples": [
      {
        "title": "Example usage:",
        "content": "var patientId = <patientId>\nvar patientPromList = <list patient prom>\nthis.http.post('https://health29.org/api/proms/'+patientId,patientPromList)\n .subscribe( (res : any) => {\n   console.log('Update patient prom ok');\n  }, (err) => {\n   ...\n  }",
        "type": "js"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Users unique access-key. For this, go to  <a href=\"#api-Access_token-signIn\">Get token</a></p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n  \"authorization\": \"Bearer eyJ0eXAiOiJKV1QiLCJhbGciPgDIUzI1NiJ9.eyJzdWIiOiI1M2ZlYWQ3YjY1YjM0ZTQ0MGE4YzRhNmUyMzVhNDFjNjEyOThiMWZjYTZjMjXkZTUxMTA9OGVkN2NlODMxYWY3IiwiaWF0IjoxNTIwMzUzMDMwLCJlcHAiOjE1NTE4ODkwMzAsInJvbGUiOiJVc2VyIiwiZ3JvdDEiOiJEdWNoZW5uZSBQYXJlbnQgUHJfrmVjdCBOZXRoZXJsYW5kcyJ9.MloW8eeJ857FY7-vwxJaMDajFmmVStGDcnfHfGJx05k\"\n}",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "patientId",
            "description": "<p>The patient unique id</p>"
          }
        ],
        "body": [
          {
            "group": "body",
            "type": "String",
            "optional": true,
            "field": "relatedTo",
            "description": "<p>Prom unique ID, which the one is related to.</p>"
          },
          {
            "group": "body",
            "type": "String",
            "optional": false,
            "field": "width",
            "description": "<p>Prom size.</p>"
          },
          {
            "group": "body",
            "type": "Number",
            "optional": false,
            "field": "periodicity",
            "description": "<p>Prom periodicity.</p>"
          },
          {
            "group": "body",
            "type": "Number",
            "optional": false,
            "field": "order",
            "description": "<p>Prom order in the section.</p>"
          },
          {
            "group": "body",
            "type": "String",
            "optional": false,
            "field": "section",
            "description": "<p>Section thath the prom belogs to, unique ID.</p>"
          },
          {
            "group": "body",
            "type": "String",
            "optional": false,
            "field": "question",
            "description": "<p>Prom text.</p>"
          },
          {
            "group": "body",
            "type": "String",
            "optional": false,
            "field": "responseType",
            "description": "<p>&quot;Text&quot;,&quot;Number&quot;,&quot;Date&quot;,&quot;Time&quot;,&quot;Toogle&quot;,&quot;Choise&quot;,&quot;ChoiseSet&quot;.</p>"
          },
          {
            "group": "body",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Prom text identifier.</p>"
          },
          {
            "group": "body",
            "type": "String",
            "optional": false,
            "field": "enabled",
            "description": "<p>If prom is or not visible in Health29 platform.</p>"
          },
          {
            "group": "body",
            "type": "String",
            "optional": true,
            "field": "isRequired",
            "description": "<p>If prom is requiered by others.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "Returns",
            "description": "<p>a message with the information of the execution.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n\t{\n\t\t\"message\": 'Proms saved'\n\t}",
          "type": "json"
        }
      ]
    },
    "filename": "controllers/user/patient/patient-prom.js",
    "groupTitle": "Datapoints"
  },
  {
    "type": "delete",
    "url": "https://health29.org/api/clinicaltrial/:clinicalTrialId",
    "title": "Delete Genotype",
    "name": "deleteGenotype",
    "description": "<p>This method deletes a Genotype of a patient</p>",
    "group": "Genotype",
    "version": "1.0.0",
    "examples": [
      {
        "title": "Example usage:",
        "content": "this.http.delete('https://health29.org/api/genotypes/'+genotypeId)\n .subscribe( (res : any) => {\n   console.log('Delete Genotype ok');\n  }, (err) => {\n   ...\n  }",
        "type": "js"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Users unique access-key. For this, go to  <a href=\"#api-Access_token-signIn\">Get token</a></p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n  \"authorization\": \"Bearer eyJ0eXAiOiJKV1QiLCJhbGciPgDIUzI1NiJ9.eyJzdWIiOiI1M2ZlYWQ3YjY1YjM0ZTQ0MGE4YzRhNmUyMzVhNDFjNjEyOThiMWZjYTZjMjXkZTUxMTA9OGVkN2NlODMxYWY3IiwiaWF0IjoxNTIwMzUzMDMwLCJlcHAiOjE1NTE4ODkwMzAsInJvbGUiOiJVc2VyIiwiZ3JvdDEiOiJEdWNoZW5uZSBQYXJlbnQgUHJfrmVjdCBOZXRoZXJsYW5kcyJ9.MloW8eeJ857FY7-vwxJaMDajFmmVStGDcnfHfGJx05k\"\n}",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "genotypeId",
            "description": "<p>Genotype unique ID.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>If the clinicaltrial has been deleted correctly, it returns the message 'The genotype has been eliminated'.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n\t\tmessage: \"The genotype has been eliminated\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "controllers/user/patient/genotype.js",
    "groupTitle": "Genotype"
  },
  {
    "type": "get",
    "url": "https://health29.org/api/genotypes/:patientId",
    "title": "Get genotype",
    "name": "getGenotype",
    "description": "<p>This method read Genotype of a patient</p>",
    "group": "Genotype",
    "version": "1.0.0",
    "examples": [
      {
        "title": "Example usage:",
        "content": "this.http.get('https://health29.org/api/genotypes/'+patientId)\n .subscribe( (res : any) => {\n   console.log('genotype: '+ res.genotype);\n  }, (err) => {\n   ...\n  }",
        "type": "js"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Users unique access-key. For this, go to  <a href=\"#api-Access_token-signIn\">Get token</a></p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n  \"authorization\": \"Bearer eyJ0eXAiOiJKV1QiLCJhbGciPgDIUzI1NiJ9.eyJzdWIiOiI1M2ZlYWQ3YjY1YjM0ZTQ0MGE4YzRhNmUyMzVhNDFjNjEyOThiMWZjYTZjMjXkZTUxMTA9OGVkN2NlODMxYWY3IiwiaWF0IjoxNTIwMzUzMDMwLCJlcHAiOjE1NTE4ODkwMzAsInJvbGUiOiJVc2VyIiwiZ3JvdDEiOiJEdWNoZW5uZSBQYXJlbnQgUHJfrmVjdCBOZXRoZXJsYW5kcyJ9.MloW8eeJ857FY7-vwxJaMDajFmmVStGDcnfHfGJx05k\"\n}",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "patientId",
            "description": "<p>Patient unique ID. More info here:  <a href=\"#api-Patients-getPatientsUser\">Get patientId</a></p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "_id",
            "description": "<p>Genotype unique ID.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>Patient's genotype. For each variant, you set the gene, mutation, codingsequencechange, aminoacidchange, isoform, and genomiccoordinates</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "date",
            "description": "<p>Date on which the diagnosis was saved.</p>"
          }
        ],
        "Success 202": [
          {
            "group": "Success 202",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>If there is no genotype for the patient, it will return: &quot;There are no genotype&quot;</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\"genotype\":\n  {\n    \"_id\":\"5a6f4b83f440d806744f3ef6\",\n    \"data\":[\n      {\"gen\":\"DMD\",\"mutation\":\"deletion\", \"codingsequencechange\":\"\", \"aminoacidchange\":\"\", \"isoform\":\"\", \"genomiccoordinates\":\"\"}\n    ],\n   \"date\":\"2018-02-27T17:55:48.261Z\"\n  }\n}\n\nHTTP/1.1 202 OK\n{message: 'There are no genotype'}",
          "type": "json"
        }
      ]
    },
    "filename": "controllers/user/patient/genotype.js",
    "groupTitle": "Genotype"
  },
  {
    "type": "post",
    "url": "https://health29.org/api/Genotypes/:patientId",
    "title": "New genotype",
    "name": "saveGenotype",
    "description": "<p>This method create a genotype of a patient</p>",
    "group": "Genotype",
    "version": "1.0.0",
    "examples": [
      {
        "title": "Example usage:",
        "content": "var genotype = {data: [{\"gen\":\"DMD\",\"mutation\":\"deletion\", \"codingsequencechange\":\"\", \"aminoacidchange\":\"\", \"isoform\":\"\", \"genomiccoordinates\":\"\"}]};\nthis.http.post('https://health29.org/api/genotypes/'+patientId, genotype)\n .subscribe( (res : any) => {\n   console.log('genotype: '+ res.genotype);\n  }, (err) => {\n   ...\n  }",
        "type": "js"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Users unique access-key. For this, go to  <a href=\"#api-Access_token-signIn\">Get token</a></p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n  \"authorization\": \"Bearer eyJ0eXAiOiJKV1QiLCJhbGciPgDIUzI1NiJ9.eyJzdWIiOiI1M2ZlYWQ3YjY1YjM0ZTQ0MGE4YzRhNmUyMzVhNDFjNjEyOThiMWZjYTZjMjXkZTUxMTA9OGVkN2NlODMxYWY3IiwiaWF0IjoxNTIwMzUzMDMwLCJlcHAiOjE1NTE4ODkwMzAsInJvbGUiOiJVc2VyIiwiZ3JvdDEiOiJEdWNoZW5uZSBQYXJlbnQgUHJfrmVjdCBOZXRoZXJsYW5kcyJ9.MloW8eeJ857FY7-vwxJaMDajFmmVStGDcnfHfGJx05k\"\n}",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "patientId",
            "description": "<p>Patient unique ID. More info here:  <a href=\"#api-Patients-getPatientsUser\">Get patientId</a></p>"
          }
        ],
        "body": [
          {
            "group": "body",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>Patient's genotype. For each variant, you set the gene, mutation, codingsequencechange, aminoacidchange, isoform, and genomiccoordinates</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "_id",
            "description": "<p>Genotype unique ID.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>Patient's genotype. For each variant, you set the gene, mutation, codingsequencechange, aminoacidchange, isoform, and genomiccoordinates</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "date",
            "description": "<p>Date on which the diagnosis was saved.</p>"
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "validated",
            "description": "<p>If the genotype is validated by a clinician, it will be true.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>If the genotype has been created correctly, it returns the message 'Genotype created'.</p>"
          }
        ],
        "Success 202": [
          {
            "group": "Success 202",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>If there is no genotype for the patient, it will return: &quot;There are no genotype&quot;</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\"genotype\":\n  {\n    \"_id\":\"5a6f4b83f440d806744f3ef6\",\n    \"data\":[\n      {\"gen\":\"DMD\",\"mutation\":\"deletion\", \"codingsequencechange\":\"\", \"aminoacidchange\":\"\", \"isoform\":\"\", \"genomiccoordinates\":\"\"}\n    ],\n   \"date\":\"2018-02-27T17:55:48.261Z\"\n  },\nmessage: \"Genotype created\"\n}\n\nHTTP/1.1 202 OK\n{message: 'There are no genotype'}",
          "type": "json"
        }
      ]
    },
    "filename": "controllers/user/patient/genotype.js",
    "groupTitle": "Genotype"
  },
  {
    "type": "put",
    "url": "https://health29.org/api/genotypes/:genotypeId",
    "title": "Update genotype",
    "name": "updateGenotype",
    "description": "<p>This method update the genotype of a patient</p>",
    "group": "Genotype",
    "version": "1.0.0",
    "examples": [
      {
        "title": "Example usage:",
        "content": "var genotype = {data: [{\"gen\":\"DMD\",\"mutation\":\"deletion\", \"codingsequencechange\":\"\", \"aminoacidchange\":\"\", \"isoform\":\"\", \"genomiccoordinates\":\"\"}]};\nthis.http.put('https://health29.org/api/genotypes/'+genotypeId, genotype)\n .subscribe( (res : any) => {\n   console.log('genotype: '+ res.genotype);\n  }, (err) => {\n   ...\n  }",
        "type": "js"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Users unique access-key. For this, go to  <a href=\"#api-Access_token-signIn\">Get token</a></p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n  \"authorization\": \"Bearer eyJ0eXAiOiJKV1QiLCJhbGciPgDIUzI1NiJ9.eyJzdWIiOiI1M2ZlYWQ3YjY1YjM0ZTQ0MGE4YzRhNmUyMzVhNDFjNjEyOThiMWZjYTZjMjXkZTUxMTA9OGVkN2NlODMxYWY3IiwiaWF0IjoxNTIwMzUzMDMwLCJlcHAiOjE1NTE4ODkwMzAsInJvbGUiOiJVc2VyIiwiZ3JvdDEiOiJEdWNoZW5uZSBQYXJlbnQgUHJfrmVjdCBOZXRoZXJsYW5kcyJ9.MloW8eeJ857FY7-vwxJaMDajFmmVStGDcnfHfGJx05k\"\n}",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "genotypeId",
            "description": "<p>Genotype unique ID. More info here:  <a href=\"#api-Genotype-getGenotype\">Get genotypeId</a></p>"
          }
        ],
        "body": [
          {
            "group": "body",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>Patient's genotype. For each variant, you set the gene, mutation, codingsequencechange, aminoacidchange, isoform, and genomiccoordinates</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "_id",
            "description": "<p>Genotype unique ID.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>Patient's phenotype. For each variant, you set the gene, mutation, codingsequencechange, aminoacidchange, isoform, and genomiccoordinates</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "date",
            "description": "<p>Date on which the diagnosis was saved.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>If the genotype has been updated correctly, it returns the message 'Genotype updated'.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\"genotype\":\n  {\n    \"_id\":\"5a6f4b83f440d806744f3ef6\",\n    \"data\":[\n      {\"gen\":\"DMD\",\"mutation\":\"deletion\", \"codingsequencechange\":\"\", \"aminoacidchange\":\"\", \"isoform\":\"\", \"genomiccoordinates\":\"\"}\n    ],\n   \"date\":\"2018-02-27T17:55:48.261Z\",\n   \"validated\":false\n  },\nmessage: \"Genotype updated\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "controllers/user/patient/genotype.js",
    "groupTitle": "Genotype"
  },
  {
    "type": "get",
    "url": "https://health29.org/api/group/",
    "title": "Get specific group information",
    "name": "getGroup",
    "description": "<p>This method return the information of one group of health29.</p>",
    "group": "Groups",
    "version": "1.0.0",
    "examples": [
      {
        "title": "Example usage:",
        "content": "var groupName = \"GroupName\"\nthis.http.get('https://health29.org/api/group/'+groupName)\n .subscribe( (res : any) => {\n   console.log('result Ok');\n  }, (err) => {\n   ...\n  }",
        "type": "js"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Users unique access-key. For this, go to  <a href=\"#api-Access_token-signIn\">Get token</a></p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n  \"authorization\": \"Bearer eyJ0eXAiOiJKV1QiLCJhbGciPgDIUzI1NiJ9.eyJzdWIiOiI1M2ZlYWQ3YjY1YjM0ZTQ0MGE4YzRhNmUyMzVhNDFjNjEyOThiMWZjYTZjMjXkZTUxMTA9OGVkN2NlODMxYWY3IiwiaWF0IjoxNTIwMzUzMDMwLCJlcHAiOjE1NTE4ODkwMzAsInJvbGUiOiJVc2VyIiwiZ3JvdDEiOiJEdWNoZW5uZSBQYXJlbnQgUHJfrmVjdCBOZXRoZXJsYW5kcyJ9.MloW8eeJ857FY7-vwxJaMDajFmmVStGDcnfHfGJx05k\"\n}",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "groupName",
            "description": "<p>The name of the group of patients. More info here:  <a href=\"#api-Groups-getGroupsNames\">Get groupName</a></p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "_id",
            "description": "<p>Group unique ID.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Group admin email address</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "subscription",
            "description": "<p>Type of subscription of the group in Health29</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Group name.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "medications",
            "description": "<p>Group medications.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "phenotype",
            "description": "<p>Group symptoms.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "defaultLang",
            "description": "<p>Group default lang.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n\t  \"_id\" : <id>,\n\t  \"email\" : <admin_email>,\n\t  \"subscription\" : \"Premium\",\n\t  \"name\" : \"GroupName\",\n \t\"medications\" : [ {\n\t\t  \"drugs\" : [\n\t\t\t  {\n\t\t\t\t  \"drugsSideEffects\" : [\n\t\t\t\t\t  \"Cushingoid\",\n\t\t\t\t\t  \"Weight gain\",\n\t\t\t\t\t  \"Growth stunting\",\n\t\t\t\t\t  \"Delayed puberty\",\n\t\t\t\t  \t\"Mood changes\",\n\t\t\t\t  \t\"Fungal infections\",\n\t\t\t  \t\t\"Other dermatologic complications\",\n\t\t\t\t  \t\"Cataract\",\n\t\t\t\t  \t\"Adrenal surpression\",\n\t\t\t\t  \t\"Bone density\"\n\t\t\t  \t],\n\t\t\t  \t\"translations\" : [\n\t\t\t\t\t  {\n\t\t\t\t\t  \t\"name\" : \"Prednisolone\",\n\t\t\t\t\t  \t\"code\" : \"en\"\n\t\t\t\t\t  },\n\t\t\t\t\t  {\n\t\t\t\t\t  \t\"name\" : \"Prednisolone\",\n\t\t\t\t\t  \t\"code\" : \"es\"\n\t\t\t\t  \t},\n\t\t\t\t  \t{\n\t\t\t\t\t  \t\"name\" : \"Corticosteroïden - Prednison\",\n\t\t\t\t\t\t  \"code\" : \"nl\"\n\t\t\t\t\t  }\n\t\t\t\t  ],\n\t\t\t\t  \"name\" : \"Prednisolone\"\n\t\t\t  }\n     ]\n\t\t  \"sideEffects\" : [\n\t\t\t  {\n\t\t\t\t  \"translationssideEffect\" : [\n\t\t\t\t  \t{\n\t\t\t\t\t\t  \"name\" : \"Bone density\",\n\t\t\t\t\t\t  \"code\" : \"en\"\n\t\t\t\t\t  },\n\t\t\t\t\t  {\n\t\t\t\t\t  \t\"name\" : \"Bone density\",\n\t\t\t\t\t\t  \"code\" : \"es\"\n\t\t\t\t\t  },\n\t\t\t\t\t  {\n\t\t\t\t\t\t  \"name\" : \"Botdichtheid\",\n\t\t\t\t\t\t  \"code\" : \"nl\"\n\t\t\t\t\t  }\n\t\t\t\t  ],\n\t\t\t\t  \"name\" : \"Bone density\"\n\t\t\t  }\n\t\t  ],\n\t\t  \"adverseEffects\" : [ ]\n\t  ],\n\t  \"phenotype\" : [\n\t\t  {\n\t\t\t  \"id\" : \"HP:0001250\",\n\t\t\t  \"name\" : \"seizures\"\n\t\t  }\n\t  ],\n\t  \"__v\" : 0,\n\t  \"defaultLang\" : \"es\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "controllers/all/group.js",
    "groupTitle": "Groups"
  },
  {
    "type": "get",
    "url": "https://health29.org/api/groupadmin/",
    "title": "Get administrator email",
    "name": "getGroupAdmin",
    "description": "<p>This method return the email of the administrator of the group.</p>",
    "group": "Groups",
    "version": "1.0.0",
    "examples": [
      {
        "title": "Example usage:",
        "content": "var groupName = <groupName>\nthis.http.get('https://health29.org/api/groupadmin/'+groupName)\n .subscribe( (res : any) => {\n   console.log('Get the email of the administrator of the group ok');\n  }, (err) => {\n   ...\n  }",
        "type": "js"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Users unique access-key. For this, go to  <a href=\"#api-Access_token-signIn\">Get token</a></p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n  \"authorization\": \"Bearer eyJ0eXAiOiJKV1QiLCJhbGciPgDIUzI1NiJ9.eyJzdWIiOiI1M2ZlYWQ3YjY1YjM0ZTQ0MGE4YzRhNmUyMzVhNDFjNjEyOThiMWZjYTZjMjXkZTUxMTA9OGVkN2NlODMxYWY3IiwiaWF0IjoxNTIwMzUzMDMwLCJlcHAiOjE1NTE4ODkwMzAsInJvbGUiOiJVc2VyIiwiZ3JvdDEiOiJEdWNoZW5uZSBQYXJlbnQgUHJfrmVjdCBOZXRoZXJsYW5kcyJ9.MloW8eeJ857FY7-vwxJaMDajFmmVStGDcnfHfGJx05k\"\n}",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "groupName",
            "description": "<p>The name of the group.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n  {\n    \"email\":<admin email>\n  }",
          "type": "json"
        }
      ]
    },
    "filename": "controllers/all/group.js",
    "groupTitle": "Groups"
  },
  {
    "type": "get",
    "url": "https://health29.org/api/groups/",
    "title": "Get groups",
    "name": "getGroups",
    "description": "<p>This method return the groups of health29. you get a list of groups, and for each one you have: name, and the symptoms associated with the group.</p>",
    "group": "Groups",
    "version": "1.0.0",
    "examples": [
      {
        "title": "Example usage:",
        "content": "this.http.get('https://health29.org/api/groups)\n .subscribe( (res : any) => {\n   console.log('groups: '+ res.groups);\n  }, (err) => {\n   ...\n  }",
        "type": "js"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n[\n  {\n    \"name\":\"Duchenne Parent Project Netherlands\",\n    \"data\":[\n      {\"id\":\"HP:0100543\",\"name\":\"Cognitive impairment\"},\n      {\"id\":\"HP:0002376\",\"name\":\"Developmental regression\"}\n    ]\n  },\n  {\n    \"name\":\"None\",\n    \"data\":[]\n  }\n]",
          "type": "json"
        }
      ]
    },
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Users unique access-key. For this, go to  <a href=\"#api-Access_token-signIn\">Get token</a></p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n  \"authorization\": \"Bearer eyJ0eXAiOiJKV1QiLCJhbGciPgDIUzI1NiJ9.eyJzdWIiOiI1M2ZlYWQ3YjY1YjM0ZTQ0MGE4YzRhNmUyMzVhNDFjNjEyOThiMWZjYTZjMjXkZTUxMTA9OGVkN2NlODMxYWY3IiwiaWF0IjoxNTIwMzUzMDMwLCJlcHAiOjE1NTE4ODkwMzAsInJvbGUiOiJVc2VyIiwiZ3JvdDEiOiJEdWNoZW5uZSBQYXJlbnQgUHJfrmVjdCBOZXRoZXJsYW5kcyJ9.MloW8eeJ857FY7-vwxJaMDajFmmVStGDcnfHfGJx05k\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "controllers/all/group.js",
    "groupTitle": "Groups"
  },
  {
    "type": "get",
    "url": "https://health29.org/api/groupsnames/",
    "title": "Get groups names",
    "name": "getGroupsNames",
    "description": "<p>This method return the groups of health29. you get a list of groups, and for each one you have the name.</p>",
    "group": "Groups",
    "version": "1.0.0",
    "examples": [
      {
        "title": "Example usage:",
        "content": "this.http.get('https://health29.org/api/groupsnames)\n .subscribe( (res : any) => {\n   console.log('groups: '+ res.groups);\n  }, (err) => {\n   ...\n  }",
        "type": "js"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n[\n  {\n    \"name\":\"Duchenne Parent Project Netherlands\"\n  },\n  {\n    \"name\":\"None\"\n  }\n]",
          "type": "json"
        }
      ]
    },
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Users unique access-key. For this, go to  <a href=\"#api-Access_token-signIn\">Get token</a></p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n  \"authorization\": \"Bearer eyJ0eXAiOiJKV1QiLCJhbGciPgDIUzI1NiJ9.eyJzdWIiOiI1M2ZlYWQ3YjY1YjM0ZTQ0MGE4YzRhNmUyMzVhNDFjNjEyOThiMWZjYTZjMjXkZTUxMTA9OGVkN2NlODMxYWY3IiwiaWF0IjoxNTIwMzUzMDMwLCJlcHAiOjE1NTE4ODkwMzAsInJvbGUiOiJVc2VyIiwiZ3JvdDEiOiJEdWNoZW5uZSBQYXJlbnQgUHJfrmVjdCBOZXRoZXJsYW5kcyJ9.MloW8eeJ857FY7-vwxJaMDajFmmVStGDcnfHfGJx05k\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "controllers/all/group.js",
    "groupTitle": "Groups"
  },
  {
    "type": "get",
    "url": "https://health29.org/api/group/medications/:groupName",
    "title": "Get medications",
    "name": "getMedicationsGroup",
    "description": "<p>This method return the medications associated with a group</p>",
    "group": "Groups",
    "version": "1.0.0",
    "examples": [
      {
        "title": "Example usage:",
        "content": "this.http.get('https://health29.org/group/medications/'+\"None\")\n .subscribe( (res : any) => {\n   console.log('Get medications ok ');\n  }, (err) => {\n   ...\n  }",
        "type": "js"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Users unique access-key. For this, go to  <a href=\"#api-Access_token-signIn\">Get token</a></p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n  \"authorization\": \"Bearer eyJ0eXAiOiJKV1QiLCJhbGciPgDIUzI1NiJ9.eyJzdWIiOiI1M2ZlYWQ3YjY1YjM0ZTQ0MGE4YzRhNmUyMzVhNDFjNjEyOThiMWZjYTZjMjXkZTUxMTA9OGVkN2NlODMxYWY3IiwiaWF0IjoxNTIwMzUzMDMwLCJlcHAiOjE1NTE4ODkwMzAsInJvbGUiOiJVc2VyIiwiZ3JvdDEiOiJEdWNoZW5uZSBQYXJlbnQgUHJfrmVjdCBOZXRoZXJsYW5kcyJ9.MloW8eeJ857FY7-vwxJaMDajFmmVStGDcnfHfGJx05k\"\n}",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "groupName",
            "description": "<p>The name of a group.  More info here:  <a href=\"doc/#api-Groups-getGroupsNames\">Get groupName</a></p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "medications",
            "description": "<p>An object with the information abour the medications associated with the group of patients.</p>"
          }
        ],
        "Success 202": [
          {
            "group": "Success 202",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>If there is group name, it will return: &quot;The group does not exist&quot;</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n {\"data\":\n   {\n\t\t  \"drugs\" : [\n\t\t\t  {\n\t\t\t\t  \"drugsSideEffects\" : [\n\t\t\t\t\t  \"Cushingoid\",\n\t\t\t\t\t  \"Weight gain\",\n\t\t\t\t\t  \"Growth stunting\",\n\t\t\t\t\t  \"Delayed puberty\",\n\t\t\t\t  \t\"Mood changes\",\n\t\t\t\t  \t\"Fungal infections\",\n\t\t\t  \t\t\"Other dermatologic complications\",\n\t\t\t\t  \t\"Cataract\",\n\t\t\t\t  \t\"Adrenal surpression\",\n\t\t\t\t  \t\"Bone density\"\n\t\t\t  \t],\n\t\t\t  \t\"translations\" : [\n\t\t\t\t\t  {\n\t\t\t\t\t  \t\"name\" : \"Prednisolone\",\n\t\t\t\t\t  \t\"code\" : \"en\"\n\t\t\t\t\t  },\n\t\t\t\t\t  {\n\t\t\t\t\t  \t\"name\" : \"Prednisolone\",\n\t\t\t\t\t  \t\"code\" : \"es\"\n\t\t\t\t  \t},\n\t\t\t\t  \t{\n\t\t\t\t\t  \t\"name\" : \"Corticosteroïden - Prednison\",\n\t\t\t\t\t\t  \"code\" : \"nl\"\n\t\t\t\t\t  }\n\t\t\t\t  ],\n\t\t\t\t  \"name\" : \"Prednisolone\"\n\t\t\t  }\n     ]\n\t\t  \"sideEffects\" : [\n\t\t\t  {\n\t\t\t\t  \"translationssideEffect\" : [\n\t\t\t\t  \t{\n\t\t\t\t\t\t  \"name\" : \"Bone density\",\n\t\t\t\t\t\t  \"code\" : \"en\"\n\t\t\t\t\t  },\n\t\t\t\t\t  {\n\t\t\t\t\t  \t\"name\" : \"Bone density\",\n\t\t\t\t\t\t  \"code\" : \"es\"\n\t\t\t\t\t  },\n\t\t\t\t\t  {\n\t\t\t\t\t\t  \"name\" : \"Botdichtheid\",\n\t\t\t\t\t\t  \"code\" : \"nl\"\n\t\t\t\t\t  }\n\t\t\t\t  ],\n\t\t\t\t  \"name\" : \"Bone density\"\n\t\t\t  }\n\t\t  ],\n\t\t  \"adverseEffects\" : [ ]\n\t  ]\n }\n}\n\nHTTP/1.1 202 OK\n{message: 'The group does not exist'}",
          "type": "json"
        }
      ]
    },
    "filename": "controllers/all/group.js",
    "groupTitle": "Groups"
  },
  {
    "type": "get",
    "url": "https://health29.org/api/group/phenotype/:groupName",
    "title": "Get phenotype",
    "name": "getPhenotypeGroup",
    "description": "<p>This method return the phenotype associated with a group</p>",
    "group": "Groups",
    "version": "1.0.0",
    "examples": [
      {
        "title": "Example usage:",
        "content": "this.http.get('https://health29.org/group/phenotype/'+\"None\")\n .subscribe( (res : any) => {\n   console.log('Phenotype info: '+ res.infoPhenotype.data);\n  }, (err) => {\n   ...\n  }",
        "type": "js"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Users unique access-key. For this, go to  <a href=\"#api-Access_token-signIn\">Get token</a></p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n  \"authorization\": \"Bearer eyJ0eXAiOiJKV1QiLCJhbGciPgDIUzI1NiJ9.eyJzdWIiOiI1M2ZlYWQ3YjY1YjM0ZTQ0MGE4YzRhNmUyMzVhNDFjNjEyOThiMWZjYTZjMjXkZTUxMTA9OGVkN2NlODMxYWY3IiwiaWF0IjoxNTIwMzUzMDMwLCJlcHAiOjE1NTE4ODkwMzAsInJvbGUiOiJVc2VyIiwiZ3JvdDEiOiJEdWNoZW5uZSBQYXJlbnQgUHJfrmVjdCBOZXRoZXJsYW5kcyJ9.MloW8eeJ857FY7-vwxJaMDajFmmVStGDcnfHfGJx05k\"\n}",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "groupName",
            "description": "<p>The name of a group.  More info here:  <a href=\"doc/#api-Groups-getGroupsNames\">Get groupName</a></p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "infoPhenotype",
            "description": "<p>The symptoms associated with the group. For each symptom, you get the <a href=\"https://en.wikipedia.org/wiki/Human_Phenotype_Ontology\" target=\"_blank\">HPO</a> and the name</p>"
          }
        ],
        "Success 202": [
          {
            "group": "Success 202",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>If there is group name, it will return: &quot;The group does not exist&quot;</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\"infoPhenotype\":\n {\"data\":\n   [\n     {\"name\":\"Cognitive impairment\",\"id\":\"HP:0100543\"},{\"name\":\"Developmental regression\",\"id\":\"HP:0002376\"}\n   ]\n }\n}\n\nHTTP/1.1 202 OK\n{message: 'The group does not exist'}",
          "type": "json"
        }
      ]
    },
    "filename": "controllers/all/group.js",
    "groupTitle": "Groups"
  },
  {
    "type": "get",
    "url": "https://health29.org/api/group/proms/:groupId",
    "title": "Get Proms Group",
    "name": "getPromSectionGroup",
    "description": "<p>This method return the proms of a group</p>",
    "group": "Groups",
    "version": "1.0.0",
    "examples": [
      {
        "title": "Example usage:",
        "content": "this.http.get('https://health29.org/api/group/proms/'+groupId)\n .subscribe( (res : any) => {\n   console.log('proms: '+ res);\n  }, (err) => {\n   ...\n  }",
        "type": "js"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Users unique access-key. For this, go to  <a href=\"#api-Access_token-signIn\">Get token</a></p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n  \"authorization\": \"Bearer eyJ0eXAiOiJKV1QiLCJhbGciPgDIUzI1NiJ9.eyJzdWIiOiI1M2ZlYWQ3YjY1YjM0ZTQ0MGE4YzRhNmUyMzVhNDFjNjEyOThiMWZjYTZjMjXkZTUxMTA9OGVkN2NlODMxYWY3IiwiaWF0IjoxNTIwMzUzMDMwLCJlcHAiOjE1NTE4ODkwMzAsInJvbGUiOiJVc2VyIiwiZ3JvdDEiOiJEdWNoZW5uZSBQYXJlbnQgUHJfrmVjdCBOZXRoZXJsYW5kcyJ9.MloW8eeJ857FY7-vwxJaMDajFmmVStGDcnfHfGJx05k\"\n}",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "groupId",
            "description": "<p>The name of the group of patients. More info here:  <a href=\"#api-Groups-getGroupsNames\">Get groupName</a></p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "_id",
            "description": "<p>Prom unique ID.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": ""
          },
          {
            "group": "Success 200",
            "type": "string",
            "allowedValues": [
              "\"Text\"",
              "\"Number\"",
              "\"Date\"",
              "\"Time\"",
              "\"Toogle\"",
              "\"Choise\"",
              "\"ChoiseSet\""
            ],
            "optional": false,
            "field": "responseType",
            "description": ""
          },
          {
            "group": "Success 200",
            "type": "string",
            "optional": false,
            "field": "question",
            "description": ""
          },
          {
            "group": "Success 200",
            "type": "String[]",
            "optional": false,
            "field": "values",
            "description": ""
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "section",
            "description": ""
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "order",
            "description": ""
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "periodicity",
            "description": ""
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "isRequired",
            "description": ""
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "enabled",
            "description": ""
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n[\n  {\n    \"_id\":\"5a6f4b83f660d806744f3ef6\",\n    \"name\":\"\",\n    \"responseType\":\"\",\n    \"question\":\"\",\n    \"values\":[],\n    \"section\":\"\",\n    \"order\":2,\n    \"periodicity\":7,\n    \"isRequired\": false,\n    \"enabled\": false\n  },\n {...}\n]",
          "type": "json"
        }
      ]
    },
    "filename": "controllers/all/group/prom.js",
    "groupTitle": "Groups"
  },
  {
    "type": "get",
    "url": "https://health29.org/api/group/proms",
    "title": "Get the proms of a section",
    "name": "getPromsSectionGroup",
    "description": "<p>This method return the proms of an specific section</p>",
    "group": "Groups",
    "version": "1.0.0",
    "examples": [
      {
        "title": "Example usage:",
        "content": "var sectionId = <sectionId>\nthis.http.get('https://health29.org/api/group/proms'+sectionId)\n .subscribe( (res : any) => {\n   console.log('Get proms from <sectionId> ok');\n  }, (err) => {\n   ...\n  }",
        "type": "js"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Users unique access-key. For this, go to  <a href=\"#api-Access_token-signIn\">Get token</a></p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n  \"authorization\": \"Bearer eyJ0eXAiOiJKV1QiLCJhbGciPgDIUzI1NiJ9.eyJzdWIiOiI1M2ZlYWQ3YjY1YjM0ZTQ0MGE4YzRhNmUyMzVhNDFjNjEyOThiMWZjYTZjMjXkZTUxMTA9OGVkN2NlODMxYWY3IiwiaWF0IjoxNTIwMzUzMDMwLCJlcHAiOjE1NTE4ODkwMzAsInJvbGUiOiJVc2VyIiwiZ3JvdDEiOiJEdWNoZW5uZSBQYXJlbnQgUHJfrmVjdCBOZXRoZXJsYW5kcyJ9.MloW8eeJ857FY7-vwxJaMDajFmmVStGDcnfHfGJx05k\"\n}",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "sectionId",
            "description": "<p>The section unique id</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "Result",
            "description": "<p>Result Returns a list of proms objects.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n[\n\t\t{\n\t\t\t\"_id\" : <prom id>,\n\t\t\t\"relatedTo\" : <prom id related>,\n\t\t\t\"width\" : \"12\",\n\t\t\t\"periodicity\" : 1,\n\t\t\t\"order\" : 2,\n\t\t\t\"section\" : <section id>,\n\t\t\t\"question\" : \"I don’t know\",\n\t\t\t\"responseType\" : \"Toogle\",\n\t\t\t\"name\" : \"PI don’t know\",\n\t\t\t\"enabled\" : true,\n\t\t\t\"isRequired\" : false,\n\t\t\t\"values\" : [ ],\n\t\t\t\"marginTop\" : false,\n\t\t\t\"hideQuestion\" : false,\n\t\t\t\"__v\" : 0\n\t\t}\n]",
          "type": "json"
        }
      ]
    },
    "filename": "controllers/all/group/prom.js",
    "groupTitle": "Groups"
  },
  {
    "type": "get",
    "url": "https://health29.org/api/translationstructureproms",
    "title": "Get the translations of the proms of a group",
    "name": "getPromsStructure",
    "description": "<p>This method return the translations of the proms of a group in a specific language</p>",
    "group": "Groups",
    "version": "1.0.0",
    "examples": [
      {
        "title": "Example usage:",
        "content": "var params = <lang>-code-<groupId>\nthis.http.get('https://health29.org/api/translationstructureproms/'+params)\n .subscribe( (res : any) => {\n   console.log('Get translations of the proms of a group in a specific language ok');\n  }, (err) => {\n   ...\n  }",
        "type": "js"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "lang-code-groupId",
            "description": "<p>The language selected and group unique id</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "Result",
            "description": "<p>Result Returns a object with the translations of the proms of the group for each section of the platform in specific language.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n\t{\n\t\"lang\" : \"en\",\n\t\"data\" : [\n\t\t{\n\t\t\t\"section\" : {\n\t\t\t\t\"_id\" : <sectionId>,\n\t\t\t\t\"description\" : \"Diagnosis data for Sanfilippo patients\",\n\t\t\t\t\"name\" : \"Diagnosis\",\n\t\t\t\t\"__v\" : 0,\n\t\t\t\t\"order\" : 1,\n\t\t\t\t\"enabled\" : true\n\t\t\t},\n\t\t\t\"promsStructure\" : [\n\t\t\t\t{\n\t\t\t\t\t\"data\" : [ ],\n\t\t\t\t\t\"structure\" : {\n\t\t\t\t\t\t\"_id\" : <promId>,\n\t\t\t\t\t\t\"disableDataPoints\" : null,\n\t\t\t\t\t\t\"relatedTo\" : null,\n\t\t\t\t\t\t\"width\" : \"6\",\n\t\t\t\t\t\t\"periodicity\" : 1,\n\t\t\t\t\t\t\"order\" : 2,\n\t\t\t\t\t\t\"section\" : <sectionId>,\n\t\t\t\t\t\t\"question\" : \"Diagnosis\",\n\t\t\t\t\t\t\"responseType\" : \"RadioButtons\",\n\t\t\t\t\t\t\"name\" : \"Diagnosis\",\n\t\t\t\t\t\t\"__v\" : 0,\n\t\t\t\t\t\t\"enabled\" : true,\n\t\t\t\t\t\t\"isRequired\" : false,\n\t\t\t\t\t\t\"values\" : [\n\t\t\t\t\t\t\t{\n\t\t\t\t\t\t\t\t\"original\" : \"MPS III - type A\",\n\t\t\t\t\t\t\t\t\"translation\" : \"MPS III - type A\"\n\t\t\t\t\t\t\t},\n\t\t\t\t\t\t\t{\n\t\t\t\t\t\t\t\t\"original\" : \"MPS III - type B\",\n\t\t\t\t\t\t\t\t\"translation\" : \"MPS III - type B\"\n\t\t\t\t\t\t\t},\n\t\t\t\t\t\t\t{\n\t\t\t\t\t\t\t\t\"original\" : \"MPS III - type C\",\n\t\t\t\t\t\t\t\t\"translation\" : \"MPS III - type C\"\n\t\t\t\t\t\t\t},\n\t\t\t\t\t\t\t{\n\t\t\t\t\t\t\t\t\"original\" : \"MPS III - type D\",\n\t\t\t\t\t\t\t\t\"translation\" : \"MPS III - type D\"\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t],\n\t\t\t\t\t\t\"marginTop\" : false,\n\t\t\t\t\t\t\"hideQuestion\" : true\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t],\n\t\t\t\" anchor\":\"Diagnosis\"\n\t\t}\n}",
          "type": "json"
        }
      ]
    },
    "filename": "controllers/all/group/proms-structure.js",
    "groupTitle": "Groups"
  },
  {
    "type": "get",
    "url": "https://health29.org/api/group/section/:promSectionId",
    "title": "Get Prom Section by id",
    "name": "getSection",
    "description": "<p>This method return a section of the proms of a group by identifier</p>",
    "group": "Groups",
    "version": "1.0.0",
    "examples": [
      {
        "title": "Example usage:",
        "content": "this.http.get('https://health29.org/api/group/section/'+promSectionId)\n .subscribe( (res : any) => {\n   console.log('Get section by identifier ok');\n  }, (err) => {\n   ...\n  }",
        "type": "js"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Users unique access-key. For this, go to  <a href=\"#api-Access_token-signIn\">Get token</a></p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n  \"authorization\": \"Bearer eyJ0eXAiOiJKV1QiLCJhbGciPgDIUzI1NiJ9.eyJzdWIiOiI1M2ZlYWQ3YjY1YjM0ZTQ0MGE4YzRhNmUyMzVhNDFjNjEyOThiMWZjYTZjMjXkZTUxMTA9OGVkN2NlODMxYWY3IiwiaWF0IjoxNTIwMzUzMDMwLCJlcHAiOjE1NTE4ODkwMzAsInJvbGUiOiJVc2VyIiwiZ3JvdDEiOiJEdWNoZW5uZSBQYXJlbnQgUHJfrmVjdCBOZXRoZXJsYW5kcyJ9.MloW8eeJ857FY7-vwxJaMDajFmmVStGDcnfHfGJx05k\"\n}",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "promSectionId",
            "description": "<p>The unique Id of the section of the proms of a group.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "Result",
            "description": "<p>Sections object:{&quot;_id&quot;:(section Id),&quot;description&quot;:(section description string),&quot;name&quot;:(section name string),&quot;enabled&quot;:(section visible boolean),&quot;order&quot;:(section order in platform number)}</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n  {\n    \"_id\":<section_id>,\n    \"description\":<section description>,\n    \"name\":<section name>,\n    \"enabled\":true,\n\t   \"order\":2\n  }",
          "type": "json"
        }
      ]
    },
    "filename": "controllers/user/patient/section-proms.js",
    "groupTitle": "Groups"
  },
  {
    "type": "get",
    "url": "https://health29.org/api/group/sections/:groupId",
    "title": "Get list Sections",
    "name": "getSections",
    "description": "<p>This method return the section list of the proms of a group</p>",
    "group": "Groups",
    "version": "1.0.0",
    "examples": [
      {
        "title": "Example usage:",
        "content": "var groupId = <group_id>\nthis.http.get('https://health29.org/api/group/sections/'+groupId)\n .subscribe( (res : any) => {\n   console.log('Get sections ok');\n  }, (err) => {\n   ...\n  }",
        "type": "js"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Users unique access-key. For this, go to  <a href=\"#api-Access_token-signIn\">Get token</a></p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n  \"authorization\": \"Bearer eyJ0eXAiOiJKV1QiLCJhbGciPgDIUzI1NiJ9.eyJzdWIiOiI1M2ZlYWQ3YjY1YjM0ZTQ0MGE4YzRhNmUyMzVhNDFjNjEyOThiMWZjYTZjMjXkZTUxMTA9OGVkN2NlODMxYWY3IiwiaWF0IjoxNTIwMzUzMDMwLCJlcHAiOjE1NTE4ODkwMzAsInJvbGUiOiJVc2VyIiwiZ3JvdDEiOiJEdWNoZW5uZSBQYXJlbnQgUHJfrmVjdCBOZXRoZXJsYW5kcyJ9.MloW8eeJ857FY7-vwxJaMDajFmmVStGDcnfHfGJx05k\"\n}",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "groupId",
            "description": "<p>The unique Id of the group of patients.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "Result",
            "description": "<p>List with the sections objects:{&quot;_id&quot;:(section Id),&quot;description&quot;:(section description string),&quot;name&quot;:(section name string),&quot;enabled&quot;:(section visible boolean),&quot;order&quot;:(section order in platform number)}</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n[\n  {\n    \"_id\":<section_id>,\n    \"description\":<section description>,\n    \"name\":<section name>,\n    \"enabled\":true,\n\t   \"order\":2\n  },\n {...}\n]",
          "type": "json"
        }
      ]
    },
    "filename": "controllers/user/patient/section-proms.js",
    "groupTitle": "Groups"
  },
  {
    "type": "delete",
    "url": "https://health29.org/api/height/:heightId",
    "title": "Delete height",
    "name": "deleteHeight",
    "description": "<p>This method delete Height of a patient</p>",
    "group": "Height",
    "version": "1.0.0",
    "examples": [
      {
        "title": "Example usage:",
        "content": "this.http.delete('https://health29.org/api/heights/'+heightId)\n .subscribe( (res : any) => {\n   console.log('Delete height ok');\n  }, (err) => {\n   ...\n  }",
        "type": "js"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Users unique access-key. For this, go to  <a href=\"#api-Access_token-signIn\">Get token</a></p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n  \"authorization\": \"Bearer eyJ0eXAiOiJKV1QiLCJhbGciPgDIUzI1NiJ9.eyJzdWIiOiI1M2ZlYWQ3YjY1YjM0ZTQ0MGE4YzRhNmUyMzVhNDFjNjEyOThiMWZjYTZjMjXkZTUxMTA9OGVkN2NlODMxYWY3IiwiaWF0IjoxNTIwMzUzMDMwLCJlcHAiOjE1NTE4ODkwMzAsInJvbGUiOiJVc2VyIiwiZ3JvdDEiOiJEdWNoZW5uZSBQYXJlbnQgUHJfrmVjdCBOZXRoZXJsYW5kcyJ9.MloW8eeJ857FY7-vwxJaMDajFmmVStGDcnfHfGJx05k\"\n}",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "heightId",
            "description": "<p>Height unique ID.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>If the height has been deleted correctly, it returns the message 'The height has been eliminated'.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n\t\tmessage: \"The height has been eliminated\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "controllers/user/patient/height.js",
    "groupTitle": "Height"
  },
  {
    "type": "get",
    "url": "https://health29.org/api/height/:patientId",
    "title": "Get height",
    "name": "getHeight",
    "description": "<p>This method read Height of a patient</p>",
    "group": "Height",
    "version": "1.0.0",
    "examples": [
      {
        "title": "Example usage:",
        "content": "this.http.get('https://health29.org/api/height/'+patientId)\n .subscribe( (res : any) => {\n   console.log('height: '+ res.height);\n  }, (err) => {\n   ...\n  }",
        "type": "js"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Users unique access-key. For this, go to  <a href=\"#api-Access_token-signIn\">Get token</a></p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n  \"authorization\": \"Bearer eyJ0eXAiOiJKV1QiLCJhbGciPgDIUzI1NiJ9.eyJzdWIiOiI1M2ZlYWQ3YjY1YjM0ZTQ0MGE4YzRhNmUyMzVhNDFjNjEyOThiMWZjYTZjMjXkZTUxMTA9OGVkN2NlODMxYWY3IiwiaWF0IjoxNTIwMzUzMDMwLCJlcHAiOjE1NTE4ODkwMzAsInJvbGUiOiJVc2VyIiwiZ3JvdDEiOiJEdWNoZW5uZSBQYXJlbnQgUHJfrmVjdCBOZXRoZXJsYW5kcyJ9.MloW8eeJ857FY7-vwxJaMDajFmmVStGDcnfHfGJx05k\"\n}",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "patientId",
            "description": "<p>Patient unique ID. More info here:  <a href=\"#api-Patients-getPatientsUser\">Get patientId</a></p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "_id",
            "description": "<p>Height unique ID.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "value",
            "description": "<p>Patient's height.</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "dateTime",
            "description": "<p>on which the height was saved.</p>"
          }
        ],
        "Success 202": [
          {
            "group": "Success 202",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>If there is no height for the patient, it will return: &quot;There are no height&quot;</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\"height\":\n  {\n    \"_id\":\"5a6f4b83f440d806744f3ef6\",\n    \"value\":\"43\",\n    \"dateTime\":\"2018-02-27T17:55:48.261Z\"\n  }\n}\n\nHTTP/1.1 202 OK\n{message: 'There are no height'}",
          "type": "json"
        }
      ]
    },
    "filename": "controllers/user/patient/height.js",
    "groupTitle": "Height"
  },
  {
    "type": "get",
    "url": "https://health29.org/api/heights/:patientId",
    "title": "Get history height",
    "name": "getHistoryHeight",
    "description": "<p>This method read History Height of a patient</p>",
    "group": "Height",
    "version": "1.0.0",
    "examples": [
      {
        "title": "Example usage:",
        "content": "this.http.get('https://health29.org/api/heights/'+patientId)\n .subscribe( (res : any) => {\n   console.log('Get history heights ok');\n  }, (err) => {\n   ...\n  }",
        "type": "js"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Users unique access-key. For this, go to  <a href=\"#api-Access_token-signIn\">Get token</a></p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n  \"authorization\": \"Bearer eyJ0eXAiOiJKV1QiLCJhbGciPgDIUzI1NiJ9.eyJzdWIiOiI1M2ZlYWQ3YjY1YjM0ZTQ0MGE4YzRhNmUyMzVhNDFjNjEyOThiMWZjYTZjMjXkZTUxMTA9OGVkN2NlODMxYWY3IiwiaWF0IjoxNTIwMzUzMDMwLCJlcHAiOjE1NTE4ODkwMzAsInJvbGUiOiJVc2VyIiwiZ3JvdDEiOiJEdWNoZW5uZSBQYXJlbnQgUHJfrmVjdCBOZXRoZXJsYW5kcyJ9.MloW8eeJ857FY7-vwxJaMDajFmmVStGDcnfHfGJx05k\"\n}",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "patientId",
            "description": "<p>Patient unique ID. More info here:  <a href=\"#api-Patients-getPatientsUser\">Get patientId</a></p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "_id",
            "description": "<p>History Height unique ID.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "value",
            "description": "<p>For each height: Patient's height.</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "dateTime",
            "description": "<p>For each height: on which the height was saved.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n[\n  {\n    \"_id\":<history height id>,\n    \"value\":\"43\",\n    \"dateTime\":\"2018-02-27T17:55:48.261Z\"\n  }\n]",
          "type": "json"
        }
      ]
    },
    "filename": "controllers/user/patient/height.js",
    "groupTitle": "Height"
  },
  {
    "type": "post",
    "url": "https://health29.org/api/height/:patientId",
    "title": "New height",
    "name": "saveHeight",
    "description": "<p>This method create a height of a patient</p>",
    "group": "Height",
    "version": "1.0.0",
    "examples": [
      {
        "title": "Example usage:",
        "content": "var height = {value: \"43\", dateTime: \"2018-02-27T17:55:48.261Z\"};\nthis.http.post('https://health29.org/api/height/'+patientId, height)\n .subscribe( (res : any) => {\n   console.log('height: '+ res.height);\n  }, (err) => {\n   ...\n  }",
        "type": "js"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Users unique access-key. For this, go to  <a href=\"#api-Access_token-signIn\">Get token</a></p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n  \"authorization\": \"Bearer eyJ0eXAiOiJKV1QiLCJhbGciPgDIUzI1NiJ9.eyJzdWIiOiI1M2ZlYWQ3YjY1YjM0ZTQ0MGE4YzRhNmUyMzVhNDFjNjEyOThiMWZjYTZjMjXkZTUxMTA9OGVkN2NlODMxYWY3IiwiaWF0IjoxNTIwMzUzMDMwLCJlcHAiOjE1NTE4ODkwMzAsInJvbGUiOiJVc2VyIiwiZ3JvdDEiOiJEdWNoZW5uZSBQYXJlbnQgUHJfrmVjdCBOZXRoZXJsYW5kcyJ9.MloW8eeJ857FY7-vwxJaMDajFmmVStGDcnfHfGJx05k\"\n}",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "patientId",
            "description": "<p>Patient unique ID. More info here:  <a href=\"#api-Patients-getPatientsUser\">Get patientId</a></p>"
          }
        ],
        "body": [
          {
            "group": "body",
            "type": "Object",
            "optional": false,
            "field": "value",
            "description": "<p>Patient's height. You set the dateTime and the height</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "_id",
            "description": "<p>Height unique ID.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "value",
            "description": "<p>Patient's height. You get the height</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>If the height has been created correctly, it returns the message 'Height created'.</p>"
          }
        ],
        "Success 202": [
          {
            "group": "Success 202",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>If there is no height for the patient, it will return: &quot;There are no height&quot;</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\"height\":\n  {\n    \"_id\":\"5a6f4b83f440d806744f3ef6\",\n    \"value\":\"43\",\n   \"dateTime\":\"2018-02-27T17:55:48.261Z\"\n  },\nmessage: \"Height created\"\n}\n\nHTTP/1.1 202 OK\n{message: 'There are no height'}",
          "type": "json"
        }
      ]
    },
    "filename": "controllers/user/patient/height.js",
    "groupTitle": "Height"
  },
  {
    "type": "put",
    "url": "https://health29.org/api/height/:heightId",
    "title": "Update height",
    "name": "updateHeight",
    "description": "<p>This method update the height of a patient</p>",
    "group": "Height",
    "version": "1.0.0",
    "examples": [
      {
        "title": "Example usage:",
        "content": "var height = {value: \"43\", dateTime:\"2018-02-27T17:55:48.261Z\"};\nthis.http.put('https://health29.org/api/height/'+heightId, height)\n .subscribe( (res : any) => {\n   console.log('height: '+ res.height);\n  }, (err) => {\n   ...\n  }",
        "type": "js"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Users unique access-key. For this, go to  <a href=\"#api-Access_token-signIn\">Get token</a></p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n  \"authorization\": \"Bearer eyJ0eXAiOiJKV1QiLCJhbGciPgDIUzI1NiJ9.eyJzdWIiOiI1M2ZlYWQ3YjY1YjM0ZTQ0MGE4YzRhNmUyMzVhNDFjNjEyOThiMWZjYTZjMjXkZTUxMTA9OGVkN2NlODMxYWY3IiwiaWF0IjoxNTIwMzUzMDMwLCJlcHAiOjE1NTE4ODkwMzAsInJvbGUiOiJVc2VyIiwiZ3JvdDEiOiJEdWNoZW5uZSBQYXJlbnQgUHJfrmVjdCBOZXRoZXJsYW5kcyJ9.MloW8eeJ857FY7-vwxJaMDajFmmVStGDcnfHfGJx05k\"\n}",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "heightId",
            "description": "<p>Height unique ID. More info here:  <a href=\"#api-Height-getHeight\">Get heightId</a></p>"
          }
        ],
        "body": [
          {
            "group": "body",
            "type": "Object",
            "optional": false,
            "field": "value",
            "description": "<p>Patient's height. You set the dateTime and the height</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "_id",
            "description": "<p>Height unique ID.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "value",
            "description": "<p>Patient's height. You get the height</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>If the height has been updated correctly, it returns the message 'Height updated'.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\"height\":\n  {\n    \"_id\":\"5a6f4b83f440d806744f3ef6\",\n    \"value\":\"43\",\n   \"dateTime\":\"2018-02-27T17:55:48.261Z\"\n  },\nmessage: \"Height updated\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "controllers/user/patient/height.js",
    "groupTitle": "Height"
  },
  {
    "type": "get",
    "url": "https://health29.org/api/langs/",
    "title": "Get languages",
    "name": "getLangs",
    "description": "<p>This method return the languages available in health 29. you get a list of languages, and for each one you have the name and the code. We currently have 5 languages, but we will include more. The current languages are:</p> <ul> <li>English: en</li> <li>Spanish: es</li> <li>German: de</li> <li>Dutch: nl</li> <li>Portuguese: pt</li> </ul>",
    "group": "Languages",
    "version": "1.0.0",
    "examples": [
      {
        "title": "Example usage:",
        "content": "this.http.get('https://health29.org/api/langs)\n .subscribe( (res : any) => {\n   console.log('languages: '+ res.listLangs);\n  }, (err) => {\n   ...\n  }",
        "type": "js"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n[\n  {\n    \"name\": \"English\",\n    \"code\": \"en\"\n  },\n  {\n    \"name\": \"Español,Castellano\",\n    \"code\": \"es\"\n  },\n  {\n    \"name\": \"Deutsch\",\n    \"code\": \"de\"\n  },\n  {\n    \"name\": \"Nederlands,Vlaams\",\n    \"code\": \"nl\"\n  },\n  {\n    \"name\": \"Português\",\n    \"code\": \"pt\"\n  }\n]",
          "type": "json"
        }
      ]
    },
    "filename": "controllers/all/lang.js",
    "groupTitle": "Languages"
  },
  {
    "type": "put",
    "url": "https://health29.org/api/admin/lang/",
    "title": "Request new language for the platform texts",
    "name": "requestaddlang",
    "description": "<p>This method request by email a new language for the platform texts. Only admins could make this request.</p>",
    "group": "Languages",
    "version": "1.0.0",
    "examples": [
      {
        "title": "Example usage:",
        "content": "var params = userId\nvar body = { code: <lang_code>, name: <lang_name> }\nthis.http.put('https://health29.org/api/admin/lang'+params,body)\n .subscribe( (res : any) => {\n   console.log('Request new language ok');\n  }, (err) => {\n   ...\n  }",
        "type": "js"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Users unique access-key. For this, go to  <a href=\"#api-Access_token-signIn\">Get token</a></p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n  \"authorization\": \"Bearer eyJ0eXAiOiJKV1QiLCJhbGciPgDIUzI1NiJ9.eyJzdWIiOiI1M2ZlYWQ3YjY1YjM0ZTQ0MGE4YzRhNmUyMzVhNDFjNjEyOThiMWZjYTZjMjXkZTUxMTA9OGVkN2NlODMxYWY3IiwiaWF0IjoxNTIwMzUzMDMwLCJlcHAiOjE1NTE4ODkwMzAsInJvbGUiOiJVc2VyIiwiZ3JvdDEiOiJEdWNoZW5uZSBQYXJlbnQgUHJfrmVjdCBOZXRoZXJsYW5kcyJ9.MloW8eeJ857FY7-vwxJaMDajFmmVStGDcnfHfGJx05k\"\n}",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "userId",
            "description": "<p>The user unique id.</p>"
          }
        ],
        "body": [
          {
            "group": "body",
            "type": "String",
            "optional": false,
            "field": "code",
            "description": "<p>The language code, i.e &quot;en&quot; or &quot;nl&quot;.</p>"
          },
          {
            "group": "body",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>The language name, i.e &quot;English&quot;.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "Result",
            "description": "<p>Returns a message with information about the execution</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n {\n\t\t\"message\":'request for new language sent'\n\t}",
          "type": "json"
        }
      ]
    },
    "filename": "controllers/admin/lang.js",
    "groupTitle": "Languages"
  },
  {
    "type": "get",
    "url": "https://health29.org/api/medicalcare/:patientId",
    "title": "Get medical care",
    "name": "getMedicalCare",
    "description": "<p>This method read medical care of a patient</p>",
    "group": "MedicalCare",
    "version": "1.0.0",
    "examples": [
      {
        "title": "Example usage:",
        "content": "this.http.get('https://health29.org/api/medicalcare/'+patientId)\n .subscribe( (res : any) => {\n   console.log('medicalcare: '+ res);\n  }, (err) => {\n   ...\n  }",
        "type": "js"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Users unique access-key. For this, go to  <a href=\"#api-Access_token-signIn\">Get token</a></p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n  \"authorization\": \"Bearer eyJ0eXAiOiJKV1QiLCJhbGciPgDIUzI1NiJ9.eyJzdWIiOiI1M2ZlYWQ3YjY1YjM0ZTQ0MGE4YzRhNmUyMzVhNDFjNjEyOThiMWZjYTZjMjXkZTUxMTA9OGVkN2NlODMxYWY3IiwiaWF0IjoxNTIwMzUzMDMwLCJlcHAiOjE1NTE4ODkwMzAsInJvbGUiOiJVc2VyIiwiZ3JvdDEiOiJEdWNoZW5uZSBQYXJlbnQgUHJfrmVjdCBOZXRoZXJsYW5kcyJ9.MloW8eeJ857FY7-vwxJaMDajFmmVStGDcnfHfGJx05k\"\n}",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "patientId",
            "description": "<p>Patient unique ID. More info here:  <a href=\"#api-Patients-getPatientsUser\">Get patientId</a></p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "_id",
            "description": "<p>Medical care unique ID.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>Patient's medical care.</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "date",
            "description": "<p>on which the medical care was saved.</p>"
          }
        ],
        "Success 202": [
          {
            "group": "Success 202",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>If there is no medication for the patient, it will return: &quot;There are no medicalCare&quot;</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n\t\t\"_id\" : <medical care id>,\n\t\t\"date\" : {\n\t\t\t\"$date\" : 1582909945550\n\t\t},\n\t\t\"data\" : [\n\t\t\t{\n\t\t\t\t\"data\" : [\n\t\t\t\t\t{\n\t\t\t\t\t\t\"uploadingGenotype\" : false,\n\t\t\t\t\t\t\"hospitalrecord\" : \"2020-02-26-Reportmedicalcare0-0.pdf\",\n\t\t\t\t\t\t\"date\" : null,\n\t\t\t\t\t\t\"choise\" : \"\"\n\t\t\t\t\t}\n\t\t\t\t],\n\t\t\t\t\"name\" : \"general\"\n\t\t\t},\n\t\t\t{\n\t\t\t\t\"data\" : [\n\t\t\t\t\t{\n\t\t\t\t\t\t\"hospital\" : \"UMCG (Groningen)\",\n\t\t\t\t\t\t\"clinician\" : \"Neurologist\",\n\t\t\t\t\t\t\"date\" : \"2020-03-23T23:00:00.000Z\",\n\t\t\t\t\t\t\"choise\" : \"\"\n\t\t\t\t\t}\n\t\t\t\t],\n\t\t\t\t\"name\" : \"specificVisit\"\n\t\t\t},\n\t\t\t{\n\t\t\t\t\"data\" : [\n\t\t\t\t\t{\n\t\t\t\t\t\t\"treatment\" : \"5e71e390b5e9be197c63d202\",\n\t\t\t\t\t\t\"reason\" : \"Respiratory\",\n\t\t\t\t\t\t\"hospital\" : \"UMCG (Groningen)\",\n\t\t\t\t\t\t\"enddate\" : \"2016-02-16T23:00:00.000Z\",\n\t\t\t\t\t\t\"startdate\" : \"2016-02-07T23:00:00.000Z\",\n\t\t\t\t\t\t\"date\" : null,\n\t\t\t\t\t\t\"choise\" : \"\"\n\t\t\t\t\t}\n\t\t\t\t],\n\t\t\t\t\"name\" : \"hospitalization\"\n\t\t\t},\n\t\t\t{\n\t\t\t\t\"data\" : [\n\t\t\t\t\t{\n\t\t\t\t\t\t\"treatment\" : \"5e6b6e1a331f001ad479a29a\",\n\t\t\t\t\t\t\"hospital\" : \"RadboudUMC (Nijmegen)\",\n\t\t\t\t\t\t\"date\" : \"2020-03-15T23:00:00.000Z\",\n\t\t\t\t\t\t\"choise\" : \"\"\n\t\t\t\t\t}\n\t\t\t\t],\n\t\t\t\t\"name\" : \"emergencies\"\n\t\t\t},\n\t\t\t{\n\t\t\t\t\"data\" : [\n\t\t\t\t\t{\n\t\t\t\t\t\t\"typeoftest\" : \"24h holter\",\n\t\t\t\t\t\t\"date\" : \"2020-03-03T23:00:00.000Z\",\n\t\t\t\t\t\t\"choise\" : \"\"\n\t\t\t\t\t}\n\t\t\t\t],\n\t\t\t\t\"name\" : \"cardiotest\"\n\t\t\t},\n\t\t\t{\n\t\t\t\t\"data\" : [ ],\n\t\t\t\t\"name\" : \"respiratorytests\"\n\t\t\t},\n\t\t\t{\n\t\t\t\t\"data\" : [ ],\n\t\t\t\t\"name\" : \"bonehealthtest\"\n\t\t\t},\n\t\t\t{\n\t\t\t\t\"data\" : [ ],\n\t\t\t\t\"name\" : \"bloodtest\"\n\t\t\t},\n\t\t\t{\n\t\t\t\t\"data\" : [\n\t\t\t\t\t{\n\t\t\t\t\t\t\"uploadingGenotype\" : false,\n\t\t\t\t\t\t\"hospitalrecord\" : \"2020-02-26-Reportmedicalcare8-0.pdf\",\n\t\t\t\t\t\t\"typeoftest\" : \"Tendonectomy\",\n\t\t\t\t\t\t\"date\" : \"2020-02-26T23:00:00.000Z\",\n\t\t\t\t\t\t\"choise\" : \"\"\n\t\t\t\t\t}\n\t\t\t\t],\n\t\t\t\t\"name\" : \"surgery\"\n\t\t\t}\n\t\t]\n}\n\nHTTP/1.1 202 OK\n{message: 'There are no medicalCare'}",
          "type": "json"
        }
      ]
    },
    "filename": "controllers/user/patient/medical-care.js",
    "groupTitle": "MedicalCare"
  },
  {
    "type": "post",
    "url": "https://health29.org/api/medicalcare/:patientId",
    "title": "Create or update medical care",
    "name": "saveMedicalCare",
    "description": "<p>This method create or update medical care of a patient</p>",
    "group": "MedicalCare",
    "version": "1.0.0",
    "examples": [
      {
        "title": "Example usage:",
        "content": "var medicalcare = {\t\t\n\t\t\"date\" : {\n\t\t\t\"$date\" : 1582909945550\n\t\t},\n\t\t\"data\" : [\n\t\t\t{\n\t\t\t\t\"data\" : [\n\t\t\t\t\t{\n\t\t\t\t\t\t\"uploadingGenotype\" : false,\n\t\t\t\t\t\t\"hospitalrecord\" : \"2020-02-26-Reportmedicalcare0-0.pdf\",\n\t\t\t\t\t\t\"date\" : null,\n\t\t\t\t\t\t\"choise\" : \"\"\n\t\t\t\t\t}\n\t\t\t\t],\n\t\t\t\t\"name\" : \"general\"\n\t\t\t},\n\t\t\t{\n\t\t\t\t\"data\" : [\n\t\t\t\t\t{\n\t\t\t\t\t\t\"hospital\" : \"UMCG (Groningen)\",\n\t\t\t\t\t\t\"clinician\" : \"Neurologist\",\n\t\t\t\t\t\t\"date\" : \"2020-03-23T23:00:00.000Z\",\n\t\t\t\t\t\t\"choise\" : \"\"\n\t\t\t\t\t}\n\t\t\t\t],\n\t\t\t\t\"name\" : \"specificVisit\"\n\t\t\t},\n\t\t\t{\n\t\t\t\t\"data\" : [\n\t\t\t\t\t{\n\t\t\t\t\t\t\"treatment\" : \"5e71e390b5e9be197c63d202\",\n\t\t\t\t\t\t\"reason\" : \"Respiratory\",\n\t\t\t\t\t\t\"hospital\" : \"UMCG (Groningen)\",\n\t\t\t\t\t\t\"enddate\" : \"2016-02-16T23:00:00.000Z\",\n\t\t\t\t\t\t\"startdate\" : \"2016-02-07T23:00:00.000Z\",\n\t\t\t\t\t\t\"date\" : null,\n\t\t\t\t\t\t\"choise\" : \"\"\n\t\t\t\t\t}\n\t\t\t\t],\n\t\t\t\t\"name\" : \"hospitalization\"\n\t\t\t},\n\t\t\t{\n\t\t\t\t\"data\" : [\n\t\t\t\t\t{\n\t\t\t\t\t\t\"treatment\" : \"5e6b6e1a331f001ad479a29a\",\n\t\t\t\t\t\t\"hospital\" : \"RadboudUMC (Nijmegen)\",\n\t\t\t\t\t\t\"date\" : \"2020-03-15T23:00:00.000Z\",\n\t\t\t\t\t\t\"choise\" : \"\"\n\t\t\t\t\t}\n\t\t\t\t],\n\t\t\t\t\"name\" : \"emergencies\"\n\t\t\t},\n\t\t\t{\n\t\t\t\t\"data\" : [\n\t\t\t\t\t{\n\t\t\t\t\t\t\"typeoftest\" : \"24h holter\",\n\t\t\t\t\t\t\"date\" : \"2020-03-03T23:00:00.000Z\",\n\t\t\t\t\t\t\"choise\" : \"\"\n\t\t\t\t\t}\n\t\t\t\t],\n\t\t\t\t\"name\" : \"cardiotest\"\n\t\t\t},\n\t\t\t{\n\t\t\t\t\"data\" : [ ],\n\t\t\t\t\"name\" : \"respiratorytests\"\n\t\t\t},\n\t\t\t{\n\t\t\t\t\"data\" : [ ],\n\t\t\t\t\"name\" : \"bonehealthtest\"\n\t\t\t},\n\t\t\t{\n\t\t\t\t\"data\" : [ ],\n\t\t\t\t\"name\" : \"bloodtest\"\n\t\t\t},\n\t\t\t{\n\t\t\t\t\"data\" : [\n\t\t\t\t\t{\n\t\t\t\t\t\t\"uploadingGenotype\" : false,\n\t\t\t\t\t\t\"hospitalrecord\" : \"2020-02-26-Reportmedicalcare8-0.pdf\",\n\t\t\t\t\t\t\"typeoftest\" : \"Tendonectomy\",\n\t\t\t\t\t\t\"date\" : \"2020-02-26T23:00:00.000Z\",\n\t\t\t\t\t\t\"choise\" : \"\"\n\t\t\t\t\t}\n\t\t\t\t],\n\t\t\t\t\"name\" : \"surgery\"\n\t\t\t}\n\t\t]\n}\n  this.http.post('https://health29.org/api/medicalcare/'+patientId,medicalcare)\n   .subscribe( (res : any) => {\n     console.log('medicalcare: '+ res);\n    }, (err) => {\n     ...\n    }",
        "type": "js"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Users unique access-key. For this, go to  <a href=\"#api-Access_token-signIn\">Get token</a></p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n  \"authorization\": \"Bearer eyJ0eXAiOiJKV1QiLCJhbGciPgDIUzI1NiJ9.eyJzdWIiOiI1M2ZlYWQ3YjY1YjM0ZTQ0MGE4YzRhNmUyMzVhNDFjNjEyOThiMWZjYTZjMjXkZTUxMTA9OGVkN2NlODMxYWY3IiwiaWF0IjoxNTIwMzUzMDMwLCJlcHAiOjE1NTE4ODkwMzAsInJvbGUiOiJVc2VyIiwiZ3JvdDEiOiJEdWNoZW5uZSBQYXJlbnQgUHJfrmVjdCBOZXRoZXJsYW5kcyJ9.MloW8eeJ857FY7-vwxJaMDajFmmVStGDcnfHfGJx05k\"\n}",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "patientId",
            "description": "<p>Patient unique ID. More info here:  <a href=\"#api-Patients-getPatientsUser\">Get patientId</a></p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "_id",
            "description": "<p>Medical care unique ID.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "medicalcare",
            "description": "<p>Patient's medical care.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>If the medical care has been created correctly, it returns the message 'MedicalCare created'. If the medical care has been updated correctly, it returns the message 'MedicalCare updated'.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n\t{\n\t\t\"message\":\"MedicalCare created\",\n\t\t\"medicalCare\":\n\t\t\t{\n\t\t\t\t\"_id\" : <medical care id>,\n\t\t\t\t\"date\" : {\n\t\t\t\t\"$date\" : 1582909945550\n\t\t\t},\n\t\t\t\"data\" : [\n\t\t\t\t{\n\t\t\t\t\t\"data\" : [\n\t\t\t\t\t\t{\n\t\t\t\t\t\t\t\"uploadingGenotype\" : false,\n\t\t\t\t\t\t\t\"hospitalrecord\" : \"2020-02-26-Reportmedicalcare0-0.pdf\",\n\t\t\t\t\t\t\t\"date\" : null,\n\t\t\t\t\t\t\t\"choise\" : \"\"\n\t\t\t\t\t\t}\n\t\t\t\t\t],\n\t\t\t\t\t\"name\" : \"general\"\n\t\t\t\t},\n\t\t\t\t{\n\t\t\t\t\t\"data\" : [\n\t\t\t\t\t\t{\n\t\t\t\t\t\t\t\"hospital\" : \"UMCG (Groningen)\",\n\t\t\t\t\t\t\t\"clinician\" : \"Neurologist\",\n\t\t\t\t\t\t\t\"date\" : \"2020-03-23T23:00:00.000Z\",\n\t\t\t\t\t\t\t\"choise\" : \"\"\n\t\t\t\t\t\t}\n\t\t\t\t\t],\n\t\t\t\t\t\"name\" : \"specificVisit\"\n\t\t\t\t},\n\t\t\t\t{\n\t\t\t\t\t\"data\" : [\n\t\t\t\t\t\t{\n\t\t\t\t\t\t\t\"treatment\" : \"5e71e390b5e9be197c63d202\",\n\t\t\t\t\t\t\t\"reason\" : \"Respiratory\",\n\t\t\t\t\t\t\t\"hospital\" : \"UMCG (Groningen)\",\n\t\t\t\t\t\t\t\"enddate\" : \"2016-02-16T23:00:00.000Z\",\n\t\t\t\t\t\t\t\"startdate\" : \"2016-02-07T23:00:00.000Z\",\n\t\t\t\t\t\t\t\"date\" : null,\n\t\t\t\t\t\t\t\"choise\" : \"\"\n\t\t\t\t\t\t}\n\t\t\t\t\t],\n\t\t\t\t\t\"name\" : \"hospitalization\"\n\t\t\t\t},\n\t\t\t\t{\n\t\t\t\t\t\"data\" : [\n\t\t\t\t\t\t{\n\t\t\t\t\t\t\t\"treatment\" : \"5e6b6e1a331f001ad479a29a\",\n\t\t\t\t\t\t\t\"hospital\" : \"RadboudUMC (Nijmegen)\",\n\t\t\t\t\t\t\t\"date\" : \"2020-03-15T23:00:00.000Z\",\n\t\t\t\t\t\t\t\"choise\" : \"\"\n\t\t\t\t\t\t}\n\t\t\t\t\t],\n\t\t\t\t\t\"name\" : \"emergencies\"\n\t\t\t\t},\n\t\t\t\t{\n\t\t\t\t\t\"data\" : [\n\t\t\t\t\t\t{\n\t\t\t\t\t\t\t\"typeoftest\" : \"24h holter\",\n\t\t\t\t\t\t\t\"date\" : \"2020-03-03T23:00:00.000Z\",\n\t\t\t\t\t\t\t\"choise\" : \"\"\n\t\t\t\t\t\t}\n\t\t\t\t\t],\n\t\t\t\t\t\"name\" : \"cardiotest\"\n\t\t\t\t},\n\t\t\t\t{\n\t\t\t\t\t\"data\" : [ ],\n\t\t\t\t\t\"name\" : \"respiratorytests\"\n\t\t\t\t},\n\t\t\t\t{\n\t\t\t\t\t\"data\" : [ ],\n\t\t\t\t\t\"name\" : \"bonehealthtest\"\n\t\t\t\t},\n\t\t\t\t{\n\t\t\t\t\t\"data\" : [ ],\n\t\t\t\t\t\"name\" : \"bloodtest\"\n\t\t\t\t},\n\t\t\t\t{\n\t\t\t\t\t\"data\" : [\n\t\t\t\t\t\t{\n\t\t\t\t\t\t\t\"uploadingGenotype\" : false,\n\t\t\t\t\t\t\t\"hospitalrecord\" : \"2020-02-26-Reportmedicalcare8-0.pdf\",\n\t\t\t\t\t\t\t\"typeoftest\" : \"Tendonectomy\",\n\t\t\t\t\t\t\t\"date\" : \"2020-02-26T23:00:00.000Z\",\n\t\t\t\t\t\t\t\"choise\" : \"\"\n\t\t\t\t\t\t}\n\t\t\t\t\t],\n\t\t\t\t\t\"name\" : \"surgery\"\n\t\t\t\t}\n\t\t\t]\n\t\t}\n}",
          "type": "json"
        }
      ]
    },
    "filename": "controllers/user/patient/medical-care.js",
    "groupTitle": "MedicalCare"
  },
  {
    "type": "put",
    "url": "https://health29.org/api/medication/changenotes/:medicationId",
    "title": "Change notes of a medication",
    "name": "changenotes",
    "description": "<p>This method updates the notes of a dose for a medication of a patient</p>",
    "group": "Medication",
    "version": "1.0.0",
    "examples": [
      {
        "title": "Example usage:",
        "content": "var medication ={\"notes\":\"note1\"};\nthis.http.put('https://health29.org/api/medication/changenotes/'+medicationId, medication)\n .subscribe( (res : any) => {\n   console.log('Change notes ok');\n  }, (err) => {\n   ...\n  }",
        "type": "js"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Users unique access-key. For this, go to  <a href=\"#api-Access_token-signIn\">Get token</a></p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n  \"authorization\": \"Bearer eyJ0eXAiOiJKV1QiLCJhbGciPgDIUzI1NiJ9.eyJzdWIiOiI1M2ZlYWQ3YjY1YjM0ZTQ0MGE4YzRhNmUyMzVhNDFjNjEyOThiMWZjYTZjMjXkZTUxMTA9OGVkN2NlODMxYWY3IiwiaWF0IjoxNTIwMzUzMDMwLCJlcHAiOjE1NTE4ODkwMzAsInJvbGUiOiJVc2VyIiwiZ3JvdDEiOiJEdWNoZW5uZSBQYXJlbnQgUHJfrmVjdCBOZXRoZXJsYW5kcyJ9.MloW8eeJ857FY7-vwxJaMDajFmmVStGDcnfHfGJx05k\"\n}",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "medicationId",
            "description": "<p>Medication unique ID.</p>"
          }
        ],
        "body": [
          {
            "group": "body",
            "type": "Object",
            "optional": false,
            "field": "value",
            "description": "<p>Patient's medication.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "medication",
            "description": "<p>Patient's medication.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>If the dose of medication has been updated correctly, it returns the message 'stop takin the drug'.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n\t\t\"medication\":\n\t\t{\n\t\t\t\"_id\" : <medicationId>,\n\t\t\t\"dose\" : \"32\",\n\t\t\t\"drug\" : \"Endocrinology - Metformin\",\n\t\t\t\"vaccinationDate\" : {\n\t\t\t\t$date\" : 1611593911550\n\t\t\t},\n\t\t\t\"notes\":\"note1\",\n\t\t\t\"endDate\" : null,\n\t\t\t\"startDate\" : {\n\t\t\t\t\"$date\" : 1610406000000\n\t\t\t},\n\t\t\t\"sideEffects\":{}\n\t\t},\n\t\t\"message\": \"notes changed\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "controllers/user/patient/medication.js",
    "groupTitle": "Medication"
  },
  {
    "type": "delete",
    "url": "https://health29.org/api/medication/:medicationId",
    "title": "Delete dose of medication",
    "name": "deleteDose",
    "description": "<p>This method deletes dose of medication of a patient.</p>",
    "group": "Medication",
    "version": "1.0.0",
    "examples": [
      {
        "title": "Example usage:",
        "content": "this.http.delete('https://health29.org/medication/'+medicationId)\n .subscribe( (res : any) => {\n   console.log('medication: '+ res.medication);\n  }, (err) => {\n   ...\n  }",
        "type": "js"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Users unique access-key. For this, go to  <a href=\"#api-Access_token-signIn\">Get token</a></p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n  \"authorization\": \"Bearer eyJ0eXAiOiJKV1QiLCJhbGciPgDIUzI1NiJ9.eyJzdWIiOiI1M2ZlYWQ3YjY1YjM0ZTQ0MGE4YzRhNmUyMzVhNDFjNjEyOThiMWZjYTZjMjXkZTUxMTA9OGVkN2NlODMxYWY3IiwiaWF0IjoxNTIwMzUzMDMwLCJlcHAiOjE1NTE4ODkwMzAsInJvbGUiOiJVc2VyIiwiZ3JvdDEiOiJEdWNoZW5uZSBQYXJlbnQgUHJfrmVjdCBOZXRoZXJsYW5kcyJ9.MloW8eeJ857FY7-vwxJaMDajFmmVStGDcnfHfGJx05k\"\n}",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "medicationId",
            "description": "<p>Medication unique ID.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>If the dose has been deleted correctly, it returns the message 'he dose has been eliminated'.</p>"
          }
        ],
        "Success 202": [
          {
            "group": "Success 202",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>If there is no dose for the patient, it will return: &quot;The dose does not exist&quot;</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n\t\t{\n\t\t\t\"message\" : 'he dose has been eliminated'\n\t\t}\n\nHTTP/1.1 202 OK\n{message: 'The dose does not exist'}",
          "type": "json"
        }
      ]
    },
    "filename": "controllers/user/patient/medication.js",
    "groupTitle": "Medication"
  },
  {
    "type": "delete",
    "url": "https://health29.org/api//medications/:drugNameAndPatient",
    "title": "Delete medication of a patient by name",
    "name": "deleteMedication",
    "description": "<p>This method deletes a medication of a patient by name.</p>",
    "group": "Medication",
    "version": "1.0.0",
    "examples": [
      {
        "title": "Example usage:",
        "content": "this.http.delete('https://health29.org//medications/'+drugName-code-PatientId)\n .subscribe( (res : any) => {\n   console.log('medication: '+ res.medication);\n  }, (err) => {\n   ...\n  }",
        "type": "js"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Users unique access-key. For this, go to  <a href=\"#api-Access_token-signIn\">Get token</a></p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n  \"authorization\": \"Bearer eyJ0eXAiOiJKV1QiLCJhbGciPgDIUzI1NiJ9.eyJzdWIiOiI1M2ZlYWQ3YjY1YjM0ZTQ0MGE4YzRhNmUyMzVhNDFjNjEyOThiMWZjYTZjMjXkZTUxMTA9OGVkN2NlODMxYWY3IiwiaWF0IjoxNTIwMzUzMDMwLCJlcHAiOjE1NTE4ODkwMzAsInJvbGUiOiJVc2VyIiwiZ3JvdDEiOiJEdWNoZW5uZSBQYXJlbnQgUHJfrmVjdCBOZXRoZXJsYW5kcyJ9.MloW8eeJ857FY7-vwxJaMDajFmmVStGDcnfHfGJx05k\"\n}",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "drugName-code-PatientId",
            "description": "<p>Medication and patient unique ID.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>If the medication has been deleted correctly, it returns the message 'The medication has been eliminated'.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n\t\t{\n\t\t\t\"message\" : 'The medication has been eliminated'\n\t\t}",
          "type": "json"
        }
      ]
    },
    "filename": "controllers/user/patient/medication.js",
    "groupTitle": "Medication"
  },
  {
    "type": "delete",
    "url": "https://health29.org/api/medications/update/:PatientIdAndMedicationId",
    "title": "Delete medication input for a patient by identifier and update previous if exists",
    "name": "deleteMedicationByIDAndUpdateStateForThePrevious",
    "description": "<p>This method delete medication input for a patient by identifier and update state to current taking for the previous input if exists</p>",
    "group": "Medication",
    "version": "1.0.0",
    "examples": [
      {
        "title": "Example usage:",
        "content": "this.http.delete('https://health29.org/api/medications/update/'+PatientId-code-MedicationId)\n .subscribe( (res : any) => {\n   console.log('Delete medication and update previous if exists ok');\n  }, (err) => {\n   ...\n  }",
        "type": "js"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Users unique access-key. For this, go to  <a href=\"#api-Access_token-signIn\">Get token</a></p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n  \"authorization\": \"Bearer eyJ0eXAiOiJKV1QiLCJhbGciPgDIUzI1NiJ9.eyJzdWIiOiI1M2ZlYWQ3YjY1YjM0ZTQ0MGE4YzRhNmUyMzVhNDFjNjEyOThiMWZjYTZjMjXkZTUxMTA9OGVkN2NlODMxYWY3IiwiaWF0IjoxNTIwMzUzMDMwLCJlcHAiOjE1NTE4ODkwMzAsInJvbGUiOiJVc2VyIiwiZ3JvdDEiOiJEdWNoZW5uZSBQYXJlbnQgUHJfrmVjdCBOZXRoZXJsYW5kcyJ9.MloW8eeJ857FY7-vwxJaMDajFmmVStGDcnfHfGJx05k\"\n}",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "patientId-code-medicationId",
            "description": "<p>Patient and Other medication unique IDs</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>If Other medication has been deleted correctly and there is not any medication previous, it returns the message 'The medication has been eliminated and there are not other medications'. If Other medication has been deleted correctly and there is a medication previous, it returns the message 'Medication has been eliminated, and previous has been updated to current taking'.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n  {\n    \"message\":\"Medication has been eliminated, and previous has been updated to current taking\",\n  }",
          "type": "json"
        }
      ]
    },
    "filename": "controllers/user/patient/medication.js",
    "groupTitle": "Medication"
  },
  {
    "type": "delete",
    "url": "https://health29.org/api/othermedications/update/:PatientIdAndMedicationId",
    "title": "Delete Other medication input for a patient by identifier and update previous if exists",
    "name": "deleteOtherMedicationByIDAndUpdateStateForThePrevious",
    "description": "<p>This method delete Other medication input for a patient by identifier and update state to current taking for the previous input if exists</p>",
    "group": "Medication",
    "version": "1.0.0",
    "examples": [
      {
        "title": "Example usage:",
        "content": "this.http.delete('https://health29.org/api/othermedications/update/'+PatientId-code-MedicationId)\n .subscribe( (res : any) => {\n   console.log('Delete medication and update previous if exists ok');\n  }, (err) => {\n   ...\n  }",
        "type": "js"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Users unique access-key. For this, go to  <a href=\"#api-Access_token-signIn\">Get token</a></p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n  \"authorization\": \"Bearer eyJ0eXAiOiJKV1QiLCJhbGciPgDIUzI1NiJ9.eyJzdWIiOiI1M2ZlYWQ3YjY1YjM0ZTQ0MGE4YzRhNmUyMzVhNDFjNjEyOThiMWZjYTZjMjXkZTUxMTA9OGVkN2NlODMxYWY3IiwiaWF0IjoxNTIwMzUzMDMwLCJlcHAiOjE1NTE4ODkwMzAsInJvbGUiOiJVc2VyIiwiZ3JvdDEiOiJEdWNoZW5uZSBQYXJlbnQgUHJfrmVjdCBOZXRoZXJsYW5kcyJ9.MloW8eeJ857FY7-vwxJaMDajFmmVStGDcnfHfGJx05k\"\n}",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "patientId-code-medicationId",
            "description": "<p>Patient and Other medication unique IDs</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>If Other medication has been deleted correctly and there is not any medication previous, it returns the message 'The medication has been eliminated and there are not other medications'. If Other medication has been deleted correctly and there is a medication previous, it returns the message 'Medication has been eliminated, and previous has been updated to current taking'.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n  {\n    \"message\":\"Medication has been eliminated, and previous has been updated to current taking\",\n  }",
          "type": "json"
        }
      ]
    },
    "filename": "controllers/user/patient/other-medication.js",
    "groupTitle": "Medication"
  },
  {
    "type": "get",
    "url": "https://health29.org/api/medications/all/:drugNameAndPatient",
    "title": "Get medication list by name",
    "name": "getAllMedicationByNameForPatient",
    "description": "<p>This method read Medication of a patient by name of medication</p>",
    "group": "Medication",
    "version": "1.0.0",
    "examples": [
      {
        "title": "Example usage:",
        "content": "this.http.get('https://health29.org/api/medications/all/'+drugName-code-PatientId)\n .subscribe( (res : any) => {\n   console.log('medication: '+ res);\n  }, (err) => {\n   ...\n  }",
        "type": "js"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Users unique access-key. For this, go to  <a href=\"#api-Access_token-signIn\">Get token</a></p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n  \"authorization\": \"Bearer eyJ0eXAiOiJKV1QiLCJhbGciPgDIUzI1NiJ9.eyJzdWIiOiI1M2ZlYWQ3YjY1YjM0ZTQ0MGE4YzRhNmUyMzVhNDFjNjEyOThiMWZjYTZjMjXkZTUxMTA9OGVkN2NlODMxYWY3IiwiaWF0IjoxNTIwMzUzMDMwLCJlcHAiOjE1NTE4ODkwMzAsInJvbGUiOiJVc2VyIiwiZ3JvdDEiOiJEdWNoZW5uZSBQYXJlbnQgUHJfrmVjdCBOZXRoZXJsYW5kcyJ9.MloW8eeJ857FY7-vwxJaMDajFmmVStGDcnfHfGJx05k\"\n}",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "drugName-code-PatientId",
            "description": "<p>Patient unique ID and name of the medication/drug.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "_id",
            "description": "<p>For each medication: Medication unique ID.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "dose",
            "description": "<p>For each medication: Other medication dose.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "drug",
            "description": "<p>For each medication: Other medication name.</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "vaccinationDate",
            "description": "<p>For each medication: on which the patient has been vaccinated with other medication.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "notes",
            "description": "<p>For each medication: Medication notes.</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "endDate",
            "description": "<p>For each medication: on which the patient ends with other medication.</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "startDate",
            "description": "<p>For each medication: on which the patient starts with other medication.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "sideEffects",
            "description": "<p>For each medication: Medication side Effects.</p>"
          }
        ],
        "Success 202": [
          {
            "group": "Success 202",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>If there is no medication with the name provided for the patient, it will return: &quot;TNo medications found&quot;</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n[\n\t\t{\n\t\t\t\"_id\" : <medicationId>,\n\t\t\t\"dose\" : \"32\",\n\t\t\t\"drug\" : \"Endocrinology - Metformin\",\n\t\t\t\"vaccinationDate\" : {\n\t\t\t\t$date\" : 1611593911550\n\t\t\t},\n\t\t\t\"notes\":\"note1\",\n\t\t\t\"endDate\" : null,\n\t\t\t\"startDate\" : {\n\t\t\t\t\"$date\" : 1610406000000\n\t\t\t},\n\t\t\t\"sideEffects\":{}\n\t\t}\n]\n\nHTTP/1.1 202 OK\n{message: 'No medications found'}",
          "type": "json"
        }
      ]
    },
    "filename": "controllers/user/patient/medication.js",
    "groupTitle": "Medication"
  },
  {
    "type": "get",
    "url": "https://health29.org/api/medication/:medicationId",
    "title": "Get medication",
    "name": "getMedication",
    "description": "<p>This method read Medication of a patient</p>",
    "group": "Medication",
    "version": "1.0.0",
    "examples": [
      {
        "title": "Example usage:",
        "content": "this.http.get('https://health29.org/api/medication/'+medicationId)\n .subscribe( (res : any) => {\n   console.log('medication: '+ res.medication);\n  }, (err) => {\n   ...\n  }",
        "type": "js"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Users unique access-key. For this, go to  <a href=\"#api-Access_token-signIn\">Get token</a></p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n  \"authorization\": \"Bearer eyJ0eXAiOiJKV1QiLCJhbGciPgDIUzI1NiJ9.eyJzdWIiOiI1M2ZlYWQ3YjY1YjM0ZTQ0MGE4YzRhNmUyMzVhNDFjNjEyOThiMWZjYTZjMjXkZTUxMTA9OGVkN2NlODMxYWY3IiwiaWF0IjoxNTIwMzUzMDMwLCJlcHAiOjE1NTE4ODkwMzAsInJvbGUiOiJVc2VyIiwiZ3JvdDEiOiJEdWNoZW5uZSBQYXJlbnQgUHJfrmVjdCBOZXRoZXJsYW5kcyJ9.MloW8eeJ857FY7-vwxJaMDajFmmVStGDcnfHfGJx05k\"\n}",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "medicationId",
            "description": "<p>Medication unique ID.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "_id",
            "description": "<p>Medication unique ID.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "dose",
            "description": "<p>Other medication dose.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "drug",
            "description": "<p>Other medication name.</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "vaccinationDate",
            "description": "<p>on which the patient has been vaccinated with other medication.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "notes",
            "description": "<p>Medication notes.</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "endDate",
            "description": "<p>on which the patient ends with other medication.</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "startDate",
            "description": "<p>on which the patient starts with other medication.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "sideEffects",
            "description": "<p>Medication side Effects.</p>"
          }
        ],
        "Success 202": [
          {
            "group": "Success 202",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>If there is no medication for the patient, it will return: &quot;There are no medication&quot;</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n\t\t{\n\t\t\t\"_id\" : <medicationId>,\n\t\t\t\"dose\" : \"32\",\n\t\t\t\"drug\" : \"Endocrinology - Metformin\",\n\t\t\t\"vaccinationDate\" : {\n\t\t\t\t$date\" : 1611593911550\n\t\t\t},\n\t\t\t\"notes\":\"note1\",\n\t\t\t\"endDate\" : null,\n\t\t\t\"startDate\" : {\n\t\t\t\t\"$date\" : 1610406000000\n\t\t\t},\n\t\t\t\"sideEffects\":{}\n\t\t}\nHTTP/1.1 202 OK\n{message: 'There are no medication'}",
          "type": "json"
        }
      ]
    },
    "filename": "controllers/user/patient/medication.js",
    "groupTitle": "Medication"
  },
  {
    "type": "get",
    "url": "https://health29.org/api/medications/:patientId",
    "title": "Get medication list",
    "name": "getMedications",
    "description": "<p>This method read Medication of a patient</p>",
    "group": "Medication",
    "version": "1.0.0",
    "examples": [
      {
        "title": "Example usage:",
        "content": "this.http.get('https://health29.org/api/medications/'+patientId)\n .subscribe( (res : any) => {\n   console.log('medication: '+ res.medication);\n  }, (err) => {\n   ...\n  }",
        "type": "js"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Users unique access-key. For this, go to  <a href=\"#api-Access_token-signIn\">Get token</a></p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n  \"authorization\": \"Bearer eyJ0eXAiOiJKV1QiLCJhbGciPgDIUzI1NiJ9.eyJzdWIiOiI1M2ZlYWQ3YjY1YjM0ZTQ0MGE4YzRhNmUyMzVhNDFjNjEyOThiMWZjYTZjMjXkZTUxMTA9OGVkN2NlODMxYWY3IiwiaWF0IjoxNTIwMzUzMDMwLCJlcHAiOjE1NTE4ODkwMzAsInJvbGUiOiJVc2VyIiwiZ3JvdDEiOiJEdWNoZW5uZSBQYXJlbnQgUHJfrmVjdCBOZXRoZXJsYW5kcyJ9.MloW8eeJ857FY7-vwxJaMDajFmmVStGDcnfHfGJx05k\"\n}",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "patientId",
            "description": "<p>Patient unique ID. More info here:  <a href=\"#api-Patients-getPatientsUser\">Get patientId</a></p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "_id",
            "description": "<p>For each medication: Medication unique ID.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "dose",
            "description": "<p>For each medication: Other medication dose.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "drug",
            "description": "<p>For each medication: Other medication name.</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "vaccinationDate",
            "description": "<p>For each medication: on which the patient has been vaccinated with other medication.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "notes",
            "description": "<p>For each medication: Medication notes.</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "endDate",
            "description": "<p>For each medication: on which the patient ends with other medication.</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "startDate",
            "description": "<p>For each medication: on which the patient starts with other medication.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "sideEffects",
            "description": "<p>For each medication: Medication side Effects.</p>"
          }
        ],
        "Success 202": [
          {
            "group": "Success 202",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>If there is no medication for the patient, it will return: &quot;There are no medication&quot;</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n[\n\t\t{\n\t\t\t\"_id\" : <medicationId>,\n\t\t\t\"dose\" : \"32\",\n\t\t\t\"drug\" : \"Endocrinology - Metformin\",\n\t\t\t\"vaccinationDate\" : {\n\t\t\t\t$date\" : 1611593911550\n\t\t\t},\n\t\t\t\"notes\":\"note1\",\n\t\t\t\"endDate\" : null,\n\t\t\t\"startDate\" : {\n\t\t\t\t\"$date\" : 1610406000000\n\t\t\t},\n\t\t\t\"sideEffects\":{}\n\t\t}\n]\n\nHTTP/1.1 202 OK\n{message: 'There are no medication'}",
          "type": "json"
        }
      ]
    },
    "filename": "controllers/user/patient/medication.js",
    "groupTitle": "Medication"
  },
  {
    "type": "put",
    "url": "https://health29.org/api/medication/newdose/:medicationIdAndPatient",
    "title": "Update medication dose",
    "name": "newDose",
    "description": "<p>This method updates the dose for a medication of a patient</p>",
    "group": "Medication",
    "version": "1.0.0",
    "examples": [
      {
        "title": "Example usage:",
        "content": "  var medication ={\n\t\t\t\"dose\" : \"32\",\n\t\t\t\"drug\" : \"Endocrinology - Metformin\",\n\t\t\t\"vaccinationDate\" : {\n\t\t\t\t$date\" : 1611593911550\n\t\t\t},\n\t\t\t\"endDate\" : null,\n\t\t\t\"startDate\" : {\n\t\t\t\t\"$date\" : 1610406000000\n\t\t\t},\n\t\t\t\"sideEffects\":{}\n\t\t};\n  this.http.put('https://health29.org/api/medication/newdose/'+medicationId-code-Patient, medication)\n   .subscribe( (res : any) => {\n     console.log('medication: '+ res.medication);\n    }, (err) => {\n     ...\n    }",
        "type": "js"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Users unique access-key. For this, go to  <a href=\"#api-Access_token-signIn\">Get token</a></p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n  \"authorization\": \"Bearer eyJ0eXAiOiJKV1QiLCJhbGciPgDIUzI1NiJ9.eyJzdWIiOiI1M2ZlYWQ3YjY1YjM0ZTQ0MGE4YzRhNmUyMzVhNDFjNjEyOThiMWZjYTZjMjXkZTUxMTA9OGVkN2NlODMxYWY3IiwiaWF0IjoxNTIwMzUzMDMwLCJlcHAiOjE1NTE4ODkwMzAsInJvbGUiOiJVc2VyIiwiZ3JvdDEiOiJEdWNoZW5uZSBQYXJlbnQgUHJfrmVjdCBOZXRoZXJsYW5kcyJ9.MloW8eeJ857FY7-vwxJaMDajFmmVStGDcnfHfGJx05k\"\n}",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "medicationId-code-Patient",
            "description": "<p>Medication and Patient unique ID.</p>"
          }
        ],
        "body": [
          {
            "group": "body",
            "type": "Object",
            "optional": false,
            "field": "value",
            "description": "<p>Patient's medication.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "medication",
            "description": "<p>Patient's medication.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>If the dose of medication has been created correctly, it returns the message 'Dose changed'.</p>"
          }
        ],
        "Success 202": [
          {
            "group": "Success 202",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>If there is no medication for the patient, it will return: &quot;There are no medication&quot;</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n\t\t\"medication\":\n\t\t{\n\t\t\t\"_id\" : <medicationId>,\n\t\t\t\"dose\" : \"32\",\n\t\t\t\"drug\" : \"Endocrinology - Metformin\",\n\t\t\t\"vaccinationDate\" : {\n\t\t\t\t$date\" : 1611593911550\n\t\t\t},\n\t\t\t\"endDate\" : null,\n\t\t\t\"startDate\" : {\n\t\t\t\t\"$date\" : 1610406000000\n\t\t\t},\n\t\t\t\"sideEffects\":{}\n\t\t},\n\t\t\"message\": \"Dose changed\"\n}\n\nHTTP/1.1 202 OK\n{message: 'There are no medication'}",
          "type": "json"
        }
      ]
    },
    "filename": "controllers/user/patient/medication.js",
    "groupTitle": "Medication"
  },
  {
    "type": "post",
    "url": "https://health29.org/api/medication/:patientId",
    "title": "New medication",
    "name": "saveMedication",
    "description": "<p>This method create a medication of a patient</p>",
    "group": "Medication",
    "version": "1.0.0",
    "examples": [
      {
        "title": "Example usage:",
        "content": "  var medication ={\n\t\t\t\"dose\" : \"32\",\n\t\t\t\"drug\" : \"Endocrinology - Metformin\",\n\t\t\t\"vaccinationDate\" : {\n\t\t\t\t$date\" : 1611593911550\n\t\t\t},\n\t\t\t\"notes\":\"note1\",\n\t\t\t\"endDate\" : null,\n\t\t\t\"startDate\" : {\n\t\t\t\t\"$date\" : 1610406000000\n\t\t\t},\n\t\t\t\"sideEffects\":{}\n\t\t};\n  this.http.post('https://health29.org/api/medication/'+patientId, medication)\n   .subscribe( (res : any) => {\n     console.log('medication: '+ res.medication);\n    }, (err) => {\n     ...\n    }",
        "type": "js"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Users unique access-key. For this, go to  <a href=\"#api-Access_token-signIn\">Get token</a></p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n  \"authorization\": \"Bearer eyJ0eXAiOiJKV1QiLCJhbGciPgDIUzI1NiJ9.eyJzdWIiOiI1M2ZlYWQ3YjY1YjM0ZTQ0MGE4YzRhNmUyMzVhNDFjNjEyOThiMWZjYTZjMjXkZTUxMTA9OGVkN2NlODMxYWY3IiwiaWF0IjoxNTIwMzUzMDMwLCJlcHAiOjE1NTE4ODkwMzAsInJvbGUiOiJVc2VyIiwiZ3JvdDEiOiJEdWNoZW5uZSBQYXJlbnQgUHJfrmVjdCBOZXRoZXJsYW5kcyJ9.MloW8eeJ857FY7-vwxJaMDajFmmVStGDcnfHfGJx05k\"\n}",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "patientId",
            "description": "<p>Patient unique ID. More info here:  <a href=\"#api-Patients-getPatientsUser\">Get patientId</a></p>"
          }
        ],
        "body": [
          {
            "group": "body",
            "type": "Object",
            "optional": false,
            "field": "value",
            "description": "<p>Patient's medication.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "medication",
            "description": "<p>Patient's medication.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>If the medication has been created correctly, it returns the message 'Medication created'.</p>"
          }
        ],
        "Success 202": [
          {
            "group": "Success 202",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>If there is no medication for the patient, it will return: &quot;There are no medication&quot;</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n\t\t\"medication\":\n\t\t{\n\t\t\t\"_id\" : <medicationId>,\n\t\t\t\"dose\" : \"32\",\n\t\t\t\"drug\" : \"Endocrinology - Metformin\",\n\t\t\t\"vaccinationDate\" : {\n\t\t\t\t$date\" : 1611593911550\n\t\t\t},\n\t\t\t\"notes\":\"note1\",\n\t\t\t\"endDate\" : null,\n\t\t\t\"startDate\" : {\n\t\t\t\t\"$date\" : 1610406000000\n\t\t\t},\n\t\t\t\"sideEffects\":{}\n\t\t},\n\t\t\"message\": \"Medication created\"\n}\n\nHTTP/1.1 202 OK\n{message: 'There are no medication'}",
          "type": "json"
        }
      ]
    },
    "filename": "controllers/user/patient/medication.js",
    "groupTitle": "Medication"
  },
  {
    "type": "put",
    "url": "https://health29.org/api/medication/sideeffect/:medicationId",
    "title": "Change side effect of a medication",
    "name": "sideeffect",
    "description": "<p>This method updates the side effect of a dose for a medication of a patient</p>",
    "group": "Medication",
    "version": "1.0.0",
    "examples": [
      {
        "title": "Example usage:",
        "content": "var medication ={\"sideEffects\":[\"Cushingoid\",\"Weight gain\"]};\nthis.http.put('https://health29.org/api/medication/sideeffect/'+medicationId, medication)\n .subscribe( (res : any) => {\n   console.log('Change side effect ok');\n  }, (err) => {\n   ...\n  }",
        "type": "js"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Users unique access-key. For this, go to  <a href=\"#api-Access_token-signIn\">Get token</a></p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n  \"authorization\": \"Bearer eyJ0eXAiOiJKV1QiLCJhbGciPgDIUzI1NiJ9.eyJzdWIiOiI1M2ZlYWQ3YjY1YjM0ZTQ0MGE4YzRhNmUyMzVhNDFjNjEyOThiMWZjYTZjMjXkZTUxMTA9OGVkN2NlODMxYWY3IiwiaWF0IjoxNTIwMzUzMDMwLCJlcHAiOjE1NTE4ODkwMzAsInJvbGUiOiJVc2VyIiwiZ3JvdDEiOiJEdWNoZW5uZSBQYXJlbnQgUHJfrmVjdCBOZXRoZXJsYW5kcyJ9.MloW8eeJ857FY7-vwxJaMDajFmmVStGDcnfHfGJx05k\"\n}",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "medicationId",
            "description": "<p>Medication unique ID.</p>"
          }
        ],
        "body": [
          {
            "group": "body",
            "type": "Object",
            "optional": false,
            "field": "value",
            "description": "<p>Patient's medication.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "medication",
            "description": "<p>Patient's medication.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>If the dose of medication has been updated correctly, it returns the message 'stop takin the drug'.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n\t\t\"medication\":\n\t\t{\n\t\t\t\"_id\" : <medicationId>,\n\t\t\t\"dose\" : \"32\",\n\t\t\t\"drug\" : \"Endocrinology - Metformin\",\n\t\t\t\"vaccinationDate\" : {\n\t\t\t\t$date\" : 1611593911550\n\t\t\t},\n\t\t\t\"notes\":\"note1\",\n\t\t\t\"endDate\" : null,\n\t\t\t\"startDate\" : {\n\t\t\t\t\"$date\" : 1610406000000\n\t\t\t},\n\t\t\t\"sideEffects\": [\"Cushingoid\",\"Weight gain\"]\n\t\t},\n\t\t\"message\": \"notes changed\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "controllers/user/patient/medication.js",
    "groupTitle": "Medication"
  },
  {
    "type": "put",
    "url": "https://health29.org/api/medication/stoptaking/:medicationId",
    "title": "Stop taking medication",
    "name": "stoptaking",
    "description": "<p>This method updates the end date of a dose for a medication of a patient</p>",
    "group": "Medication",
    "version": "1.0.0",
    "examples": [
      {
        "title": "Example usage:",
        "content": "  var medication ={\n\t\t\t\"startDate\" : {\n\t\t\t\t\"$date\" : 1610406000000\n\t\t\t}\n\t };\n  this.http.put('https://health29.org/api/medication/stoptaking/'+medicationId, medication)\n   .subscribe( (res : any) => {\n     console.log('medication: '+ res.medication);\n    }, (err) => {\n     ...\n    }",
        "type": "js"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Users unique access-key. For this, go to  <a href=\"#api-Access_token-signIn\">Get token</a></p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n  \"authorization\": \"Bearer eyJ0eXAiOiJKV1QiLCJhbGciPgDIUzI1NiJ9.eyJzdWIiOiI1M2ZlYWQ3YjY1YjM0ZTQ0MGE4YzRhNmUyMzVhNDFjNjEyOThiMWZjYTZjMjXkZTUxMTA9OGVkN2NlODMxYWY3IiwiaWF0IjoxNTIwMzUzMDMwLCJlcHAiOjE1NTE4ODkwMzAsInJvbGUiOiJVc2VyIiwiZ3JvdDEiOiJEdWNoZW5uZSBQYXJlbnQgUHJfrmVjdCBOZXRoZXJsYW5kcyJ9.MloW8eeJ857FY7-vwxJaMDajFmmVStGDcnfHfGJx05k\"\n}",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "medicationId",
            "description": "<p>Medication unique ID.</p>"
          }
        ],
        "body": [
          {
            "group": "body",
            "type": "Object",
            "optional": false,
            "field": "value",
            "description": "<p>Patient's medication.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "medication",
            "description": "<p>Patient's medication.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>If the dose of medication has been updated correctly, it returns the message 'stop takin the drug'.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n\t\t\"medication\":\n\t\t{\n\t\t\t\"_id\" : <medicationId>,\n\t\t\t\"dose\" : \"32\",\n\t\t\t\"drug\" : \"Endocrinology - Metformin\",\n\t\t\t\"vaccinationDate\" : {\n\t\t\t\t$date\" : 1611593911550\n\t\t\t},\n\t\t\t\"notes\":\"note1\",\n\t\t\t\"endDate\" : null,\n\t\t\t\"startDate\" : {\n\t\t\t\t\"$date\" : 1610406000000\n\t\t\t},\n\t\t\t\"sideEffects\":{}\n\t\t},\n\t\t\"message\": \"stop takin the drug\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "controllers/user/patient/medication.js",
    "groupTitle": "Medication"
  },
  {
    "type": "put",
    "url": "https://health29.org/api/medication/:medicationId",
    "title": "Update medication",
    "name": "updateMedication",
    "description": "<p>This method update the medication of a patient</p>",
    "group": "Medication",
    "version": "1.0.0",
    "examples": [
      {
        "title": "Example usage:",
        "content": "  var medication = {\n\t\t\t\"dose\" : \"32\",\n\t\t\t\"drug\" : \"Endocrinology - Metformin\",\n\t\t\t\"vaccinationDate\" : {\n\t\t\t\t$date\" : 1611593911550\n\t\t\t},\n\t\t\t\"notes\":\"note1\",\n\t\t\t\"endDate\" : null,\n\t\t\t\"startDate\" : {\n\t\t\t\t\"$date\" : 1610406000000\n\t\t\t},\n\t\t\t\"sideEffects\":{}\n\t };\n  this.http.put('https://health29.org/api/medication/'+medicationId, medication)\n   .subscribe( (res : any) => {\n     console.log('medication: '+ res.medication);\n    }, (err) => {\n     ...\n    }",
        "type": "js"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Users unique access-key. For this, go to  <a href=\"#api-Access_token-signIn\">Get token</a></p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n  \"authorization\": \"Bearer eyJ0eXAiOiJKV1QiLCJhbGciPgDIUzI1NiJ9.eyJzdWIiOiI1M2ZlYWQ3YjY1YjM0ZTQ0MGE4YzRhNmUyMzVhNDFjNjEyOThiMWZjYTZjMjXkZTUxMTA9OGVkN2NlODMxYWY3IiwiaWF0IjoxNTIwMzUzMDMwLCJlcHAiOjE1NTE4ODkwMzAsInJvbGUiOiJVc2VyIiwiZ3JvdDEiOiJEdWNoZW5uZSBQYXJlbnQgUHJfrmVjdCBOZXRoZXJsYW5kcyJ9.MloW8eeJ857FY7-vwxJaMDajFmmVStGDcnfHfGJx05k\"\n}",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "medicationId",
            "description": "<p>Medication unique ID.</p>"
          }
        ],
        "body": [
          {
            "group": "body",
            "type": "Object",
            "optional": false,
            "field": "value",
            "description": "<p>Patient's medication.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "medication",
            "description": "<p>Patient's medication.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>If the medication has been updated correctly, it returns the message 'Medication updated'.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n\t\t\"medication\":\n\t\t{\n\t\t\t\"_id\" : <medicationId>,\n\t\t\t\"dose\" : \"32\",\n\t\t\t\"drug\" : \"Endocrinology - Metformin\",\n\t\t\t\"vaccinationDate\" : {\n\t\t\t\t$date\" : 1611593911550\n\t\t\t},\n\t\t\t\"notes\":\"note1\",\n\t\t\t\"endDate\" : null,\n\t\t\t\"startDate\" : {\n\t\t\t\t\"$date\" : 1610406000000\n\t\t\t},\n\t\t\t\"sideEffects\":{}\n\t\t},\n\t\t\"message\": \"Medication updated\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "controllers/user/patient/medication.js",
    "groupTitle": "Medication"
  },
  {
    "type": "post",
    "url": "https://health29.org/api/patients/updateSubscriptionTrue/:patientId",
    "title": "Add subscriptions to group alerts/notifications for a patient",
    "name": "addSubscriptionToGroupAlerts",
    "description": "<p>This method adds subscriptions to group alerts/notifications for a patient</p>",
    "group": "Notifications",
    "version": "1.0.0",
    "examples": [
      {
        "title": "Example usage:",
        "content": "this.http.post('https://health29.org/api/patients/updateSubscriptionTrue/'+patientId,{})\n .subscribe( (res : any) => {\n   console.log('Add subscriptions to group alerts/notifications for a patient ok');\n  }, (err) => {\n   ...\n  }",
        "type": "js"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Users unique access-key. For this, go to  <a href=\"#api-Access_token-signIn\">Get token</a></p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n  \"authorization\": \"Bearer eyJ0eXAiOiJKV1QiLCJhbGciPgDIUzI1NiJ9.eyJzdWIiOiI1M2ZlYWQ3YjY1YjM0ZTQ0MGE4YzRhNmUyMzVhNDFjNjEyOThiMWZjYTZjMjXkZTUxMTA9OGVkN2NlODMxYWY3IiwiaWF0IjoxNTIwMzUzMDMwLCJlcHAiOjE1NTE4ODkwMzAsInJvbGUiOiJVc2VyIiwiZ3JvdDEiOiJEdWNoZW5uZSBQYXJlbnQgUHJfrmVjdCBOZXRoZXJsYW5kcyJ9.MloW8eeJ857FY7-vwxJaMDajFmmVStGDcnfHfGJx05k\"\n}",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "patientId",
            "description": "<p>Patient unique ID. More info here:  <a href=\"#api-Patients-getPatientsUser\">Get patientId</a></p>"
          }
        ],
        "body": [
          {
            "group": "body",
            "type": "Object",
            "optional": false,
            "field": "Empty",
            "description": "<p>Body empty.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "Patient",
            "description": "<p>Patient's data.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>If subscriptions to group alerts/notifications for a patient has been added correctly, it returns the message 'Patient info updated'</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n\t\t\"Patient\": {\n\t\t\tpatientName: <patientName>,\n\t\t\tsurname: <surname>,\n\t\t\tbirthDate: <birthDate>,\n\t\t\tcitybirth: <citybirth>,\n\t\t\tprovincebirth: <provincebirth>,\n\t\t\tcountrybirth: <countrybirth>,\n\t\t\tstreet: <street>,\n\t\t\tpostalCode: <postalCode>,\n\t\t\tcity: <city>,\n\t\t\tprovince: <province>,\n\t\t\tcountry: <country>,\n\t\t\tphone1: <phone1>,\n\t\t\tphone2: <phone2>,\n\t\t\tgender: <gender>,\n\t\t\tsiblings: <siblings>,\n\t\t\tparents: <parents>,\n\t\t\tcreatedBy: <user reference>,\n\t\t\tdeath: <death>,\n\t\t\tnotes: <notes>,\n\t\t\tanswers: <answers>,\n\t\t\tsubscriptionToGroupAlerts:true\n\t\t}\n\t\t\"message\":'Patient info updated'\n}",
          "type": "json"
        }
      ]
    },
    "filename": "controllers/user/patient.js",
    "groupTitle": "Notifications"
  },
  {
    "type": "delete",
    "url": "https://health29.org/api/patients/updateSubscriptionFalse/:patientId",
    "title": "Delete subscriptions to group alerts/notifications for a patient",
    "name": "deleteSubscriptionToGroupAlerts",
    "description": "<p>This method deletes subscriptions to group alerts/notifications for a patient</p>",
    "group": "Notifications",
    "version": "1.0.0",
    "examples": [
      {
        "title": "Example usage:",
        "content": "this.http.delete('https://health29.org/api/patients/updateSubscriptionFalse/'+patientId)\n .subscribe( (res : any) => {\n   console.log('Delete subscriptions to group alerts/notifications for a patient ok');\n  }, (err) => {\n   ...\n  }",
        "type": "js"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Users unique access-key. For this, go to  <a href=\"#api-Access_token-signIn\">Get token</a></p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n  \"authorization\": \"Bearer eyJ0eXAiOiJKV1QiLCJhbGciPgDIUzI1NiJ9.eyJzdWIiOiI1M2ZlYWQ3YjY1YjM0ZTQ0MGE4YzRhNmUyMzVhNDFjNjEyOThiMWZjYTZjMjXkZTUxMTA9OGVkN2NlODMxYWY3IiwiaWF0IjoxNTIwMzUzMDMwLCJlcHAiOjE1NTE4ODkwMzAsInJvbGUiOiJVc2VyIiwiZ3JvdDEiOiJEdWNoZW5uZSBQYXJlbnQgUHJfrmVjdCBOZXRoZXJsYW5kcyJ9.MloW8eeJ857FY7-vwxJaMDajFmmVStGDcnfHfGJx05k\"\n}",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "patientId",
            "description": "<p>Patient unique ID. More info here:  <a href=\"#api-Patients-getPatientsUser\">Get patientId</a></p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "Patient",
            "description": "<p>Patient's data.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>If subscriptions to group alerts/notifications for a patient has been deleted correctly, it returns the message 'Patient info updated'</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n\t\t\"Patient\": {\n\t\t\tpatientName: <patientName>,\n\t\t\tsurname: <surname>,\n\t\t\tbirthDate: <birthDate>,\n\t\t\tcitybirth: <citybirth>,\n\t\t\tprovincebirth: <provincebirth>,\n\t\t\tcountrybirth: <countrybirth>,\n\t\t\tstreet: <street>,\n\t\t\tpostalCode: <postalCode>,\n\t\t\tcity: <city>,\n\t\t\tprovince: <province>,\n\t\t\tcountry: <country>,\n\t\t\tphone1: <phone1>,\n\t\t\tphone2: <phone2>,\n\t\t\tgender: <gender>,\n\t\t\tsiblings: <siblings>,\n\t\t\tparents: <parents>,\n\t\t\tcreatedBy: <user reference>,\n\t\t\tdeath: <death>,\n\t\t\tnotes: <notes>,\n\t\t\tanswers: <answers>,\n\t\t\tsubscriptionToGroupAlerts:false\n\t\t}\n\t\t\"message\":'Patient info updated'\n}",
          "type": "json"
        }
      ]
    },
    "filename": "controllers/user/patient.js",
    "groupTitle": "Notifications"
  },
  {
    "type": "get",
    "url": "https://health29.org/api/alerts/alertsNotReadAndTranslatedName/",
    "title": "Request list alerts of patient not read",
    "name": "getAlertsNotReadAndTranslatedName",
    "description": "<p>This method request the list of specific alerts of a patient not read and in selected language.</p>",
    "group": "Notifications",
    "version": "1.0.0",
    "examples": [
      {
        "title": "Example usage:",
        "content": "var params = <patientId>-code-<lang>\nthis.http.get('https://health29.org/api/alerts/alertsNotReadAndTranslatedName/'+params)\n .subscribe( (res : any) => {\n   console.log('Get list of specific alerts of a patient not read and in selected language ok');\n  }, (err) => {\n   ...\n  }",
        "type": "js"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Users unique access-key. For this, go to  <a href=\"#api-Access_token-signIn\">Get token</a></p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n  \"authorization\": \"Bearer eyJ0eXAiOiJKV1QiLCJhbGciPgDIUzI1NiJ9.eyJzdWIiOiI1M2ZlYWQ3YjY1YjM0ZTQ0MGE4YzRhNmUyMzVhNDFjNjEyOThiMWZjYTZjMjXkZTUxMTA9OGVkN2NlODMxYWY3IiwiaWF0IjoxNTIwMzUzMDMwLCJlcHAiOjE1NTE4ODkwMzAsInJvbGUiOiJVc2VyIiwiZ3JvdDEiOiJEdWNoZW5uZSBQYXJlbnQgUHJfrmVjdCBOZXRoZXJsYW5kcyJ9.MloW8eeJ857FY7-vwxJaMDajFmmVStGDcnfHfGJx05k\"\n}",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "patientId-code-lang",
            "description": "<p>The unique identifier of a patient and the code of the language selected.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "Result",
            "description": "<p>Returns list of specific alerts of a patient not read and in selected language</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n [\n     {\n     \t\"_id\" : <alertId>,\n     \t\"endDate\" : null,\n     \t    \"url\" : [\n     \t        {\n     \t            \"name\" : [\n     \t                {\n     \t                    \"translation\" : \"Take me to respiratory section\",\n     \t                    \"code\" : \"en\"\n     \t                },\n     \t                {\n     \t                    \"translation\" : \"Llévame a la sección respiratoria\",\n     \t                    \"code\" : \"es\"\n     \t                },\n     \t                {\n     \t                    \"translation\" : \"Ga naar de luchtwegen\",\n     \t                    \"code\" : \"nl\"\n     \t                }\n     \t            ],\n     \t            \"url\" : \"/user/clinicinfo/courseofthedisease#Respiratory condition\"\n     \t        },\n     \t    ],\n     \t\"launchDate\" : {\n     \t    \"$date\" : 1576796400000\n     \t},\n     \t\"translatedName\" : [\n     \t    {\n     \t        \"translation\" : \"It's important to follow up on your pulmonary function: have you recently visited your pulmonologist?\",\n     \t        \"title\" : \"Visits to pulmonologist\",\n     \t        \"code\" : \"en\"\n     \t    },\n     \t    {\n     \t        \"translation\" : \"Es importante hacer un seguimiento de tu función pulmonar: ¿has visitado recientemente a tu neumólogo?\",\n     \t        \"title\" : \"Visitas al neumólogo\",\n     \t        \"code\" : \"es\"\n     \t    }\n     \t],\n     \t\"identifier\" : \"1\",\n     \t\"type\" : \"6months\",\n     \t\"groupId\" : <groupId>,\n     \t\"importance\" : \"\",\n     \t\"logo\" : \"\",\n     \t\"color\" : \"\",\n     \t\"role\" : \"User\",\n     \t\"receiver\" : {\n     \t    \"type\" : \"broadcast\",\n     \t    \"data\" : [ ]\n     \t}\n     }\n\t]",
          "type": "json"
        }
      ]
    },
    "filename": "controllers/all/alerts.js",
    "groupTitle": "Notifications"
  },
  {
    "type": "get",
    "url": "https://health29.org/api/alerts/alertsReadAndTranslatedName/",
    "title": "Request list alerts of a patient read",
    "name": "getAlertsReadAndTranslatedName",
    "description": "<p>This method request the list of specific alerts of a patient read and in selected language.</p>",
    "group": "Notifications",
    "version": "1.0.0",
    "examples": [
      {
        "title": "Example usage:",
        "content": "var params = <patientId>-code-<lang>\nthis.http.get('https://health29.org/api/alerts/alertsReadAndTranslatedName/'+params)\n .subscribe( (res : any) => {\n   console.log('Get list of specific alerts of a patient read and in selected language ok');\n  }, (err) => {\n   ...\n  }",
        "type": "js"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Users unique access-key. For this, go to  <a href=\"#api-Access_token-signIn\">Get token</a></p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n  \"authorization\": \"Bearer eyJ0eXAiOiJKV1QiLCJhbGciPgDIUzI1NiJ9.eyJzdWIiOiI1M2ZlYWQ3YjY1YjM0ZTQ0MGE4YzRhNmUyMzVhNDFjNjEyOThiMWZjYTZjMjXkZTUxMTA9OGVkN2NlODMxYWY3IiwiaWF0IjoxNTIwMzUzMDMwLCJlcHAiOjE1NTE4ODkwMzAsInJvbGUiOiJVc2VyIiwiZ3JvdDEiOiJEdWNoZW5uZSBQYXJlbnQgUHJfrmVjdCBOZXRoZXJsYW5kcyJ9.MloW8eeJ857FY7-vwxJaMDajFmmVStGDcnfHfGJx05k\"\n}",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "patientId-code-lang",
            "description": "<p>The unique identifier of a patient and the code of the language selected.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "Result",
            "description": "<p>Returns list of specific alerts of a patient not read and in selected language</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n [\n     {\n     \t\"_id\" : <alertId>,\n     \t\"endDate\" : null,\n     \t    \"url\" : [\n     \t        {\n     \t            \"name\" : [\n     \t                {\n     \t                    \"translation\" : \"Take me to respiratory section\",\n     \t                    \"code\" : \"en\"\n     \t                },\n     \t                {\n     \t                    \"translation\" : \"Llévame a la sección respiratoria\",\n     \t                    \"code\" : \"es\"\n     \t                },\n     \t                {\n     \t                    \"translation\" : \"Ga naar de luchtwegen\",\n     \t                    \"code\" : \"nl\"\n     \t                }\n     \t            ],\n     \t            \"url\" : \"/user/clinicinfo/courseofthedisease#Respiratory condition\"\n     \t        },\n     \t    ],\n     \t\"launchDate\" : {\n     \t    \"$date\" : 1576796400000\n     \t},\n     \t\"translatedName\" : [\n     \t    {\n     \t        \"translation\" : \"It's important to follow up on your pulmonary function: have you recently visited your pulmonologist?\",\n     \t        \"title\" : \"Visits to pulmonologist\",\n     \t        \"code\" : \"en\"\n     \t    },\n     \t    {\n     \t        \"translation\" : \"Es importante hacer un seguimiento de tu función pulmonar: ¿has visitado recientemente a tu neumólogo?\",\n     \t        \"title\" : \"Visitas al neumólogo\",\n     \t        \"code\" : \"es\"\n     \t    }\n     \t],\n     \t\"identifier\" : \"1\",\n     \t\"type\" : \"6months\",\n     \t\"groupId\" : <groupId>,\n     \t\"importance\" : \"\",\n     \t\"logo\" : \"\",\n     \t\"color\" : \"\",\n     \t\"role\" : \"User\",\n     \t\"receiver\" : {\n     \t    \"type\" : \"broadcast\",\n     \t    \"data\" : [ ]\n     \t}\n     }\n\t]",
          "type": "json"
        }
      ]
    },
    "filename": "controllers/all/alerts.js",
    "groupTitle": "Notifications"
  },
  {
    "type": "get",
    "url": "https://health29.org/api/patients/getSubscriptionToGroupAlerts/:patientId",
    "title": "Get subscriptions to group alerts/notifications for a patient",
    "name": "getSubscriptionToGroupAlerts",
    "description": "<p>This method returns the subscriptions to group alerts/notifications for a patient</p>",
    "group": "Notifications",
    "version": "1.0.0",
    "examples": [
      {
        "title": "Example usage:",
        "content": "this.http.get('https://health29.org/api/patients/getSubscriptionToGroupAlerts/'+patientId)\n .subscribe( (res : any) => {\n   console.log('Get subscriptions to group alerts/notifications for a patient ok');\n  }, (err) => {\n   ...\n  }",
        "type": "js"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Users unique access-key. For this, go to  <a href=\"#api-Access_token-signIn\">Get token</a></p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n  \"authorization\": \"Bearer eyJ0eXAiOiJKV1QiLCJhbGciPgDIUzI1NiJ9.eyJzdWIiOiI1M2ZlYWQ3YjY1YjM0ZTQ0MGE4YzRhNmUyMzVhNDFjNjEyOThiMWZjYTZjMjXkZTUxMTA9OGVkN2NlODMxYWY3IiwiaWF0IjoxNTIwMzUzMDMwLCJlcHAiOjE1NTE4ODkwMzAsInJvbGUiOiJVc2VyIiwiZ3JvdDEiOiJEdWNoZW5uZSBQYXJlbnQgUHJfrmVjdCBOZXRoZXJsYW5kcyJ9.MloW8eeJ857FY7-vwxJaMDajFmmVStGDcnfHfGJx05k\"\n}",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "patientId",
            "description": "<p>Patient unique ID. More info here:  <a href=\"#api-Patients-getPatientsUser\">Get patientId</a></p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "subscription",
            "description": "<p>Patient's subscription to group alerts/notifications status.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n\t\t\"subscription\": true\n}",
          "type": "json"
        }
      ]
    },
    "filename": "controllers/user/patient.js",
    "groupTitle": "Notifications"
  },
  {
    "type": "get",
    "url": "https://health29.org/api/useralertsp/",
    "title": "Request list of patient alerts.",
    "name": "getUserAlerts",
    "description": "<p>This method request the list of patient alerts.</p>",
    "group": "Notifications",
    "version": "1.0.0",
    "examples": [
      {
        "title": "Example usage:",
        "content": "var params = <patientId>\nthis.http.get('https://health29.org/api/useralerts/'+params)\n .subscribe( (res : any) => {\n   console.log('Get list of alerts of a patient ok');\n  }, (err) => {\n   ...\n  }",
        "type": "js"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Users unique access-key. For this, go to  <a href=\"#api-Access_token-signIn\">Get token</a></p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n  \"authorization\": \"Bearer eyJ0eXAiOiJKV1QiLCJhbGciPgDIUzI1NiJ9.eyJzdWIiOiI1M2ZlYWQ3YjY1YjM0ZTQ0MGE4YzRhNmUyMzVhNDFjNjEyOThiMWZjYTZjMjXkZTUxMTA9OGVkN2NlODMxYWY3IiwiaWF0IjoxNTIwMzUzMDMwLCJlcHAiOjE1NTE4ODkwMzAsInJvbGUiOiJVc2VyIiwiZ3JvdDEiOiJEdWNoZW5uZSBQYXJlbnQgUHJfrmVjdCBOZXRoZXJsYW5kcyJ9.MloW8eeJ857FY7-vwxJaMDajFmmVStGDcnfHfGJx05k\"\n}",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "patientId",
            "description": "<p>The unique identifier of a patient.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "Result",
            "description": "<p>Returns list of alerts of a patient</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n [\n     {\n\t    \t\"_id\" : <user alert id>,\n\t    \t\"showDate\" : {\n\t    \t\t\"$date\" : 1576796400000\n\t    \t},\n\t    \t\"launch\" : false,\n\t    \t\"snooze\" : \"1\",\n\t    \t\"state\" : \"Read\",\n\t    \t\"patientId\" : <patientId>,\n\t    \t\"alertId\" : <alertId>,\n\t    \t\"__v\" : 0\n\t    }\n\t]",
          "type": "json"
        }
      ]
    },
    "filename": "controllers/all/useralerts.js",
    "groupTitle": "Notifications"
  },
  {
    "type": "delete",
    "url": "https://health29.org/api/othermedications/:medicationId",
    "title": "Delete Other medication by identifier",
    "name": "deleteOtherMedication",
    "description": "<p>This method delete a specific Other Medication of a patient by identifier</p>",
    "group": "Other_Medication",
    "version": "1.0.0",
    "examples": [
      {
        "title": "Example usage:",
        "content": "this.http.delete('https://health29.org/api/othermedications/'+medicationId)\n .subscribe( (res : any) => {\n   console.log('Delete medication ok');\n  }, (err) => {\n   ...\n  }",
        "type": "js"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Users unique access-key. For this, go to  <a href=\"#api-Access_token-signIn\">Get token</a></p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n  \"authorization\": \"Bearer eyJ0eXAiOiJKV1QiLCJhbGciPgDIUzI1NiJ9.eyJzdWIiOiI1M2ZlYWQ3YjY1YjM0ZTQ0MGE4YzRhNmUyMzVhNDFjNjEyOThiMWZjYTZjMjXkZTUxMTA9OGVkN2NlODMxYWY3IiwiaWF0IjoxNTIwMzUzMDMwLCJlcHAiOjE1NTE4ODkwMzAsInJvbGUiOiJVc2VyIiwiZ3JvdDEiOiJEdWNoZW5uZSBQYXJlbnQgUHJfrmVjdCBOZXRoZXJsYW5kcyJ9.MloW8eeJ857FY7-vwxJaMDajFmmVStGDcnfHfGJx05k\"\n}",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "medicationId",
            "description": "<p>Other medication unique ID</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>If Other medication has been deleted correctly, it returns the message 'The drug has been deleted'.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n  {\n    \"message\":\"The drug has been deleted\"\n  }",
          "type": "json"
        }
      ]
    },
    "filename": "controllers/user/patient/other-medication.js",
    "groupTitle": "Other_Medication"
  },
  {
    "type": "get",
    "url": "https://health29.org/api/othermedicationName/:patientIdAndMedicationName",
    "title": "Get Other medication for patient and by name",
    "name": "getOtherMedicationName",
    "description": "<p>This method read Medication of a patient by name</p>",
    "group": "Other_Medication",
    "version": "1.0.0",
    "examples": [
      {
        "title": "Example usage:",
        "content": "this.http.get('https://health29.org/api/othermedicationName/'+patientId-code-MedicationName)\n .subscribe( (res : any) => {\n   console.log('medication: '+ res);\n  }, (err) => {\n   ...\n  }",
        "type": "js"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Users unique access-key. For this, go to  <a href=\"#api-Access_token-signIn\">Get token</a></p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n  \"authorization\": \"Bearer eyJ0eXAiOiJKV1QiLCJhbGciPgDIUzI1NiJ9.eyJzdWIiOiI1M2ZlYWQ3YjY1YjM0ZTQ0MGE4YzRhNmUyMzVhNDFjNjEyOThiMWZjYTZjMjXkZTUxMTA9OGVkN2NlODMxYWY3IiwiaWF0IjoxNTIwMzUzMDMwLCJlcHAiOjE1NTE4ODkwMzAsInJvbGUiOiJVc2VyIiwiZ3JvdDEiOiJEdWNoZW5uZSBQYXJlbnQgUHJfrmVjdCBOZXRoZXJsYW5kcyJ9.MloW8eeJ857FY7-vwxJaMDajFmmVStGDcnfHfGJx05k\"\n}",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "patientId-code-medicationName",
            "description": "<p>Patient unique ID. More info here:  <a href=\"#api-Patients-getPatientsUser\">Get patientId</a></p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "medicationId",
            "description": "<p>For each medication: Medication unique ID.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "notes",
            "description": "<p>For each medication: Other medication notes.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "type",
            "description": "<p>For each medication: Other value.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "dose",
            "description": "<p>For each medication: Other medication dose.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>For each medication: Other medication name.</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "endDate",
            "description": "<p>For each medication: on which the patient ends with other medication.</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "startDate",
            "description": "<p>For each medication: on which the patient starts with other medication.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "freesideEffects",
            "description": "<p>For each medication: Other medication freesideEffects added by the patient.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "compassionateUse",
            "description": "<p>For each medication: Other medication compassionate use.</p>"
          }
        ],
        "Success 202": [
          {
            "group": "Success 202",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>If there is no medication with this name for the patient, it will return: &quot;medication not found&quot;</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n  {\n    \"_id\":\"<other medication id>,\n\t\t\"notes\" : \"\",\n\t\t\"type\" : \"Other\",\n\t\t\"dose\" : \"1000\",\n\t\t\"name\" : \"test\",\n\t\t\"endDate\" : null,\n\t\t\"startDate\" : {\n\t\t\t\"$date\" : 1610406000000\n\t\t},\n\t\t\"freesideEffects\" : \"\",\n\t\t\"compassionateUse\" : \"\"\n  }\n\nHTTP/1.1 202 OK\n{message: 'medication not found'}",
          "type": "json"
        }
      ]
    },
    "filename": "controllers/user/patient/other-medication.js",
    "groupTitle": "Other_Medication"
  },
  {
    "type": "get",
    "url": "https://health29.org/api/othermedications/:patientId",
    "title": "Get Other medication list",
    "name": "getOtherMedications",
    "description": "<p>This method read Other Medication of a patient</p>",
    "group": "Other_Medication",
    "version": "1.0.0",
    "examples": [
      {
        "title": "Example usage:",
        "content": "this.http.get('https://health29.org/api/othermedications/'+patientId)\n .subscribe( (res : any) => {\n   console.log('medication: '+ res.medication);\n  }, (err) => {\n   ...\n  }",
        "type": "js"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Users unique access-key. For this, go to  <a href=\"#api-Access_token-signIn\">Get token</a></p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n  \"authorization\": \"Bearer eyJ0eXAiOiJKV1QiLCJhbGciPgDIUzI1NiJ9.eyJzdWIiOiI1M2ZlYWQ3YjY1YjM0ZTQ0MGE4YzRhNmUyMzVhNDFjNjEyOThiMWZjYTZjMjXkZTUxMTA9OGVkN2NlODMxYWY3IiwiaWF0IjoxNTIwMzUzMDMwLCJlcHAiOjE1NTE4ODkwMzAsInJvbGUiOiJVc2VyIiwiZ3JvdDEiOiJEdWNoZW5uZSBQYXJlbnQgUHJfrmVjdCBOZXRoZXJsYW5kcyJ9.MloW8eeJ857FY7-vwxJaMDajFmmVStGDcnfHfGJx05k\"\n}",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "patientId",
            "description": "<p>Patient unique ID. More info here:  <a href=\"#api-Patients-getPatientsUser\">Get patientId</a></p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "medicationId",
            "description": "<p>For each medication: Medication unique ID.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "notes",
            "description": "<p>For each medication: Other medication notes.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "type",
            "description": "<p>For each medication: Other value.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "dose",
            "description": "<p>For each medication: Other medication dose.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>For each medication: Other medication name.</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "endDate",
            "description": "<p>For each medication: on which the patient ends with other medication.</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "startDate",
            "description": "<p>For each medication: on which the patient starts with other medication.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "freesideEffects",
            "description": "<p>For each medication: Other medication freesideEffects added by the patient.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "compassionateUse",
            "description": "<p>For each medication: Other medication compassionate use.</p>"
          }
        ],
        "Success 202": [
          {
            "group": "Success 202",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>If there is no medication for the patient, it will return: &quot;There are no medication&quot;</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n  [{\n    \"_id\":\"<other medication id>,\n\t\t\"notes\" : \"\",\n\t\t\"type\" : \"Other\",\n\t\t\"dose\" : \"1000\",\n\t\t\"name\" : \"test\",\n\t\t\"endDate\" : null,\n\t\t\"startDate\" : {\n\t\t\t\"$date\" : 1610406000000\n\t\t},\n\t\t\"freesideEffects\" : \"\",\n\t\t\"compassionateUse\" : \"\"\n  }]\n\nHTTP/1.1 202 OK\n{message: 'There are no medication'}",
          "type": "json"
        }
      ]
    },
    "filename": "controllers/user/patient/other-medication.js",
    "groupTitle": "Other_Medication"
  },
  {
    "type": "get",
    "url": "https://health29.org/api/othermedicationID/:medicationId",
    "title": "Get Other medication by identifier",
    "name": "getOtherMedicationsId",
    "description": "<p>This method read a Other Medication by its identifier</p>",
    "group": "Other_Medication",
    "version": "1.0.0",
    "examples": [
      {
        "title": "Example usage:",
        "content": "this.http.get('https://health29.org/api/othermedicationID/'+medicationId)\n .subscribe( (res : any) => {\n   console.log('medication: '+ res.medication);\n  }, (err) => {\n   ...\n  }",
        "type": "js"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Users unique access-key. For this, go to  <a href=\"#api-Access_token-signIn\">Get token</a></p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n  \"authorization\": \"Bearer eyJ0eXAiOiJKV1QiLCJhbGciPgDIUzI1NiJ9.eyJzdWIiOiI1M2ZlYWQ3YjY1YjM0ZTQ0MGE4YzRhNmUyMzVhNDFjNjEyOThiMWZjYTZjMjXkZTUxMTA9OGVkN2NlODMxYWY3IiwiaWF0IjoxNTIwMzUzMDMwLCJlcHAiOjE1NTE4ODkwMzAsInJvbGUiOiJVc2VyIiwiZ3JvdDEiOiJEdWNoZW5uZSBQYXJlbnQgUHJfrmVjdCBOZXRoZXJsYW5kcyJ9.MloW8eeJ857FY7-vwxJaMDajFmmVStGDcnfHfGJx05k\"\n}",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "medicationId",
            "description": "<p>Medication unique ID.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "medicationId",
            "description": "<p>Medication unique ID.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "notes",
            "description": "<p>Other medication notes.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "type",
            "description": "<p>Other value.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "dose",
            "description": "<p>Other medication dose.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Other medication name.</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "endDate",
            "description": "<p>on which the patient ends with other medication.</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "startDate",
            "description": "<p>on which the patient starts with other medication.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "freesideEffects",
            "description": "<p>Other medication freesideEffects added by the patient.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "compassionateUse",
            "description": "<p>Other medication compassionate use.</p>"
          }
        ],
        "Success 202": [
          {
            "group": "Success 202",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>If there is no medication for the patient, it will return: &quot;There are no medication&quot;</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n  {\n    \"_id\":\"<other medication id>,\n\t\t\"notes\" : \"\",\n\t\t\"type\" : \"Other\",\n\t\t\"dose\" : \"1000\",\n\t\t\"name\" : \"test\",\n\t\t\"endDate\" : null,\n\t\t\"startDate\" : {\n\t\t\t\"$date\" : 1610406000000\n\t\t},\n\t\t\"freesideEffects\" : \"\",\n\t\t\"compassionateUse\" : \"\"\n  }\n\nHTTP/1.1 202 OK\n{message: 'There are no medication'}",
          "type": "json"
        }
      ]
    },
    "filename": "controllers/user/patient/other-medication.js",
    "groupTitle": "Other_Medication"
  },
  {
    "type": "post",
    "url": "https://health29.org/api/othermedication/:patientId",
    "title": "New Other medication",
    "name": "saveOtherMedication",
    "description": "<p>This method create a new Other medication of a patient</p>",
    "group": "Other_Medication",
    "version": "1.0.0",
    "examples": [
      {
        "title": "Example usage:",
        "content": "var medication = {value: \"43\", dateTime: \"2018-02-27T17:55:48.261Z\"};\nthis.http.post('https://health29.org/api/othermedication/'+patientId, medication)\n .subscribe( (res : any) => {\n   console.log('medication: '+ res.medication);\n  }, (err) => {\n   ...\n  }",
        "type": "js"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Users unique access-key. For this, go to  <a href=\"#api-Access_token-signIn\">Get token</a></p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n  \"authorization\": \"Bearer eyJ0eXAiOiJKV1QiLCJhbGciPgDIUzI1NiJ9.eyJzdWIiOiI1M2ZlYWQ3YjY1YjM0ZTQ0MGE4YzRhNmUyMzVhNDFjNjEyOThiMWZjYTZjMjXkZTUxMTA9OGVkN2NlODMxYWY3IiwiaWF0IjoxNTIwMzUzMDMwLCJlcHAiOjE1NTE4ODkwMzAsInJvbGUiOiJVc2VyIiwiZ3JvdDEiOiJEdWNoZW5uZSBQYXJlbnQgUHJfrmVjdCBOZXRoZXJsYW5kcyJ9.MloW8eeJ857FY7-vwxJaMDajFmmVStGDcnfHfGJx05k\"\n}",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "patientId",
            "description": "<p>Patient unique ID. More info here:  <a href=\"#api-Patients-getPatientsUser\">Get patientId</a></p>"
          }
        ],
        "body": [
          {
            "group": "body",
            "type": "Object",
            "optional": false,
            "field": "value",
            "description": "<p>Patient's medication. You set the dateTime and the medication</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "_id",
            "description": "<p>Medication unique ID.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "value",
            "description": "<p>Patient's medication. You get the medication</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>If the medication has been created correctly, it returns the message 'Medication created'.</p>"
          }
        ],
        "Success 202": [
          {
            "group": "Success 202",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>If there is no medication for the patient, it will return: &quot;There are no medication&quot;</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\"medication\":\n  {\n    \"_id\":\"5a6f4b83f440d806744f3ef6\",\n    \"value\":\"43\",\n   \"dateTime\":\"2018-02-27T17:55:48.261Z\"\n  },\nmessage: \"Medication created\"\n}\n\nHTTP/1.1 202 OK\n{message: 'There are no medication'}",
          "type": "json"
        }
      ]
    },
    "filename": "controllers/user/patient/other-medication.js",
    "groupTitle": "Other_Medication"
  },
  {
    "type": "put",
    "url": "https://health29.org/api/othermedication/:medicationId",
    "title": "Update Other medication",
    "name": "updateOtherMedication",
    "description": "<p>This method update the Other medication of a patient</p>",
    "group": "Other_Medication",
    "version": "1.0.0",
    "examples": [
      {
        "title": "Example usage:",
        "content": "var medication = {value: \"43\", dateTime:\"2018-02-27T17:55:48.261Z\"};\nthis.http.put('https://health29.org/api/othermedication/'+medicationId, medication)\n .subscribe( (res : any) => {\n   console.log('medication: '+ res.medication);\n  }, (err) => {\n   ...\n  }",
        "type": "js"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Users unique access-key. For this, go to  <a href=\"#api-Access_token-signIn\">Get token</a></p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n  \"authorization\": \"Bearer eyJ0eXAiOiJKV1QiLCJhbGciPgDIUzI1NiJ9.eyJzdWIiOiI1M2ZlYWQ3YjY1YjM0ZTQ0MGE4YzRhNmUyMzVhNDFjNjEyOThiMWZjYTZjMjXkZTUxMTA9OGVkN2NlODMxYWY3IiwiaWF0IjoxNTIwMzUzMDMwLCJlcHAiOjE1NTE4ODkwMzAsInJvbGUiOiJVc2VyIiwiZ3JvdDEiOiJEdWNoZW5uZSBQYXJlbnQgUHJfrmVjdCBOZXRoZXJsYW5kcyJ9.MloW8eeJ857FY7-vwxJaMDajFmmVStGDcnfHfGJx05k\"\n}",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "medicationId",
            "description": "<p>Medication unique ID.</p>"
          }
        ],
        "body": [
          {
            "group": "body",
            "type": "Object",
            "optional": false,
            "field": "value",
            "description": "<p>Patient's medication.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "value",
            "description": "<p>Patient's medication. You get the medication</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>If the medication has been updated correctly, it returns the message 'Medication updated'.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\"medication\":\n  {\n    \"_id\":\"5a6f4b83f440d806744f3ef6\",\n    \"value\":\"43\",\n   \"dateTime\":\"2018-02-27T17:55:48.261Z\"\n  },\n\t\"message\": \"Medication updated\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "controllers/user/patient/other-medication.js",
    "groupTitle": "Other_Medication"
  },
  {
    "type": "delete",
    "url": "https://health29.org/api/patients/:patientId",
    "title": "Delete patient",
    "name": "deletePatient",
    "description": "<p>This method deletes a Patient</p>",
    "group": "Patients",
    "version": "1.0.0",
    "examples": [
      {
        "title": "Example usage:",
        "content": "this.http.delete('https://health29.org/api/patients/'+patientId)\n .subscribe( (res : any) => {\n   console.log('Delete patient ok');\n  }, (err) => {\n   ...\n  }",
        "type": "js"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Users unique access-key. For this, go to  <a href=\"#api-Access_token-signIn\">Get token</a></p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n  \"authorization\": \"Bearer eyJ0eXAiOiJKV1QiLCJhbGciPgDIUzI1NiJ9.eyJzdWIiOiI1M2ZlYWQ3YjY1YjM0ZTQ0MGE4YzRhNmUyMzVhNDFjNjEyOThiMWZjYTZjMjXkZTUxMTA9OGVkN2NlODMxYWY3IiwiaWF0IjoxNTIwMzUzMDMwLCJlcHAiOjE1NTE4ODkwMzAsInJvbGUiOiJVc2VyIiwiZ3JvdDEiOiJEdWNoZW5uZSBQYXJlbnQgUHJfrmVjdCBOZXRoZXJsYW5kcyJ9.MloW8eeJ857FY7-vwxJaMDajFmmVStGDcnfHfGJx05k\"\n}",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "patientId",
            "description": "<p>Patient unique ID. More info here:  <a href=\"#api-Patients-getPatientsUser\">Get patientId</a></p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>If patient has been deleted correctly, it returns the message 'The patient has been eliminated.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n\t\t\"message\":'The patient has been eliminated'\n}",
          "type": "json"
        }
      ]
    },
    "filename": "controllers/user/patient.js",
    "groupTitle": "Patients"
  },
  {
    "type": "get",
    "url": "https://health29.org/api/patients/:patientId",
    "title": "Get patient",
    "name": "getPatient",
    "description": "<p>This method read data of a Patient</p>",
    "group": "Patients",
    "version": "1.0.0",
    "examples": [
      {
        "title": "Example usage:",
        "content": "this.http.get('https://health29.org/api/patients/'+patientId)\n .subscribe( (res : any) => {\n   console.log('patient info: '+ res.patient);\n  }, (err) => {\n   ...\n  }",
        "type": "js"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Users unique access-key. For this, go to  <a href=\"#api-Access_token-signIn\">Get token</a></p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n  \"authorization\": \"Bearer eyJ0eXAiOiJKV1QiLCJhbGciPgDIUzI1NiJ9.eyJzdWIiOiI1M2ZlYWQ3YjY1YjM0ZTQ0MGE4YzRhNmUyMzVhNDFjNjEyOThiMWZjYTZjMjXkZTUxMTA9OGVkN2NlODMxYWY3IiwiaWF0IjoxNTIwMzUzMDMwLCJlcHAiOjE1NTE4ODkwMzAsInJvbGUiOiJVc2VyIiwiZ3JvdDEiOiJEdWNoZW5uZSBQYXJlbnQgUHJfrmVjdCBOZXRoZXJsYW5kcyJ9.MloW8eeJ857FY7-vwxJaMDajFmmVStGDcnfHfGJx05k\"\n}",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "patientId",
            "description": "<p>Patient unique ID. More info here:  <a href=\"#api-Patients-getPatientsUser\">Get patientId</a></p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "string",
            "allowedValues": [
              "\"male\"",
              "\"female\""
            ],
            "optional": false,
            "field": "gender",
            "description": "<p>Gender of the Patient.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "phone1",
            "description": "<p>Phone number of the Patient.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "phone2",
            "description": "<p>Other phone number of the Patient.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "country",
            "description": "<p>Country code of residence of the Patient. (<a href=\"https://github.com/astockwell/countries-and-provinces-states-regions\" target=\"_blank\">ISO_3166-2</a>)</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "province",
            "description": "<p>Province or region code of residence of the Patient. (<a href=\"https://github.com/astockwell/countries-and-provinces-states-regions\" target=\"_blank\">ISO_3166-2</a>)</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "city",
            "description": "<p>City of residence of the Patient.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "postalCode",
            "description": "<p>PostalCode of residence of the Patient.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "street",
            "description": "<p>Street of residence of the Patient.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "countrybirth",
            "description": "<p>Country birth of the Patient. (<a href=\"https://github.com/astockwell/countries-and-provinces-states-regions\" target=\"_blank\">ISO_3166-2</a>)</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "provincebirth",
            "description": "<p>Province birth of the Patient. (<a href=\"https://github.com/astockwell/countries-and-provinces-states-regions\" target=\"_blank\">ISO_3166-2</a>)</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "citybirth",
            "description": "<p>City birth of the Patient.</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "birthDate",
            "description": "<p>Date of birth of the patient.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "patientName",
            "description": "<p>Name of the Patient.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "surname",
            "description": "<p>Surname of the Patient.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "parents",
            "description": "<p>Data about parents of the Patient. The highEducation field can be ... The profession field is a free field</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "siblings",
            "description": "<p>Data about siblings of the Patient. The affected field can be yes or no. The gender field can be male or female</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\"patient\":\n  {\n    \"gender\":\"male\",\n    \"phone2\":\"\",\n    \"phone1\":\"\",\n    \"country\":\"NL\",\n    \"province\":\"Groningen\",\n    \"city\":\"narnias\",\n    \"postalCode\":\"\",\n    \"street\":\"\",\n    \"countrybirth\":\"SL\",\n    \"provincebirth\":\"Barcelona\",\n    \"citybirth\":\"narnia\",\n    \"birthDate\":\"1984-06-13T00:00:00.000Z\",\n    \"surname\":\"aa\",\n    \"patientName\":\"aa\",\n    \"parents\":[{\"_id\":\"5a6f4b71f600d806044f3ef5\",\"profession\":\"\",\"highEducation\":\"\"}],\n    \"siblings\":[{\"_id\":\"5a6f4b71f600d806044f3ef4\",\"affected\":null,\"gender\":\"\"}]\n  }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "controllers/user/patient.js",
    "groupTitle": "Patients"
  },
  {
    "type": "get",
    "url": "https://health29.org/api/admin/getPatientsForUserList/",
    "title": "Request list of patients from list user identifiers.",
    "name": "getPatientListForListOfUserIds",
    "description": "<p>This method request the list of patients from list user identifiers.</p>",
    "group": "Patients",
    "version": "1.0.0",
    "examples": [
      {
        "title": "Example usage:",
        "content": "var param = [<list user Ids>]\nthis.http.get('https://health29.org/api/admin/getPatientsForUserList/'+param)\n .subscribe( (res : any) => {\n   console.log('Get list of the patients from list user identifiers ok');\n  }, (err) => {\n   ...\n  }",
        "type": "js"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Users unique access-key. For this, go to  <a href=\"#api-Access_token-signIn\">Get token</a></p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n  \"authorization\": \"Bearer eyJ0eXAiOiJKV1QiLCJhbGciPgDIUzI1NiJ9.eyJzdWIiOiI1M2ZlYWQ3YjY1YjM0ZTQ0MGE4YzRhNmUyMzVhNDFjNjEyOThiMWZjYTZjMjXkZTUxMTA9OGVkN2NlODMxYWY3IiwiaWF0IjoxNTIwMzUzMDMwLCJlcHAiOjE1NTE4ODkwMzAsInJvbGUiOiJVc2VyIiwiZ3JvdDEiOiJEdWNoZW5uZSBQYXJlbnQgUHJfrmVjdCBOZXRoZXJsYW5kcyJ9.MloW8eeJ857FY7-vwxJaMDajFmmVStGDcnfHfGJx05k\"\n}",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String[]",
            "optional": false,
            "field": "UserIds",
            "description": "<p>A list with the user identifiers.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "Result",
            "description": "<p>Returns a message with information about the execution and the list with identifiers of the patients</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n {\n\t\t\"message\": 'Patient Ids',\n\t\t\"patientIdsList\":[<patientIdsList>]}",
          "type": "json"
        }
      ]
    },
    "filename": "controllers/admin/users.js",
    "groupTitle": "Patients"
  },
  {
    "type": "get",
    "url": "https://health29.org/api/patients-all/:userId",
    "title": "Get patient list of a user",
    "name": "getPatientsUser",
    "description": "<p>This method read the patient list of a user. For each patient you have, you will get: patientId, name, and last name.</p>",
    "group": "Patients",
    "version": "1.0.0",
    "examples": [
      {
        "title": "Example usage:",
        "content": "this.http.get('https://health29.org/api/patients-all/'+userId)\n .subscribe( (res : any) => {\n   console.log('patient list: '+ res.listpatients);\n   if(res.listpatients.length>0){\n     console.log(\"patientId\" + res.listpatients[0].sub +\", Patient Name: \"+ res.listpatients[0].patientName+\", Patient surname: \"+ res.listpatients[0].surname);\n   }\n  }, (err) => {\n   ...\n  }",
        "type": "js"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Users unique access-key. For this, go to  <a href=\"#api-Access_token-signIn\">Get token</a></p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n  \"authorization\": \"Bearer eyJ0eXAiOiJKV1QiLCJhbGciPgDIUzI1NiJ9.eyJzdWIiOiI1M2ZlYWQ3YjY1YjM0ZTQ0MGE4YzRhNmUyMzVhNDFjNjEyOThiMWZjYTZjMjXkZTUxMTA9OGVkN2NlODMxYWY3IiwiaWF0IjoxNTIwMzUzMDMwLCJlcHAiOjE1NTE4ODkwMzAsInJvbGUiOiJVc2VyIiwiZ3JvdDEiOiJEdWNoZW5uZSBQYXJlbnQgUHJfrmVjdCBOZXRoZXJsYW5kcyJ9.MloW8eeJ857FY7-vwxJaMDajFmmVStGDcnfHfGJx05k\"\n}",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "userId",
            "description": "<p>User unique ID. More info here:  <a href=\"#api-Access_token-signIn\">Get token and userId</a></p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "listpatients",
            "description": "<p>You get a list of patients (usually only one patient), with your patient id, name, and surname.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\"listpatients\":\n {\n  \"sub\": \"1499bb6faef2c95364e2f4tt2c9aef05abe2c9c72110a4514e8c4c3fb038ff30\",\n  \"patientName\": \"Jhon\",\n  \"surname\": \"Doe\"\n },\n {\n  \"sub\": \"5499bb6faef2c95364e2f4ee2c9aef05abe2c9c72110a4514e8c4c4gt038ff30\",\n  \"patientName\": \"Peter\",\n  \"surname\": \"Tosh\"\n }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "controllers/user/patient.js",
    "groupTitle": "Patients"
  },
  {
    "type": "post",
    "url": "https://health29.org/api/patients/:userId",
    "title": "New Patient",
    "name": "savePatient",
    "description": "<p>This method allows to create a new Patient</p>",
    "group": "Patients",
    "version": "1.0.0",
    "examples": [
      {
        "title": "Example usage:",
        "content": "var patient = {patientName: '', surname: '', street: '', postalCode: '', citybirth: '', provincebirth: '', countrybirth: null, city: '', province: '', country: null, phone1: '', phone2: '', birthDate: null, gender: null, siblings: [], parents: []};\nthis.http.post('https://health29.org/api/patients/'+userId, patient)\n .subscribe( (res : any) => {\n   console.log('patient info: '+ res.patientInfo);\n  }, (err) => {\n   ...\n  }",
        "type": "js"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Users unique access-key. For this, go to  <a href=\"#api-Access_token-signIn\">Get token</a></p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n  \"authorization\": \"Bearer eyJ0eXAiOiJKV1QiLCJhbGciPgDIUzI1NiJ9.eyJzdWIiOiI1M2ZlYWQ3YjY1YjM0ZTQ0MGE4YzRhNmUyMzVhNDFjNjEyOThiMWZjYTZjMjXkZTUxMTA9OGVkN2NlODMxYWY3IiwiaWF0IjoxNTIwMzUzMDMwLCJlcHAiOjE1NTE4ODkwMzAsInJvbGUiOiJVc2VyIiwiZ3JvdDEiOiJEdWNoZW5uZSBQYXJlbnQgUHJfrmVjdCBOZXRoZXJsYW5kcyJ9.MloW8eeJ857FY7-vwxJaMDajFmmVStGDcnfHfGJx05k\"\n}",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "userId",
            "description": "<p>User unique ID. More info here:  <a href=\"#api-Access_token-signIn\">Get token and userId</a></p>"
          }
        ],
        "body": [
          {
            "group": "body",
            "type": "string",
            "allowedValues": [
              "\"male\"",
              "\"female\""
            ],
            "optional": false,
            "field": "gender",
            "description": "<p>Gender of the Patient.</p>"
          },
          {
            "group": "body",
            "type": "String",
            "optional": false,
            "field": "phone1",
            "description": "<p>Phone number of the Patient.</p>"
          },
          {
            "group": "body",
            "type": "String",
            "optional": false,
            "field": "phone2",
            "description": "<p>Other phone number of the Patient.</p>"
          },
          {
            "group": "body",
            "type": "String",
            "optional": false,
            "field": "country",
            "description": "<p>Country code of residence of the Patient. (<a href=\"https://github.com/astockwell/countries-and-provinces-states-regions\" target=\"_blank\">ISO_3166-2</a>)</p>"
          },
          {
            "group": "body",
            "type": "String",
            "optional": false,
            "field": "province",
            "description": "<p>Province or region code of residence of the Patient. (<a href=\"https://github.com/astockwell/countries-and-provinces-states-regions\" target=\"_blank\">ISO_3166-2</a>)</p>"
          },
          {
            "group": "body",
            "type": "String",
            "optional": false,
            "field": "city",
            "description": "<p>City of residence of the Patient.</p>"
          },
          {
            "group": "body",
            "type": "String",
            "optional": true,
            "field": "postalCode",
            "description": "<p>PostalCode of residence of the Patient.</p>"
          },
          {
            "group": "body",
            "type": "String",
            "optional": true,
            "field": "street",
            "description": "<p>Street of residence of the Patient.</p>"
          },
          {
            "group": "body",
            "type": "String",
            "optional": false,
            "field": "countrybirth",
            "description": "<p>Country birth of the Patient. (<a href=\"https://github.com/astockwell/countries-and-provinces-states-regions\" target=\"_blank\">ISO_3166-2</a>)</p>"
          },
          {
            "group": "body",
            "type": "String",
            "optional": false,
            "field": "provincebirth",
            "description": "<p>Province birth of the Patient. (<a href=\"https://github.com/astockwell/countries-and-provinces-states-regions\" target=\"_blank\">ISO_3166-2</a>)</p>"
          },
          {
            "group": "body",
            "type": "String",
            "optional": false,
            "field": "citybirth",
            "description": "<p>City birth of the Patient.</p>"
          },
          {
            "group": "body",
            "type": "Date",
            "optional": false,
            "field": "birthDate",
            "description": "<p>Date of birth of the patient.</p>"
          },
          {
            "group": "body",
            "type": "String",
            "optional": false,
            "field": "patientName",
            "description": "<p>Name of the Patient.</p>"
          },
          {
            "group": "body",
            "type": "String",
            "optional": false,
            "field": "surname",
            "description": "<p>Surname of the Patient.</p>"
          },
          {
            "group": "body",
            "type": "Object",
            "optional": true,
            "field": "parents",
            "description": "<p>Data about parents of the Patient. The highEducation field can be ... The profession field is a free field</p>"
          },
          {
            "group": "body",
            "type": "Object",
            "optional": true,
            "field": "siblings",
            "description": "<p>Data about siblings of the Patient. The affected field can be yes or no. The gender field can be male or female</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "patientInfo",
            "description": "<p>patientId, name, and surname.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>If the patient has been created correctly, it returns the message 'Patient created'.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\"patientInfo\":\n {\n  \"sub\": \"1499bb6faef2c95364e2f4tt2c9aef05abe2c9c72110a4514e8c4c3fb038ff30\",\n  \"patientName\": \"Jhon\",\n  \"surname\": \"Doe\"\n },\n\"message\": \"Patient created\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "controllers/user/patient.js",
    "groupTitle": "Patients"
  },
  {
    "type": "put",
    "url": "https://health29.org/api/patients/:patientId",
    "title": "Update Patient",
    "name": "updatePatient",
    "description": "<p>This method allows to change the data of a patient.</p>",
    "group": "Patients",
    "version": "1.0.0",
    "examples": [
      {
        "title": "Example usage:",
        "content": "var patient = {patientName: '', surname: '', street: '', postalCode: '', citybirth: '', provincebirth: '', countrybirth: null, city: '', province: '', country: null, phone1: '', phone2: '', birthDate: null, gender: null, siblings: [], parents: []};\nthis.http.put('https://health29.org/api/patients/'+patientId, patient)\n .subscribe( (res : any) => {\n   console.log('patient info: '+ res.patientInfo);\n  }, (err) => {\n   ...\n  }",
        "type": "js"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Users unique access-key. For this, go to  <a href=\"#api-Access_token-signIn\">Get token</a></p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n  \"authorization\": \"Bearer eyJ0eXAiOiJKV1QiLCJhbGciPgDIUzI1NiJ9.eyJzdWIiOiI1M2ZlYWQ3YjY1YjM0ZTQ0MGE4YzRhNmUyMzVhNDFjNjEyOThiMWZjYTZjMjXkZTUxMTA9OGVkN2NlODMxYWY3IiwiaWF0IjoxNTIwMzUzMDMwLCJlcHAiOjE1NTE4ODkwMzAsInJvbGUiOiJVc2VyIiwiZ3JvdDEiOiJEdWNoZW5uZSBQYXJlbnQgUHJfrmVjdCBOZXRoZXJsYW5kcyJ9.MloW8eeJ857FY7-vwxJaMDajFmmVStGDcnfHfGJx05k\"\n}",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "patientId",
            "description": "<p>Patient unique ID. More info here:  <a href=\"#api-Patients-getPatientsUser\">Get patientId</a></p>"
          }
        ],
        "body": [
          {
            "group": "body",
            "type": "string",
            "allowedValues": [
              "\"male\"",
              "\"female\""
            ],
            "optional": false,
            "field": "gender",
            "description": "<p>Gender of the Patient.</p>"
          },
          {
            "group": "body",
            "type": "String",
            "optional": false,
            "field": "phone1",
            "description": "<p>Phone number of the Patient.</p>"
          },
          {
            "group": "body",
            "type": "String",
            "optional": false,
            "field": "phone2",
            "description": "<p>Other phone number of the Patient.</p>"
          },
          {
            "group": "body",
            "type": "String",
            "optional": false,
            "field": "country",
            "description": "<p>Country code of residence of the Patient. (<a href=\"https://github.com/astockwell/countries-and-provinces-states-regions\" target=\"_blank\">ISO_3166-2</a>)</p>"
          },
          {
            "group": "body",
            "type": "String",
            "optional": false,
            "field": "province",
            "description": "<p>Province or region code of residence of the Patient. (<a href=\"https://github.com/astockwell/countries-and-provinces-states-regions\" target=\"_blank\">ISO_3166-2</a>)</p>"
          },
          {
            "group": "body",
            "type": "String",
            "optional": false,
            "field": "city",
            "description": "<p>City of residence of the Patient.</p>"
          },
          {
            "group": "body",
            "type": "String",
            "optional": true,
            "field": "postalCode",
            "description": "<p>PostalCode of residence of the Patient.</p>"
          },
          {
            "group": "body",
            "type": "String",
            "optional": true,
            "field": "street",
            "description": "<p>Street of residence of the Patient.</p>"
          },
          {
            "group": "body",
            "type": "String",
            "optional": false,
            "field": "countrybirth",
            "description": "<p>Country birth of the Patient. (<a href=\"https://github.com/astockwell/countries-and-provinces-states-regions\" target=\"_blank\">ISO_3166-2</a>)</p>"
          },
          {
            "group": "body",
            "type": "String",
            "optional": false,
            "field": "provincebirth",
            "description": "<p>Province birth of the Patient. (<a href=\"https://github.com/astockwell/countries-and-provinces-states-regions\" target=\"_blank\">ISO_3166-2</a>)</p>"
          },
          {
            "group": "body",
            "type": "String",
            "optional": false,
            "field": "citybirth",
            "description": "<p>City birth of the Patient.</p>"
          },
          {
            "group": "body",
            "type": "Date",
            "optional": false,
            "field": "birthDate",
            "description": "<p>Date of birth of the patient.</p>"
          },
          {
            "group": "body",
            "type": "String",
            "optional": false,
            "field": "patientName",
            "description": "<p>Name of the Patient.</p>"
          },
          {
            "group": "body",
            "type": "String",
            "optional": false,
            "field": "surname",
            "description": "<p>Surname of the Patient.</p>"
          },
          {
            "group": "body",
            "type": "Object",
            "optional": true,
            "field": "parents",
            "description": "<p>Data about parents of the Patient. The highEducation field can be ... The profession field is a free field</p>"
          },
          {
            "group": "body",
            "type": "Object",
            "optional": true,
            "field": "siblings",
            "description": "<p>Data about siblings of the Patient. The affected field can be yes or no. The gender field can be male or female</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "patientInfo",
            "description": "<p>patientId, name, and surname.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>If the patient has been created correctly, it returns the message 'Patient updated'.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\"patientInfo\":\n {\n  \"sub\": \"1499bb6faef2c95364e2f4tt2c9aef05abe2c9c72110a4514e8c4c3fb038ff30\",\n  \"patientName\": \"Jhon\",\n  \"surname\": \"Doe\"\n },\n\"message\": \"Patient updated\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "controllers/user/patient.js",
    "groupTitle": "Patients"
  },
  {
    "type": "delete",
    "url": "https://health29.org/api/phenotypes/:phenotypeId",
    "title": "Delete phenotype",
    "name": "deletePhenotype",
    "description": "<p>This method deletes Phenotype of a patient</p>",
    "group": "Phenotype",
    "version": "1.0.0",
    "examples": [
      {
        "title": "Example usage:",
        "content": "this.http.delete('https://health29.org/api/phenotypes/'+phenotypeId)\n .subscribe( (res : any) => {\n   console.log('Delete phenotype ok');\n  }, (err) => {\n   ...\n  }",
        "type": "js"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Users unique access-key. For this, go to  <a href=\"#api-Access_token-signIn\">Get token</a></p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n  \"authorization\": \"Bearer eyJ0eXAiOiJKV1QiLCJhbGciPgDIUzI1NiJ9.eyJzdWIiOiI1M2ZlYWQ3YjY1YjM0ZTQ0MGE4YzRhNmUyMzVhNDFjNjEyOThiMWZjYTZjMjXkZTUxMTA9OGVkN2NlODMxYWY3IiwiaWF0IjoxNTIwMzUzMDMwLCJlcHAiOjE1NTE4ODkwMzAsInJvbGUiOiJVc2VyIiwiZ3JvdDEiOiJEdWNoZW5uZSBQYXJlbnQgUHJfrmVjdCBOZXRoZXJsYW5kcyJ9.MloW8eeJ857FY7-vwxJaMDajFmmVStGDcnfHfGJx05k\"\n}",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "phenotypeId",
            "description": "<p>Phenotype unique ID.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>If the phenotype has been deleted correctly, it returns the message 'The phenotype has been eliminated'.</p>"
          }
        ],
        "Success 202": [
          {
            "group": "Success 202",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>If the phenotype not exists for the patient, it will return: &quot;The phenotype does not exis&quot;</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n\t\t\"message\": \"The phenotype has been eliminated\"\n}\n\nHTTP/1.1 202 OK\n{message: 'The phenotype does not exis'}",
          "type": "json"
        }
      ]
    },
    "filename": "controllers/user/patient/phenotype.js",
    "groupTitle": "Phenotype"
  },
  {
    "type": "delete",
    "url": "https://health29.org/api/phenotypes/history/:phenotypeId",
    "title": "Delete phenotype history record",
    "name": "deletePhenotypeHistoryRecord",
    "description": "<p>This method deletes Phenotype history record of a patient</p>",
    "group": "Phenotype",
    "version": "1.0.0",
    "examples": [
      {
        "title": "Example usage:",
        "content": "this.http.delete('https://health29.org/api/phenotypes/history/'+phenotypeId)\n .subscribe( (res : any) => {\n   console.log('Delete phenotype history record ok');\n  }, (err) => {\n   ...\n  }",
        "type": "js"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Users unique access-key. For this, go to  <a href=\"#api-Access_token-signIn\">Get token</a></p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n  \"authorization\": \"Bearer eyJ0eXAiOiJKV1QiLCJhbGciPgDIUzI1NiJ9.eyJzdWIiOiI1M2ZlYWQ3YjY1YjM0ZTQ0MGE4YzRhNmUyMzVhNDFjNjEyOThiMWZjYTZjMjXkZTUxMTA9OGVkN2NlODMxYWY3IiwiaWF0IjoxNTIwMzUzMDMwLCJlcHAiOjE1NTE4ODkwMzAsInJvbGUiOiJVc2VyIiwiZ3JvdDEiOiJEdWNoZW5uZSBQYXJlbnQgUHJfrmVjdCBOZXRoZXJsYW5kcyJ9.MloW8eeJ857FY7-vwxJaMDajFmmVStGDcnfHfGJx05k\"\n}",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "phenotypeId",
            "description": "<p>Phenotype unique ID.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>If the phenotype history record has been deleted correctly, it returns the message 'The phenotype has been eliminated'.</p>"
          }
        ],
        "Success 202": [
          {
            "group": "Success 202",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>If the phenotype history record not exists for the patient, it will return: &quot;The phenotype does not exis&quot;</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n\t\t\"message\": \"The phenotype history record has been eliminated\"\n}\n\nHTTP/1.1 202 OK\n{message: 'The phenotype history record does not exis'}",
          "type": "json"
        }
      ]
    },
    "filename": "controllers/user/patient/phenotype.js",
    "groupTitle": "Phenotype"
  },
  {
    "type": "get",
    "url": "https://health29.org/api/phenotypes/:patientId",
    "title": "Get phenotype",
    "name": "getPhenotype",
    "description": "<p>This method read Phenotype of a patient</p>",
    "group": "Phenotype",
    "version": "1.0.0",
    "examples": [
      {
        "title": "Example usage:",
        "content": "this.http.get('https://health29.org/api/phenotypes/'+patientId)\n .subscribe( (res : any) => {\n   console.log('phenotype: '+ res.phenotype);\n  }, (err) => {\n   ...\n  }",
        "type": "js"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Users unique access-key. For this, go to  <a href=\"#api-Access_token-signIn\">Get token</a></p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n  \"authorization\": \"Bearer eyJ0eXAiOiJKV1QiLCJhbGciPgDIUzI1NiJ9.eyJzdWIiOiI1M2ZlYWQ3YjY1YjM0ZTQ0MGE4YzRhNmUyMzVhNDFjNjEyOThiMWZjYTZjMjXkZTUxMTA9OGVkN2NlODMxYWY3IiwiaWF0IjoxNTIwMzUzMDMwLCJlcHAiOjE1NTE4ODkwMzAsInJvbGUiOiJVc2VyIiwiZ3JvdDEiOiJEdWNoZW5uZSBQYXJlbnQgUHJfrmVjdCBOZXRoZXJsYW5kcyJ9.MloW8eeJ857FY7-vwxJaMDajFmmVStGDcnfHfGJx05k\"\n}",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "patientId",
            "description": "<p>Patient unique ID. More info here:  <a href=\"#api-Patients-getPatientsUser\">Get patientId</a></p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "_id",
            "description": "<p>Phenotype unique ID.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>Patient's phenotype. For each symptom, you get the <a href=\"https://en.wikipedia.org/wiki/Human_Phenotype_Ontology\" target=\"_blank\">HPO</a> and the name</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "date",
            "description": "<p>Date on which the diagnosis was saved.</p>"
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "validated",
            "description": "<p>If the phenotype is validated by a clinician, it will be true.</p>"
          }
        ],
        "Success 202": [
          {
            "group": "Success 202",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>If there is no phenotype for the patient, it will return: &quot;There are no phenotype&quot;</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\"phenotype\":\n  {\n    \"_id\":\"5a6f4b83f440d806744f3ef6\",\n    \"data\":[\n      {\"id\":\"HP:0100543\",\"name\":\"Cognitive impairment\"},\n      {\"id\":\"HP:0002376\",\"name\":\"Developmental regression\"}\n    ],\n   \"date\":\"2018-02-27T17:55:48.261Z\",\n   \"validated\":false\n  }\n}\n\nHTTP/1.1 202 OK\n{message: 'There are no phenotype'}",
          "type": "json"
        }
      ]
    },
    "filename": "controllers/user/patient/phenotype.js",
    "groupTitle": "Phenotype"
  },
  {
    "type": "get",
    "url": "https://health29.org/api/phenotypes/history/:patientId",
    "title": "Get phenotype history",
    "name": "getPhenotypeHistory",
    "description": "<p>This method read Phenotype history of a patient ordered by date.</p>",
    "group": "Phenotype",
    "version": "1.0.0",
    "examples": [
      {
        "title": "Example usage:",
        "content": "this.http.get('https://health29.org/api/phenotypes/history/'+patientId)\n .subscribe( (res : any) => {\n   console.log('phenotype: history'+ res);\n  }, (err) => {\n   ...\n  }",
        "type": "js"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Users unique access-key. For this, go to  <a href=\"#api-Access_token-signIn\">Get token</a></p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n  \"authorization\": \"Bearer eyJ0eXAiOiJKV1QiLCJhbGciPgDIUzI1NiJ9.eyJzdWIiOiI1M2ZlYWQ3YjY1YjM0ZTQ0MGE4YzRhNmUyMzVhNDFjNjEyOThiMWZjYTZjMjXkZTUxMTA9OGVkN2NlODMxYWY3IiwiaWF0IjoxNTIwMzUzMDMwLCJlcHAiOjE1NTE4ODkwMzAsInJvbGUiOiJVc2VyIiwiZ3JvdDEiOiJEdWNoZW5uZSBQYXJlbnQgUHJfrmVjdCBOZXRoZXJsYW5kcyJ9.MloW8eeJ857FY7-vwxJaMDajFmmVStGDcnfHfGJx05k\"\n}",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "patientId",
            "description": "<p>Patient unique ID. More info here:  <a href=\"#api-Patients-getPatientsUser\">Get patientId</a></p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "_id",
            "description": "<p>Phenotype history unique ID.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>Patient's history phenotype. For each symptom, you get the <a href=\"https://en.wikipedia.org/wiki/Human_Phenotype_Ontology\" target=\"_blank\">HPO</a> and the name</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "date",
            "description": "<p>Date on which the diagnosis was saved.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "validatedId",
            "description": "<p>If the phenotype is validated by a clinician, the clinician unique ID.</p>"
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "validated",
            "description": "<p>If the phenotype is validated by a clinician, it will be true.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n[\n  {\n    \"_id\":<phenotype history id>,\n    \"data\":[\n      {\"id\":\"HP:0100543\",\"name\":\"Cognitive impairment\"},\n      {\"id\":\"HP:0002376\",\"name\":\"Developmental regression\"}\n    ],\n\t   \"inputType\": <inputType>,\n   \"date\":<date>,\n\t  \"validator_id\":<validator_id>,\n   \"validated\":false\n  }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "controllers/user/patient/phenotype.js",
    "groupTitle": "Phenotype"
  },
  {
    "type": "post",
    "url": "https://health29.org/api/phenotypes/:patientId",
    "title": "New phenotype",
    "name": "savePhenotype",
    "description": "<p>This method create a phenotype of a patient</p>",
    "group": "Phenotype",
    "version": "1.0.0",
    "examples": [
      {
        "title": "Example usage:",
        "content": "var phenotype = {data: [{\"id\":\"HP:0100543\",\"name\":\"Cognitive impairment\"},{\"id\":\"HP:0002376\",\"name\":\"Developmental regression\"}]};\nthis.http.post('https://health29.org/api/phenotypes/'+patientId, phenotype)\n .subscribe( (res : any) => {\n   console.log('phenotype: '+ res.phenotype);\n  }, (err) => {\n   ...\n  }",
        "type": "js"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Users unique access-key. For this, go to  <a href=\"#api-Access_token-signIn\">Get token</a></p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n  \"authorization\": \"Bearer eyJ0eXAiOiJKV1QiLCJhbGciPgDIUzI1NiJ9.eyJzdWIiOiI1M2ZlYWQ3YjY1YjM0ZTQ0MGE4YzRhNmUyMzVhNDFjNjEyOThiMWZjYTZjMjXkZTUxMTA9OGVkN2NlODMxYWY3IiwiaWF0IjoxNTIwMzUzMDMwLCJlcHAiOjE1NTE4ODkwMzAsInJvbGUiOiJVc2VyIiwiZ3JvdDEiOiJEdWNoZW5uZSBQYXJlbnQgUHJfrmVjdCBOZXRoZXJsYW5kcyJ9.MloW8eeJ857FY7-vwxJaMDajFmmVStGDcnfHfGJx05k\"\n}",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "patientId",
            "description": "<p>Patient unique ID. More info here:  <a href=\"#api-Patients-getPatientsUser\">Get patientId</a></p>"
          }
        ],
        "body": [
          {
            "group": "body",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>Patient's phenotype. For each symptom, you set the <a href=\"https://en.wikipedia.org/wiki/Human_Phenotype_Ontology\" target=\"_blank\">HPO</a> and the name</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "_id",
            "description": "<p>Phenotype unique ID.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>Patient's phenotype. For each symptom, you get the <a href=\"https://en.wikipedia.org/wiki/Human_Phenotype_Ontology\" target=\"_blank\">HPO</a> and the name</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "date",
            "description": "<p>Date on which the diagnosis was saved.</p>"
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "validated",
            "description": "<p>If the phenotype is validated by a clinician, it will be true.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>If the phenotype has been created correctly, it returns the message 'Phenotype created'.</p>"
          }
        ],
        "Success 202": [
          {
            "group": "Success 202",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>If there is no phenotype for the patient, it will return: &quot;There are no phenotype&quot;</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\"phenotype\":\n  {\n    \"_id\":\"5a6f4b83f440d806744f3ef6\",\n    \"data\":[\n      {\"id\":\"HP:0100543\",\"name\":\"Cognitive impairment\"},\n      {\"id\":\"HP:0002376\",\"name\":\"Developmental regression\"}\n    ],\n   \"date\":\"2018-02-27T17:55:48.261Z\",\n   \"validated\":false\n  },\nmessage: \"Phenotype created\"\n}\n\nHTTP/1.1 202 OK\n{message: 'There are no phenotype'}",
          "type": "json"
        }
      ]
    },
    "filename": "controllers/user/patient/phenotype.js",
    "groupTitle": "Phenotype"
  },
  {
    "type": "delete",
    "url": "https://health29.org/api/socialinfos/:socialInfoId",
    "title": "Delete social info",
    "name": "deleteSocialInfo",
    "description": "<p>This method deletes social info of a patient</p>",
    "group": "Social_info",
    "version": "1.0.0",
    "examples": [
      {
        "title": "Example usage:",
        "content": "this.http.delete('https://health29.org/api/socialinfos/'+socialInfoId)\n .subscribe( (res : any) => {\n   console.log('Delete social info ok');\n  }, (err) => {\n   ...\n  }",
        "type": "js"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Users unique access-key. For this, go to  <a href=\"#api-Access_token-signIn\">Get token</a></p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n  \"authorization\": \"Bearer eyJ0eXAiOiJKV1QiLCJhbGciPgDIUzI1NiJ9.eyJzdWIiOiI1M2ZlYWQ3YjY1YjM0ZTQ0MGE4YzRhNmUyMzVhNDFjNjEyOThiMWZjYTZjMjXkZTUxMTA9OGVkN2NlODMxYWY3IiwiaWF0IjoxNTIwMzUzMDMwLCJlcHAiOjE1NTE4ODkwMzAsInJvbGUiOiJVc2VyIiwiZ3JvdDEiOiJEdWNoZW5uZSBQYXJlbnQgUHJfrmVjdCBOZXRoZXJsYW5kcyJ9.MloW8eeJ857FY7-vwxJaMDajFmmVStGDcnfHfGJx05k\"\n}",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "_id",
            "description": "<p>Social info unique ID. More info here:  <a href=\"#api-Social_info-getSocialInfo\">Get socialInfoId</a></p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>If the social info has been deleted correctly, it returns the message 'The social info has been eliminated'.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n\t\"message\": \"The social info has been eliminated\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "controllers/user/patient/social-info.js",
    "groupTitle": "Social_info"
  },
  {
    "type": "get",
    "url": "https://health29.org/api/socialinfos/:patientId",
    "title": "Get social info",
    "name": "getSocialInfo",
    "description": "<p>This method read social info of a patient</p>",
    "group": "Social_info",
    "version": "1.0.0",
    "examples": [
      {
        "title": "Example usage:",
        "content": "this.http.get('https://health29.org/api/socialinfos/'+patientId)\n .subscribe( (res : any) => {\n   console.log('social info: '+ res.socialInfo);\n  }, (err) => {\n   ...\n  }",
        "type": "js"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Users unique access-key. For this, go to  <a href=\"#api-Access_token-signIn\">Get token</a></p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n  \"authorization\": \"Bearer eyJ0eXAiOiJKV1QiLCJhbGciPgDIUzI1NiJ9.eyJzdWIiOiI1M2ZlYWQ3YjY1YjM0ZTQ0MGE4YzRhNmUyMzVhNDFjNjEyOThiMWZjYTZjMjXkZTUxMTA9OGVkN2NlODMxYWY3IiwiaWF0IjoxNTIwMzUzMDMwLCJlcHAiOjE1NTE4ODkwMzAsInJvbGUiOiJVc2VyIiwiZ3JvdDEiOiJEdWNoZW5uZSBQYXJlbnQgUHJfrmVjdCBOZXRoZXJsYW5kcyJ9.MloW8eeJ857FY7-vwxJaMDajFmmVStGDcnfHfGJx05k\"\n}",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "patientId",
            "description": "<p>Patient unique ID. More info here:  <a href=\"#api-Patients-getPatientsUser\">Get patientId</a></p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "_id",
            "description": "<p>Social info unique ID.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "profession",
            "description": "<p>Profession of the patient.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "hoursWork",
            "description": "<p>Number of hours worked per week.</p>"
          },
          {
            "group": "Success 200",
            "type": "string",
            "allowedValues": [
              "\"volunteer\"",
              "\"paid\"",
              "\"no\""
            ],
            "optional": false,
            "field": "work",
            "description": "<p>Work of the Patient</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "currentEducation",
            "description": "<p>Current education of the Patient. field can be ...</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "completedEducation",
            "description": "<p>Completed education of the Patient. field can be ...</p>"
          },
          {
            "group": "Success 200",
            "type": "string",
            "allowedValues": [
              "\"regularEducation\"",
              "\"specialEducation\""
            ],
            "optional": false,
            "field": "education",
            "description": "<p>Type of education.</p>"
          },
          {
            "group": "Success 200",
            "type": "String[]",
            "allowedValues": [
              "\"gaming\"",
              "\"music\"",
              "\"sports\"",
              "\"movies\"",
              "\"mindgames\"",
              "\"scouting\"",
              "\"other\""
            ],
            "optional": false,
            "field": "interests",
            "description": ""
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "otherinterest",
            "description": "<p>If interests contains Other.</p>"
          },
          {
            "group": "Success 200",
            "type": "String[]",
            "allowedValues": [
              "\"swimming\"",
              "\"wheelchairHockey\"",
              "\"soccer\"",
              "\"hourseRiding\"",
              "\"other\""
            ],
            "optional": false,
            "field": "sports",
            "description": ""
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "othersport",
            "description": "<p>If sports contains Other.</p>"
          },
          {
            "group": "Success 200",
            "type": "String[]",
            "allowedValues": [
              "\"parent\"",
              "\"sibling\"",
              "\"helpers\"",
              "\"friends\"",
              "\"helperdog\""
            ],
            "optional": false,
            "field": "support",
            "description": ""
          },
          {
            "group": "Success 200",
            "type": "String[]",
            "allowedValues": [
              "\"parent\"",
              "\"institution\"",
              "\"partner\"",
              "\"friend\"",
              "\"independent\"",
              "\"other\""
            ],
            "optional": false,
            "field": "livingSituation",
            "description": ""
          }
        ],
        "Success 202": [
          {
            "group": "Success 202",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>If there is no social information for the patient, it will return: &quot;There are no social info&quot;</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\"socialInfo\":\n  {\n    \"_id\":\"5a6f4b83f660d806744f3ef6\",\n    \"profession\":\"\",\n    \"hoursWork\":\"\",\n    \"work\":\"no\",\n    \"currentEducation\":\"\",\n    \"completedEducation\":\"\",\n    \"education\":\"regularEducation\",\n    \"interests\":[\"gaming\",\"music\"],\n    \"otherinterest\":\"\",\n    \"sports\":[\"other\"],\n    \"othersport\":\"\",\n    \"support\":[\"helpers\",\"friends\"],\n    \"livingSituation\":[\"partner\"]\n  }\n}\n\nHTTP/1.1 202 OK\n{message: 'There are no social info'}",
          "type": "json"
        }
      ]
    },
    "filename": "controllers/user/patient/social-info.js",
    "groupTitle": "Social_info"
  },
  {
    "type": "post",
    "url": "https://health29.org/api/socialinfos/:patientId",
    "title": "New social info",
    "name": "saveSocialInfo",
    "description": "<p>This method read social info of a patient</p>",
    "group": "Social_info",
    "version": "1.0.0",
    "examples": [
      {
        "title": "Example usage:",
        "content": "var socialInfo = {education: '', completedEducation: '', currentEducation: '', work: '', hoursWork: '', profession: '', livingSituation: '', support: [], sports: [], othersport: '', interests: [], otherinterest: ''};\nthis.http.post('https://health29.org/api/socialinfos/'+patientId, socialInfo)\n .subscribe( (res : any) => {\n   console.log('social info: '+ res.socialInfo);\n  }, (err) => {\n   ...\n  }",
        "type": "js"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Users unique access-key. For this, go to  <a href=\"#api-Access_token-signIn\">Get token</a></p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n  \"authorization\": \"Bearer eyJ0eXAiOiJKV1QiLCJhbGciPgDIUzI1NiJ9.eyJzdWIiOiI1M2ZlYWQ3YjY1YjM0ZTQ0MGE4YzRhNmUyMzVhNDFjNjEyOThiMWZjYTZjMjXkZTUxMTA9OGVkN2NlODMxYWY3IiwiaWF0IjoxNTIwMzUzMDMwLCJlcHAiOjE1NTE4ODkwMzAsInJvbGUiOiJVc2VyIiwiZ3JvdDEiOiJEdWNoZW5uZSBQYXJlbnQgUHJfrmVjdCBOZXRoZXJsYW5kcyJ9.MloW8eeJ857FY7-vwxJaMDajFmmVStGDcnfHfGJx05k\"\n}",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "patientId",
            "description": "<p>Patient unique ID. More info here:  <a href=\"#api-Patients-getPatientsUser\">Get patientId</a></p>"
          }
        ],
        "body": [
          {
            "group": "body",
            "type": "String",
            "optional": true,
            "field": "profession",
            "description": "<p>Profession of the patient.</p>"
          },
          {
            "group": "body",
            "type": "String",
            "optional": true,
            "field": "hoursWork",
            "description": "<p>Number of hours worked per week.</p>"
          },
          {
            "group": "body",
            "type": "string",
            "allowedValues": [
              "\"volunteer\"",
              "\"paid\"",
              "\"no\""
            ],
            "optional": true,
            "field": "work",
            "description": "<p>Work of the Patient</p>"
          },
          {
            "group": "body",
            "type": "String",
            "optional": true,
            "field": "currentEducation",
            "description": "<p>Current education of the Patient. field can be ...</p>"
          },
          {
            "group": "body",
            "type": "String",
            "optional": true,
            "field": "completedEducation",
            "description": "<p>Completed education of the Patient. field can be ...</p>"
          },
          {
            "group": "body",
            "type": "string",
            "allowedValues": [
              "\"regularEducation\"",
              "\"specialEducation\""
            ],
            "optional": true,
            "field": "education",
            "description": "<p>Type of education.</p>"
          },
          {
            "group": "body",
            "type": "String[]",
            "allowedValues": [
              "\"gaming\"",
              "\"music\"",
              "\"sports\"",
              "\"movies\"",
              "\"mindgames\"",
              "\"scouting\"",
              "\"other\""
            ],
            "optional": true,
            "field": "interests",
            "description": ""
          },
          {
            "group": "body",
            "type": "String",
            "optional": true,
            "field": "otherinterest",
            "description": "<p>If interests contains Other</p>"
          },
          {
            "group": "body",
            "type": "String[]",
            "allowedValues": [
              "\"swimming\"",
              "\"wheelchairHockey\"",
              "\"soccer\"",
              "\"hourseRiding\"",
              "\"other\""
            ],
            "optional": true,
            "field": "sports",
            "description": ""
          },
          {
            "group": "body",
            "type": "String",
            "optional": true,
            "field": "othersport",
            "description": "<p>If sports contains Other</p>"
          },
          {
            "group": "body",
            "type": "String[]",
            "allowedValues": [
              "\"parent\"",
              "\"sibling\"",
              "\"helpers\"",
              "\"friends\"",
              "\"helperdog\""
            ],
            "optional": true,
            "field": "support",
            "description": ""
          },
          {
            "group": "body",
            "type": "String[]",
            "allowedValues": [
              "\"parent\"",
              "\"institution\"",
              "\"partner\"",
              "\"friend\"",
              "\"independent\"",
              "\"other\""
            ],
            "optional": true,
            "field": "livingSituation",
            "description": ""
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "socialInfo",
            "description": "<p>All the values that you can pass as a parameter, and also the _id that has been assigned to it (Social info unique ID)</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>If the social info has been created correctly, it returns the message 'Social Info created'.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\"socialInfo\":\n  {\n    \"_id\":\"5a6f4b83f660d806744f3ef6\",\n    \"profession\":\"\",\n    \"hoursWork\":\"\",\n    \"work\":\"no\",\n    \"currentEducation\":\"\",\n    \"completedEducation\":\"\",\n    \"education\":\"regularEducation\",\n    \"interests\":[\"gaming\",\"music\"],\n    \"otherinterest\":\"\",\n    \"sports\":[\"other\"],\n    \"othersport\":\"\",\n    \"support\":[\"helpers\",\"friends\"],\n    \"livingSituation\":[\"partner\"]\n  },\n\"message\": \"Social Info created\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "controllers/user/patient/social-info.js",
    "groupTitle": "Social_info"
  },
  {
    "type": "put",
    "url": "https://health29.org/api/socialinfos/:socialInfoId",
    "title": "Update social info",
    "name": "updateSocialInfo",
    "description": "<p>This method read social info of a patient</p>",
    "group": "Social_info",
    "version": "1.0.0",
    "examples": [
      {
        "title": "Example usage:",
        "content": "var socialInfo = {education: '', completedEducation: '', currentEducation: '', work: '', hoursWork: '', profession: '', livingSituation: '', support: [], sports: [], othersport: '', interests: [], otherinterest: ''};\nthis.http.put('https://health29.org/api/socialinfos/'+socialInfoId, socialInfo)\n .subscribe( (res : any) => {\n   console.log('social info: '+ res.socialInfo);\n  }, (err) => {\n   ...\n  }",
        "type": "js"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Users unique access-key. For this, go to  <a href=\"#api-Access_token-signIn\">Get token</a></p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n  \"authorization\": \"Bearer eyJ0eXAiOiJKV1QiLCJhbGciPgDIUzI1NiJ9.eyJzdWIiOiI1M2ZlYWQ3YjY1YjM0ZTQ0MGE4YzRhNmUyMzVhNDFjNjEyOThiMWZjYTZjMjXkZTUxMTA9OGVkN2NlODMxYWY3IiwiaWF0IjoxNTIwMzUzMDMwLCJlcHAiOjE1NTE4ODkwMzAsInJvbGUiOiJVc2VyIiwiZ3JvdDEiOiJEdWNoZW5uZSBQYXJlbnQgUHJfrmVjdCBOZXRoZXJsYW5kcyJ9.MloW8eeJ857FY7-vwxJaMDajFmmVStGDcnfHfGJx05k\"\n}",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "_id",
            "description": "<p>Social info unique ID. More info here:  <a href=\"#api-Social_info-getSocialInfo\">Get socialInfoId</a></p>"
          }
        ],
        "body": [
          {
            "group": "body",
            "type": "String",
            "optional": true,
            "field": "profession",
            "description": "<p>Profession of the patient.</p>"
          },
          {
            "group": "body",
            "type": "String",
            "optional": true,
            "field": "hoursWork",
            "description": "<p>Number of hours worked per week.</p>"
          },
          {
            "group": "body",
            "type": "string",
            "allowedValues": [
              "\"volunteer\"",
              "\"paid\"",
              "\"no\""
            ],
            "optional": true,
            "field": "work",
            "description": "<p>Work of the Patient</p>"
          },
          {
            "group": "body",
            "type": "String",
            "optional": true,
            "field": "currentEducation",
            "description": "<p>Current education of the Patient. field can be ...</p>"
          },
          {
            "group": "body",
            "type": "String",
            "optional": true,
            "field": "completedEducation",
            "description": "<p>Completed education of the Patient. field can be ...</p>"
          },
          {
            "group": "body",
            "type": "string",
            "allowedValues": [
              "\"regularEducation\"",
              "\"specialEducation\""
            ],
            "optional": true,
            "field": "education",
            "description": "<p>Type of education.</p>"
          },
          {
            "group": "body",
            "type": "String[]",
            "allowedValues": [
              "\"gaming\"",
              "\"music\"",
              "\"sports\"",
              "\"movies\"",
              "\"mindgames\"",
              "\"scouting\"",
              "\"other\""
            ],
            "optional": true,
            "field": "interests",
            "description": ""
          },
          {
            "group": "body",
            "type": "String",
            "optional": true,
            "field": "otherinterest",
            "description": "<p>If interests contains Other</p>"
          },
          {
            "group": "body",
            "type": "String[]",
            "allowedValues": [
              "\"swimming\"",
              "\"wheelchairHockey\"",
              "\"soccer\"",
              "\"hourseRiding\"",
              "\"other\""
            ],
            "optional": true,
            "field": "sports",
            "description": ""
          },
          {
            "group": "body",
            "type": "String",
            "optional": true,
            "field": "othersport",
            "description": "<p>If sports contains Other</p>"
          },
          {
            "group": "body",
            "type": "String[]",
            "allowedValues": [
              "\"parent\"",
              "\"sibling\"",
              "\"helpers\"",
              "\"friends\"",
              "\"helperdog\""
            ],
            "optional": true,
            "field": "support",
            "description": ""
          },
          {
            "group": "body",
            "type": "String[]",
            "allowedValues": [
              "\"parent\"",
              "\"institution\"",
              "\"partner\"",
              "\"friend\"",
              "\"independent\"",
              "\"other\""
            ],
            "optional": true,
            "field": "livingSituation",
            "description": ""
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "socialInfo",
            "description": "<p>All the values that you can pass as a parameter, and also the _id that has been assigned to it (Social info unique ID)</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>If the social info has been updated correctly, it returns the message 'Social Info updated'.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\"socialInfo\":\n  {\n    \"_id\":\"5a6f4b83f660d806744f3ef6\",\n    \"profession\":\"\",\n    \"hoursWork\":\"\",\n    \"work\":\"no\",\n    \"currentEducation\":\"\",\n    \"completedEducation\":\"\",\n    \"education\":\"regularEducation\",\n    \"interests\":[\"gaming\",\"music\"],\n    \"otherinterest\":\"\",\n    \"sports\":[\"other\"],\n    \"othersport\":\"\",\n    \"support\":[\"helpers\",\"friends\"],\n    \"livingSituation\":[\"partner\"]\n  },\n\"message\": \"Social Info updated\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "controllers/user/patient/social-info.js",
    "groupTitle": "Social_info"
  },
  {
    "type": "get",
    "url": "https://health29.org/api/admin/answers/getanswer",
    "title": "Request the answers of a specific patient",
    "name": "getAnswers",
    "description": "<p>This method requests the values of the answers of a specific patient</p>",
    "group": "Stats",
    "version": "1.0.0",
    "examples": [
      {
        "title": "Example usage:",
        "content": "var params = <patientId>\nthis.http.get('https://health29.org/api/admin/answers/getanswer'+params)\n .subscribe( (res : any) => {\n   console.log('Get list of answers of a specific patient ok');\n  }, (err) => {\n   ...\n  }",
        "type": "js"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Users unique access-key. For this, go to  <a href=\"#api-Access_token-signIn\">Get token</a></p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n  \"authorization\": \"Bearer eyJ0eXAiOiJKV1QiLCJhbGciPgDIUzI1NiJ9.eyJzdWIiOiI1M2ZlYWQ3YjY1YjM0ZTQ0MGE4YzRhNmUyMzVhNDFjNjEyOThiMWZjYTZjMjXkZTUxMTA9OGVkN2NlODMxYWY3IiwiaWF0IjoxNTIwMzUzMDMwLCJlcHAiOjE1NTE4ODkwMzAsInJvbGUiOiJVc2VyIiwiZ3JvdDEiOiJEdWNoZW5uZSBQYXJlbnQgUHJfrmVjdCBOZXRoZXJsYW5kcyJ9.MloW8eeJ857FY7-vwxJaMDajFmmVStGDcnfHfGJx05k\"\n}",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "patientId",
            "description": "<p>The unique identifier of a patient</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "Result",
            "description": "<p>Returns the object with the patient answers for each section/question.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n\t\t{\n\t\t\tspecificVisit:true/false/'not answered',\n\t\t\thospitalization:true/false/'not answered',\n\t\t\temergencies:true/false/'not answered',\n\t\t\tcardiotest:true/false/'not answered',\n\t\t\trespiratorytests:true/false/'not answered',\n\t\t\tbonehealthtest:true/false/'not answered',\n\t\t\tbloodtest:true/false/'not answered',\n\t\t\tsurgery:true/false/'not answered'\n\t\t}",
          "type": "json"
        }
      ]
    },
    "filename": "controllers/admin/stats-answers.js",
    "groupTitle": "Stats"
  },
  {
    "type": "delete",
    "url": "https://health29.org/api/users/:id",
    "title": "Delete user",
    "name": "deleteUser",
    "version": "1.0.0",
    "description": "<p>This method allows to delete a user</p>",
    "group": "Users",
    "examples": [
      {
        "title": "Example usage:",
        "content": "this.http.delete('https://health29.org/api/users/'+userId)\n .subscribe( (res : any) => {\n   console.log('Delete user ok');\n  }, (err) => {\n   ...\n  }",
        "type": "js"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Users unique access-key. For this, go to  <a href=\"#api-Access_token-signIn\">Get token</a></p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n  \"authorization\": \"Bearer eyJ0eXAiOiJKV1QiLCJhbGciPgDIUzI1NiJ9.eyJzdWIiOiI1M2ZlYWQ3YjY1YjM0ZTQ0MGE4YzRhNmUyMzVhNDFjNjEyOThiMWZjYTZjMjXkZTUxMTA9OGVkN2NlODMxYWY3IiwiaWF0IjoxNTIwMzUzMDMwLCJlcHAiOjE1NTE4ODkwMzAsInJvbGUiOiJVc2VyIiwiZ3JvdDEiOiJEdWNoZW5uZSBQYXJlbnQgUHJfrmVjdCBOZXRoZXJsYW5kcyJ9.MloW8eeJ857FY7-vwxJaMDajFmmVStGDcnfHfGJx05k\"\n}",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "userId",
            "description": "<p>User unique ID. More info here:  <a href=\"#api-Access_token-signIn\">Get token and userId</a></p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UserNotFound",
            "description": "<p>The <code>id</code> of the User was not found.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found\n    {message: `Error deleting the user: ${err}`}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n\t{message: `The user has been deleted.`}",
          "type": "json"
        }
      ]
    },
    "filename": "controllers/all/user.js",
    "groupTitle": "Users"
  },
  {
    "type": "get",
    "url": "https://health29.org/api/users/:id",
    "title": "Get user",
    "name": "getUser",
    "version": "1.0.0",
    "group": "Users",
    "description": "<p>This methods read data of a User</p>",
    "examples": [
      {
        "title": "Example usage:",
        "content": "this.http.get('https://health29.org/api/users/'+userId)\n .subscribe( (res : any) => {\n   console.log(res.userName);\n}, (err) => {\n  ...\n}",
        "type": "js"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Users unique access-key. For this, go to  <a href=\"#api-Access_token-signIn\">Get token</a></p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n  \"authorization\": \"Bearer eyJ0eXAiOiJKV1QiLCJhbGciPgDIUzI1NiJ9.eyJzdWIiOiI1M2ZlYWQ3YjY1YjM0ZTQ0MGE4YzRhNmUyMzVhNDFjNjEyOThiMWZjYTZjMjXkZTUxMTA9OGVkN2NlODMxYWY3IiwiaWF0IjoxNTIwMzUzMDMwLCJlcHAiOjE1NTE4ODkwMzAsInJvbGUiOiJVc2VyIiwiZ3JvdDEiOiJEdWNoZW5uZSBQYXJlbnQgUHJfrmVjdCBOZXRoZXJsYW5kcyJ9.MloW8eeJ857FY7-vwxJaMDajFmmVStGDcnfHfGJx05k\"\n}",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "userId",
            "description": "<p>User unique ID. More info here:  <a href=\"#api-Access_token-signIn\">Get token and userId</a></p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Email of the User.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "userName",
            "description": "<p>UserName of the User.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "lang",
            "description": "<p>lang of the User.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "group",
            "description": "<p>Group of the User.</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "signupDate",
            "description": "<p>Signup date of the User.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\"user\":\n {\n  \"email\": \"John@example.com\",\n  \"userName\": \"Doe\",\n  \"lang\": \"en\",\n  \"group\": \"nameGroup\",\n  \"signupDate\": \"2018-01-26T13:25:31.077Z\"\n }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UserNotFound",
            "description": "<p>The <code>id</code> of the User was not found.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found\n    {\n      \"error\": \"UserNotFound\"\n    }",
          "type": "json"
        }
      ]
    },
    "filename": "controllers/all/user.js",
    "groupTitle": "Users"
  },
  {
    "type": "put",
    "url": "https://health29.org/api/users/:id",
    "title": "Update user",
    "name": "updateUser",
    "version": "1.0.0",
    "description": "<p>This method allows to change the user's data</p>",
    "group": "Users",
    "examples": [
      {
        "title": "Example usage:",
        "content": "this.http.put('https://health29.org/api/users/'+userId, this.user)\n .subscribe( (res : any) => {\n   console.log('User update: '+ res.user);\n  }, (err) => {\n   ...\n  }",
        "type": "js"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Users unique access-key. For this, go to  <a href=\"#api-Access_token-signIn\">Get token</a></p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n  \"authorization\": \"Bearer eyJ0eXAiOiJKV1QiLCJhbGciPgDIUzI1NiJ9.eyJzdWIiOiI1M2ZlYWQ3YjY1YjM0ZTQ0MGE4YzRhNmUyMzVhNDFjNjEyOThiMWZjYTZjMjXkZTUxMTA9OGVkN2NlODMxYWY3IiwiaWF0IjoxNTIwMzUzMDMwLCJlcHAiOjE1NTE4ODkwMzAsInJvbGUiOiJVc2VyIiwiZ3JvdDEiOiJEdWNoZW5uZSBQYXJlbnQgUHJfrmVjdCBOZXRoZXJsYW5kcyJ9.MloW8eeJ857FY7-vwxJaMDajFmmVStGDcnfHfGJx05k\"\n}",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "userId",
            "description": "<p>User unique ID. More info here:  <a href=\"#api-Access_token-signIn\">Get token and userId</a></p>"
          }
        ],
        "body": [
          {
            "group": "body",
            "type": "String",
            "optional": true,
            "field": "userName",
            "description": "<p>UserName of the User.</p>"
          },
          {
            "group": "body",
            "type": "String",
            "optional": true,
            "field": "lang",
            "description": "<p>lang of the User.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Email of the User.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "userName",
            "description": "<p>UserName of the User.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "lang",
            "description": "<p>lang of the User.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "group",
            "description": "<p>Group of the User.</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "signupDate",
            "description": "<p>Signup date of the User.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\"user\":\n {\n  \"email\": \"John@example.com\",\n  \"userName\": \"Doe\",\n  \"lang\": \"en\",\n  \"group\": \"nameGroup\",\n  \"signupDate\": \"2018-01-26T13:25:31.077Z\"\n }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UserNotFound",
            "description": "<p>The <code>id</code> of the User was not found.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found\n    {\n      \"error\": \"UserNotFound\"\n    }",
          "type": "json"
        }
      ]
    },
    "filename": "controllers/all/user.js",
    "groupTitle": "Users"
  },
  {
    "type": "delete",
    "url": "https://health29.org/api/vaccination/:vaccinationId",
    "title": "Delete vaccination",
    "name": "deleteVaccination",
    "description": "<p>This method delete Vaccination by identifier</p>",
    "group": "Vaccination",
    "version": "1.0.0",
    "examples": [
      {
        "title": "Example usage:",
        "content": "this.http.delete('https://health29.org/api/vaccination/'+vaccinationId)\n .subscribe( (res : any) => {\n   console.log('Delete vaccination ok');\n  }, (err) => {\n   ...\n  }",
        "type": "js"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Users unique access-key. For this, go to  <a href=\"#api-Access_token-signIn\">Get token</a></p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n  \"authorization\": \"Bearer eyJ0eXAiOiJKV1QiLCJhbGciPgDIUzI1NiJ9.eyJzdWIiOiI1M2ZlYWQ3YjY1YjM0ZTQ0MGE4YzRhNmUyMzVhNDFjNjEyOThiMWZjYTZjMjXkZTUxMTA9OGVkN2NlODMxYWY3IiwiaWF0IjoxNTIwMzUzMDMwLCJlcHAiOjE1NTE4ODkwMzAsInJvbGUiOiJVc2VyIiwiZ3JvdDEiOiJEdWNoZW5uZSBQYXJlbnQgUHJfrmVjdCBOZXRoZXJsYW5kcyJ9.MloW8eeJ857FY7-vwxJaMDajFmmVStGDcnfHfGJx05k\"\n}",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "vaccinationId",
            "description": "<p>Vaccination unique ID.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>If the vaccination has been deleted correctly, it returns the message 'The vaccination has been deleted'.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n\t\"message\": \"The vaccination has been deleted\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "controllers/user/patient/vaccination.js",
    "groupTitle": "Vaccination"
  },
  {
    "type": "get",
    "url": "https://health29.org/api/vaccinations/:patientId",
    "title": "Get vaccinations list",
    "name": "getVaccinations",
    "description": "<p>This method read Vaccination of a patient</p>",
    "group": "Vaccination",
    "version": "1.0.0",
    "examples": [
      {
        "title": "Example usage:",
        "content": "this.http.get('https://health29.org/api/vaccinations/'+patientId)\n .subscribe( (res : any) => {\n   console.log('vaccination: '+ res.vaccination);\n  }, (err) => {\n   ...\n  }",
        "type": "js"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Users unique access-key. For this, go to  <a href=\"#api-Access_token-signIn\">Get token</a></p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n  \"authorization\": \"Bearer eyJ0eXAiOiJKV1QiLCJhbGciPgDIUzI1NiJ9.eyJzdWIiOiI1M2ZlYWQ3YjY1YjM0ZTQ0MGE4YzRhNmUyMzVhNDFjNjEyOThiMWZjYTZjMjXkZTUxMTA9OGVkN2NlODMxYWY3IiwiaWF0IjoxNTIwMzUzMDMwLCJlcHAiOjE1NTE4ODkwMzAsInJvbGUiOiJVc2VyIiwiZ3JvdDEiOiJEdWNoZW5uZSBQYXJlbnQgUHJfrmVjdCBOZXRoZXJsYW5kcyJ9.MloW8eeJ857FY7-vwxJaMDajFmmVStGDcnfHfGJx05k\"\n}",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "patientId",
            "description": "<p>Patient unique ID. More info here:  <a href=\"#api-Patients-getPatientsUser\">Get patientId</a></p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "_id",
            "description": "<p>Vaccination unique ID.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "value",
            "description": "<p>Patient's Vaccination.</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "dateTime",
            "description": "<p>on which the vaccination was saved.</p>"
          }
        ],
        "Success 202": [
          {
            "group": "Success 202",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>If there is no vaccination for the patient, it will return: &quot;There are no vaccination&quot;</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\"vaccination\":\n  {\n    \"_id\":\"5a6f4b83f440d806744f3ef6\",\n    \"value\":\"43\",\n    \"dateTime\":\"2018-02-27T17:55:48.261Z\"\n  }\n}\n\nHTTP/1.1 202 OK\n{message: 'There are no vaccination'}",
          "type": "json"
        }
      ]
    },
    "filename": "controllers/user/patient/vaccination.js",
    "groupTitle": "Vaccination"
  },
  {
    "type": "post",
    "url": "https://health29.org/api/vaccination/:patientId",
    "title": "New vaccination",
    "name": "saveVaccination",
    "description": "<p>This method create a vaccination of a patient</p>",
    "group": "Vaccination",
    "version": "1.0.0",
    "examples": [
      {
        "title": "Example usage:",
        "content": "var vaccination = {value: \"43\", dateTime: \"2018-02-27T17:55:48.261Z\"};\nthis.http.post('https://health29.org/api/vaccination/'+patientId, vaccination)\n .subscribe( (res : any) => {\n   console.log('vaccination: '+ res.vaccination);\n  }, (err) => {\n   ...\n  }",
        "type": "js"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Users unique access-key. For this, go to  <a href=\"#api-Access_token-signIn\">Get token</a></p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n  \"authorization\": \"Bearer eyJ0eXAiOiJKV1QiLCJhbGciPgDIUzI1NiJ9.eyJzdWIiOiI1M2ZlYWQ3YjY1YjM0ZTQ0MGE4YzRhNmUyMzVhNDFjNjEyOThiMWZjYTZjMjXkZTUxMTA9OGVkN2NlODMxYWY3IiwiaWF0IjoxNTIwMzUzMDMwLCJlcHAiOjE1NTE4ODkwMzAsInJvbGUiOiJVc2VyIiwiZ3JvdDEiOiJEdWNoZW5uZSBQYXJlbnQgUHJfrmVjdCBOZXRoZXJsYW5kcyJ9.MloW8eeJ857FY7-vwxJaMDajFmmVStGDcnfHfGJx05k\"\n}",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "patientId",
            "description": "<p>Patient unique ID. More info here:  <a href=\"#api-Patients-getPatientsUser\">Get patientId</a></p>"
          }
        ],
        "body": [
          {
            "group": "body",
            "type": "Object",
            "optional": false,
            "field": "value",
            "description": "<p>Patient's vaccination. You set the dateTime and the vaccination</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "_id",
            "description": "<p>Vaccination unique ID.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "value",
            "description": "<p>Patient's vaccination. You get the vaccination</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>If the vaccination has been created correctly, it returns the message 'Vaccination created'.</p>"
          }
        ],
        "Success 202": [
          {
            "group": "Success 202",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>If there is no vaccination for the patient, it will return: &quot;There are no vaccination&quot;</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\"vaccination\":\n  {\n    \"_id\":\"5a6f4b83f440d806744f3ef6\",\n    \"value\":\"43\",\n   \"dateTime\":\"2018-02-27T17:55:48.261Z\"\n  },\nmessage: \"Vaccination created\"\n}\n\nHTTP/1.1 202 OK\n{message: 'There are no vaccination'}",
          "type": "json"
        }
      ]
    },
    "filename": "controllers/user/patient/vaccination.js",
    "groupTitle": "Vaccination"
  },
  {
    "type": "delete",
    "url": "https://health29.org/api/weight/:heightId",
    "title": "Delete weight",
    "name": "deleteWeight",
    "description": "<p>This method delete Weight of a patient</p>",
    "group": "Weight",
    "version": "1.0.0",
    "examples": [
      {
        "title": "Example usage:",
        "content": "this.http.delete('https://health29.org/api/weight/'+weightId)\n .subscribe( (res : any) => {\n   console.log('Delete weight ok');\n  }, (err) => {\n   ...\n  }",
        "type": "js"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Users unique access-key. For this, go to  <a href=\"#api-Access_token-signIn\">Get token</a></p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n  \"authorization\": \"Bearer eyJ0eXAiOiJKV1QiLCJhbGciPgDIUzI1NiJ9.eyJzdWIiOiI1M2ZlYWQ3YjY1YjM0ZTQ0MGE4YzRhNmUyMzVhNDFjNjEyOThiMWZjYTZjMjXkZTUxMTA9OGVkN2NlODMxYWY3IiwiaWF0IjoxNTIwMzUzMDMwLCJlcHAiOjE1NTE4ODkwMzAsInJvbGUiOiJVc2VyIiwiZ3JvdDEiOiJEdWNoZW5uZSBQYXJlbnQgUHJfrmVjdCBOZXRoZXJsYW5kcyJ9.MloW8eeJ857FY7-vwxJaMDajFmmVStGDcnfHfGJx05k\"\n}",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "weightId",
            "description": "<p>Weight unique ID.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>If the weight has been deleted correctly, it returns the message 'The weight has been eliminated'.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n\t\tmessage: \"The weight has been eliminated\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "controllers/user/patient/weight.js",
    "groupTitle": "Weight"
  },
  {
    "type": "get",
    "url": "https://health29.org/api/weights/:patientId",
    "title": "Get history weight",
    "name": "getHistoryWeight",
    "description": "<p>This method read History Weight of a patient</p>",
    "group": "Weight",
    "version": "1.0.0",
    "examples": [
      {
        "title": "Example usage:",
        "content": "this.http.get('https://health29.org/api/weights/'+patientId)\n .subscribe( (res : any) => {\n   console.log('Get History weight ok');\n  }, (err) => {\n   ...\n  }",
        "type": "js"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Users unique access-key. For this, go to  <a href=\"#api-Access_token-signIn\">Get token</a></p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n  \"authorization\": \"Bearer eyJ0eXAiOiJKV1QiLCJhbGciPgDIUzI1NiJ9.eyJzdWIiOiI1M2ZlYWQ3YjY1YjM0ZTQ0MGE4YzRhNmUyMzVhNDFjNjEyOThiMWZjYTZjMjXkZTUxMTA9OGVkN2NlODMxYWY3IiwiaWF0IjoxNTIwMzUzMDMwLCJlcHAiOjE1NTE4ODkwMzAsInJvbGUiOiJVc2VyIiwiZ3JvdDEiOiJEdWNoZW5uZSBQYXJlbnQgUHJfrmVjdCBOZXRoZXJsYW5kcyJ9.MloW8eeJ857FY7-vwxJaMDajFmmVStGDcnfHfGJx05k\"\n}",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "patientId",
            "description": "<p>Patient unique ID. More info here:  <a href=\"#api-Patients-getPatientsUser\">Get patientId</a></p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "_id",
            "description": "<p>Weight unique ID.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "value",
            "description": "<p>For each weight: Patient's weight.</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "dateTime",
            "description": "<p>For each weight: on which the weight was saved.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n[\n  {\n    \"_id\":\"5a6f4b83f440d806744f3ef6\",\n    \"value\":\"43\",\n    \"dateTime\":\"2018-02-27T17:55:48.261Z\"\n  }\n]",
          "type": "json"
        }
      ]
    },
    "filename": "controllers/user/patient/weight.js",
    "groupTitle": "Weight"
  },
  {
    "type": "get",
    "url": "https://health29.org/api/weight/:patientId",
    "title": "Get weight",
    "name": "getWeight",
    "description": "<p>This method read Weight of a patient</p>",
    "group": "Weight",
    "version": "1.0.0",
    "examples": [
      {
        "title": "Example usage:",
        "content": "this.http.get('https://health29.org/api/weight/'+patientId)\n .subscribe( (res : any) => {\n   console.log('weight: '+ res.weight);\n  }, (err) => {\n   ...\n  }",
        "type": "js"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Users unique access-key. For this, go to  <a href=\"#api-Access_token-signIn\">Get token</a></p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n  \"authorization\": \"Bearer eyJ0eXAiOiJKV1QiLCJhbGciPgDIUzI1NiJ9.eyJzdWIiOiI1M2ZlYWQ3YjY1YjM0ZTQ0MGE4YzRhNmUyMzVhNDFjNjEyOThiMWZjYTZjMjXkZTUxMTA9OGVkN2NlODMxYWY3IiwiaWF0IjoxNTIwMzUzMDMwLCJlcHAiOjE1NTE4ODkwMzAsInJvbGUiOiJVc2VyIiwiZ3JvdDEiOiJEdWNoZW5uZSBQYXJlbnQgUHJfrmVjdCBOZXRoZXJsYW5kcyJ9.MloW8eeJ857FY7-vwxJaMDajFmmVStGDcnfHfGJx05k\"\n}",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "patientId",
            "description": "<p>Patient unique ID. More info here:  <a href=\"#api-Patients-getPatientsUser\">Get patientId</a></p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "_id",
            "description": "<p>Weight unique ID.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "value",
            "description": "<p>Patient's weight.</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "dateTime",
            "description": "<p>on which the weight was saved.</p>"
          }
        ],
        "Success 202": [
          {
            "group": "Success 202",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>If there is no weight for the patient, it will return: &quot;There are no weight&quot;</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\"weight\":\n  {\n    \"_id\":\"5a6f4b83f440d806744f3ef6\",\n    \"value\":\"43\",\n    \"dateTime\":\"2018-02-27T17:55:48.261Z\"\n  }\n}\n\nHTTP/1.1 202 OK\n{message: 'There are no weight'}",
          "type": "json"
        }
      ]
    },
    "filename": "controllers/user/patient/weight.js",
    "groupTitle": "Weight"
  },
  {
    "type": "post",
    "url": "https://health29.org/api/weight/:patientId",
    "title": "New weight",
    "name": "saveWeight",
    "description": "<p>This method create a weight of a patient</p>",
    "group": "Weight",
    "version": "1.0.0",
    "examples": [
      {
        "title": "Example usage:",
        "content": "var weight = {value: \"43\", dateTime: \"2018-02-27T17:55:48.261Z\"};\nthis.http.post('https://health29.org/api/weight/'+patientId, weight)\n .subscribe( (res : any) => {\n   console.log('weight: '+ res.weight);\n  }, (err) => {\n   ...\n  }",
        "type": "js"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Users unique access-key. For this, go to  <a href=\"#api-Access_token-signIn\">Get token</a></p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n  \"authorization\": \"Bearer eyJ0eXAiOiJKV1QiLCJhbGciPgDIUzI1NiJ9.eyJzdWIiOiI1M2ZlYWQ3YjY1YjM0ZTQ0MGE4YzRhNmUyMzVhNDFjNjEyOThiMWZjYTZjMjXkZTUxMTA9OGVkN2NlODMxYWY3IiwiaWF0IjoxNTIwMzUzMDMwLCJlcHAiOjE1NTE4ODkwMzAsInJvbGUiOiJVc2VyIiwiZ3JvdDEiOiJEdWNoZW5uZSBQYXJlbnQgUHJfrmVjdCBOZXRoZXJsYW5kcyJ9.MloW8eeJ857FY7-vwxJaMDajFmmVStGDcnfHfGJx05k\"\n}",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "patientId",
            "description": "<p>Patient unique ID. More info here:  <a href=\"#api-Patients-getPatientsUser\">Get patientId</a></p>"
          }
        ],
        "body": [
          {
            "group": "body",
            "type": "Object",
            "optional": false,
            "field": "value",
            "description": "<p>Patient's weight. You set the dateTime and the weight</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "_id",
            "description": "<p>Weight unique ID.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "value",
            "description": "<p>Patient's weight. You get the weight</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>If the weight has been created correctly, it returns the message 'Weight created'.</p>"
          }
        ],
        "Success 202": [
          {
            "group": "Success 202",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>If there is no weight for the patient, it will return: &quot;There are no weight&quot;</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\"weight\":\n  {\n    \"_id\":\"5a6f4b83f440d806744f3ef6\",\n    \"value\":\"43\",\n   \"dateTime\":\"2018-02-27T17:55:48.261Z\"\n  },\nmessage: \"Weight created\"\n}\n\nHTTP/1.1 202 OK\n{message: 'There are no weight'}",
          "type": "json"
        }
      ]
    },
    "filename": "controllers/user/patient/weight.js",
    "groupTitle": "Weight"
  },
  {
    "type": "put",
    "url": "https://health29.org/api/weight/:weightId",
    "title": "Update weight",
    "name": "updateWeight",
    "description": "<p>This method update the weight of a patient</p>",
    "group": "Weight",
    "version": "1.0.0",
    "examples": [
      {
        "title": "Example usage:",
        "content": "var weight = {value: \"43\", dateTime:\"2018-02-27T17:55:48.261Z\"};\nthis.http.put('https://health29.org/api/weight/'+weightId, weight)\n .subscribe( (res : any) => {\n   console.log('weight: '+ res.weight);\n  }, (err) => {\n   ...\n  }",
        "type": "js"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Users unique access-key. For this, go to  <a href=\"#api-Access_token-signIn\">Get token</a></p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n  \"authorization\": \"Bearer eyJ0eXAiOiJKV1QiLCJhbGciPgDIUzI1NiJ9.eyJzdWIiOiI1M2ZlYWQ3YjY1YjM0ZTQ0MGE4YzRhNmUyMzVhNDFjNjEyOThiMWZjYTZjMjXkZTUxMTA9OGVkN2NlODMxYWY3IiwiaWF0IjoxNTIwMzUzMDMwLCJlcHAiOjE1NTE4ODkwMzAsInJvbGUiOiJVc2VyIiwiZ3JvdDEiOiJEdWNoZW5uZSBQYXJlbnQgUHJfrmVjdCBOZXRoZXJsYW5kcyJ9.MloW8eeJ857FY7-vwxJaMDajFmmVStGDcnfHfGJx05k\"\n}",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "weightId",
            "description": "<p>Weight unique ID. More info here:  <a href=\"#api-Weight-getWeight\">Get weightId</a></p>"
          }
        ],
        "body": [
          {
            "group": "body",
            "type": "Object",
            "optional": false,
            "field": "value",
            "description": "<p>Patient's weight. You set the dateTime and the weight</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "_id",
            "description": "<p>Weight unique ID.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "value",
            "description": "<p>Patient's weight. You get the weight</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>If the weight has been updated correctly, it returns the message 'Weight updated'.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\"weight\":\n  {\n    \"_id\":\"5a6f4b83f440d806744f3ef6\",\n    \"value\":\"43\",\n   \"dateTime\":\"2018-02-27T17:55:48.261Z\"\n  },\nmessage: \"Weight updated\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "controllers/user/patient/weight.js",
    "groupTitle": "Weight"
  },
  {
    "type": "get",
    "url": "https://health29.org/api/admin/qna/getCategories/",
    "title": "Request the list of categories present in a specific knowledgebase/qna",
    "name": "getCategories",
    "description": "<p>This method request the list of categories of a specific qna/knowledgeBase.</p>",
    "group": "knowledgeBases",
    "version": "1.0.0",
    "examples": [
      {
        "title": "Example usage:",
        "content": "var params = <knowledgeBaseID>\nthis.http.get('https://health29.org/api/admin/qna/getCategories/'+params)\n .subscribe( (res : any) => {\n   console.log('Get list of categories of qna ok');\n  }, (err) => {\n   ...\n  }",
        "type": "js"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Users unique access-key. For this, go to  <a href=\"#api-Access_token-signIn\">Get token</a></p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n  \"authorization\": \"Bearer eyJ0eXAiOiJKV1QiLCJhbGciPgDIUzI1NiJ9.eyJzdWIiOiI1M2ZlYWQ3YjY1YjM0ZTQ0MGE4YzRhNmUyMzVhNDFjNjEyOThiMWZjYTZjMjXkZTUxMTA9OGVkN2NlODMxYWY3IiwiaWF0IjoxNTIwMzUzMDMwLCJlcHAiOjE1NTE4ODkwMzAsInJvbGUiOiJVc2VyIiwiZ3JvdDEiOiJEdWNoZW5uZSBQYXJlbnQgUHJfrmVjdCBOZXRoZXJsYW5kcyJ9.MloW8eeJ857FY7-vwxJaMDajFmmVStGDcnfHfGJx05k\"\n}",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "knowledgeBaseID",
            "description": "<p>The unique identifier of a knowledgeBase</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "Result",
            "description": "<p>Returns the list of categories of a specific qna/knowledgeBase.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n\t\t{\n\t\t\tcategories:[\"category1\",\"category2\"]\n\t\t}",
          "type": "json"
        }
      ]
    },
    "filename": "controllers/admin/qna.js",
    "groupTitle": "knowledgeBases"
  },
  {
    "type": "get",
    "url": "https://health29.org/api/qnas",
    "title": "Request list of qnas/knowledgeBases identifiers for a group in specific language",
    "name": "getKnowledgeBaseID",
    "description": "<p>This method request the list of qnas/knowledgeBases identifiers for a group in specific language.</p>",
    "group": "knowledgeBases",
    "version": "1.0.0",
    "examples": [
      {
        "title": "Example usage:",
        "content": "var query = { group: <group_name>, lang: <lang_code> }\nthis.http.get('https://health29.org/api/qna',{params:query})\n .subscribe( (res : any) => {\n   console.log('Get list of qnas identifiers for a group in specific language ok');\n  }, (err) => {\n   ...\n  }",
        "type": "js"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Users unique access-key. For this, go to  <a href=\"#api-Access_token-signIn\">Get token</a></p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n  \"authorization\": \"Bearer eyJ0eXAiOiJKV1QiLCJhbGciPgDIUzI1NiJ9.eyJzdWIiOiI1M2ZlYWQ3YjY1YjM0ZTQ0MGE4YzRhNmUyMzVhNDFjNjEyOThiMWZjYTZjMjXkZTUxMTA9OGVkN2NlODMxYWY3IiwiaWF0IjoxNTIwMzUzMDMwLCJlcHAiOjE1NTE4ODkwMzAsInJvbGUiOiJVc2VyIiwiZ3JvdDEiOiJEdWNoZW5uZSBQYXJlbnQgUHJfrmVjdCBOZXRoZXJsYW5kcyJ9.MloW8eeJ857FY7-vwxJaMDajFmmVStGDcnfHfGJx05k\"\n}",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "groupName",
            "description": "<p>The name of the group: { group: (group_name) }</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "lang",
            "description": "<p>The code of the language: { lang: (lang_code) }</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "Result",
            "description": "<p>Returns the identifier of knowledgeBase for specific group and language</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n\t\t{\n\t\t\tknowledgeBaseID: <knowledgeBaseID>,\n\t\t}",
          "type": "json"
        }
      ]
    },
    "filename": "controllers/admin/qna.js",
    "groupTitle": "knowledgeBases"
  },
  {
    "type": "get",
    "url": "https://health29.org/api/qnas",
    "title": "Request list of qnas/knowledgeBases identifiers for a group",
    "name": "getKnowledgeBaseIDS",
    "description": "<p>This method request the list of qnas/knowledgeBases identifiers for a group in all languages configured.</p>",
    "group": "knowledgeBases",
    "version": "1.0.0",
    "examples": [
      {
        "title": "Example usage:",
        "content": "var query = { group: <group_name> }\nthis.http.get('https://health29.org/api/qnas',{params:query})\n .subscribe( (res : any) => {\n   console.log('Get list of qnas identifiers for a group ok');\n  }, (err) => {\n   ...\n  }",
        "type": "js"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Users unique access-key. For this, go to  <a href=\"#api-Access_token-signIn\">Get token</a></p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n  \"authorization\": \"Bearer eyJ0eXAiOiJKV1QiLCJhbGciPgDIUzI1NiJ9.eyJzdWIiOiI1M2ZlYWQ3YjY1YjM0ZTQ0MGE4YzRhNmUyMzVhNDFjNjEyOThiMWZjYTZjMjXkZTUxMTA9OGVkN2NlODMxYWY3IiwiaWF0IjoxNTIwMzUzMDMwLCJlcHAiOjE1NTE4ODkwMzAsInJvbGUiOiJVc2VyIiwiZ3JvdDEiOiJEdWNoZW5uZSBQYXJlbnQgUHJfrmVjdCBOZXRoZXJsYW5kcyJ9.MloW8eeJ857FY7-vwxJaMDajFmmVStGDcnfHfGJx05k\"\n}",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "groupName",
            "description": "<p>The name of the group: { group: (group_name) }</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "Result",
            "description": "<p>Returns list of knowledgeBases with the information of the ID and the lang: [{knowledgeBaseID:qna.knowledgeBaseID, lang: qna.lang}]</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n [\n\t\t{\n\t\t\tknowledgeBaseID: <knowledgeBaseID>,\n\t\t\tlang: <lang_code>\n\t\t}\n\t]",
          "type": "json"
        }
      ]
    },
    "filename": "controllers/admin/qna.js",
    "groupTitle": "knowledgeBases"
  }
] });
