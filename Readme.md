## Installing application

1. Go to the code tab by selecting "<> Code" tab in Pull request page
2. Click green "<> Code" button and copy link to the git repository
3. On your disk create empty folder for testing app (for example c:\RSS\node\cross_check\crud_api\student_1)
4. Open command line and go to the created folder or open folder in your code editor
5. Create a local copy of the repository in created folder by using command "git clone {copied_link}"
6. Go to the development branch by command "git checkout development"
7. Install dependencies by command "npm install"

## Running App

- Start app by command "npm run start:dev" or "npm run start:multi"

## Create bundle

- For creating bundle use command "npm run start:prod"

## Runnig Tests

- For running test use "npm run test" command
- Use Ctrl+C to exit to command line after testing

## Using App

- Use POSTMAN app for requests and check app responses in accordance https://github.com/AlreadyBored/nodejs-assignments/blob/main/assignments/crud-api/assignment.md endpoints
- Use port 4000 on localhost for requests, also you can use 4001..4004 ports if app was started by command "npm run start:multi"
- App implemented so that you don't need use symbol $ in endpoints before {userId}

## Note fore Cross-Check App

- For checking errors on the server side that occur during the processing of requests send incorrect JSON body in POST or PUT requests. For example { username": "Маша" }, there is not first double quote on username key.
- PUT - request should content one ore more required fields and hobbies (if exist) should be array, in other case error 400 will be emitted
