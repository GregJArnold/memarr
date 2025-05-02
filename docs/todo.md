# Step-by-Step Plan to Build Meme Library Search Web App

## Overview

This plan outlines the development of the Meme Library Search Web App as specified in the PRD. It is structured into phases aligned with the PRD's implementation plan (MVP, Enhanced Features, Polish and Scale, Maintenance). Tasks are broken into small, actionable steps with subtasks, ensuring incremental progress and no complexity jumps. Each task includes a unique ID, dependencies, and context for implementation. Dependencies ensure tasks build on each other, creating a cohesive workflow.

## Phase 1: MVP (3-4 months)

### Task 1: Set Up Project Infrastructure

**ID**: T1  
**Context**: Establish the foundational development environment to ensure consistent local self-hosting and collaboration. This includes version control, CI/CD, and monitoring setup.  
**Dependencies**: None

- [x] **T1.1**: Create project structure
  - Set up root directories: `/frontend` (React), `/backend` (Node.js), `/docs` (documentation).
  - Initialize `package.json` for both frontend and backend.
  - Set up `.gitignore` for Node.js, React, and PostgreSQL as needed in those directories.
- [x] **T1.2**: Configure CI/CD with GitHub Actions
  - Create a GitHub Actions workflow for linting, testing, and building the app.
  - Ensure workflows run on pull requests and master branch pushes.
- [x] **T1.3**: Set up Glitchtip for error tracking
  - Install Glitchtip locally or use a self-hosted instance.
  - Configure error reporting for Node.js and React.

### Task 2: Set Up Backend Foundation

**ID**: T2  
**Context**: Build the core backend infrastructure, including the Node.js server, GraphQL API, and PostgreSQL database, to support meme storage and metadata management.  
**Dependencies**: T1

- [x] **T2.1**: Initialize Node.js server
  - Set up a Node.js project with Express and Apollo Server for GraphQL.
  - Create a basic `/health` endpoint to verify server status.
- [x] **T2.2**: Configure PostgreSQL database
  - Install PostgreSQL locally and create a database for the app.
  - Set up a connection using the Objection ORM.
- [x] **T2.3**: Define initial database schema
  - Create tables for:
    - Users (ID, email, hashed password).
    - Memes (ID, file path, user ID, upload timestamp).
    - Tags (ID, name, meme ID).
    - Events (ID, type, meme ID, timestamp, description).
  - Ensure foreign key relationships.
- [x] **T2.4**: Set up local file storage
  - Create a `/storage` directory for meme images.
  - Implement a basic file upload endpoint to save images locally.

### Task 3: Implement User Authentication

**ID**: T3  
**Context**: Enable user sign-up and login using email-based authentication to secure access to the meme library. OAuth for X will be added later.  
**Dependencies**: T2

- [x] **T3.1**: Create user sign-up endpoint
  - Implement a GraphQL mutation for user registration (email, password).
  - Hash passwords using bcrypt before storing.
- [x] **T3.2**: Create user login endpoint
  - Implement a GraphQL mutation for login, returning a JWT token.
  - Validate credentials and issue token with a 24-hour expiry.
- [x] **T3.3**: Add authentication middleware
  - Create middleware to verify JWT tokens for protected GraphQL queries/mutations.
  - Apply to all endpoints except `/health`, sign-up, and login.

### Task 4: Develop AI Classification Module

**ID**: T4  
**Context**: Integrate an AI model to classify meme templates and extract text blocks, forming the core of the app's functionality. Use a placeholder OpenAI-compatible model for local testing.  
**Dependencies**: T2

- [x] **T4.1**: Set up AI model integration
  - Choose a local or self-hosted AI model (e.g., Hugging Face model for image classification and OCR).
  - Create a service to interface with the model via API or local execution.
- [x] **T4.2**: Implement template classification
  - Process uploaded meme images to identify templates (e.g., "Distracted Boyfriend").
  - Return a template name or "unknown" if unrecognized.
- [x] **T4.3**: Implement text extraction
  - Use OCR to extract text blocks from memes.
  - Label blocks (e.g., top text, bottom text) based on position or template-specific logic.
