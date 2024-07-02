import Avatar from "@/components/ui/avatar";
import { defaultAvatar } from "@/utils/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useStateProvider } from "@/context/StateContext";
import AuthLayout from "@/layouts/AuthLayout";
import { useOnBoardUserMutation } from "@/tanstack-hooks/auth/mutations";
import { appLinks } from "@/utils/appLinks";
import { authSchema } from "@repo/schemas";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const loadingId = "onboarding";

const OnBoardingPage = () => {
  const router = useRouter();
  const { state } = useStateProvider();
  const [name, setName] = useState(state.userInfo?.name || "");
  const [image, setImage] = useState(state.userInfo?.image || defaultAvatar);
  const [imageFile, setImageFile] = useState<File | undefined>(undefined);
  const [bio, setBio] = useState("");
  const mutation = useOnBoardUserMutation(loadingId);

  const handleOnboarding = () => {
    // I am suppose to upload the image to firebase, but I didn't do it.
    const validator = authSchema.safeParse({
      id: state.userInfo?.id,
      name,
      image,
      email: state.userInfo?.email,
      bio,
    });

    if (!validator.success) return toast.error("Invalid Credentials");

    toast.loading("Onboarding", { id: loadingId });
    mutation.mutate(validator.data);
  };

  useEffect(() => {
    if (!state.userInfo?.id && !state.userInfo?.isOnBoard) {
      void router.push(appLinks.login);
    } else if (state.userInfo?.isOnBoard) {
      void router.push(appLinks.home);
    }
  }, [router, state.userInfo]);

  return (
    <AuthLayout smallHeader>
      <div className="mx-auto mt-8 w-full max-w-[600px] space-y-6">
        <h2 className="text-center text-clampMd font-semibold">
          Create Your Profile
        </h2>

        <div className="flex flex-col-reverse items-center gap-4 sm:flex-row">
          <div className="flex w-full flex-col items-center justify-center gap-4">
            <Input
              label
              name="Display Name"
              placeholder="Your Display Name"
              className="h-12"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              label
              name="Bio"
              placeholder="About you..."
              className="h-12"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>

          <div className="group/image relative z-0 w-fit border-spacing-10 cursor-pointer rounded-md">
            <Avatar
              size="xl"
              src={image}
              setImage={setImage}
              imageFile={imageFile}
              setImageFile={setImageFile}
            />
          </div>
        </div>

        <Button
          className="!mt-6"
          onClick={handleOnboarding}
          isLoading={mutation.isPending}
        >
          Create Profile
        </Button>
      </div>
    </AuthLayout>
  );
};

export default OnBoardingPage;
