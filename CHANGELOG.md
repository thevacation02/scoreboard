# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

## [v1.10.0] - 2020-12-23

### Added
- MapRoulette integration - view MapRoulette challenges on campaigns, with MapRoulette specific information
- Tasking Manager "chip" ui on Campaign cards to distinguish campaign project source
- Added OSM Teams Organization management UI, enabling Scoreboard admins to designate team managers and moderators

### Changed
- Local development changes: refactored Docker compose, move to github actions

### Fixed
- Fixed refresh tokens for teams
- Blank map image for loading state

### Changed

## [v1.9.1] - 2020-05-07

### Added

- Added some helpful labelling on the Create Team form.

## [v1.9.0] - 2020-05-07

### Added

- Added new sections to readme about osm-teams and administration settings.
- Added an osmesaStats data structure to the response in route /teams:id.
- Added new "Team stats" page to compile team editing + list of assigned campaigns
- Added "Create/Edit Teams" page allowing creation/editing of team name, hashtag, description, location, members, campaigns
- Added "Edit Moderators" page within Edit Teams allowing moderators to assign other team members as moderators
- Added Teams index page with "own teams" and "moderated teams" filters
- Added "Connect Teams" banner dependent on oauth flow for connecting [osm-teams](https://github.com/developmentseed/osm-teams) api
- Added "Sort by Country" to Users page
- Added environment variable to designate OSM Teams Organization that Scoreboard can write to

### Changed

- CentOS deployment script: deployment/centos/deploy.sh corrected and updated.
- Cleaned up and improved comments in `.env.sample`.
- Removed environment variables from README. Instead use `.env.sample` as a reference.
- Removed in-page table sorting from Users and Country tables
- Removed admin area ability to create teams / edit teams

### Fixed

- Fixed server session duration to remove "empty" sessions for API tokens

## [v1.8.0] - 2020-02-03

### Added
- Settings Admin Page
- Memory cache for settings
- Added blank state illustration for users with no edits
- Add CLI tool to allow user to assign random edits to their user for development
- Added "Total" row for campaign tables and campaign CSV export which calculates all stat totals 

### Changed 
- User extent tiles now provided by s3 and tileserver proxy
- Osmesa service now reads settings from cache
- Right-align table headers and cells with numeric data, excepting first "Rank" column
- Update node version to 12.14LTS

### Fixed
- Refactor stylesheets for modular scss best practices, added stylelint
- Catch undefined headers for sort column title

## [v1.7.2] - 2019-12-03
### Changed
- Table header link hover color; allows user to more easily distinguish hovered column
- Shortened "POI" description to save space

### Fixed
- Fixed path issue for rendering table icons
- Guard for null user edit counts


## [v1.7.1] - 2019-12-02
### Fixed
- Fix pagination bug for users table

## [v1.7.0] - 2019-11-28
### Added
- Add country of origin column to campaign tables

### Changed
- Refactor tables and tableheaders to use a common component configured using a tableSchema
- Make all tables sortable

### Fixed
- Removed "You" from public profile sidebars
- Design fixes: ensured full-height application, aligned country maps, included full height headers and loading states
- Removed source environment URL join from Edit Profile link in menu
- Replace `edit_sum` on User pages with the updated `edit_count` from OSMesa
- Fixes bug in tables when defaults for statistics are not provided by the API
- Remove redundant tooltips from campaign tables

## [v1.6.0] - 2019-10-28
### Changed
- Move all table header labels to common json file with descriptions.
- Move OSMESA service to use the OSMESA database directly instead of the osmesa-stat-server API
### Added
- Tooltip feature for providing definitions or instructions to user
- Edit times that occured within the last 24 hours show 'Last Edit: In the last 24 Hours' rather than 'today'

## [v1.5.0] - 2019-09-27
### Changed
- CSV exports from Campaigns and Users now split out the "Added" and "Modified" stats for all features

### Fixed
- Updated references to hashtag count to fix the hashtag chart
- Country blurb values have a fallback value of '0' if value is not supplied
- Campaign maps are guaranteed to display AOI due to addition conditional that check for an ID before rendering
- Campaign map zoom controls are re-enabled

## [v1.4.0] - 2019-08-19
### Added
- Campaigns can be filtered to include or exclude archived campaigns
- Railway features and lengths added, modified and deleted are included in campaigns, user profiles, dashboards and downloads

## [v1.3.5] - 2019-07-19
### Changed
- Switch campaign logic for homepage to using recency instead of priority

### Fixed
- Fix campaign language on homepage
- Fix changeset count property from OSMesa in CampaignTable component


## [v1.3.4] - 2019-07-17
### Fixed
- Fixed language related to mapping/completeness percentage between tasking managers 2 and 3
- TM2 and TM3 statuses now match in the database
- Draft campaigns are filtered at the API level

## [v1.3.3] - 2019-06-26
### Added
- Add changeset counts for user table in country pages

### Fixed
- Fix search state persistence and admin team page

## [v1.3.2] - 2019-06-17
### Changed
- Stats in the tables, exports and blurbs on Campaign, Dashboard, and User profile pages now combine the `added` and `modified` edits

## [v1.3.1] - 2019-06-11
### Added
- Updated osm-teams to have access tokens. Admins now need to sign in to osm-teams
- UI additions to gray out teams if the user does not have an access token

## [v1.3.0] - 2019-06-07
### Added
- Campaigns, countries and users pages can be sorted by name in alphabetical order
- Added new tests for alphabetical sorting
- "Reset filters" button clears filter options on the Campaigns page
- Number of edits and Number of changesets now available in summary stats widget at the top of the user and dashboard pages
- Campaign Table displays "Edits" in addition to "Changesets" (previously incorrectly labeled "Edits", see Fixed)
- Campaigns page renders blank state campaign cards while loading in campaign card data

### Fixed
- State retains page number and filters when navigating between the Campaigns page and individual campaign cards
- Add uniqueness constraint to campaigns to make sure that campaigns with the same id from the same tasking manager aren't added twice
- Campaign and dashboard page header style updated to better organize metadata hierarchy
- State retains filters when navigating away and to the countries and users page searches
- Update deployment docs for centos
- Top stats on the main page no longer count excluded users or their edits
- Campaign Table column corrected to say "Changesets" in place of "Edits"
- Campaign csv download includes both added and modified coastlines

## [v1.2.0] - 2019-05-08
### Added
- Add "Help" link to Scoreboard documentation
- Users are able to download a PDF certificate of all their earned badges from their dashboard
- Admins can include extra parameters to filter the project search of a tasking manager
- On user profile and individual dashboard, clicking "Export Data" link will download a CSV of user data
- On campaign pages, clicking "Export Data" link will download a CSV of the contributions of the top 10 campaign participants

### Changed
- "Not Logged In" error page takes an environment variable for the Editor name (default is OSM)
- Dashboard campaigns widget now shows a "Contributions" tab separate from the "All" tab which shows the list of contributions, favorites and team campaigns.

### Fixed
- Campaigns without stats will now display an "empty state", still displaying metadata from the tasking manager but without additional visualizations
- Expand the stats used in breakdown of edits and sums of edits by including missing modified and deleted metrics


## [v1.1.0] - 2019-03-19
### Added
- Add OSMESA status as "Last Refreshed" to pages using OSMESA stats
- On user page and dashboard, top campaigns will now show names of campaigns contributed to instead of hashtags contributed to
- The current version number of Scoreboard is now displayed in the footer
- On Campaigns Page, "top 10" user table has more detailed statistics
- Add <title> for pages

### Changed
- On the user dashboard, the "all campaigns" component will show all campaigns contributed to instead of assignments + favorites
- Country page user tables read "Edits" while those on Campaign pages read "Changesets"
- Docs site moved from being served from the API to statically hosted on https://developmentseed.org/scoreboard

### Fixed
- Leave excluded users' edits in aggregate statistics
- Updated table header styles to fix bug in Admin "Exclude Users" table, applies to whole app
- Mask color for favicons

## [v1.0.3] - 2019-03-07

### Fixed
- Updated country statistics to not display users in the admin-selected exclusion list

## [v1.0.2] - 2019-03-07
### Fixed
- Updated mock coastlines data to reflect new syntax
- Country statistics
  - To get top participants, subset after ordering total list by number of changesets
  - Accurate total edit count by country

## [v1.0.1] - 2019-02-22
### Changed
- Standardize how a user's last edit time is reported

### Fixed
- Remove MVT artifacts produced by OSMesa in Leaflet fallback maps

## [v1] - 2019-02-14
### Added
- Scoreboard backend
  - Ability to login using OSM (using passport in the backend)
  - Add support for multiple roles with different permissions
    - Currently stratified into `users` and `admins`
  - Simple command for upgrading users to administrators via cli
  - Add country geojson for looking up ISO codes and geometries
  - Admins can create, delete, and update badges through API routes and the admin interface
  - Support for badges based on the date edits are made and the hashtags they're made with
  - Hashtag-based badges and expired date-specific badges are excluded from "In Progress" display
  - Exclusion list that allows admins to exclude bots from overview page statistics
  - Integration with [osm-teams](https://github.com/developmentseed/osm-teams) API
  - Support both [tasking manager 2](https://github.com/hotosm/osm-tasking-manager2) and [tasking manager 3](https://github.com/hotosm/tasking-manager)
  - Admins can add multiple tasking managers via the admin interface

- Scoreboard UI
  - UI updates, with a new responsive design
  - Homepage and logo
  - Coastline metrics
  - Reformatted campaign URLs to be independent of fault-prone hashtags
  - Country pages
  - Team pages
  - Team admins can assign campaigns to team members and team-specific priorities to campaigns
  - Ability to "favorite" a campaign to see it on your dashboard
  - Admin UI that enables admins to:
    - Give admin access to other users
    - Create and edit badges
    - Create and edit teams
    - Assign users and campaigns to teams
  - User dashboard page that includes:
    - Summary statistics
    - Team membership
    - Edited countries
    - Favorited campaigns
    - Team-favorited campaigns
    - Earned and unearned (in-progress) badges
  - Route to the dashboard when a user is logged in
  - Comprehensive documentation published at `/docs`
  - Ability to sort campaigns by last update and creation date

### Changed
- Scoreboard backend
  - Move from Sqlite to Postgres
  - Migrated to [next.js](https://github.com/zeit/next.js/)
    - Instead of deploying the api and frontend separately, the two codebases are
      merged into one with server-rendering provided by next.js
    - For changes to development process see the [updated README.md](README.md)
  - Move badge calculations to the backend
  - Move badge details to the database
  - Revise user model module to be the same format as the roles model
  - Move existing `api/users` endpoint to `api/users/stats` and use `api/users` for a list of users without stats
  - Consecutive and total days mapped are calculated with dates formatted YYYY-MM-DD
  - Validation and completeness sliders are separated on the Campaigns page.
  - Updated favicon

## [v0.2.4] - 2018-10-23
### Added
- A 404 page for missing campaigns

### Fixed
- updated OsMesa api endpoint for campaigns to `/campaigns` from `/hashtags`

## [v0.2.3] - 2018-10-22

### Fixed
- allow setting custom project names
- unregister existing service workers

## [v0.2.2] - 2018-10-12

### Fixed
- frontend/react: convert uid to string

## [v0.2.1] - 2018-10-09

### Added
- Support custom path for sqlite3 database file

### Fixed
- Pass username as a footprint layer name
- Add support for running the frontend side on addresses other than `/scoreboard`
- Remove service workers to allow loading `/api` and `/docs` in the browser when using proxy

## [v0.2.0] - 2018-08-14

### Added
- Ability for user to sort by Most/Least recent edit or Most/Least total number of edits on /users.
- Ava test suite in api/tests/test.js uses obscured data in api/tests/fixtures and checks api/user(s) endpoints
- Added mocked endpoints for external APIs

### Changed
- Took out user table sorting (which overwrote sorts executed on the backend) in frontend/src/commponents/AllUsersTable.js.
- Started using lerna for package management
- Logic for setting up the application separated from the rest of api/server.js and put into api/index.js
- Connection.js (api/db/) now returns a function which sets a different database path when NODE_ENV is set to TEST
- Api source code is organized under the `src` folder

## [v0.1.0] - 2018-08-03

- The first release

[Unreleased]: https://github.com/developmentseed/scoreboard/compare/v1.10.0...HEAD
[v1.10.0]: https://github.com/developmentseed/scoreboard/compare/v1.9.1...1.10.0
[v1.9.1]: https://github.com/developmentseed/scoreboard/compare/v1.9.0...1.9.1
[v1.9.0]: https://github.com/developmentseed/scoreboard/compare/v1.8.0...1.9.0
[v1.8.0]: https://github.com/developmentseed/scoreboard/compare/v1.7.2...1.8.0
[v1.7.2]: https://github.com/developmentseed/scoreboard/compare/v1.7.1...v1.7.2
[v1.7.1]: https://github.com/developmentseed/scoreboard/compare/v1.7.0...v1.7.1
[v1.7.0]: https://github.com/developmentseed/scoreboard/compare/v1.6.0...v1.7.0
[v1.6.0]: https://github.com/developmentseed/scoreboard/compare/v1.5.0...v1.6.0
[v1.5.0]: https://github.com/developmentseed/scoreboard/compare/v1.4.0...v1.5.0
[v1.4.0]: https://github.com/developmentseed/scoreboard/compare/v1.3.3...v1.4.0
[v1.3.4]: https://github.com/developmentseed/scoreboard/compare/v1.3.3...v1.3.4
[v1.3.3]: https://github.com/developmentseed/scoreboard/compare/v1.3.2...v1.3.3
[v1.3.2]: https://github.com/developmentseed/scoreboard/compare/v1.3.1...v1.3.2
[v1.3.1]: https://github.com/developmentseed/scoreboard/compare/v1.3.0...v1.3.1
[v1.3.0]: https://github.com/developmentseed/scoreboard/compare/v1.2.0...v1.3.0
[v1.2.0]: https://github.com/developmentseed/scoreboard/compare/v1.1.0...v1.2.0
[v1.1.0]: https://github.com/developmentseed/scoreboard/compare/v1.0.3...v1.1.0
[v1.0.3]: https://github.com/developmentseed/scoreboard/compare/v1.0.2...v1.0.3
[v1.0.2]: https://github.com/developmentseed/scoreboard/compare/v1.0.1...v1.0.2
[v1.0.1]: https://github.com/developmentseed/scoreboard/compare/v1...v1.0.1
[v1]: https://github.com/developmentseed/scoreboard/compare/v0.2.4...v1
[v0.2.4]: https://github.com/developmentseed/scoreboard/compare/v0.2.3...v0.2.4
[v0.2.3]: https://github.com/developmentseed/scoreboard/compare/v0.2.2...v0.2.3
[v0.2.2]: https://github.com/developmentseed/scoreboard/compare/v0.2.1...v0.2.2
[v0.2.1]: https://github.com/developmentseed/scoreboard/compare/v0.2.0...v0.2.1
[v0.2.0]: https://github.com/developmentseed/scoreboard/compare/v0.1.0...v0.2.0
[v0.1.0]: https://github.com/developmentseed/scoreboard/compare/d4fc54a...v0.1.0
