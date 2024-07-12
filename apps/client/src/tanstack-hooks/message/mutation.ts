import { API } from "@/utils";
import { appLinks } from "@/utils/appLinks";
import { user_pair } from "@repo/db";
import { TMessageSchema } from "@repo/schemas/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useAddMessageMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: TMessageSchema) => {
      const response = await API.post(appLinks.addPairMessages, data);
      if (!response.data.success) {
        throw new Error(response.data.msg);
      }
      if (!response.data.success) {
        throw new Error(response.data.msg);
      }

      const newMessage = response.data.data as TMessageSchema;
      return newMessage;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [appLinks.queryKeys.getAllUserPairs],
      });
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

export const useImageAudioMessageMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: FormData) => {
      const type = data.get("type") as TMessageSchema["type"];
      const response = await API.post(
        type === "image"
          ? appLinks.addImageMessage
          : type === "audio"
            ? appLinks.addAudioMessage
            : "",
        data,
        { headers: { "Content-Type": "multipart/form-data" } },
      );

      if (!response.data.success) {
        throw new Error(response.data.msg);
      }

      const newMessage = response.data.data as TMessageSchema;
      return newMessage;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [appLinks.queryKeys.getAllUserPairs],
      });
    },
    onError: (error) => {
      console.log(error);
    },
  });
};
