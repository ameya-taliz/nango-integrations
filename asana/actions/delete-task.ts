import { createAction } from 'nango';
import type { NangoActionError } from '../models.js';
import { EmptyAsanaResponse, Id } from '../models.js';

const action = createAction({
    description: 'Delete a task.',
    version: '2.0.2',
    scopes: ['tasks:delete'],

    endpoint: {
        method: 'DELETE',
        path: '/tasks',
        group: 'Tasks'
    },

    input: Id,
    output: EmptyAsanaResponse,

    exec: async (nango, input): Promise<EmptyAsanaResponse> => {
        if (!input.id) {
            throw new nango.ActionError<NangoActionError>({
                type: 'validation_error',
                message: 'You must specify a task id (gid) to delete.'
            });
        }
        const response = await nango.delete({
            endpoint: `/api/1.0/tasks/${input.id}`,
            retries: 3
        });

        return response.data.data;
    }
});

export type NangoActionLocal = Parameters<(typeof action)['exec']>[0];
export default action;
