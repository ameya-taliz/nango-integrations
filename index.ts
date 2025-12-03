// -- Integration: asana
import './asana/syncs/tasks.js';
// import './asana/syncs/users.js';
// import './asana/syncs/workspaces.js';
import './asana/syncs/projects.js';
import './asana/actions/update-project.js';
// import './asana/actions/fetch-workspaces.js';
// import './asana/actions/fetch-projects.js';
import './asana/actions/create-task.js';
import './asana/actions/update-task.js';
import './asana/actions/delete-task.js';
import './asana/actions/add-asana-dependencies.js';
import './asana/actions/remove-asana-dependencies.js';

// -- Integration: rocketlane
import './rocketlane/syncs/rocketlane-projects.js';
import './rocketlane/syncs/rocketlane-tasks.js';
import './rocketlane/syncs/rocketlane-users.js';
import './rocketlane/actions/update-rocketlane-project.js';
import './rocketlane/actions/update-rocketlane-task.js';

// -- Integration: slack
// import './slack/syncs/users.js';
// import './slack/syncs/channels.js';
// import './slack/syncs/messages.js';
import './slack/actions/send-message.js';