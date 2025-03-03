import React, { useContext } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Lookup from "@/data/Lookup";
import { useGoogleLogin } from "@react-oauth/google";
import { UserDetailContext } from "@/app/context/UserDetailContext";
import axios from "axios";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import uuid4 from "uuid4";
import { toast } from "sonner";
import Image from "next/image";

const SignInDialog = ({ openDialog, closeDialog }) => {
  const { setUserDetail } = useContext(UserDetailContext);
  const CreateUser = useMutation(api.users.CreteUser);

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponce) => {
      console.log(tokenResponce);
      const userInfo = await axios.get(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        {
          headers: { Authorization: "Bearer" + tokenResponce?.access_token },
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

      if (typeof window !== undefined) {
        localStorage.setItem("user", JSON.stringify(dbUser[0]));
      }
      await setUserDetail(dbUser[0]);
      // save this inside our database
      toast.success("Logged In Successfully");
      closeDialog(false);
    },
    onError: (errorResponse) => console.log(errorResponse),
  });

  return (
    <Dialog open={openDialog} onOpenChange={closeDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle></DialogTitle>
          <DialogDescription>
            <div className="flex flex-col items-center justify-center gap-3">
              <h2 className="font-bold text-2xl   text-white text-center">
                {Lookup.SIGNIN_HEADING}
              </h2>
              <p className="mt-2 text-center">{Lookup.SIGNIN_SUBHEADING}</p>
              <div
                onClick={googleLogin}
                className="border cursor-pointer border-slate-300 hover:border-purple-400 hover:shadow-[0_0_5px_rgba(124,58,237,0.5)] transition-all border-transparent rounded-lg flex items-center justify-between px-4 py-2 gap-4"
              >
                <Image
                  src={"/google.png"}
                  alt="google icon"
                  width={10}
                  height={10}
                  className="h-7 w-auto"
                />

                <span className=" text-black bg-white">
                  Sign In With Google
                </span>
              </div>
              <p>{Lookup?.SIGNIn_AGREEMENT_TEXT}</p>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default SignInDialog;
