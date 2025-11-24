import { createAction } from 'nango';

import type { NangoActionError } from '../models.js';
import { AsanaProject, AsanaUpdateProject } from '../models.js';

const action = createAction({
    description: 'Update a project with selected fields',
    version: '1.0.1',
    scopes: ['projects:write'],

    endpoint: {
        method: 'PUT',
        path: '/projects',
        group: 'Projects'
    },

    input: AsanaUpdateProject,
    output: AsanaProject,

    exec: async (nango, input): Promise<AsanaProject> => {
        if (!input.id) {
            throw new nango.ActionError<NangoActionError>({
                type: 'validation_error',
                message: 'You must specify a project id (gid) to update.'
            });
        }

        const normalizedInput = normalizeDates(input);

        const response = await nango.put<{ data: AsanaProject }>({
            // https://developers.asana.com/reference/updateproject
            endpoint: `/api/1.0/projects/${input.id}`,
            data: {
                data: normalizedInput
            },
            retries: 3
        });

        const { data } = response;

        return data.data;
    }
});

export type NangoActionLocal = Parameters<(typeof action)['exec']>[0];
export default action;

function normalizeDates(input: AsanaUpdateProject): AsanaUpdateProject {
    return {
        ...input,
        due_on: input.due_on ? new Date(input.due_on).toISOString().split('T')[0] : undefined
    };
}

