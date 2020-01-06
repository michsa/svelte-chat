<script>
  import io from 'socket.io-client'
  import _ from 'lodash/fp'
	import F from 'futil'
	export let port
	
	// state
	// -----

	let user = prompt('Please enter your name') || 'anonymous'
  let socket = io(`http://localhost:${port}`)
  let messages = []
	let message = ''

	// methods
	// -------
	
	$: processMessage = _.update('createdBy', F.when(_.eq(user), 'me'))

	let sendMessage = () => {
    socket.emit('send message', { message, user })
    message = ''
  }

  let clearDb = () => socket.emit('clear messages')

  // socket events
	// -------------
	
  socket.on('load messages', msgs => {
    console.log('load messages: ', msgs)
    messages = _.map(processMessage, msgs)
	})
	
  socket.on('receive message', msg => {
    console.log('receive message: ', msg)
    messages = [...messages, processMessage(msg)]
  })
</script>

<style>
  ul {
    list-style-type: none;
    padding-inline-start: 0;
  }
	#message-form {
		display: flex;
	}
	#m {
		flex: 1;
	}
</style>

<body>
  <ul id="messages">
    {#each messages as msg}
      <li>
        [{new Date(msg.createdAt).toLocaleTimeString('en-US')}]
        <b>{msg.createdBy}:</b>
        {msg.message}
      </li>
    {/each}
  </ul>
  <form action="" id="message-form">
    <input id="m" autocomplete="off" bind:value={message} />
    <button type="submit" on:click|preventDefault={sendMessage}>send</button>
  </form>
	<input bind:value={user} />
  <button on:click={clearDb}>clear messages</button>
</body>
