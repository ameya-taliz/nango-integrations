import { createAction } from 'nango';

import { RocketlaneProject, RocketlaneUpdateProject } from '../models.js';
import { unixTimestampToISO } from '../rocketlane_utilities.js';

const action = createAction({
    description: 'Update a project with selected fields',
    version: '1.1.0',

    endpoint: {
        method: 'PUT',
        path: '/projects',
        group: 'Projects'
    },

    input: RocketlaneUpdateProject,
    output: RocketlaneProject,

    exec: async (nango, input): Promise<RocketlaneProject> => {

        const { id, ...payload } = input;

        const response = await nango.put<{ data: any }>({
            // https://developer.rocketlane.com/reference/update-project
            endpoint: `/1.0/projects/${id}`,
            data: payload,
            retries: 3
        });

        const apiProject = response.data as any;

        // Map API response to RocketlaneProject format
        const project = RocketlaneProject.parse({
            id: apiProject.projectId.toString(),
            projectId: apiProject.projectId,
            projectName: apiProject.projectName,
            startDate: apiProject.startDate,
            dueDate: apiProject.dueDate,
            createdAt: unixTimestampToISO(apiProject.createdAt),
            updatedAt: unixTimestampToISO(apiProject.updatedAt),
            owner: apiProject.owner,
            teamMembers: apiProject.teamMembers,
            customer: apiProject.customer,
            archived: apiProject.archived,
            status: apiProject.status,
        });

        return project;
    }
});

export type NangoActionLocal = Parameters<(typeof action)['exec']>[0];
export default action;