- [x] **T4.4**: Store classification results
  - Save template name and text blocks as metadata in the Memes table.
  - Add a "failed analysis" tag if classification fails.

### Task 5: Build Meme Upload Functionality

**ID**: T5  
**Context**: Allow users to upload memes, process them with the AI, and store them in the library, including handling failed classifications.  
**Dependencies**: T3, T4

- [x] **T5.1**: Create meme upload endpoint
  - Implement a GraphQL mutation to upload meme images (authenticated users only).
  - Save images to local storage and store file path in the database.
- [x] **T5.2**: Integrate AI classification
  - Trigger AI classification (template and text extraction) on upload.
  - Store results in the Memes table or tag as "failed analysis".
- [x] **T5.3**: Log upload event
  - Create an event in the Events table (e.g., "Meme uploaded", timestamp, meme ID).
- [x] **T5.4**: Handle failed classifications
  - If AI fails, tag meme with "failed analysis" and log event.
  - Return an error response to the client with options to describe or submit.

### Task 6: Set Up Frontend Foundation

**ID**: T6  
**Context**: Build the React frontend to provide a user interface for meme uploads, library display, and navigation.  
**Dependencies**: T1

- [x] **T6.1**: Initialize React project
  - Set up a React project with Vite.
  - Install Tailwind CSS and configure it.
- [x] **T6.2**: Create basic layout
  - Implement a navigation bar with links to Home, Library, and Activity.
  - Add a main content area for page rendering.
- [x] **T6.3**: Set up Apollo Client
  - Install Apollo Client for GraphQL queries/mutations.
  - Configure to connect to the backend GraphQL API.
- [x] **T6.4**: Implement routing
  - Use React Router to handle routes for Home, Library, Activity, and Login/Sign-up pages.

### Task 7: Implement Login/Sign-Up UI

**ID**: T7  
**Context**: Create frontend pages for user authentication, integrating with the backend API.  
**Dependencies**: T3, T6

- [x] **T7.1**: Build sign-up page
  - Create a form with email and password fields.
  - Call the sign-up mutation and store the JWT token in local storage.
- [x] **T7.2**: Build login page
  - Create a form with email and password fields.
  - Call the login mutation, store the JWT, and redirect to the Library page.
- [x] **T7.3**: Add auth state management
  - Use Context API to manage logged-in state.
  - Protect routes (e.g., Library, Activity) to redirect unauthenticated users to Login.

### Task 8: Build Meme Upload UI

**ID**: T8  
**Context**: Create a frontend interface for users to upload memes and handle failed classifications.  
**Dependencies**: T5, T7

- [x] **T8.1**: Create upload form
  - Add a file input field to the Library page for image uploads.
  - Include a submit button to trigger the upload.
- [x] **T8.2**: Integrate with upload endpoint
  - Call the meme upload mutation with the selected file.
  - Display a success message on successful upload.
- [ ] **T8.3**: Implement error modal for failed classifications
  - Show a modal if the upload fails classification.
  - Include fields for template name and text block description, plus a "Submit to Developers" button.
- [ ] **T8.4**: Handle modal submissions
  - Send description data or just the meme to the backend via a mutation.
  - Display a confirmation message after submission.

### Task 9: Implement Basic Search Functionality

**ID**: T9  
**Context**: Allow users to search their meme library by template and text content, displaying results in a grid.  
**Dependencies**: T5, T7

- [x] **T9.1**: Create search endpoint
  - Implement a GraphQL query to search memes by template name and text content.
  - Support additive filtering (e.g., template AND text).
- [x] **T9.2**: Build search UI
  - Add input fields for template and text on the Library page.
  - Include a search button to trigger the query.
- [x] **T9.3**: Display search results
  - Render results as a grid of thumbnails with template names.
  - Allow clicking a thumbnail to view meme details (image, template, text).
- [x] **T9.4**: Handle empty results
  - Show a "No results found" message if the search returns no memes.

### Task 10: Build Activity Page

**ID**: T10  
**Context**: Create an activity page to display meme-related events, such as uploads and classifications.  
**Dependencies**: T5, T7

