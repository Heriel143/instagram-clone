import { faker } from "@faker-js/faker";
import Story from "./Story";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

const Stories = () => {
  const { data: session } = useSession();
  const [suggestion, setSuggestion] = useState([]);
  useEffect(() => {
    const suggestion = [...Array(20)].map((_, i) => ({
      avatar: faker.image.avatar(),
      name: faker.name.fullName(),

      id: i,
    }));
    setSuggestion(suggestion);
  }, []);

  return (
    <div className="flex space-x-2 p-6 bg-white mt-8 border border-gray-300 rounded-2xl overflow-x-scroll scrollbar-thin scrollbar-thumb-gray-200">
      {session && (
        <Story img={session.user.image} username={session.user.username} />
      )}
      {suggestion.map((profile) => (
        <Story key={profile.id} img={profile.avatar} username={profile.name} />
      ))}
    </div>
  );
};

export default Stories;
