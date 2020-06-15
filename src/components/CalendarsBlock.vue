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

			<div ref="grid" class="calendars-block__grid">

				<!-- major calendar -->

				<div class="calendars-block__subgrid">

					<Calendar 
						:key="1" 
						:params="paramsCalendar1" 
						class="calendars-block__calendar"
						:width="widthBig"
					/>

					<!-- time block -->

					<div v-if="isPageServices" class="calendars-block__time">

						<div class="calendars-block__time-item">

							<span class="calendars-block__time-item-text">с</span>

							<IconClock class="calendars-block__time-item-icon" />
						
							<Select 
								autocomplete
								:styling="'flat'" 
								:bg="'#e0e2ea'" 
								:items="timeItemsFrom"
								:disabledItems="disabledTimeItemsFrom"
								:allow="'numbers'"
								class="calendars-block__time-item-select"
								@select="onSelectTimeFrom"
							/>

						</div>

						<div class="calendars-block__time-item">

							<span class="calendars-block__time-item-text">по</span>

							<IconClock class="calendars-block__time-item-icon" />
						
							<Select 
								autocomplete
								:styling="'flat'" 
								:bg="'#e0e2ea'"
								:items="timeItemsTo"
								:disabledItems="disabledTimeItemsTo"
								:allow="'numbers'"
								class="calendars-block__time-item-select"
								@select="onSelectTimeTo"
							/>

						</div>

					</div>

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
import IconClock from '@/components/svg-icons/clock'
import Select from '@/components/controls/Select'
	
export default {

	name: 'CalendarsBlock',

	components: {

		Calendar,
		IconArrowDown,
		IconClock,
		Select,

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

			timeItemsFrom: [

				{ value: 8, text: '8:00' },
				{ value: 9, text: '9:00' },
				{ value: 10, text: '10:00' },
				{ value: 11, text: '11:00' },
				{ value: 12, text: '12:00' },
				{ value: 13, text: '13:00' },
				{ value: 14, text: '14:00' },
				{ value: 15, text: '15:00' },
				{ value: 16, text: '16:00' },
				{ value: 17, text: '17:00' },
				{ value: 18, text: '18:00' },
				{ value: 19, text: '19:00' },

			],

			timeItemsTo: [

				{ value: 9, text: '9:00' },
				{ value: 10, text: '10:00' },
				{ value: 11, text: '11:00' },
				{ value: 12, text: '12:00' },
				{ value: 13, text: '13:00' },
				{ value: 14, text: '14:00' },
				{ value: 15, text: '15:00' },
				{ value: 16, text: '16:00' },
				{ value: 17, text: '17:00' },
				{ value: 18, text: '18:00' },
				{ value: 19, text: '19:00' },
				{ value: 20, text: '20:00' },

			],

			disabledTimeItemsFrom: [],

			disabledTimeItemsTo: [],

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

			},

			immediate: true

		}

	},

	created () {

		this.setDate()

	},

	mounted () {

		this.calculateWidth()

		window.addEventListener('resize', this.calculateWidth)

	},

	beforeDestroy () {

		window.removeEventListener('resize', this.calculateWidth)

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

			let width = this.$refs.grid.offsetWidth,
				part = 0

			if (this.isPageBirthdays) {

				part = width / 23.2

				this.widthBig = part * 7 * 2.25 ^ 0
				this.widthSmall = part * 7 ^ 0

			} else if (this.isPageServices) {

				part = width / 24.4

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

		onSelectTimeFrom (timeFrom) {

			let fromValue = timeFrom.value

			this.disabledTimeItemsTo = []

			if (!fromValue) return

			this.timeItemsTo.forEach(item => {

				if (item.value <= fromValue) this.disabledTimeItemsTo.push(item)

			})

		},

		onSelectTimeTo (timeTo) {

			let toValue = timeTo.value

			this.disabledTimeItemsFrom = []

			if (!toValue) return

			this.timeItemsFrom.forEach(item => {

				if (item.value >= toValue) this.disabledTimeItemsFrom.push(item)

			})

		},
		
	}

}

</script>

<style lang="stylus">
	
.calendars-block
	
	&__title
		margin-top: 5%
		margin-bottom: 4%
		font-family: 'Roboto-Light'
		font-size: 40px
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
		text-transform: uppercase
		text-align: center
		
	&__arrow
		display: flex
		align-items: center
		justify-content: center
		position: absolute
		top: 362px
		top: 50%
		width: 50px
		height: 50px
		z-index: 1
		
		&:not(.disabled)
			cursor: pointer
			
		&.disabled
			cursor: not-allowed
			
			path, line
				stroke: lighten(colorBlack, 80%)!important
		
		&:hover:not(.disabled) path
			fill: #AFAFAF!important
		
		&.left
			left: 1.5vw
			transform: translateY(-50%) rotate(90deg)
			
		&.right
			right: 1.5vw
			transform: translateY(-50%) rotate(-90deg)
	
	&__grid
		display: flex
		flex-direction: row
		justify-content: space-around
		position: relative
		margin: 23px auto 0
		padding-right: 2.4%
		width: 100%
		max-width: 1200px
		
	&__subgrid
			
		&:first-child
			display: grid
			grid-template-rows: 1fr auto
			
		&:nth-child(2)
			display: flex
			flex-direction: column
			justify-content: space-between
	
	&__subgrid:first-child &__calendar
		min-height: 700px

	&__subgrid:nth-child(2) &__calendar:nth-child(2)
		margin-top: 12%
		
		.calendar__table
			padding-top: 6%
			
	&__time
		display: flex
		justify-content: space-between
		margin-top: 30px
		margin-bottom: 1.45%
		padding: 0 4.5% 0 5.5%
		
		&-item
			display: flex
			align-items: flex-end
			font-family: 'Roboto-Light'
			font-size: 26px
			color: colorBlack
			text-transform: uppercase
			
			&-text
				position: relative
				top: -5px
				margin-right: 25px
			
			&-icon
				position: relative
				margin-right: 30px
				
			&-select
				width: 164px
				height: 57px
				
				.select__arrow
					top: 3px

	// календари дней рождений
		
	&.birthdays &__grid
		display: flex
		flex-direction: row
		justify-content: space-between
		margin: 23px 5.5% 0
			
	&.birthdays &__subgrid:first-child
		display: flex
		flex-direction: column
		padding: 0
		width: auto
		
	&__subgrid:first-child &__calendar
		min-height: auto
			
	&.birthdays &__subgrid:nth-child(2)
		display: flex
		flex-direction: column
		justify-content: space-between
		padding: 0 0 0 27px
		width: auto
		
	&.birthdays &__subgrid:nth-child(2) &__calendar:nth-child(2)
		margin-top: 0
		
		.calendar__table
			padding-top: 0

</style>