- [x] **T10.1**: Create events query endpoint
  - Implement a GraphQL query to fetch events (type, meme ID, timestamp, description).
  - Include related meme data (thumbnail, template name).
- [x] **T10.2**: Build activity page UI
  - Create a table with columns: thumbnail (hover tooltip for larger view), template name, event description, actions.
  - Fetch events using the events query.
- [x] **T10.3**: Implement view action
  - Add a "View" button in the actions column to navigate to a meme detail page.
- [x] **T10.4**: Ensure extensibility
  - Design the table to support new event types (e.g., use a generic event type field).

### Task 11: Set Up Developer Submission Pipeline

**ID**: T11  
**Context**: Enable users to submit unrecognized memes to developers for review and model updates.  
**Dependencies**: T5, T8

- [ ] **T11.1**: Create submission endpoint
  - Implement a GraphQL mutation to submit a meme (image, template name, description, user ID, timestamp).
  - Store submission in a PostgreSQL table (Submissions).
- [ ] **T11.2**: Build developer review interface
  - Create a simple Node.js app with a table listing submissions (meme, description, etc.).
  - Include buttons to approve (add to AI model) or reject.
- [ ] **T11.3**: Log submission events
  - Add an event to the Events table when a user submits a meme.
- [ ] **T11.4**: Notify user of submission
  - Return a confirmation message via the API after submission.

## Phase 2: Enhanced Features (2-3 months)

### Task 12: Implement Manual Tagging

**ID**: T12  
**Context**: Allow users to add, edit, and remove custom tags for memes to enhance searchability.  
**Dependencies**: T9

- [x] **T12.1**: Create tagging endpoints
  - Implement GraphQL mutations to add, edit, and delete tags for a meme.
  - Store tags in the Tags table with meme ID.
- [x] **T12.2**: Build tagging UI
  - Add a tag input field to the meme detail page.
  - Display existing tags with an option to edit or delete.
- [x] **T12.3**: Update search to include tags
  - Modify the search query to filter by tags in addition to template and text.
  - Update the search UI with a tags input field.
- [x] **T12.4**: Log tagging events
  - Add events to the Events table for tag additions, edits, and deletions.

### Task 13: Enhance Activity Page Extensibility

**ID**: T13  
**Context**: Refactor the activity page to support new event types and actions dynamically.  
**Dependencies**: T10, T12

- [ ] **T13.1**: Create event-action mapping
  - Define a configuration (e.g., JSON or database table) mapping event types to actions (e.g., "tag_added" → "view", "edit tags").
  - Ensure new event types can be added without code changes.
- [ ] **T13.2**: Update activity page UI
  - Render actions dynamically based on the event-action mapping.
  - Test with existing events (uploads, classifications, tags).
- [ ] **T13.3**: Add edit tags action
  - Implement an "Edit Tags" button for relevant events (e.g., uploads, tag edits).
  - Link to the meme detail page with the tagging UI.
- [ ] **T13.4**: Test extensibility
  - Simulate a new event type and action to ensure the system handles it correctly.

### Task 14: Implement Re-scanning Process

**ID**: T14  
**Context**: Build a process to re-scan memes tagged as "failed analysis" after app updates, logging successful classifications.  
**Dependencies**: T5, T11

- [ ] **T14.1**: Create re-scanning script
  - Write a Node.js script to query memes with the "failed analysis" tag.
  - Re-run AI classification and update metadata if successful.
- [ ] **T14.2**: Integrate with update process
  - Trigger the re-scanning script at the end of the app update process (e.g., via a CLI command).
  - Ensure failures are silently ignored.
- [ ] **T14.3**: Log re-scanning events
  - Add events to the Events table for successful re-classifications.
  - Update the meme's metadata (remove "failed analysis" tag if successful).
- [ ] **T14.4**: Test re-scanning
  - Upload a meme that fails classification, simulate an AI update, and verify re-scanning behavior.

## Phase 3: Polish and Scale (2 months)

### Task 15: Optimize Search Performance

