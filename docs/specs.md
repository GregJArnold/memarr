# Product Requirements Document (PRD): Meme Library Search Web App

## Project Overview

**Purpose**: To create a web application that enables users to search and manage a personal library of image memes, leveraging AI to classify memes by template and text content, with manual tag addition, and facilitate posting to platforms like X as part of messages.

**Target Audience**: Average social media users who frequently use and share memes in online conversations.

**Primary Goal**: Allow users to efficiently search their meme library using additive criteria (template, text content, tags) and seamlessly integrate memes into messages on external platforms.

## Core Requirements

- **AI Classification**: Automatically classify meme templates and parse text content with near-perfect accuracy upon upload.
- **Search Functionality**: Support additive search by meme template, text content, and user-defined tags.
- **Manual Tagging**: Allow users to add custom tags to memes and automatically tag based on source.
- **New Template Handling**: Enable users to describe new meme templates via natural language for developer review and integration.
- **Activity Tracking**: Log meme-related events (e.g., uploads, classifications, failures) in an activity page.
- **Integration**: Facilitate posting memes to external platforms like X.
- **Re-scanning**: Automatically retry analysis for memes tagged as "failed analysis" after app updates.
- **Self-Hosted**: App should be able to be self-hosted without needing any cloud services.

## Core Features

1. **Meme Upload and Classification**:
   - Users upload memes to their library.
   - AI identifies the meme template and extracts text blocks (e.g., top text, bottom text, character-specific text) with high accuracy.
   - Automatically tags memes based on source.

2. **Search Interface**:
   - Additive search by:
     - Template (e.g., "The worst day of your life so far", "Distracted Boyfriend", "Matthew McConaughey Smoking").
     - Text content (parsed from meme-specific text blocks).
     - Manual or automatic tags.
   - Displays search results with meme thumbnails and metadata.

3. **Manual Tag Management**:
   - Users can add, edit, or remove custom tags.
   - Tags stored as metadata for searchability.

4. **New Template Submission**:
   - If AI fails to classify a meme template, displays an error message.
   - Offers users two options:
     - Describe the template (name and text block relationships) in natural language.
     - Submit the meme to developers for review.
   - Submission includes meme image, user description, user ID, timestamp, and template name.

5. **Activity Page**:
   - Displays a table of events (e.g., uploads, successful classifications, failed analyses, tag edits).
   - Columns: meme thumbnail (with hover tooltip for larger view), template name, event description, actions (e.g., view, edit tags).
   - Flexible design to support new event types and actions.

6. **Failed Analysis Handling**:
   - Tags memes that fail classification with "failed analysis".
   - Automatically re-scans these memes after app updates, silently ignoring those that fail again.
   - Logs successful re-classifications on the activity page.

7. **External Posting**:
   - Allows users to select a meme and post it to platforms like X within a message.

## Core Components

1. **Frontend**:
   - Search interface with input fields for template, text, and tags.
   - Meme library display with thumbnails and metadata.
   - Activity page with event table and action buttons.
   - Error modal for failed classifications with description/submission options.
   - Meme preview with hover tooltip.

2. **Backend**:
   - AI model for template classification and text extraction.
   - Database for storing memes, metadata (templates, tags, text), and event logs.
   - API for search, upload, tagging, and external posting.
   - Submission pipeline to send new template data to developers.

3. **Developer Tools**:
   - Interface to review user-submitted memes and descriptions.
   - Mechanism to update AI model and template database.

4. **Storage**:
   - Cloud storage for meme images.
   - Metadata storage for templates, tags, text blocks, and event logs.

## App/User Flow

1. **Onboarding**:
   - User signs up/logs in (via email).
   - Sees an empty library with an option to upload memes.

2. **Meme Upload**:
   - User uploads a meme image.
   - AI classifies the template and extracts text blocks.
   - If successful, meme is added to the library with metadata (template, text, source tags).
   - If failed, displays error modal:
     - Option 1: Enter template name and describe text block relationships.
     - Option 2: Submit meme to developers.
		 - Meme is still added to library.
     - Tags meme with "failed analysis".

3. **Search**:
   - User enters search criteria (template, text, tags) in additive fields.
   - Results display as a grid of thumbnails with template names and tags.
   - User clicks a meme to view details or post to X.

4. **Tagging**:
   - User views a meme and adds/edits custom tags.
   - Tags saved and reflected in search.

5. **Activity Page**:
   - User navigates to activity page to view event history.
   - Sees table with thumbnails, event details, and actions (e.g., view meme, edit tags).
   - Post-update, sees notifications of successfully re-classified memes.

6. **Posting**:
   - User selects a meme from library or search results.
   - Composes a message and posts to X via integration.

7. **New Template Submission**:
   - User submits a failed meme with or without description.
   - Receives confirmation message.
   - Developers review submission (meme, description, user ID, timestamp) and update AI model.

8. **Post-Update Re-scanning**:
   - After app update, system re-scans memes tagged "failed analysis".
   - Successful classifications logged on activity page; failures remain tagged.

## Tech Stack

- **Frontend**:
  - Framework: React.js for dynamic UI.
  - Styling: Tailwind CSS for rapid development.
  - State Management: Context API.

- **Backend**:
  - Language: Node.js with GraphQL for API.
  - AI Model: OpenAI to allow connecting to multiple different AIs.
  - Database: PostgreSQL for metadata and event logs.
  - Storage: Local file storage for meme images.

- **Developer Tools**:
  - Admin Panel: Custom Node.js app for submission review.
  - Queue: PostgreSQL table for storing user submissions.

- **Integration**:
  - X API for authentication and posting.
  - OAuth for user login.

- **DevOps**:
  - Hosting: Able to be locally self-hosted.
  - CI/CD: GitHub Actions for automated deployment.
  - Monitoring: Glitchtip for error tracking.

## Implementation Plan

### Phase 1: MVP (3-4 months)
- **Goals**:
  - Build core upload and AI classification system.
  - Implement basic search by template and text.
  - Create activity page with upload and classification events.
  - Set up failed analysis tagging and submission pipeline.
- **Tasks**:
  - Develop AI model for template classification and text extraction.
  - Build frontend for upload, search, and activity page.
  - Set up backend API and database schema.
  - Create developer submission review tool.

### Phase 2: Enhanced Features (2-3 months)
- **Goals**:
  - Add manual tagging and tag-based search.
  - Enhance activity page with flexible event types and actions.
  - Implement re-scanning process for failed analyses.
- **Tasks**:
  - Add tagging UI and API endpoints.
  - Refactor activity page for extensibility (event-action mapping).
  - Build re-scanning script triggered post-update.
  - Test AI accuracy and refine model.

### Phase 3: Polish and Scale (2 months)
- **Goals**:
  - Optimize search performance and UI/UX.
  - Improve developer tools for faster template integration.
  - Ensure scalability for growing user base.
- **Tasks**:
  - Optimize database queries and indexing for search.
  - Enhance error modal with better UX (e.g., examples for template description).
  - Scale infrastructure (e.g., add caching with Redis).
  - Conduct user testing and iterate on feedback.
  - Implement X authentication and basic posting.

### Phase 4: Maintenance and Iteration (Ongoing)
- **Goals**:
  - Monitor AI performance and user submissions.
  - Add new features (e.g., template suggestion, bulk tagging).
  - Maintain integrations with X API.
- **Tasks**:
  - Regularly update AI model with new templates.
  - Analyze activity page usage for new event types.
  - Patch bugs and improve performance based on user feedback.
