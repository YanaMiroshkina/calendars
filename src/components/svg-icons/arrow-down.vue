<template>

	<svg class="icon-arrow-down" width="36" height="16" viewBox="0 0 210 100" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path d="M10.5 8.5L106.904 89.8765" :stroke="color" stroke-width="15"/>
		<line x1="99.9143" y1="89.0657" x2="201.914" y2="9.06573" :stroke="color" stroke-width="15"/>
	</svg>

</template>

<script>
	
export default {

	name: 'icon-arrow-down',

	props: {

		color: {

			type: String,
			default: '#5c678c'

		}

	}

}

</script>