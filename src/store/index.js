import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({

  state: {

  	persons: [

			{
				firstName: 'Александр',
				lastName: 'Ткачёв',
				photo: 'assets/img/boy-avatar.jpg',
				link: 'team-member/1',

			},

			{
				firstName: 'Ирина',
				lastName: 'Кошкина',
				photo: 'assets/img/girl-avatar.jpg',
				link: 'team-member/2',

			},

			{
				firstName: 'Константин',
				lastName: 'Константинов',
				photo: 'assets/img/boy-avatar.jpg',
				link: 'team-member/3',

			},

			{
				firstName: 'Алина',
				lastName: 'Берёзкина',
				photo: 'assets/img/girl-avatar.jpg',
				link: 'team-member/4',

			},
			
		]

  },

  getters: {

  	persons: state => {

  		return state.persons

  	}

  },

  mutations: {

  },

  actions: {

  },

  modules: {

  }

})
