import { Show, SignInButton, SignUpButton, UserButton } from '@clerk/react'

const App = () => {
  return (
    
    <div>
      <h1 className='text-red-500 text-2xl font-bold'>Welcome to the Admin Panel, time stamp: 4hrs, 38mins, 55secs</h1>
      <header>
        <Show when="signed-out">
          <SignInButton />
          <SignUpButton />
        </Show>
        <Show when="signed-in">
          <UserButton />
        </Show>
      </header>
    </div>
  )
}

export default App