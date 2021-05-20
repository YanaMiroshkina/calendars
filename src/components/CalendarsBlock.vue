<template>
	
	<div :class="className">

		<div v-if="isPageServices" class="calendars-block__title">{{ year1 }}</div>

		<div class="calendars-block__content">
				
			<!-- arrows -->

			<template v-if="isPageServices">

				<div 
					class="calendars-block__arrow left" 
					:class="{
						'disabled': month1 == initialMonth && year1 == initialYear
					}"
					@click="onClickArrow('left')" 
				>

					<IconArrowDown key="left" color="#2d3244"/>

				</div>

				<div 
					class="calendars-block__arrow right"
					@click="onClickArrow('right')"
				>

					<IconArrowDown key="right" color="#2d3244"/>

				</div>

			</template>

			<!-- calendars -->

			<div 
				ref="grid" 
				:style="{
					'width': (isPageServices ? gridWidthServices : gridWidthBirthdays) + 'px'
				}"
				class="calendars-block__grid"
			>

				<!-- major calendar -->

				<div class="calendars-block__subgrid">

					<Calendar 
						:key="1" 
						:params="paramsCalendar1" 
						class="calendars-block__calendar"
						:width="widthBig"
					/>

				</div>

				<!-- minor calendars -->

				<div class="calendars-block__subgrid">

					<Calendar 
						:key="2" 
						:params="paramsCalendar2" 
						class="calendars-block__calendar"
						:width="widthSmall"
						@click.native="onClickSmallCalendar(month2, year2)"
					/>

					<Calendar 
						:key="3" 
						:params="paramsCalendar3" 
						class="calendars-block__calendar"
						:width="widthSmall"
						@click.native="onClickSmallCalendar(month3, year3)"
					/>

				</div>

			</div>

		</div>

	</div>

</template>

<script>

import { mapGetters } from 'vuex'
import Calendar from '@/components/Calendar'
import IconArrowDown from '@/components/svg-icons/arrow-down'
	
export default {

	name: 'CalendarsBlock',

	components: {

		Calendar,
		IconArrowDown,

	},

	props: {

		place: {

			type: String,
			default: ''

		}

	},

	data () {

		let date = new Date()

		return {

			gridWidthBirthdays: 740,
			gridWidthServices: 700,

			widthBig: 0,
			widthSmall: 0,

			date: '',

			initialDate: date,
			initialMonth: date.getMonth() + 1,
			initialYear: date.getFullYear(),

			month1: '',
			year1: '',

			month2: '',
			year2: '',

			month3: '',
			year3: '',

			paramsCalendar1: {},
			paramsCalendar2: {},
			paramsCalendar3: {},

		}

	},

	computed: {

		...mapGetters({

			persons: 'persons',

		}),

		className () {

			return `calendars-block ${this.$route.name}`

		},

		isPageServices () {

			return this.$route.name == 'services'

		},

		isPageBirthdays () {

			return this.$route.name == 'birthdays'

		},

	},

	watch: {

		'$route.name': {

			handler (name) {

				this.setDate(this.initialMonth, this.initialYear)
				this.calculateWidth()

			},

			immediate: true

		}

	},

	created () {

		this.setDate()

	},

	methods: {

		setDate (month, year) {

			if (!month) {

				this.date = new Date()

				this.month1 = this.date.getMonth() + 1

				this.year1 = this.date.getFullYear()

			} else {

				let initialDate = new Date()

				if (year) initialDate.setYear(year)

				this.date = new Date(initialDate.setMonth(month - 1))

				this.month1 = month

				this.year1 = year

			}

			if (this.month1 == 12) {

				this.month2 = 1
				this.year2 = this.year1 + 1

				this.month3 = 2
				this.year3 = this.year1 + 1

			} else if (this.month1 < 11) {

				this.month2 = this.month1 + 1
				this.year2 = this.year1

				this.month3 = this.month1 + 2
				this.year3 = this.year1

			} else if (this.month1 == 11) {

				this.month2 = 12
				this.year2 = this.year1

				this.month3 = 1
				this.year3 = this.year1 + 1

			}

			for (let i = 1; i <= 3; i++) {

				this['paramsCalendar' + i] = {

					month: this['month' + i],
					year: this['year' + i],
					isMain: i == 1 ? true : false,
					birthdays: [

						{

							day: i,
							persons: this.persons.slice(i - 1)

						}

					]

				}

			}

		},

		calculateWidth () {

			let part = 0

			if (this.isPageBirthdays) {

				part = this.gridWidthBirthdays / 23.4

				this.widthBig = part * 7 * 2.25 ^ 0
				this.widthSmall = part * 7 ^ 0

			} else if (this.isPageServices) {

				part = this.gridWidthServices / 24.4

				this.widthBig = part * 7 * 2.2 ^ 0
				this.widthSmall = part * 7 ^ 0

			}

		},

		onClickArrow (direction) {

			if (direction == 'right') {

				let year = this.month1 == 12 ? this.year1 + 1 : this.year1,
					month = this.month1 == 12 ? 1 : this.month1 + 1

				this.setDate(month, year)

			} else if (direction == 'left') {

				let thisYearHasEarlierMonths = this.year1 == this.initialYear && this.month1 > this.initialMonth,
					isNextYear = this.year1 > this.initialYear,
					year = isNextYear && this.month1 == 1 ? this.year1 - 1 : this.year1,
					month = isNextYear && this.month1 == 1 ? 12 : this.month1 - 1

				if (thisYearHasEarlierMonths || isNextYear) {

					this.setDate(month, year)

				}

			}

		},

		onClickSmallCalendar (month, year) {

			if (this.isPageBirthdays) return

			this.setDate(month, year)

		},
		
	}

}

