import { createAction } from 'nango';

import type { NangoActionError } from '../models.js';
import { AsanaTask, AsanaUpdateTask } from '../models.js';

const action = createAction({
    description: 'Update a task and be able to assign the task to a specific user',
    version: '2.1.1',
    scopes: ['tasks:write'],

    endpoint: {
        method: 'PATCH',
        path: '/tasks',
        group: 'Tasks'
    },

    input: AsanaUpdateTask,
    output: AsanaTask,

    exec: async (nango, input): Promise<AsanaTask> => {
        if (!input.id) {
            throw new nango.ActionError<NangoActionError>({
                type: 'validation_error',
                message: 'You must specify a task id (gid) to update.'
            });
        }

        const normalizedInput = normalizeDates(input);

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

        const response = await nango.put<{ data: AsanaTask }>({
            // https://developers.asana.com/reference/tasks
            endpoint: `/api/1.0/tasks/${input.id}`,
            data: {
                data: normalizedInput,
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

function normalizeDates(input: AsanaUpdateTask): AsanaUpdateTask {
    return {
        ...input,
        due_on: input.due_on ? new Date(input.due_on).toISOString() : undefined
    };
}
