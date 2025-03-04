import React, { useContext, useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { UserDetailContext } from "@/app/context/UserDetailContext";
import axios from "axios";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import uuid4 from "uuid4";
import { toast } from "sonner";
import Image from "next/image";
import Lookup from "@/data/Lookup";
import { Loader2 } from "lucide-react";

const SignInDialog = ({ openDialog, closeDialog }) => {
  const { setUserDetail } = useContext(UserDetailContext);
  const CreateUser = useMutation(api.users.CreteUser);
  const [loading, setLoading] = useState(false);

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);

      try {
        const userInfo = await axios.get(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: { Authorization: "Bearer " + tokenResponse?.access_token },
          }
        );
        console.log(userInfo);
        const user = userInfo.data;

        const dbUser = await CreateUser({
          name: user?.name,
          email: user?.email,
          picture: user?.picture,
          uid: uuid4(),
        });

        if (typeof window !== "undefined") {
          localStorage.setItem("user", JSON.stringify(dbUser[0]));
        }
        await setUserDetail(dbUser[0]);
        toast.success("Logged In Successfully");
        closeDialog(false);
      } catch (error) {
        toast.error("Login failed. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    onError: (errorResponse) => {
      console.log(errorResponse);
      setLoading(false);
      toast.error("Google Sign-in failed.");
    },
  });

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity ${openDialog ? "opacity-100 visible" : "opacity-0 invisible"}`}
    >
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 md:p-8 transition-all transform scale-100">
        <h2 className="text-2xl font-bold text-center text-gray-900">
          {Lookup.SIGNIN_HEADING}
        </h2>
        <p className="mt-2 text-center text-gray-600">
          {Lookup.SIGNIN_SUBHEADING}
        </p>
        <div className="mt-6 flex flex-col items-center gap-4">
          <button
            onClick={googleLogin}
            className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-lg px-4 py-3 text-gray-700 hover:border-purple-500 hover:shadow-md transition-all"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="w-6 h-6 animate-spin text-purple-500" />
            ) : (
              <>
                <Image
                  src="/google.png"
                  alt="Google icon"
                  width={24}
                  height={24}
                  className="w-6 h-6"
                />
                <span className="text-base font-medium">
                  Sign In With Google
                </span>
              </>
            )}
          </button>
          <p className="text-sm text-gray-500 text-center">
            {Lookup?.SIGNIn_AGREEMENT_TEXT}
          </p>
        </div>
        <button
          onClick={() => closeDialog(false)}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          &#x2715;
        </button>
      </div>
    </div>
  );
};

export default SignInDialog;
