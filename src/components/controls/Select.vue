<template>

	<div :class="className">

		<div 
			class="select__selected"
			:style="styleObjForSelected"
			@click="onClickSelectedItem"
		>
			
			<input 
				class="select__input" 
				type="text" 
				:disabled="!autocomplete"
				:value="selectedText" 
				:placeholder="placeholder" 
				@input="onInput"
			/>

			<div 
				class="select__arrow"
				@click="onClickArrow"
			><IconArrowDown /></div>

		</div>

		<div 
			data-js-options
			class="select__options"
			:style="styleObjForOptions"
		>

			<template v-if="isVisibleNoMatch">

				<div class="select__option no-match">Нет совпадений</div>

			</template>

			<template v-else>

				<div 
					v-for="(item, i) in computedItems"
					:key="i"
					data-js-option
					class="select__option"
					:class="{
						'active': checkSelected(item),
						'disabled': isDisabledItem(item)
					}"
					@click="!isDisabledItem(item) && onClickSelectItem(item)"
				>{{item.text !== undefined ? item.text : item}}</div>

			</template>

		</div>

	</div>

</template>

<script>

import selectors from '@/mixins/selectors'
import IconArrowDown from '@/components/svg-icons/arrow-down'
import { uid } from '@/utils/uid'
	
export default {

	name: '',

	components: {

		IconArrowDown,

	},

	props: {

		autocomplete: {

			type: Boolean,
			default: false

		},

		items: {

			type: Array,
			default: () => ([])

		},

		disabledItems: {

			type: Array,
			default: () => ([])

		},

		placeholder: {

			type: String,
			default: ''

		},

		styling: {

			type: String,
			// oulined, underlined, flat
			default: 'outlined'

		},

		bg: {

			type: [Boolean, String],
			default: false

		},

	},

	mixins: [selectors],

	data: () => ({

		isOpened: false,

		computedItems: [],

		selectedItem: {},

		selectedText: '',

		isVisibleNoMatch: false,

	}),

	computed: {

		styleObjForSelected () {

			let obj = {}

			if (this.bg) obj.backgroundColor = this.bg

			return obj

		},

		styleObjForOptions () {

			let obj = {}

			if (this.bg) obj.backgroundColor = this.bg

			return obj

		},

		uid () {

			return uid()

		},

		className () {

			return 'select select-' + this.uid + ` ${this.styling}`

		},

	},

	created () {

		this.setInitialItems()
		
	},

	mounted () {

		document.body.addEventListener('click', this.onClickBody)

	},

	beforeDestroy () {

		document.body.removeEventListener('click', this.onClickBody)

	},

	methods: {

		setInitialItems () {

			this.computedItems = this.items

		},

		onClickSelectedItem () {

			if (!this.isOpened) this.showOptions()

		},

		onClickArrow (e) {

			e.stopPropagation()

			if (this.isOpened) this.hideOptions()

			else this.showOptions()

		},

		onInput (e) {

			let value = e.target.value

			this.selectedText = value

			this.filterItems(value)

		},

		filterItems (value) {

			if (value) {

				this.computedItems = this.items.filter(item => {

					if (typeof(item) === 'object') {

						if (item.text.includes(value)) return true

					} else if (item.includes(value)) return true

				})

			} else {

				this.computedItems = this.items	

				this.selectItem('')

			}

			if (!this.computedItems.length && this.autocomplete) this.isVisibleNoMatch = true	

			else this.isVisibleNoMatch = false

		},

		onClickSelectItem (item) {

			this.selectItem(item)

			this.hideOptions()

		},

		isDisabledItem (item) {

			let value = item.value

			if (value !== undefined ? this.disabledItems.find(d => d.value == value) : this.disabledItems.includes(value)) {

				return true

			} else return false

		},

		selectItem (item) {

			this.selectedItem = item

			let text = ''

			if (typeof(item) == 'string' && !item) text = item

			else if (item.text !== undefined) text = item.text

			this.selectedText = text

			this.$emit('select', item)

		},

		checkSelected (item) {

			let selected = this.selectedItem

			if (typeof(selected) == 'string' && selected == item) return true

			else if (typeof(selected) == 'object' && selected.value == item.value) return true

			else return false

		},

		onClickBody (e) {

			e.stopPropagation()

			let select = e.target.closest('.select-' + this.uid)

			if (select) return

			if (this.isOpened) this.hideOptions()

		},

		showOptions () {

			this.$el && this.$el.classList.add('opened')

			this.isOpened = true

			this.scrollToOption()

		},

		scrollToOption () {

			let optionsEl = this.el('[data-js-options]'),
				selectedOption = this.el('[data-js-option].active'),
				disabledOptions = this.els('[data-js-option].disabled'),
				firstOptionAfterDisabled = disabledOptions.length ? disabledOptions[disabledOptions.length - 1]?.nextSibling : undefined

			if (selectedOption) optionsEl.scrollTop = selectedOption.offsetTop

			else if (firstOptionAfterDisabled) optionsEl.scrollTop = firstOptionAfterDisabled.offsetTop

			else optionsEl.scrollTop = 0

		},

		hideOptions () {

			if (!this.isOpened) return

			this.$el && this.$el.classList.remove('opened')

			this.isOpened = false

			this.handleCloseAutocomplete()

		},

		handleCloseAutocomplete () {

			if (!this.autocomplete) return

			if (this.isVisibleNoMatch) this.clearSelected()

			else this.resetSelectedItem()

			this.isVisibleNoMatch = false

			this.setInitialItems()

		},

		resetSelectedItem () {

			this.onClickSelectItem(this.selectedItem)

		},

		clearSelected () {

			this.onClickSelectItem('')

		},
		
	}

}

