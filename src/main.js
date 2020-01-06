import App from './App.svelte'
import { port } from '../config'

console.log('port from app', port)

const app = new App({
  target: document.body,
  props: {
		name: 'world',
		port
	},
})

window.app = app

export default app
