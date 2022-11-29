import { async } from "@firebase/util";
import React from "react";
import Header from "../../components/Header";
import { getProviders, signIn as SignIntoProvider } from "next-auth/react";

const signIn = ({ providers }) => {
  //   console.log(providers);
  return (
    <>
      <Header />
      <div className=' flex flex-col items-center justify-center min-h-screen -mt-52'>
        <img className=' w-80' src='https://links.papareact.com/ocw' alt='' />
        <div className=' mt-20'>
          {Object.values(providers).map((provider) => (
            <div key={provider.name}>
              <button
                className=' bg-blue-500 rounded-lg p-2 text-white'
                onClick={() =>
                  SignIntoProvider(provider.id, { callbackUrl: "/" })
                }
              >
                Sign in with {provider.name}
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export async function getServerSideProps() {
  const providers = await getProviders();

  return {
    props: { providers },
  };
}

export default signIn;
