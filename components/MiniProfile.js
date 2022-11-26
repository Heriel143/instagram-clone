import { useSession, signOut } from "next-auth/react";
import React from "react";

const MiniProfile = () => {
  const { data: session } = useSession();
  // console.log(session);
  return (
    <div className=" flex items-center justify-between mt-14 ml-10">
      <img
        className=" h-16 w-16 rounded-full border p-[2px] mr-2"
        src={session?.user?.image}
        alt=""
      />
      <div className="flex-1 mx-2 ">
        <h2 className=" font-bold">{session?.user?.username}</h2>
        <h3 className=" text-sm text-gray-400">Welcome to Instagram</h3>
      </div>
      <button
        onClick={signOut}
        className=" text-blue-600 text-sm font-semibold"
      >
        Sign out
      </button>
    </div>
  );
};

export default MiniProfile;
