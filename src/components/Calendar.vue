<template>
	
	<div :class="className">

		<div class="calendar__month-name">{{ monthName[0].toUpperCase() + monthName.slice(1) }}</div>

		<div class="calendar__table">

			<div v-if="!isPageBirthdays" ref="weekdays" class="calendar__weekdays">
				
				<div v-for="weekday in weekdays" class="calendar__weekday">{{ weekday[0].toUpperCase() + weekday[1] }}</div>

			</div>
			
			<div class="calendar__days">

				<div 
					v-for="week in 6"
					:key="'week-' + week"
					ref="week"
					class="calendar__week"
				>

					<div
						v-for="i in 7" 
						:key="(
							day = daysNumbers[week][i - 1], 
							(week - 1) * 7 + i
						)"
						:data-js-day="day"
						class="calendar__day"
						:class="{
							'with-number': day,
							'disabled': checkIfDayDisabled(daysNumbers[week][i - 1]),
							'active': checkIfDaySelected(day)
						}"
						@click="(e) => onClickDay(e, daysNumbers[week][i - 1])"
					>

						<div class="calendar__day-number">{{ day }}</div>

						<!-- дни рождения - start -->

						<div v-if="isPageBirthdays && persons(day).length" class="calendar__day-birthdays">

							<!-- 1 -->
							
							<div class="calendar__day-birthday">
								
								<router-link 
									v-if="person = persons(day)[0]"
									:to="person.link"
									data-js-person
									class="calendar__day-person"
									:style="{
										'background-image': 'url(' + require(`@/${person.photo}`) + ')'
									}"
									@mouseenter.native="onMouseenterPerson"
									@mouseleave.native="onMouseleavePerson"
								>

									<div data-js-person-name class="calendar__day-person-name">
										{{`${person.firstName} ${person.lastName}`}}
									</div>

								</router-link>

							</div>

							<!-- 2 -->

							<div class="calendar__day-birthday">
								
								<router-link 
									v-if="person = persons(day)[1]"
									:to="person.link"
									data-js-person
									class="calendar__day-person"
									:style="{
										'background-image': 'url(' + require(`@/${person.photo}`) + ')'
									}"
									@mouseenter.native="onMouseenterPerson"
									@mouseleave.native="onMouseleavePerson"
								>

									<div data-js-person-name class="calendar__day-person-name">
										{{`${person.firstName} ${person.lastName}`}}
									</div>

								</router-link>

							</div>

							<!-- 3 -->

							<div></div>

							<!-- 4 -->

							<div class="calendar__day-birthday">

								<router-link 
									v-if="person = persons(day)[2], persons(day).length == 3"
									:to="person.link"
									data-js-person
									class="calendar__day-person"
									:style="{
										'background-image': 'url(' + require(`@/${person.photo}`) + ')'
									}"
									@mouseenter.native="onMouseenterPerson"
									@mouseleave.native="onMouseleavePerson"
								>

									<div data-js-person-name class="calendar__day-person-name">
										{{`${person.firstName} ${person.lastName}`}}
									</div>

								</router-link>

								<div 
									v-if="people = persons(day).slice(2), persons(day).length > 3"
									data-js-person
									class="calendar__day-persons"
									@mouseenter="onMouseenterPerson"
									@mouseleave="onMouseleavePerson"
								>

									<span class="calendar__day-persons-number">+{{ people.length }}</span>

									<div 
										data-js-person-name
										class="calendar__day-persons-names"
									>

										<router-link 
											v-for="(person, i) in people" 
											:key="i"
											:to="person.link"
											class="calendar__day-persons-name"
										>

											{{`${person.firstName} ${person.lastName}`}}

										</router-link>

									</div>

								</div>

							</div>

						</div>

						<!-- дни рождения - finish -->

					</div>

				</div>

			</div>

		</div>

	</div>

</template>

<script>

import { mapState, mapActions } from 'vuex'
import selectors from '@/mixins/selectors'
	
