
import UserMenu from "../components/UserMenu";
import ContainerProject from "../components/ContainerProject";
import AddFriend from "../components/AddFriend";

import "./css/Home.css";
import FriendRequest from "../components/FriendRequest";

// eslint-disable-next-line react/prop-types
const Home = ({ getFullImageUrl }) => {
  return (
    <div className="home">
      <div className="flex menu">
        <AddFriend />
        <FriendRequest photoPicture={getFullImageUrl} />
        <UserMenu photoPicture={getFullImageUrl} />
      </div>

      <h2>HOME</h2>
      <ContainerProject />
    </div>
  );
};

export default Home;
