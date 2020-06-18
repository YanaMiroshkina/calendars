<template>

	<div id="app">

		<div v-if="showIEWarning" class="ie">
			
			<div class="ie__description">Корректная работа сайта пока гарантируется только в браузере Google Chrome.<br>Скачать его можно по ссылке: <a class="ie__link" href="https://www.google.com/chrome/" target="_blank" title="Скачать браузер Google Chrome">https://www.google.com/chrome/</a></div>

			<div 
				class="ie__btn"
				@click="hideIEWarning"
			>Продолжить с Internet Explorer</div>

		</div>

		<template v-else>

			<div class="nav">
				<div class="nav__title">Выберите календарь:</div>
				<router-link class="nav__link" to="/birthdays">Дни рождения</router-link>
				<router-link class="nav__link" to="/services">Сервисы</router-link>
			</div>

			<router-view />

		</template>

	</div>

</template>

<script>

export default {

	name: 'App',

	data: () => ({

		showIEWarning: false

	}),

	created () {

		if (navigator.userAgent.indexOf('MSIE') !== -1 || navigator.appVersion.indexOf('Trident/') > -1) this.showIEWarning = true

	},

	methods: {

		hideIEWarning () {

			this.showIEWarning = false

		}

	}

}

</script>

<style lang="stylus">

#app
	padding-bottom: 250px
	-webkit-font-smoothing: antialiased
	-moz-osx-font-smoothing: grayscale
	color: colorBlack
	text-align: center
	
.ie
	display: flex
	flex-direction: column
	align-items: center
	justify-content: center
	width: 100%
	height: 100vh
	
	&__description
		line-height: 26px
		text-align: center
		
	&__link
		color: colorDark
		text-decoration: underline
		
		&:hover
			color: colorBlack
	
	&__btn
		margin-top: 20px
		padding: 10px 20px
		background-color: colorLight
		cursor: pointer
	
.nav	
	
	&__title
		padding: 20px 0
	
	&__link
		display: inline-block
		padding: 10px 20px
		font-size: 18px
		color: colorBlack
		background-color: colorUltraLight
		transition: background 0.07s
		
		&:last-child
			border-left: 1px solid colorLight
		
		&:hover,
		&.router-link-exact-active
			background-color: colorLight
	
</style>