export default {

	name: 'Calendar',

	props: {

		width: {

			type: Number,
			default: 0,

		},

		params: {

			type: Object,
			default: () => ({

				month: 1,
				year: 2020,
				isMain: true

			})

		}   

	},

	mixins: [ selectors ],

	data: () => ({

		monthNames: [

			'январь', 'февраль', 'март', 
			'апрель', 'май', 'июнь', 
			'июль', 'август', 'сентябрь', 
			'октябрь', 'ноябрь', 'декабрь'

		],

		weekdays: ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'],

		initialDay: new Date().getDate(),
		initialMonth: new Date().getMonth() + 1,
		initialYear: new Date().getFullYear(),

	}),

	computed: {

		...mapState({

			selectedDates: 'selectedDates'

		}),

		isPageBirthdays () {

			return this.$route.name == 'birthdays'

		},

		isPageServices () {

			return this.$route.name == 'services'

		},

		className () {

			let className = 'calendar'

			if (this.params.isMain) className += ' big'

			else className += ' small'

			if (this.isPageBirthdays) className += ' birthdays'

			if (this.isPageServices) className += ' services'

			return className

		},

		monthName () {

			return this.monthNames[new Date(+this.params.year, +this.params.month - 1, 1).getMonth()]

		},

		firstDayPosition () {

			let weekday = this.weekdays[new Date(+this.params.year, +this.params.month - 1, 1).getDay()],
				dayIndex = this.weekdays.indexOf(weekday)

			return `${weekday}-${dayIndex}`

		},

		daysLength () {

			return new Date(+this.params.year, +this.params.month, 0).getDate()

		},

		daysNumbers () {

			let obj = {},
				dayNumber = ''

			for ( let week = 1; week <= 6; week++ ) {

				for ( let day = 1; day <= 7; day++ ) {

					obj[week] = obj[week] || []

					let dayIndex = day - 1,
						cellIndex = (week - 1) * 7 + day - 1

					if (`${this.weekdays[dayIndex]}-${cellIndex}` == this.firstDayPosition) {

						dayNumber = 1

					} else if (dayNumber && dayNumber < this.daysLength) {

						dayNumber += 1

					} else {

						dayNumber = ''

					}

					obj[week].push(dayNumber)

				}

			}

			return obj

		},

		hintTop () {

			return this.params.isMain ? 28 : 8

		},

		hintLeft () {

			return this.params.isMain ? 28 : 8

		},

	},

	watch: {

		width: {

			handler () {

				this.$nextTick(() => this.calculateGridSize())

			},

			immediate: true

		},

	},

	methods: {

		...mapActions({

			selectDate: 'selectDate',

		}),

		calculateGridSize () {

			this.$el.style.width = this.width + 'px'

			let elWidth = this.$el.offsetWidth,
				size = elWidth / 7 ^ 0

			if (this.isPageServices) this.$refs.weekdays.style['grid-template-rows'] = size + 'px'
			this.$refs.week.forEach(week => week.style['grid-template-rows'] = size + 'px')

		},

		checkIfDayDisabled (day) {

			let isDisabled = this.params.isMain 
				&& day 
				&& day < this.initialDay 
				&& this.params.month == this.initialMonth 
				&& this.params.year == this.initialYear

			return isDisabled

		},

		checkIfDaySelected (day) {

			if (this.selectedDates.find(d => d == `${day}.${this.params.month}.${this.params.year}`)) return true

			else return false

		},

		onClickDay (e, day) {

			if (this.isPageBirthdays || !this.params.isMain || !day || this.checkIfDayDisabled(day)) return

			this.selectDate({date: `${day}.${this.params.month}.${this.params.year}`})

		},

		persons (day) {

			return this.params.birthdays.find(item => item.day == day)?.persons || []

		},

		onMouseenterPerson (e) {

			this.showHint(e)

		},

		onMouseleavePerson (e) {

			this.hideHint(e)

		},

		showHint (e) {

			let el = e.target,
				hint = e.target.querySelector('[data-js-person-name]'),
				hintRect = hint?.getBoundingClientRect(),
				hintStyle = window.getComputedStyle(hint),
				extraIndent = this.params.isMain ? 22 : 4

			// тултип выходит за правую границу окна
			if (window.innerWidth - (hintRect.left + hintRect.width + 20) < 0) {

				hint.style.left = this.hintLeft - hintRect.width - extraIndent + 'px'

			} else hint.style.left = this.hintLeft + 'px'

			// тултип выходит за нижнюю границу окна
			if (hintRect.bottom + 20 > window.innerHeight) {

				hint.style.top = this.hintTop - hintRect.height - extraIndent + 'px'

			} else hint.style.top = this.hintTop + 'px'

			el.classList.add('active')

		},

		hideHint (e) {

			let el = e.target,
				hint = e.target.querySelector('[data-js-person-name]')

			el.classList.remove('active')
			hint.style.removeProperty('top')
			hint.style.removeProperty('left')

		},

	}

}

</script>

<style lang="stylus">
	
