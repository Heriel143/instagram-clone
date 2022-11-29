import type { NextPage } from "next";
import Head from "next/head";
import Feed from "../components/Feed";
import Image from "next/image";
import Header from "../components/Header";
import Modal from "../components/Modal";

const Home: NextPage = () => {
  return (
    <div className=' bg-gray-50 h-screen overflow-y-scroll scrollbar-hide'>
      <Head>
        <title>Instagram 2.0 by Heriel</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      {/*** header */}
      <Header />

      <Feed />
      <Modal />
    </div>
  );
};

export default Home;
