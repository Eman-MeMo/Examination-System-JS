# Examination System JS

## Overview
This is a web-based Examination System that allows students to log in, select an exam, answer questions, and receive a score upon completion. The system includes user authentication, exam selection, quiz functionality, and score tracking.

## Features
- **User Authentication**: Students log in using their email and password.
- **Exam Selection**: Users select an exam subject and difficulty level.
- **Dynamic Question Loading**: Questions are fetched dynamically from a JSON file.
- **Timer and Progress Tracking**: The exam includes a countdown timer and question navigation.
- **Flagging Questions**: Users can flag questions for review.
- **Automatic Scoring**: The system calculates and displays the user's final score.
- **Local Storage for Session Handling**: Users can be remembered between sessions.

## Technologies Used
- **HTML**: Structure of the web pages.
- **CSS**: Styling for a user-friendly interface.
- **JavaScript**: Logic for validation, fetching questions, and handling the exam.

## File Structure
```
/Assets
  /CSS
    - login.css
    - SelectExam.css
    - exam.css
  /JS
    - login.js
    - SelectExam.js
    - exam.js
  /Images
    - image-1.png
    - image-2.png
  /Data.json

index.html        -> Redirects to login.html
login.html        -> User login page
SelectExam.html   -> Exam selection page
exam.html         -> Examination page
```

## How to Use
1. **Login**:
   - Enter a valid email and password.
   - Click "Login" to proceed.
   - If "Remember me" is checked, user details are stored in `Cookies`.
2. **Select Exam**:
   - Choose a subject and difficulty level.
   - Click "Start Exam".
3. **Take the Exam**:
   - Answer each question before the timer runs out.
   - Navigate using "Next" and "Previous" buttons.
   - Use the "Flag" button to mark questions for review.
   - Click "Submit" to finish the exam.
4. **View Score**:
   - The system calculates the score and displays the result.

## Validation and Error Handling
- Email format validation.
- Password complexity check (8-10 characters, at least one uppercase, one lowercase, one digit, and one special character).
- Prevents starting the exam without selecting a subject and level.
- Displays error messages for incorrect login or missing selections.

## Future Enhancements
- Implement backend authentication and database storage.
- Add a dashboard for tracking student performance.