**ID**: T15  
**Context**: Improve the search functionality for speed and accuracy, ensuring scalability for larger meme libraries.  
**Dependencies**: T12

- [ ] **T15.1**: Add database indexes
  - Create indexes on Memes (template, text) and Tags (name) for faster queries.
  - Test query performance with a large dataset.
- [ ] **T15.2**: Implement caching
  - Use Redis (self-hosted) to cache frequent search queries.
  - Invalidate cache on meme uploads or tag changes.
- [ ] **T15.3**: Optimize search UI
  - Add debouncing to search input to reduce API calls.
  - Display a loading spinner during search.
- [ ] **T15.4**: Test scalability
  - Simulate 1,000 memes per user and verify search performance.

### Task 16: Enhance Error Modal UX

**ID**: T16  
**Context**: Improve the user experience of the failed classification modal to make it more intuitive.  
**Dependencies**: T8

- [ ] **T16.1**: Add example descriptions
  - Include sample template names and text block descriptions in the modal.
  - Use placeholder text to guide users.
- [ ] **T16.2**: Improve modal design
  - Use Tailwind CSS to make the modal visually appealing (e.g., clean layout, consistent colors).
  - Add clear labels for template name and description fields, with a separate "Submit to Developers" button.
- [ ] **T16.3**: Add validation feedback
  - Validate that the template name is non-empty before submission.
  - Show a friendly error message (e.g., "Please provide a template name") if validation fails.
- [ ] **T16.4**: Test modal usability
  - Conduct usability testing with 3–5 users to ensure the modal is intuitive.
  - Iterate based on feedback (e.g., adjust wording or layout).

## Phase 3: Polish and Scale (2 months, continued)

### Task 16: Enhance Error Modal UX

**ID**: T16  
**Context**: Improve the user experience of the failed classification modal to make it more intuitive and guide users in submitting new meme templates. This enhances user engagement and submission quality.  
**Dependencies**: T8 (Meme Upload UI)

- [ ] **T16.1**: Add example descriptions
  - Include sample template names (e.g., "Distracted Boyfriend") and text block descriptions (e.g., "Top text: Girlfriend's complaint, Bottom text: Boyfriend's distraction") in the modal.
  - Use placeholder text in input fields to guide users.
- [ ] **T16.2**: Improve modal design
  - Apply Tailwind CSS to make the modal visually appealing (e.g., clean layout, consistent colors).
  - Add clear labels for template name and description fields, with a separate "Submit to Developers" button.
- [ ] **T16.3**: Add validation feedback
  - Validate that the template name is non-empty before submission.
  - Show a friendly error message (e.g., "Please provide a template name") if validation fails.
- [ ] **T16.4**: Test modal usability
  - Conduct usability testing with 3–5 users to ensure the modal is intuitive.
  - Iterate based on feedback (e.g., adjust wording or layout).

### Task 17: Implement X Authentication and Posting

**ID**: T17  
**Context**: Enable users to authenticate via X and post memes to X as part of messages, fulfilling the PRD's integration requirement.  
**Dependencies**: T3 (User Authentication), T7 (Login/Sign-Up UI), T9 (Basic Search Functionality)

- [ ] **T17.1**: Set up X OAuth authentication
  - Integrate X API for OAuth 2.0 login using the X developer portal.
  - Add a GraphQL mutation to handle X login, storing the access token in the database.
- [ ] **T17.2**: Update login UI for X
  - Add a "Login with X" button to the login page.
  - Redirect users to X for authentication and handle the callback to store the token.
- [ ] **T17.3**: Create posting endpoint
  - Implement a GraphQL mutation to post a meme to X with a user-provided message.
  - Use the stored X access token to authenticate the request.
- [ ] **T17.4**: Build posting UI
  - Add a "Post to X" button on the meme detail page (accessible from search results or library).
  - Include a text area for the message and a preview of the meme before posting.
- [ ] **T17.5**: Test X integration
  - Verify that users can log in via X and post memes successfully.
  - Handle edge cases (e.g., expired tokens, API rate limits).

### Task 18: Improve Developer Tools for Template Integration

