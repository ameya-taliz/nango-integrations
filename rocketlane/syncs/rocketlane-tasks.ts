import { createSync } from 'nango';
import type { ProxyConfiguration } from 'nango';
import { unixTimestampToISO } from '../rocketlane_utilities.js';
import { RocketlaneTask } from '../models.js';


const sync = createSync({
    description: `Retrieves all tasks, including assignee and project information`,
    version: '1.2.0', // Version, increment it when you release a new version
    endpoints: [{ method: 'GET', path: '/rocketlane/tasks', group: 'Tasks' }],
    frequency: 'every week', // Default sync interval
    autoStart: false, // Should the sync start immediately when a new connection is created?
    syncType: 'full', // incremental or full (full refresh or incremental sync)
    trackDeletes: true,
    models: {
        RocketlaneTask: RocketlaneTask,
    },
    exec: async (nango) => {
        //https://developer.rocketlane.com/reference/get-all-tasks
        const proxyConfig: ProxyConfiguration = {
            endpoint: '/1.0/tasks',
            paginate: {
                type: 'cursor',
                cursor_path_in_response: 'pagination.nextPageToken',
                response_path: 'data',
                cursor_name_in_request: 'pageToken',
                limit: 100,
                limit_name_in_request: 'pageSize'
            },
            params: {
                includeFields: [
                    'dependencies', 
                    'parent', 
                    'type',
                    'assignees',
                    'phase',
                    'priority',
                ]
            },
            retries: 10
        };

        for await (const tasksPage of nango.paginate<any>(proxyConfig)) {
            const tasks = mapTasks(tasksPage);
            await nango.batchSave(tasks, 'RocketlaneTask');
        }

        await nango.deleteRecordsFromPreviousExecutions('RocketlaneTask')
    },
});

function mapTasks(records: any[]): RocketlaneTask[] {
    return records.map((record: any): RocketlaneTask => ({
        id: record.taskId.toString(),
        taskId: record.taskId,
        taskName: record.taskName,
        taskDescription: record.taskDescription,
        startDate: record.startDate,
        dueDate: record.dueDate,
        createdAt: unixTimestampToISO(record.createdAt),
        updatedAt: unixTimestampToISO(record.updatedAt),
        archived: record.archived,
        createdBy: record.createdBy,
        updatedBy: record.updatedBy,
        status: record.status,
        project: record.project,
        dependencies: record.dependencies,
        parent: record.parent,
        type: record.type,
        assignees: record.assignees,
        phase: record.phase,
        priority: record.priority,
    }));
}

export type NangoSyncLocal = Parameters<(typeof sync)['exec']>[0];
export default sync;