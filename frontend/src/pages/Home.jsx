import { useMutation } from "@apollo/client";
import toast from "react-hot-toast";
import { LOGOUT_USER } from "../graphql/mutations/userMutation";

const Home = ({ name }) => {
  const [logout, { loading }] = useMutation(LOGOUT_USER, {
    refetchQueries: ["GetAuthenticatedUser"],
  });
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error(error.message);
    }
  };
  return (
    <>
      <div className="h-screen flex justify-center items-center flex-col">
        <p className="text-4xl sm:text-7xl font-bold relative z-20 bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-500 py-8">
          Welcome {name}
        </p>
        <button
          onClick={handleLogout}
          className="py-3 px-5 bg-white text-black rounded-lg"
        >
          {loading ? "Logging out..." : "Logout"}
        </button>
      </div>
    </>
  );
};

export default Home;
