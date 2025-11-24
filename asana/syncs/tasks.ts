import { createSync } from 'nango';
//import { toUser } from '../mappers/to-user.js';

import type { BaseAsanaModel } from '../models.js';
import { AsanaTask } from '../models.js';
import { z } from 'zod';

const sync = createSync({
    description: 'Retrieve all tasks that exist in the workspace',
    version: '2.1.4',
    frequency: 'every day',
    autoStart: true,
    syncType: 'full',

    endpoints: [
        {
            method: 'GET',
            path: '/tasks',
            group: 'Tasks'
        }
    ],

    models: {
        AsanaTask: AsanaTask.extend({ id: z.string() })
    },

    metadata: z.object({}),

    exec: async (nango) => {
        const lastSyncDate = nango.lastSyncDate;

        for await (const workspaces of nango.paginate<BaseAsanaModel>({ endpoint: '/api/1.0/workspaces', params: { limit: 100 }, retries: 10 })) {
            for (const workspace of workspaces) {
                for await (const projects of nango.paginate<BaseAsanaModel>({
                    endpoint: '/api/1.0/projects',
                    params: { workspace: workspace.gid, limit: 100 },
                    retries: 10
                })) {
                    for (const project of projects) {
                        // https://developers.asana.com/reference/tasks
                        const params: Record<string, string> = {
                            project: project.gid,
                            limit: '100',
                            opt_fields: [
                                'name',
                                'resource_type',
                                'resource_subtype',
                                'created_at',
                                'modified_at',
                                'start_at',
                                'start_on',
                                'due_at',
                                'due_on',
                                'completed_at',
                                'permalink_url',
                                'notes',
                                'workspace',
                                'projects',
                                'dependencies',
                                'parent',
                            ].join(',')
                        };

                        if (lastSyncDate) {
                            params['modified_since'] = lastSyncDate.toISOString();
                        }
                        for await (const tasks of nango.paginate<AsanaTask>({ endpoint: '/api/1.0/tasks', params, retries: 10 })) {
                            const normalizedTasks = tasks.map((task) => {
                                return {
                                    ...task,
                                    id: task.gid,
                                    //assignee: task.assignee ? toUser(task.assignee) : null,
                                };
                            });
                            await nango.batchSave(normalizedTasks, 'AsanaTask');
                        }
                    }
                }
            }
        }
    }
});

export type NangoSyncLocal = Parameters<(typeof sync)['exec']>[0];
export default sync;