</script>

<style lang="stylus">
	
.select
	display: inline-flex
	position: relative
	width: 100%
	height: 45px
	font-size: 23px
	cursor: pointer
	
	&__selected
		display: inline-flex
		width: 100%

	&__input
		display: inline-flex
		width: 100%
		height: 100%
		font-size: inherit
		line-height: 45px
		color: colorBlack
		background-color: transparent
		border: none
		
		&:active,
		&:focus
			outline: none
			
	&__arrow
		display: flex
		align-items: center
		justify-content: center
		position: absolute
		top: 0
		right: 0
		width: 27px
		height: 27px
		text-align: center
		transition: transform 0.2s
		
	&.opened &__arrow
		transform: rotate(180deg)
			
	&__options
		display: none
		flex-direction: column
		position: absolute
		left: 0
		width: 100%
		height: auto
		max-height: 250px
		background-color: white
		border: 1px solid rgba(57, 55, 55, 0.4)
		border-top: none
		box-sizing: border-box
		overflow-x: hidden
		overflow-y: auto
		z-index: 1
		
	&.opened &__options
		display: flex
		
	&__option
		display: inline-flex
		padding: 0 10px 0 17px
		width: 100%
		height: 45px
		line-height: 45px
		
		&:not(:last-child)
			border-bottom: 1px solid rgba(57, 55, 55, 0.4)
			
		&.no-match
			font-size: 12px
			cursor: not-allowed
			
		&.active
			font-family: 'Roboto'
			
		&.disabled
			cursor: default
			
	/* ===== flat ===== */
		
	&.flat &__selected
		border-radius: 4px
		
	&.flat &__input
		padding: 2px 70px 0 17px
		
	&.flat &__arrow
		margin-right: 17px
		padding-top: 8px
		padding-left: 14px
		width: 50px
		height: 50px
		text-align: center
		transform-origin: 32px 27px
		
	&.flat &__options
		top: 54px
		border-top: 1px solid colorDark
		border-left: none
		border-right: none
		border-bottom: none
		border-bottom-left-radius: 4px
		border-bottom-right-radius: 4px
		
	&.flat &__option
		
		&:not(:last-child)
			border-bottom: 1px solid colorMedium
		
		&.active,
		&:hover:not(.no-match):not(.disabled)
			background-color: colorMedium
			
		&.disabled
			color: colorMedium
			background-color: colorLight

</style>