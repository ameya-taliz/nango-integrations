# Setup
1. Sign up for personal Nango account at `https://nango.dev`.
2. In the app, create integrations for Asana, Rocketlane, and Slack (get info from team)
3. Create duplicate of `.env.sample`, rename it so you have `.env`, and update `NANGO_SECRET_KEY_DEV`
4. Install Nango: `npm install -g nango`
5. Install packages: `npm install`
6. Deploy syncs and actions: `nango deploy dev`


# Development
Documentation: https://nango.dev/docs/implementation-guides/syncs/implement-a-sync
Run `nango dryrun <file_name> '<connection_id>'` to test integration
Run `nango deploy --sync <file_name (without extension)> dev` to deploy specific sync to dev environment
Run `nango deploy dev` to deploy all syncs to dev environment (update version number in individual files)
