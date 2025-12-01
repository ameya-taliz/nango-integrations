import { createAction } from 'nango';

import { RocketlaneTask, RocketlaneUpdateTask } from '../models.js';
import { unixTimestampToISO } from '../rocketlane_utilities.js';

const action = createAction({
    description: 'Update a task with selected fields',
    version: '1.1.0',

    endpoint: {
        method: 'PUT',
        path: '/tasks',
        group: 'Tasks'
    },

    input: RocketlaneUpdateTask,
    output: RocketlaneTask,

    exec: async (nango, input): Promise<RocketlaneTask> => {

        const { id, ...payload } = input;

        const response = await nango.put<{ data: any }>({
            // https://developer.rocketlane.com/reference/update-project
            endpoint: `/1.0/tasks/${id}`,
            data: payload,
            retries: 3
        });

        const apiTask = response.data as any;
        //console.log(apiTask);

        // Map API response to RocketlaneTask format
        const task = RocketlaneTask.parse({
            id: apiTask.taskId.toString(),
            taskId: apiTask.taskId,
            taskName: apiTask.taskName,
            taskDescription: apiTask.taskDescription,
            startDate: apiTask.startDate,
            dueDate: apiTask.dueDate,
            createdAt: unixTimestampToISO(apiTask.createdAt),
            updatedAt: unixTimestampToISO(apiTask.updatedAt),
            archived: apiTask.archived,
            createdBy: apiTask.createdBy,
            updatedBy: apiTask.updatedBy,
            status: apiTask.status,
            project: apiTask.project,
            dependencies: apiTask.dependencies,
            parent: apiTask.parent,
            type: apiTask.type,
        });

        return task;
    }
});

export type NangoActionLocal = Parameters<(typeof action)['exec']>[0];
export default action;
