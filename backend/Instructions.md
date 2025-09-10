# Capio React Native Coding Test

The purpose of this coding test is to see how you code and to have something practical to base discussions on at the technical interview. The test is supposed to take 3-4 hours to complete. Most importantly, we want to discuss your thought process, so make sure not to get stuck anywhere. In that case, it's better to move on to another part. We expect you to use some kind of template to get started quickly.

It's okay to use AI, but we expect you to have full understanding of all the code you submit and be able to explain in your own words why you implemented things the way you did.

## The task

Build a React Native application that allows users to login and save their phone number. The main task is handling the authentication, keeping the user logged in and logging it out according to the requirements below. The app should communicate with the given backend via secure API calls.

The backend is a simple node server, see the attached as a zip-file. Unzip it, run npm install, npm run build and then npm start to run it locally. There is more information about the API in the README file and API documentation.

### Features to implement

#### 1. Login Screen

A simple screen with username and password inputs. On submit, call the `POST /login` endpoint. Use the returned access token for all subsequent requests.
Successfully logging in should navigate the user to the Home screen. Logging out should bring the user back to the Login Screen.

#### 2. Home Screen and Profile Screen

The logged in part of the app consists of two screen: the Home Screen and the Profile screen.

- The Home screen displays a welcome message with the username. Call the `GET /account` endpoint for the user information. It also contains a button for navigation to the profile screen.
- The Profile screen contains an input field and a button where the user can save their phone number. Update the phone number by calling the `PATCH /account` endpoint with the phone number. If the user has a phone number saved it should be visible when entering the Profile Screen.
- For the sake of the test you should take into account that the user information could be updated from elsewhere. Therefor you should make sure the information is kept up to date in the app.

#### 3. Refreshing authentication

The access token is only valid for a short time and needs to be refreshed with the refresh token using the `/refresh` endpoint. The requirements for authentication is:

- The user should stay logged in as long as the app is active
- The user should stay logged in if the app has been in the background for less than 10 minutes
- The user should be logged out if the app has been terminated or has been in the background for more than 10 minutes

### Bonus tasks

If you have time you are welcome to complete on or more of the bonus tasks:

- Add some type of testing you feel is appropriate
- Add some nice styling and/or animations
- Implement graceful handling of network connectivity issues
- Add Biometric Authentication
  - Prompt it if user has logged in less than 24 hours ago and has an active refresh token, even if the app was terminated.

### Evaluation

We want to see how you structure your code, how you deal with data fetching and state management. You don't need to focus on design and styling in this task (unless you choose that as a bonus task). It's a pretty big task so it's understandable if you don't complete it all the way, don't stress about it. It's okay if not all parts work perfectly. It's important not to get stuck, if you do it's better to move on and finish another part.
