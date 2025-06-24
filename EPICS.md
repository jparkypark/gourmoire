# Gourmoire V1 Epic Specification

## Epic Status Overview

### Epic Status Overview
| Epic | Status | Stories | Completion |
|------|--------|---------|------------|
| Recipe Management | 📋 Not Started | 0/4 | 0% |
| Search & Discovery | 📋 Not Started | 0/5 | 0% |
| Daily Usage | 📋 Not Started | 0/2 | 0% |
| User Interface | 📋 Not Started | 0/2 | 0% |
| Authentication | ✅ Completed | 2/2 | 100% |

**Overall Progress**: 2/15 total stories completed (13%)

---

## Status Definitions

| Status | Icon | Description |
|--------|------|-------------|
| **Not Started** | 📋 | Work has not begun on this item |
| **In Progress** | 🔄 | Currently being worked on |
| **Blocked** | 🚫 | Cannot proceed due to dependencies or issues |
| **In Review** | 🔍 | Work completed, awaiting review or testing |
| **Completed** | ✅ | Successfully finished and verified |

**Usage Guidelines:**
- **Epics/Stories**: Primarily use Not Started → In Progress → Completed
- **Tasks**: May use all statuses including Blocked and In Review for detailed tracking
- **Blocked items**: Always include reason and dependencies in task description

---

## Overview
Gourmoire V1 is a personal recipe management web application designed for a single user to organize, search, and manage their recipe collection. The focus is on simplicity, usability, and core functionality.

## Core Features

### 📋 1. Recipe Management (CRUD)
**Status**: 📋 Not Started | **Progress**: 0/4 stories completed

**Create Recipe**
- User can add new recipes with the following fields:
  - **Title** (required, max 200 chars)
  - **Description** (optional, max 500 chars)
  - **Servings** (number, default 4)
  - **Prep Time** (minutes)
  - **Cook Time** (minutes)
  - **Ingredients** (list with quantity, unit, item)
  - **Instructions** (ordered list of steps)
  - **Tags** (multiple selection from predefined + custom)

**Read Recipe**
- View recipe in detail with all information
- Print-friendly layout option
- Display creation and modification dates
- Show associated tags with visual indicators

**Update Recipe**
- Edit any recipe field
- Auto-save draft functionality
- Track modification history (last updated timestamp)

**Delete Recipe**
- Soft delete with confirmation dialog
- Ability to restore recently deleted recipes (within 30 days)

### 📋 2. Tagging System
**Status**: 📋 Not Started | **Progress**: Covered in Search & Discovery epic

**Tag Categories**
- **Cuisine**: Italian, Mexican, Asian, American, etc.
- **Dietary**: Vegetarian, Vegan, Gluten-Free, Dairy-Free, etc.
- **Meal Type**: Breakfast, Lunch, Dinner, Snack, Dessert
- **Cooking Method**: Baked, Grilled, Slow Cooker, One-Pot, etc.
- **Custom**: User-defined tags

**Tag Management**
- Create custom tags with color coding
- Assign multiple tags to recipes
- Edit/delete custom tags (with impact warning)
- Tag usage statistics (how many recipes use each tag)

### 📋 3. Search & Discovery
**Status**: 📋 Not Started | **Progress**: 0/5 stories completed

**Search Functionality**
- **Full-text search** across recipe titles and descriptions
- **Ingredient search** - find recipes containing specific ingredients
- **Quick filters**: 
  - By prep time (< 15 min, 15-30 min, 30+ min)
  - By cook time (< 30 min, 30-60 min, 60+ min)
  - By servings (1-2, 3-4, 5+ people)

**Filtering & Sorting**
- Filter by single or multiple tags
- Combine search with filters
- Sort options:
  - Recently added (default)
  - Alphabetical (A-Z, Z-A)
  - Prep time (shortest/longest first)
  - Cook time (shortest/longest first)

**Browse Views**
- **List View**: Compact list with key details
- **Grid View**: Card-based layout with recipe images (placeholder support)

### ✅ 4. Authentication
**Status**: ✅ Completed | **Progress**: 2/2 stories completed

**Simple Auth System**
- Single hardcoded user account
- JWT-based authentication
- Login form with username/password
- Auto-logout after 24 hours
- Remember me option (30 days)

**Protected Routes**
- All recipe management requires authentication
- Public recipe view option (future enhancement)

### 📋 5. User Interface
**Status**: 📋 Not Started | **Progress**: 0/2 stories completed

**Responsive Design**
- Mobile-first approach
- Tablet and desktop optimizations
- Touch-friendly interface elements

**Navigation**
- Header with search bar and user menu
- Sidebar navigation (desktop) / bottom nav (mobile)
- Breadcrumb navigation for deep pages

**Key Pages**
- **Dashboard**: Recent recipes, quick stats, search
- **All Recipes**: Searchable/filterable recipe list
- **Recipe Detail**: Full recipe view with edit options
- **Add/Edit Recipe**: Form-based recipe creation/editing
- **Tags Management**: View and manage all tags

## User Stories

See [STORIES.md](./STORIES.md) for detailed user stories with acceptance criteria and estimates.

**Story Summary**: 15 total stories across 5 epics

**By Epic**:
- Recipe Management: 4 stories (RM-01, RM-02, RM-03, RM-04)
- Search & Discovery: 5 stories (SD-01, SD-02, SD-03, SD-04, SD-05)
- Daily Usage: 2 stories (DU-01, DU-02)
- User Interface: 2 stories (UI-01, UI-02)
- Authentication: 2 stories (AU-01, AU-02)

## Technical Requirements

### Performance
- Page load time < 2 seconds
- Search results in < 500ms
- Mobile-optimized bundle size

### Data Validation
- Client and server-side validation using Zod schemas
- Form validation with helpful error messages
- Data sanitization for user inputs

### Accessibility
- WCAG 2.1 AA compliance
- Keyboard navigation support
- Screen reader compatibility
- High contrast mode support

## Release Scope

For detailed release planning and story assignments, see **[ROADMAP.md](./ROADMAP.md)**.

### Future Enhancements (V2+)
- 🔮 Recipe image upload and management
- 🔮 Meal planning and shopping lists
- 🔮 Recipe import from URLs
- 🔮 Nutritional information integration
- 🔮 Recipe sharing capabilities
- 🔮 Advanced search (by ingredients you have)
- 🔮 Recipe rating and notes system
- 🔮 Export recipes to PDF
- 🔮 Multi-user support

## Success Criteria

### Functional
- User can perform all CRUD operations on recipes
- Search and filtering work accurately and quickly
- Tags can be created, assigned, and used for filtering
- Authentication protects recipe management features

### User Experience
- Intuitive navigation and recipe management
- Fast and responsive across all devices
- Clean, readable recipe display
- Efficient recipe entry workflow

### Technical
- Zero data loss
- 99% uptime
- Fast search performance
- Secure authentication