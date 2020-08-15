import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Main',
    redirect: '/find',
    component: Home,
    children: [
      {
        path: 'find',
        name: 'Find',
        component: () => import('../views/Find.vue'),
        redirect: '/find/recommendation',
        children: [
          {
            path: 'recommendation',
            name: 'Recommendation',
            component: () => import('../views/find/Recommendation.vue')
          },
          {
            path: 'playlist',
            name: 'Playlist',
            component: () => import('../views/find/Playlist.vue'),
            redirect: '/find/playlist/hot',
            children: [
              {
                path: 'hot',
                name: 'Hot',
                component: () => import('../views/find/Hot.vue')
              }
            ]
          },
          {
            path: 'radiohost',
            name: 'Radiohost',
            component: () => import('../views/find/Radiohost.vue')
          },
          {
            path: 'singer',
            name: 'Singer',
            component: () => import('../views/find/Singer.vue')
          },
          {
            path: 'newmusic',
            name: 'Newmusic',
            component: () => import('../views/find/Newmusic.vue')
          },
          {
            path: 'rankinglist',
            name: 'Rankinglist',
            component: () => import('../views/find/Rankinglist.vue')
          }
        ]
      },
      {
        path: 'fm',
        name: 'FM',
        component: () => import('../views/FM.vue')
      },
      {
        path: 'broadcast',
        name: 'Broadcast',
        component: () => import('../views/Broadcast.vue')
      },
      {
        path: 'video',
        name: 'Video',
        component: () => import('../views/Video.vue')
      },
      {
        path: 'friend',
        name: 'Friend',
        component: () => import('../views/Friend.vue')
      },
      {
        path: 'pldetail',
        name: 'Playlist',
        component: () => import('../views/subPage/Pldetail.vue')
      }
    ]
  }
  // {
  //   path: '/about',
  //   name: 'About',
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
];

const router = new VueRouter({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes
});

export default router;
