export default {

	methods: {

		el (selector) {

			return this.$el.querySelector(selector)

		},

		els (selector) {

			return this.$el.querySelectorAll(selector)

		},

	}

}