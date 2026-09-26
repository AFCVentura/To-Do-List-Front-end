# Easy Check (front end)

Easy Check is a to-do list web app built as a college team project at Senac Santa Catarina (September to November 2024). Users create an account, log in, organize tasks into lists, check items off and manage their account.

This repository is the React front end. It talks to a Spring Boot REST API backed by MySQL, which the project hosted on AWS.

## Screenshots

<!-- Screenshots go here -->

## Features

- Sign up with live password rules: at least 8 characters, upper and lowercase letters, a number, a special character, no spaces and a matching confirmation
- Login with a JWT kept in session storage and sent as a Bearer token on every request
- Route guards that keep logged-out users on the auth pages and logged-in users away from them
- Lists: create, select and delete, with a confirmation modal before deleting
- Items: add, delete and mark as done inside the selected list
- Settings page with logout and account deletion

## Tech stack

- React 18 with Vite
- React Router 6
- Axios, plus a small custom `useAxios` hook that handles request, loading and error state
- React Bootstrap and Bootstrap Icons, with custom styling in Sass
- react-password-checklist for the sign up password rules

## Project structure

```
src/
  components/   Login, Register and the two route guards
  pages/        AuthPage, HomePage (lists and items) and Config (settings)
  hooks/        useAxios
  sass/         style.scss
server.js       small Express mock used during development to test the register request
```

## Running locally

```bash
npm install
npm run dev
```

The app expects the Easy Check API at `http://localhost:8080/api`.

## My part

I set up the project (routing, auth flow, Sass and Bootstrap configuration) and built the sign up and login screens with their API calls, the route guards, the `useAxios` hook, the settings page and the final restyle of the UI. The lists and items screen was built by a teammate.
