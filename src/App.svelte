<script>
  import io from 'socket.io-client'
  import _ from 'lodash/fp'
  import F from 'futil'
  export let name
	export let port
	
	let user = prompt("Please enter your name")

  let socket = io(`http://localhost:${port}`)
  let messages = [
    { createdAt: Date.now(), createdBy: 'michsa', message: 'test' }
  ]
  let message = ''

  socket.on('load messages', msgs => {
		console.log('load messages: ', msgs)
		messages = msgs
  })
  socket.on('receive message', msg => {
    console.log('receive message: ', msg)
    messages = [...messages, msg]
  })

  let sendMessage = () => {
		socket.emit('send message', message)
		message = ''
	}
</script>

<style>
  h1 {
    color: magenta;
  }
	ul {
		list-style-type: none;
		padding-inline-start: 0;
	}
</style>

<body>
  <h1>Hello {name}!</h1>
  <ul id="messages">
    {#each messages as msg}
      <li>
        [{new Date(msg.createdAt).toLocaleTimeString("en-US")}]
        <b>{msg.createdBy}:</b>
        {msg.message}
      </li>
    {/each}
  </ul>
  <form action="">
    <input id="m" autocomplete="off" bind:value={message} />
    <button type="submit" on:click|preventDefault={sendMessage}>send</button>
  </form>
</body>
