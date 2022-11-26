import React from "react";

const Story = ({ img, username }) => {
  return (
    <div>
      <img
        className='h-16 w-16 rounded-full p-[1.5px] border-red-500 border-[3px] object-contain cursor-pointer hover:scale-110 transition transform duration-200 ease-out  '
        src={img}
        alt=' '
      />
      <p className='text-xs w-16 truncate text-center '>{username}</p>
    </div>
  );
};

export default Story;
