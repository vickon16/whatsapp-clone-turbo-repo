import { useStateProvider } from "@/context/StateContext";
import { API } from "@/utils";
import { appLinks } from "@/utils/appLinks";
import { type TAuthSchema } from "@repo/schemas/types";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/router";
import { toast } from "sonner";
import { user } from "@repo/db";

export const useCheckUserMutation = (loadingId: string) => {
  const router = useRouter();
  const { dispatch } = useStateProvider();

  return useMutation({
    mutationFn: async (data: TAuthSchema) => {
      return await API.post(appLinks.authCheckUserRoute, {
        id: data.id,
        email: data.email,
      });
    },
    onSuccess: (data) => {
      const userData = data.data.data as user;
      dispatch({ type: "SET_USER_INFO", payload: userData });
      toast.success("Successfully Logged In", {
        id: loadingId,
      });
      return router.push(appLinks.home);
    },
    onError: (error, variables) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 404) {
          dispatch({ type: "SET_USER_INFO", payload: variables });
          toast.dismiss();
          return router.push(appLinks.onboarding);
        }
      }

      return toast.error("Something went wrong", {
        id: loadingId,
      });
    },
  });
};

export const useOnBoardUserMutation = (loadingId?: string) => {
  const { dispatch } = useStateProvider();

  return useMutation({
    mutationFn: async (data: TAuthSchema) => {
      return await API.post(appLinks.authOnboardUserRoute, data);
    },
    onSuccess: (data) => {
      const userData = data.data as user;
      dispatch({ type: "SET_USER_INFO", payload: userData });
      toast.success("Successfully Onboard", {
        id: loadingId,
      });
      return window.location.assign(appLinks.home);
    },
    onError: () => {
      return toast.error("Something went wrong", {
        id: loadingId,
      });
    },
  });
};