**ID**: T18  
**Context**: Enhance the developer review interface to streamline the process of adding new meme templates to the AI model, improving turnaround time for user submissions.  
**Dependencies**: T11 (Developer Submission Pipeline)

- [ ] **T18.1**: Add template update endpoint
  - Create a GraphQL mutation (admin-only) to add a new template to the AI model's database.
  - Store template metadata (name, text block rules) in a Templates table.
- [ ] **T18.2**: Enhance review interface
  - Add fields to the developer review app to input template name and text block rules based on user submissions.
  - Include a preview of the submitted meme image.
- [ ] **T18.3**: Automate model retraining
  - Implement a script to retrain or update the AI model with new templates (e.g., fine-tune the Hugging Face model locally).
  - Trigger retraining after approving a submission.
- [ ] **T18.4**: Test template integration
  - Submit a test meme, approve it via the review interface, and verify the AI correctly classifies it after retraining.

### Task 19: Conduct User Testing

**ID**: T19  
**Context**: Gather feedback from real users to identify usability issues and refine the app before scaling. This ensures the app meets the needs of average social media users.  
**Dependencies**: T15 (Optimize Search Performance), T16 (Enhance Error Modal UX), T17 (X Authentication and Posting)

- [ ] **T19.1**: Design test scenarios
  - Create 5–7 tasks for users (e.g., upload a meme, search by template, post to X, submit a failed meme).
  - Define success criteria (e.g., complete task in <1 minute, no errors).
- [ ] **T19.2**: Recruit test participants
  - Identify 5–10 social media users (e.g., via X or local networks).
  - Ensure diversity in technical proficiency.
- [ ] **T19.3**: Conduct testing sessions
  - Run 30-minute sessions with each user, observing task completion and collecting feedback.
  - Record pain points (e.g., confusing UI, slow performance).
- [ ] **T19.4**: Implement feedback
  - Prioritize feedback (e.g., fix critical bugs, simplify workflows).
  - Update UI, API, or logic based on findings (e.g., adjust search filters, clarify modal text).

### Task 20: Finalize Scalability

**ID**: T20  
**Context**: Ensure the app can handle a growing user base and larger meme libraries while maintaining performance, focusing on self-hosted scalability.  
**Dependencies**: T15 (Optimize Search Performance), T18 (Improve Developer Tools)

- [ ] **T20.1**: Optimize file storage
  - Implement a file organization strategy (e.g., user-specific folders, hashed filenames) to prevent storage bottlenecks.
  - Add cleanup logic to remove orphaned files.
- [ ] **T20.2**: Scale database performance
  - Analyze query performance with a large dataset (e.g., 10,000 memes, 100 users).
  - Add partitioning or sharding if needed for PostgreSQL.
- [ ] **T20.3**: Stress-test the app
  - Simulate 100 concurrent users uploading, searching, and posting.
  - Monitor CPU, memory, and disk usage on a self-hosted server.
- [ ] **T20.4**: Document self-hosting guide
  - Create a `README` or `/docs/self-hosting.md` with steps to set up Node.js, PostgreSQL, AI model, and Glitchtip locally.
  - Include hardware requirements (e.g., 8GB RAM, 4-core CPU).

## Phase 4: Maintenance and Iteration (Ongoing)

### Task 21: Monitor AI and Submission Performance

**ID**: T21  
**Context**: Continuously track the AI model's accuracy and user submission quality to maintain a high-quality meme classification system.  
**Dependencies**: T18 (Improve Developer Tools), T19 (Conduct User Testing)

- [ ] **T21.1**: Set up AI performance metrics
  - Log classification accuracy (e.g., correct vs. failed classifications) in Glitchtip.
  - Create a dashboard in the developer review app to display metrics.
- [ ] **T21.2**: Analyze submission trends
  - Add a report in the review app to show common templates or text patterns in submissions.
  - Identify frequently submitted templates for priority integration.
- [ ] **T21.3**: Schedule model updates
  - Establish a biweekly process to review submissions and retrain the AI model.
  - Test updated model before deployment.
