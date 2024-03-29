export default {
  '/api/auth_routes': {
    '/form/advanced-form': { authority: ['admin', 'user'] },
  },
  '/api/menus': {
    routes: [
      // dashboard
      {
        path: '/dashboard',
        name: 'dashboard',
        icon: 'dashboard',
        routes: [
          {
            path: '/dashboard/analysis',
            name: 'analysis',
          },
          {
            path: '/dashboard/monitor',
            name: 'monitor',
          },
          {
            path: '/dashboard/workplace',
            name: 'workplace',
          },
        ],
      },
      // forms
      {
        path: '/forms',
        icon: 'form',
        name: 'form',
        routes: [
          {
            path: '/forms/basicform',
            name: 'basicform',
          },
          {
            path: '/forms/stepform',
            name: 'stepform',
            hideChildrenInMenu: false,
            routes: [
              {
                path: '/forms/stepform/index',
                name: 'info',
              },
              {
                path: '/forms/stepform/confirm',
                name: 'confirm',
              },
              {
                path: '/forms/stepform/result',
                name: 'result',
              },
            ],
          },
          {
            path: '/forms/advancedform',
            name: 'advancedform',
            authority: ['admin'],
          },
        ],
      },
      // list
      {
        path: '/list',
        icon: 'table',
        name: 'list',
        routes: [
          {
            path: '/list/tablelist',
            name: 'searchtable',
          },
          {
            path: '/list/basiclist',
            name: 'basiclist',
          },
          {
            path: '/list/cardlist',
            name: 'cardlist',
          },
          {
            path: '/list/search',
            name: 'searchlist',
            routes: [
              {
                path: '/list/search/articles',
                name: 'articles',
              },
              {
                path: '/list/search/projects',
                name: 'projects',
              },
              {
                path: '/list/search/applications',
                name: 'applications',
              },
            ],
          },
        ],
      },
      {
        path: '/profile',
        name: 'profile',
        icon: 'profile',
        routes: [
          // profile
          {
            path: '/profile/basicprofile',
            name: 'basic',
          },
          {
            path: '/profile/advancedprofile',
            name: 'advanced',
          },
        ],
      },
      {
        name: 'result',
        icon: 'check-circle-o',
        path: '/result',
        routes: [
          // result
          {
            path: '/result/success',
            name: 'success',
          },
          { path: '/result/fail', name: 'fail' },
        ],
      },
      {
        name: 'exception',
        icon: 'warning',
        path: '/exception',
        routes: [
          // exception
          {
            path: '/exception/403',
            name: 'not-permission',
          },
          {
            path: '/exception/404',
            name: 'not-find',
          },
          {
            path: '/exception/500',
            name: 'server-error',
          },
          {
            path: '/exception/trigger',
            name: 'trigger',
            hideInMenu: true,
          },
        ],
      },
      {
        name: 'account',
        icon: 'user',
        path: '/account',
        routes: [
          {
            path: '/account/center',
            name: 'center',
            routes: [
              {
                path: '/account/center/articles',
              },
              {
                path: '/account/center/applications',
              },
              {
                path: '/account/center/projects',
              },
            ],
          },
          {
            path: '/account/settings',
            name: 'settings',
            routes: [
              {
                path: '/account/settings/baseview',
              },
              {
                path: '/account/settings/security',
              },
              {
                path: '/account/settings/binding',
              },
              {
                path: '/account/settings/notification',
              },
            ],
          },
        ],
      },

      // system权限管理
      {
        path: '/system',
        icon: 'table',
        name: 'UPMS管理',
        routes: [
          {
            path: '/system/user/index',
            name: '用户管理',
          },
          // {
          //   path: '/system/role/index',
          //   name: '角色管理',
          // },
          // {
          //   path: '/system/menu/index',
          //   name: '菜单管理',
          // },
          {
            path: '/system/dict/index',
            name: '字典管理',
          },
        ],
      },

        // system权限管理
        {
          path: '/dataAnalysis',
          icon: 'table',
          name: '数据分析',
          routes: [
            {
              path: '/dataAnalysis/basicAnalysis/index',
              name: '基础分析',
            },
            {
              path: '/dataAnalysis/oddsAnalysis/index',
              name: 'Odds分析',
            },
          ],
        },
    ],
  },
};