</script>

<style lang="stylus">
	
.calendars-block
	
	&.services
		margin-top: 40px
		
	&.birthdays
		margin-top: 60px
	
	&__title
		margin-bottom: 32px
		font-family: 'Roboto-Light'
		font-size: 32px
		color: colorBlack
		text-align: center
	
	&__content
		display: flex
		justify-content: center
		position: relative
		margin: 0 auto
		max-width: 1920px
		
	&__month-name
		font-size: 26px
		line-height: 30px
		color: colorBlack
		text-align: center
		
	&__arrow
		display: flex
		align-items: center
		justify-content: center
		position: absolute
		top: 200px
		top: 50%
		width: 50px
		height: 50px
		z-index: 1
		
		&:not(.disabled)
			cursor: pointer
			
		&.disabled
			cursor: not-allowed
			
			path, 
			line
				stroke: lighten(colorBlack, 80%)!important
		
		&.left
			right: calc(100% - 280px)
			transform: translateY(-50%) rotate(90deg)
			
		&.right
			left: calc(100% - 280px)
			transform: translateY(-50%) rotate(-90deg)
	
	&__grid
		display: flex
		flex-direction: row
		justify-content: space-around
		position: relative
		margin: 0 auto
		
	&__subgrid
			
		&:first-child
			display: grid
			grid-template-rows: 1fr auto
			
		&:nth-child(2)
			display: flex
			flex-direction: column
			justify-content: space-between

	&__subgrid:nth-child(2) &__calendar:nth-child(2)
		margin-top: 12%
		
	// календари сервисов
		
	&.services &__subgrid:nth-child(2)
		margin-top: 15px

	// календари дней рождений
		
	&.birthdays &__grid
		display: flex
		flex-direction: row
		justify-content: space-between
			
	&.birthdays &__subgrid:first-child
		display: flex
		flex-direction: column
		width: auto
			
	&.birthdays &__subgrid:nth-child(2)
		display: flex
		flex-direction: column
		justify-content: space-between
		width: auto
		
	&.birthdays &__subgrid:nth-child(2) &__calendar:nth-child(2)
		margin-top: 0

</style>