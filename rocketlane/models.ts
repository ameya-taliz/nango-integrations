import * as z from 'zod';

/***************************************************************
* Projects
***************************************************************/
export const RocketlaneProject = z.object({
    id: z.string(),
    projectId: z.number(),
    projectName: z.string(),
    startDate: z.union([z.string(), z.null()]).optional(),
    dueDate: z.union([z.string(), z.null()]).optional(),
    createdAt: z.string(), // ISO 8601 datetime string
    updatedAt: z.string(), // ISO 8601 datetime string
    owner: z.object({
      emailId: z.string(),
      userId: z.number(),
      firstName: z.union([z.string(), z.null()]).optional(),
      lastName: z.union([z.string(), z.null()]).optional(),
    }),
    teamMembers: z.object({
      members: z.array(z.object({
          emailId: z.string(),
          userId: z.number(),
          firstName: z.union([z.string(), z.null()]).optional(),
          lastName: z.union([z.string(), z.null()]).optional(),
      })),
      customers: z.array(z.object({
          emailId: z.string(),
          userId: z.number(),
          firstName: z.union([z.string(), z.null()]).optional(),
          lastName: z.union([z.string(), z.null()]).optional(),
      })),
    }),
    customer: z.object({
      companyId: z.number(),
      companyName: z.string(),
    }),
    archived: z.boolean(),
    status: z.object({
      value: z.number(),
      label: z.string(),
    }),
  });
  
  export type RocketlaneProject = z.infer<typeof RocketlaneProject>;

  export const RocketlaneUpdateProject = z.object({
    id: z.string(),
    dueDate: z.union([z.string(), z.null()]).optional(),
  });

  export type RocketlaneUpdateProject = z.infer<typeof RocketlaneUpdateProject>;

/***************************************************************
* Users
***************************************************************/
export const RocketlaneUser = z.object({
  id: z.string(),
  userId: z.number(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string(),
  type: z.enum(['TEAM_MEMBER', 'CUSTOMER', 'PARTNER', 'EXTERNAL_PARTNER']),
  status: z.enum(['ACTIVE', 'INACTIVE', 'INVITED', 'PASSIVE']),
  role: z.object({
    roleId: z.number(),
    roleName: z.string(),
  }),
  company: z.object({
    companyId: z.number(),
    companyName: z.string(),
  }),
  createdAt: z.string(), // ISO 8601 datetime string
  updatedAt: z.string(), // ISO 8601 datetime string
});

export type RocketlaneUser = z.infer<typeof RocketlaneUser>;
/***************************************************************
* Tasks
***************************************************************/
  export const RocketlaneTask = z.object({
    id: z.string(),
    taskId: z.number(),
    taskName: z.string(),
    taskDescription: z.union([z.string(), z.null()]).optional(),
    startDate: z.union([z.string(), z.null()]).optional(),
    dueDate: z.union([z.string(), z.null()]).optional(),
    createdAt: z.string(), // ISO 8601 datetime string
    updatedAt: z.string(), // ISO 8601 datetime string
    archived: z.boolean(),
    createdBy: z.object({
      emailId: z.string(),
      userId: z.number(),
      firstName: z.union([z.string(), z.null()]).optional(),
      lastName: z.union([z.string(), z.null()]).optional(),
    }),
    updatedBy: z.object({
      emailId: z.string(),
      userId: z.number(),
      firstName: z.union([z.string(), z.null()]).optional(),
      lastName: z.union([z.string(), z.null()]).optional(),
    }),
    status: z.object({
      value: z.number(),
      label: z.string(),
    }),
    project: z.object({
      projectId: z.number(),
      projectName: z.string(),
    }),
    dependencies: z.array(z.object({
      taskId: z.number(),
      taskName: z.string(),
    })).optional(),
    parent: z.object({
      taskId: z.number(),
      taskName: z.string(),
    }).optional(),
    type: z.string().optional(),
    assignees: z.object({
      members: z.array(z.object({
        emailId: z.string(),
        userId: z.number(),
        firstName: z.union([z.string(), z.null()]).optional(),
        lastName: z.union([z.string(), z.null()]).optional(),
      })),
      placeholders: z.array(z.object({
        placeholderId: z.number(),
        placeholderName: z.string(),
        role: z.object({
          roleId: z.number(),
          roleName: z.string(),
        }).optional(),
      })).optional(),
    }).optional(),
    phase: z.object({
      value: z.number().optional(),
      label: z.string().optional(),
    }).optional(),
    priority: z.object({
      value: z.number().optional(),
      label: z.string().optional(),
    }).optional(),
  });
  
  export type RocketlaneTask = z.infer<typeof RocketlaneTask>;

  export const RocketlaneUpdateTask = z.object({
    id: z.string(),
    dueDate: z.union([z.string(), z.null()]).optional(),
    startDate: z.union([z.string(), z.null()]).optional(),
    taskName: z.string().optional(),
    taskDescription: z.union([z.string(), z.null()]).optional(),
    status: z.object({
      value: z.number(),
    }).optional(),
  });

  export type RocketlaneUpdateTask = z.infer<typeof RocketlaneUpdateTask>;