- [ ] **T21.4**: Notify users of new templates
  - Add a notification on the activity page when a user's submitted template is added (e.g., "Your template 'X' is now supported!").

### Task 22: Add Template Suggestion Feature

**ID**: T22  
**Context**: Enhance the app by suggesting similar templates during search or upload, improving user experience and discovery.  
**Dependencies**: T15 (Optimize Search Performance), T21 (Monitor AI and Submission Performance)

- [ ] **T22.1**: Create template similarity logic
  - Implement a simple algorithm (e.g., cosine similarity on template metadata) to find related templates.
  - Store similarity scores in the Templates table.
- [ ] **T22.2**: Add suggestion endpoint
  - Create a GraphQL query to return suggested templates based on a meme's template or search query.
  - Limit to 3–5 suggestions.
- [ ] **T22.3**: Build suggestion UI
  - Display suggested templates below search results or on the meme detail page.
  - Use thumbnails and template names, clickable to view related memes.
- [ ] **T22.4**: Test suggestions
  - Verify that suggestions are relevant (e.g., "Distracted Boyfriend" suggests "Drake Hotline Bling").
  - Adjust algorithm based on user feedback.

### Task 23: Implement Bulk Tagging

**ID**: T23  
**Context**: Allow users to apply tags to multiple memes at once, improving efficiency for large libraries.  
**Dependencies**: T12 (Manual Tagging), T19 (Conduct User Testing)

- [ ] **T23.1**: Create bulk tagging endpoint
  - Implement a GraphQL mutation to apply a tag to multiple meme IDs.
  - Validate that all memes exist and belong to the user.
- [ ] **T23.2**: Build bulk tagging UI
  - Add a checkbox selection mode to the library/search results grid.
  - Include a "Tag Selected" button that opens a tag input field.
- [ ] **T23.3**: Log bulk tagging events
  - Add an event to the Events table for bulk tagging (e.g., "Tagged 5 memes with 'funny'").
- [ ] **T23.4**: Test bulk tagging
  - Verify that tags are applied correctly to multiple memes.
  - Ensure the UI is intuitive and handles edge cases (e.g., no memes selected).

### Task 24: Maintain X API Integration

**ID**: T24  
**Context**: Ensure the X API integration remains functional as the platform evolves, addressing any breaking changes or new features.  
**Dependencies**: T17 (X Authentication and Posting)

- [ ] **T24.1**: Monitor X API updates
  - Subscribe to X developer portal announcements for API changes.
  - Log any deprecated endpoints or new requirements in Glitchtip.
- [ ] **T24.2**: Update authentication if needed
  - Modify OAuth flow if X updates its API (e.g., new scopes, token formats).
  - Test login functionality after updates.
- [ ] **T24.3**: Update posting if needed
  - Adjust the posting mutation to comply with new X API requirements (e.g., media upload formats).
  - Verify posting works with various meme sizes and message lengths.
- [ ] **T24.4**: Add integration tests
  - Write automated tests for X login and posting using a mock X API.
  - Run tests in CI/CD to catch regressions.

### Task 25: Ongoing Bug Fixes and Performance Improvements

**ID**: T25  
**Context**: Continuously address bugs and optimize performance based on user feedback and monitoring, ensuring a stable app.  
**Dependencies**: T20 (Finalize Scalability), T21 (Monitor AI and Submission Performance)

- [ ] **T25.1**: Set up bug tracking process
  - Create a GitHub issue template for bugs with fields for description, steps to reproduce, and screenshots.
  - Prioritize bugs based on severity (e.g., critical, minor).
- [ ] **T25.2**: Fix reported bugs
  - Address 2–3 high-priority bugs per week (e.g., UI glitches, API errors).
  - Write unit tests to prevent regressions.
- [ ] **T25.3**: Optimize performance
  - Monitor Glitchtip for slow endpoints or high resource usage.
  - Implement optimizations (e.g., reduce image processing time, optimize queries) as needed.
- [ ] **T25.4**: Collect user feedback
  - Add a feedback form in the app (e.g., on the Activity page) for users to report issues or suggest features.
  - Review feedback monthly and prioritize for future iterations.
