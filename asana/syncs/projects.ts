import { createSync } from 'nango';
import type { BaseAsanaModel } from '../models.js';
import { AsanaProject } from '../models.js';
import { z } from 'zod';

const sync = createSync({
    description: 'Retrieves all projects for a user',
    version: '2.1.1',
    frequency: 'every day',
    autoStart: true,
    syncType: 'full',

    endpoints: [
        {
            method: 'GET',
            path: '/projects',
            group: 'Projects'
        }
    ],

    models: {
        AsanaProject: AsanaProject
    },

    metadata: z.object({}),

    exec: async (nango) => {
        for await (const workspaces of nango.paginate<BaseAsanaModel>({ endpoint: '/api/1.0/workspaces', params: { limit: 100 }, retries: 10 })) {
            for (const workspace of workspaces) {
                for await (const projects of nango.paginate<BaseAsanaModel>({
                    // https://developers.asana.com/reference/projects
                    endpoint: '/api/1.0/projects',
                    params: {
                        workspace: workspace.gid,
                        limit: 100,
                        opt_fields: ['due_on', 
                            'start_on', 
                            'completed_at', 
                            'notes', 
                            'name', 
                            'created_at', 
                            'modified_at', 
                            'permalink_url',
                            ].join(',')
                    },
                    retries: 10
                })) {
                    const projectsWithId = projects.map((project) => {
                        return {
                            ...project,
                            id: project.gid
                        };
                    });
                    await nango.batchSave(projectsWithId, 'AsanaProject');
                }
            }
        }
    }
});

export type NangoSyncLocal = Parameters<(typeof sync)['exec']>[0];
export default sync;
