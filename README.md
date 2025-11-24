# Setup
1. Sign up for personal Nango account at `https://nango.dev`
2. Create duplicate of `.env.sample`, rename it so you have `.env`, and update values


# Development
Documentation: https://nango.dev/docs/implementation-guides/syncs/implement-a-sync
Run `nango dryrun <file_name> '<connection_id>'` to test integration
Run `nango deploy --sync <file_name (without extension)> dev` to deploy specific sync to dev environment
Run `nango deploy dev` to deploy all syncs to dev environment (update version number in individual files)
