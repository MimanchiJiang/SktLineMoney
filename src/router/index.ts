import Vue from 'vue';
import VueRouter from 'vue-router';
import Money from '@/views/Money.vue';
import Labels from '@/views/Labels.vue';
import Statistics from '@/views/Statistics.vue';
import NotFound from '@/views/NotFound.vue';
import EditLabel from '@/views/EditLabel.vue';
import { Component } from 'vue-property-decorator';
import Chart from '../components/Chart.vue';
import viewChart from "@/views/viewChart.vue"
import User from "@/views/vues.vue"

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    redirect: '/statistics'
  },
  {
    path: '/viewChart',
    component: viewChart
  },
  {
    path: '/money',
    component: Money
  },
  {
    path: '/labels',
    component: Labels
  },
  {
    path: '/statistics',
    component: Statistics
  },
  {
    path: '/user/:id',
    component: User
  },
  {
    path: '/labels/edit/:id',
    component: EditLabel
  },
  {
    path: '*',
    component: NotFound
  }
];

const router = new VueRouter({
  routes
});

export default router;
