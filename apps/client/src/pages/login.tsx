import { defaultAvatar } from "@/utils/constants";
import { Button } from "@/components/ui/button";
import AuthLayout from "@/layouts/AuthLayout";
import { useCheckUserMutation } from "@/tanstack-hooks/auth/mutations";
import { firebaseAuth } from "@/utils/FirebaseConfig";
import { authSchema } from "@repo/schemas";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";
import { useStateProvider } from "@/context/StateContext";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { appLinks } from "@/utils/appLinks";

const LoginPage = () => {
  const {
    state: { userInfo },
  } = useStateProvider();
  const loadingId = "login";
  const mutation = useCheckUserMutation(loadingId);
  const router = useRouter();

  useEffect(() => {
    if (!!userInfo?.id) router.push(appLinks.home);
  }, [userInfo?.id]);

  const handleLogin = async () => {
    toast.loading("Login In...", {
      id: loadingId,
    });
    const provider = new GoogleAuthProvider();
    const {
      user: { displayName, email, photoURL, uid },
    } = await signInWithPopup(firebaseAuth, provider);

    const validator = authSchema.safeParse({
      id: uid,
      name: displayName,
      email,
      image: photoURL || defaultAvatar,
    });

    if (!validator.success)
      return toast.error("The login credentials are incomplete");

    mutation.mutate(validator.data);
  };

  return (
    <AuthLayout>
      <Button size="lg" onClick={handleLogin}>
        <FcGoogle className="mr-2 size-6" />
        Sign in with Google
      </Button>
    </AuthLayout>
  );
};

export default LoginPage;
