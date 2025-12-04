import { createSync } from 'nango';
import type { ProxyConfiguration } from 'nango';
import { RocketlaneUser } from '../models.js';
import { unixTimestampToISO } from '../rocketlane_utilities.js';



const sync = createSync({
    description: `Retrieves all users`,
    version: '1.0.1', 
    endpoints: [{ method: 'GET', path: '/rocketlane/users', group: 'Users' }],
    frequency: 'every week',
    autoStart: false, 
    syncType: 'full', 
    trackDeletes: true,
    models: {
        RocketlaneUser: RocketlaneUser,
    },
    exec: async (nango) => {
        //https://developer.rocketlane.com/reference/get-all-users
        const proxyConfig: ProxyConfiguration = {
            endpoint: '/1.0/users',
            paginate: {
                type: 'cursor',
                cursor_path_in_response: 'pagination.nextPageToken',
                response_path: 'data',
                cursor_name_in_request: 'pageToken',
                limit: 100,
                limit_name_in_request: 'pageSize'
            },
            params: {
                includeFields: ['role', 'company'],
            },
            retries: 10
        };

        for await (const usersPage of nango.paginate<any>(proxyConfig)) {
            const users = mapUsers(usersPage);
            await nango.batchSave(users, 'RocketlaneUser');
        }

        await nango.deleteRecordsFromPreviousExecutions('RocketlaneUser')
    },
});

function mapUsers(records: any[]): RocketlaneUser[] {
    return records.map((record: any): RocketlaneUser => ({
        id: record.userId.toString(),
        userId: record.userId,
        firstName: record.firstName,
        lastName: record.lastName,
        email: record.email,
        type: record.type,
        status: record.status,
        role: record.role,
        company: record.company,
        createdAt: unixTimestampToISO(record.createdAt),
        updatedAt: unixTimestampToISO(record.updatedAt),
    }));
}

export type NangoSyncLocal = Parameters<(typeof sync)['exec']>[0];
export default sync;