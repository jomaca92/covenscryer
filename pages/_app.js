import '../styles/globals.css'
import { createClient, Provider } from 'urql'

const client = createClient({
  url: "https://api.thegraph.com/subgraphs/name/jomaca92/crypto-coven"
})

function MyApp({ Component, pageProps }) {
  return <Provider value={client}><Component {...pageProps} /></Provider>
}

export default MyApp
