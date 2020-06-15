<template>

	<div class="page-calendars">
	
		<CalendarsBlock v-if="['birthdays', 'services'].includes($route.name)" />

	</div>

</template>

<script>

import CalendarsBlock from '@/components/CalendarsBlock'

export default {

	name: 'page-calendars',

	components: {

		CalendarsBlock

	},

}

</script>

<style lang="stylus">

.page-calendars
	display: flex
	flex-direction: column
	position: relative
	width: 100%

</style>