.calendar
	
	*::selection
		background-color: transparent
		
	*::-moz-selection
		background-color: transparent
	
	&__month-name
		font-size: 20px
		line-height: 20px
		color: colorBlack
		text-align: center
		
	&__table
		margin-top: 10px
		
	&__weekdays
		display: grid
		grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr
		
	&__weekday
		align-self: center
		justify-self: center
		font-family: 'Roboto-Light'
		font-size: 20px
		color: colorBlack
		
		&:nth-child(6),
		&:nth-child(7)
			font-family: 'Roboto-Medium'
		
	&__week
		display: grid
		grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr
		
	&__day
		position: relative
		font-family: 'Roboto-Light'
		font-size: 16px
		line-height: 1
		color: colorBlack
		cursor: default
		
		&:nth-child(6),
		&:nth-child(7)
			font-family: 'Roboto-Medium'
			
		&.with-number
			cursor: pointer
			
		&-number
			position: relative
			top: calc(50% - 14px)
			text-align: center  
		
	// большой календарь
		
	&.big &__month-name
		cursor: default
		
	&.big &__weekday
		cursor: default
		
	// маленький календарь
		
	&.small &__weekday
		font-size: 12px
		
	&.small &__day
		font-size: 12px
		
	&.small &__day-number
		top: calc(50% - 8px)
		
	/* --- календарь сервисов --- */
		
	&.services &__day
		
		&.with-number:not(.disabled):not(.active):hover:before,
		&.active:before
			display: block
			content: ''
			position: absolute
			top: 2px
			left: 4px
			width: calc(100% - 8px)
			height: calc(100% - 8px)
			border-radius: 4px
			
		&.with-number:not(.disabled):not(.active):hover:before
			background-color: colorUltraLight
			
		&.active:before
			background-color: colorLight
		
		&.disabled
			color: lighten(colorBlack, 70%)
			cursor: not-allowed
			
	&.services.big &__day
		font-size: 22px
		
	&.services.small
		position: relative
		cursor: pointer
		
		&:hover:before
			display: block
			content: ''
			position: absolute
			top: -12px
			left: -10px
			width: calc(100% + 20px)
			height: calc(100% + 20px)
			background-color: colorUltraLight
			border-radius: 4px
			
	&.services.small &__month-name,
	&.services.small &__weekdays
		position: relative
		z-index: 1
		
	&.services.small &__day
		pointer-events: none

	/* --- календарь дней рождений --- */
		
	// сетка
		
	&.birthdays &__week
		border-bottom: 1px solid colorDark
		
		&:first-child
			border-top: 1px solid colorDark
			
	&.birthdays &__day
		border-right: 1px solid colorDark
		
		&:first-child
			border-left: 1px solid colorDark
	
		&.with-number 
			background-color: colorLight
		
	// основной контент
		
	&.birthdays &__month-name
		text-align: left  
		
	&.birthdays &__day
		
		&-number
			display: block
		
		&.with-number
			cursor: default
		
		&-birthdays
			display: grid
			grid-template-rows: 1fr 1fr
			grid-template-columns: 1fr 1fr
			position: absolute
			top: 0
			left: 0
			width: 100%
			height: 100%
			
		&-person
			display: block
			position: relative
			width: 100%
			height: 100%
			background-size: cover
			
			&-name
				visibility: hidden
				position: absolute
				padding: 4px 8px
				font-family: 'Roboto'
				font-size: 16px
				line-height: 20px
				color: white
				white-space: nowrap
				background-color: colorDark
				border-radius: 4px
				z-index: 1
				
		&-persons
			display: flex
			align-items: center
			justify-content: center
			position: relative
			width: 100%
			height: 100%
			cursor: pointer
			
			&-number
				padding-right: 4px
				font-family: 'Roboto-Bold'
				font-size: 20px
				color: colorDark
				text-shadow: 
					2px 2px 0px white, 
					-2px -2px 0px white, 
					2px -2px 0px white, 
					-2px 2px 0px white
				
			&-names
				visibility: hidden
				display: flex
				flex-direction: column
				position: absolute
				padding: 4px 8px
				font-size: 16px
				text-align: left
				background-color: colorDark
				border-radius: 4px
				z-index: 1
				
			&-name
				font-size: 16px
				line-height: 1.4
				color: white
				white-space: nowrap
				
				&:hover
					text-decoration: underline
				
	&.birthdays &__day-person.active &__day-person-name
		visibility: visible
		
	&.birthdays &__day-persons.active &__day-persons-names
		visibility: visible
		
	// большой календарь с ДР
		
	&.birthdays.big &__day
		font-size: 20px
		
	&.birthdays.big &__day-number
		top: calc(100% - 26px)
		left: 6px
		text-align: left
		
	// маленький календарь с ДР
		
	&.birthdays.small &__day
		font-size: 12px
		
	&.birthdays.small &__day-number
		top: calc(100% - 14px)
		left: 2px
		text-align: left
		
	&.birthdays.small &__day-persons-number
		margin-left: 2px
		padding-right: 0
		font-size: 16px
		text-shadow: 
			1px 1px 0px white, 
			-1px -1px 0px white, 
			1px -1px 0px white, 
			-1px 1px 0px white
			
	&.birthdays.small &__day-persons-names
		font-size: 16px

</style>
