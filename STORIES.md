# Gourmoire User Stories

## Project Progress

**Current Release Progress**: See **[ROADMAP.md](./ROADMAP.md)** for V1.0 vs V1.1 story breakdown.

**Overall Progress**: 0/15 total stories completed (0%)

```
██████████████████████████████████████████████████████████████ 0%
0    10    20    30    40    50    60    70    80    90    100
```

---

This document contains all user stories for Gourmoire V1, organized by epic. Each story includes acceptance criteria and effort estimates.

> **Status Definitions**: See [EPICS.md - Status Definitions](./EPICS.md#status-definitions) for complete status legend and usage guidelines.

## Story Format
- **Story ID**: Unique identifier
- **Epic**: Parent epic reference
- **Story**: User story in standard format
- **Acceptance Criteria**: Specific requirements for completion
- **Estimate**: Relative effort (Small/Medium/Large)

---

## Epic: Recipe Management

**Stories**: RM-01, RM-02, RM-03, RM-04

### 📋 RM-01: Add New Recipe
**Status**: 📋 Not Started | **Progress**: 0/8 tasks completed
**Epic**: Recipe Management  
**Story**: As a user, I want to add a new recipe so I can save my favorite dishes  
**Acceptance Criteria**:
- I can fill out a form with title, description, servings, prep time, cook time
- I can add multiple ingredients with quantity, unit, and item name
- I can add multiple instruction steps in order
- I can assign tags to the recipe
- Form validates required fields and shows helpful error messages
- Recipe is saved and I'm redirected to the recipe detail view
- Success message confirms the recipe was saved

**Estimate**: Large

### 📋 RM-02: Edit Recipe Details
**Status**: 📋 Not Started | **Progress**: 0/4 tasks completed
**Epic**: Recipe Management  
**Story**: As a user, I want to edit recipe details so I can improve or correct information  
**Acceptance Criteria**:
- I can access edit mode from recipe detail view
- Form is pre-populated with existing recipe data
- I can modify any field (title, ingredients, instructions, tags, etc.)
- Auto-save draft functionality preserves changes as I work
- Changes are validated before saving
- I can cancel editing without losing original data
- Updated recipe shows modification timestamp
- Success message confirms changes were saved

**Estimate**: Medium

### 📋 RM-03: Delete Recipe
**Status**: 📋 Not Started | **Progress**: 0/5 tasks completed
**Epic**: Recipe Management  
**Story**: As a user, I want to delete recipes I no longer need  
**Acceptance Criteria**:
- Delete option is available from recipe detail view
- Confirmation dialog prevents accidental deletion
- Recipe is removed from all lists and search results
- Success message confirms deletion
- Recipe can be restored within 30 days (soft delete)

**Estimate**: Small

### 📋 RM-04: View Recipe Details
**Status**: 📋 Not Started | **Progress**: 0/4 tasks completed
**Epic**: Recipe Management  
**Story**: As a user, I want to view a recipe in a clean, readable format  
**Acceptance Criteria**:
- Recipe displays with clear typography and spacing
- Ingredients are listed with quantities and units
- Instructions are numbered and easy to follow
- Tags are visually distinct and clickable
- Prep time, cook time, and servings are prominently displayed
- Print-friendly layout option is available
- Edit and delete actions are easily accessible

**Estimate**: Medium

---

## Epic: Search & Discovery

**Stories**: SD-01, SD-02, SD-03, SD-04, SD-05

### 📋 SD-01: Tag Recipes
**Status**: 📋 Not Started | **Progress**: 0/7 tasks completed
**Epic**: Search & Discovery  
**Story**: As a user, I want to tag recipes so I can categorize them by cuisine, dietary needs, etc.  
**Acceptance Criteria**:
- I can select from predefined tag categories (Cuisine, Dietary, Meal Type, Cooking Method)
- I can assign multiple tags to a single recipe
- Tags are displayed visually on recipe cards and details
- Tag selection interface is intuitive and searchable
- Recently used tags appear first for quick selection

**Estimate**: Medium

### 📋 SD-02: Search Recipes
**Status**: 📋 Not Started | **Progress**: 0/6 tasks completed
**Epic**: Search & Discovery  
**Story**: As a user, I want to search for recipes by name or ingredient  
**Acceptance Criteria**:
- Search bar is prominently placed and always accessible
- Full-text search works across recipe titles and descriptions
- Ingredient search finds recipes containing specific ingredients
- Results are returned in under 500ms
- Search terms are highlighted in results
- "No results" state provides helpful suggestions
- Search history/suggestions improve usability

**Estimate**: Large

### 📋 SD-03: Filter Recipes
**Status**: 📋 Not Started | **Progress**: 0/4 tasks completed
**Epic**: Search & Discovery  
**Story**: As a user, I want to filter recipes by various criteria so I can find what I'm looking for  
**Acceptance Criteria**:
- Quick filter options: <15min, 15-30min, 30+ min prep time
- Quick filter options: <30min, 30-60min, 60+ min cook time
- Servings filter: 1-2, 3-4, 5+ people
- Filter by single or multiple tags
- Filters can be combined with search
- Active filters are clearly displayed with remove options
- Filter results update immediately
- Filter counts show available recipes per category

**Estimate**: Large

### 📋 SD-04: Browse and Sort Recipes
**Status**: 📋 Not Started | **Progress**: 0/4 tasks completed
**Epic**: Search & Discovery  
**Story**: As a user, I want to browse and sort recipes in different ways  
**Acceptance Criteria**:
- I can click any tag to see all recipes with that tag
- Tag-based browsing supports multiple tag selection
- Sort options: Recently added (default), Alphabetical (A-Z, Z-A)
- Sort options: Prep time (shortest/longest first), Cook time (shortest/longest first)
- List view and grid view options for recipe display
- Grid view shows recipe cards with placeholder image support
- View preferences are remembered

**Estimate**: Medium

### 📋 SD-05: Manage Tags
**Status**: 📋 Not Started | **Progress**: 0/4 tasks completed
**Epic**: Search & Discovery  
**Story**: As a user, I want to manage my custom tags so I can keep my tagging system organized  
**Acceptance Criteria**:
- I can create custom tags with color coding
- Tags management page shows all tags with usage statistics
- I can edit custom tag names and colors
- I can delete custom tags with impact warnings (shows affected recipes)
- Predefined tags cannot be deleted but can be hidden
- Tag categories are clearly organized (Cuisine, Dietary, Meal Type, etc.)

**Estimate**: Medium

---

## Epic: Daily Usage

**Stories**: DU-01, DU-02

### 📋 DU-01: Quick Dinner Discovery
**Status**: 📋 Not Started | **Progress**: 0/4 tasks completed
**Epic**: Daily Usage  
**Story**: As a user, I want to quickly find dinner ideas based on available time  
**Acceptance Criteria**:
- Homepage features "Quick Dinner Ideas" section
- Time-based suggestions integrate prep + cook time
- One-click access to recipes under specific time limits
- Suggestions include variety of cuisines and dietary options
- "Feeling lucky" random recipe suggestion for indecisive moments

**Estimate**: Medium

### 📋 DU-02: Recent Recipes Dashboard
**Status**: 📋 Not Started | **Progress**: 0/4 tasks completed
**Epic**: Daily Usage  
**Story**: As a user, I want to see my recently added recipes on the homepage  
**Acceptance Criteria**:
- Homepage shows 5-10 most recently added recipes
- Recent recipes display with thumbnail-style cards
- Quick stats show total recipe count and recent activity
- "View all recipes" link provides easy navigation
- Dashboard loads quickly and is mobile-optimized

**Estimate**: Small

---

## Epic: User Interface

### UI-01: Responsive Design
**Epic**: User Interface  
**Story**: As a user, I want to access my recipes from any device with a great experience  
**Acceptance Criteria**:
- Application is fully responsive on mobile, tablet, and desktop
- Touch-friendly interface elements on mobile devices
- Fast loading on slower mobile connections
- Consistent functionality across all screen sizes
- Mobile-first design approach

**Estimate**: Large

### UI-02: Navigation System
**Epic**: User Interface  
**Story**: As a user, I want intuitive navigation so I can easily move between different sections  
**Acceptance Criteria**:
- Header with search bar and user menu
- Sidebar navigation on desktop, bottom navigation on mobile
- Breadcrumb navigation for deep pages
- Clear visual hierarchy and consistent navigation patterns
- Quick access to frequently used features

**Estimate**: Medium

---

## Epic: Authentication

### AU-01: User Login
**Epic**: Authentication  
**Story**: As a user, I want to securely access my recipe collection  
**Acceptance Criteria**:
- Login form with username and password fields
- JWT token-based authentication with 24-hour expiration
- "Remember me" option extends session to 30 days
- Failed login attempts show helpful error messages
- Secure password handling with proper validation

**Estimate**: Medium

### AU-02: Protected Routes
**Epic**: Authentication  
**Story**: As a user, I want my recipes to be private and secure  
**Acceptance Criteria**:
- All recipe management features require authentication
- Unauthenticated users are redirected to login
- Session expiration triggers automatic logout
- Secure token storage and refresh handling
- Clear indication of authentication status

**Estimate**: Small

---

## Story Summary

**Total Stories**: 15  
**By Epic**:
- Recipe Management: 4 stories
- Search & Discovery: 5 stories  
- Daily Usage: 2 stories
- User Interface: 2 stories
- Authentication: 2 stories

**By Estimate**:
- Small: 3 stories
- Medium: 7 stories
- Large: 5 stories

**Next Step**: Break down stories into technical tasks in TASKS.md