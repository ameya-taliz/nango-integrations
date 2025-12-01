import { createSync } from 'nango';
import type { ProxyConfiguration } from 'nango';
import { RocketlaneProject } from '../models.js';
import { unixTimestampToISO } from '../rocketlane_utilities.js';



const sync = createSync({
    description: `Retrieves all projects, including member information`,
    version: '1.1.2', // Version, increment it when you release a new version
    endpoints: [{ method: 'GET', path: '/rocketlane/projects', group: 'Projects' }],
    frequency: 'every week', // Default sync interval
    autoStart: false, // Should the sync start immediately when a new connection is created?
    syncType: 'full', // incremental or full (full refresh or incremental sync)
    trackDeletes: true,
    models: {
        RocketlaneProject: RocketlaneProject,
    },
    exec: async (nango) => {
        //https://developer.rocketlane.com/reference/get-all-projects
        const proxyConfig: ProxyConfiguration = {
            endpoint: '/1.0/projects',
            paginate: {
                type: 'cursor',
                cursor_path_in_response: 'pagination.nextPageToken',
                response_path: 'data',
                cursor_name_in_request: 'pageToken',
                limit: 100,
                limit_name_in_request: 'pageSize'
            },
            retries: 10
        };

        for await (const projectsPage of nango.paginate<any>(proxyConfig)) {
            const projects = mapProjects(projectsPage);
            await nango.batchSave(projects, 'RocketlaneProject');
        }

        await nango.deleteRecordsFromPreviousExecutions('RocketlaneProject')
    },
});

function mapProjects(records: any[]): RocketlaneProject[] {
    return records.map((record: any): RocketlaneProject => ({
        id: record.projectId.toString(),
        projectId: record.projectId,
        projectName: record.projectName,
        startDate: record.startDate,
        dueDate: record.dueDate,
        createdAt: unixTimestampToISO(record.createdAt),
        updatedAt: unixTimestampToISO(record.updatedAt),
        owner: record.owner,
        teamMembers: record.teamMembers,
        customer: record.customer,
        archived: record.archived,
        status: record.status,
    }));
}

export type NangoSyncLocal = Parameters<(typeof sync)['exec']>[0];
export default sync;