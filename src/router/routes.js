import CalendarsPage from '@/pages/calendars'

const routes = [

	{
		path: '/',
		name: 'calendars',
		component: CalendarsPage
	},

	{
		path: '/birthdays',
		name: 'birthdays',
		component: CalendarsPage
	},

	{
		path: '/services',
		name: 'services',
		component: CalendarsPage
	},

]

export default routes