import { getProviders, signIn as SignIntoProvider } from 'next-auth/react'
import Header from '../../components/Header'
function SignIn({ providers }) {
  return (
    <>
      <Header />
      <div className=" -mt-56 flex min-h-screen flex-col items-center justify-center py-2 px-14 text-center">
        <img className=" w-80" src="https://links.papareact.com/t4i" alt="" />
        <div className="mt-40">
          {Object.values(providers).map((provider) => (
            <div key={provider.name}>
              <button
                className="items-center rounded-lg bg-blue-500 p-3 text-white"
                onClick={() =>
                  SignIntoProvider(provider.id, {
                    callbackUrl: 'http://localhost:3000',
                  })
                }
              >
                Sign in with {provider.name}
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
export async function getServerSideProps() {
  const providers = await getProviders()
  return {
    props: {
      providers,
    },
  }
}
export default SignIn
