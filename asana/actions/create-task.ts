import { createAction } from 'nango';

import type { NangoActionError } from '../models.js';
import { AsanaTask, CreateAsanaTask } from '../models.js';

const action = createAction({
    description:
        'Create a task using Asana specific fields',
    version: '2.1.1',
    scopes: ['tasks:write'],

    endpoint: {
        method: 'POST',
        path: '/tasks',
        group: 'Tasks'
    },

    input: CreateAsanaTask,
    output: AsanaTask,

    exec: async (nango, input): Promise<AsanaTask> => {
        if (!input.projects) {
            throw new nango.ActionError<NangoActionError>({
                type: 'validation_error',
                message:
                    'You must specify at least one project.'
            });
        }

        const params: Record<string, string> = {
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

        const response = await nango.post<{ data: AsanaTask }>({
            // https://developers.asana.com/reference/createtask
            endpoint: '/api/1.0/tasks',
            data: {
                data: input
            },
            params: params,
            retries: 3
        });

        const { data } = response;

        return data.data;
    }
});

export type NangoActionLocal = Parameters<(typeof action)['exec']>[0];
export default action;
