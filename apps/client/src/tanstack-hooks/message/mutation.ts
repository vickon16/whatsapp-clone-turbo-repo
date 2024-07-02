import { API } from "@/utils";
import { appLinks } from "@/utils/appLinks";
import { TMessageSchema } from "@repo/schemas/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useAddMessageMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: TMessageSchema) => {
      return await API.post(appLinks.addPairMessages, data);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [appLinks.queryKeys.getChatListMessages],
      });
    },
    onError: (error) => {
      console.log(error);
    },
  });
};
