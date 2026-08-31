import { render } from 'preact'

import { App } from './ui/App'
import './ui/styles.css'

const root = document.getElementById('app')
if (root === null) throw new Error('The page is missing its #app element.')

// The one place the current date enters the app. From here it is passed in.
render(<App today={new Date()} />, root)

// Registered only in a built app: during development the browser should always
// be looking at the files on disk.
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    void navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`, {
      scope: import.meta.env.BASE_URL,
    })
  })
}
