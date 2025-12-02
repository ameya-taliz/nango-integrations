import { createAction } from 'nango';

import type { NangoActionError } from '../models.js';
import { AsanaTaskDependencies, EmptyAsanaResponse } from '../models.js';

const action = createAction({
    description: 'Add dependencies to a task',
    version: '1.0.0',
    scopes: ['tasks:write'],

    endpoint: {
        method: 'POST',
        path: '/tasks/{task_id}/addDependencies',
        group: 'Tasks'
    },

    input: AsanaTaskDependencies,
    output: EmptyAsanaResponse,

    exec: async (nango, input): Promise<EmptyAsanaResponse> => {
        if (!input.id) {
            throw new nango.ActionError<NangoActionError>({
                type: 'validation_error',
                message: 'You must specify a task id (gid) to update.'
            });
        }

        const response = await nango.post<{ data: any }>({
            // https://developers.asana.com/reference/tasks
            endpoint: `/api/1.0/tasks/${input.id}/addDependencies`,
            data: {
                data: {
                    dependencies: input.dependencies
                }
            },
            retries: 3
        });

        const { data } = response;

        return data.data;
    }
});

export type NangoActionLocal = Parameters<(typeof action)['exec']>[0];
export default action;
