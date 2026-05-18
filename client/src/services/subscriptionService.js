import { instance } from "./api";

export const subscriptionService = {
  createSubscription: async (programId, paymentMethod, transactionNumber) => {
    const { data } = await instance.post("subscriptions", {
      programId,
      paymentMethod,
      transactionNumber,
    });
    return data.data.subscription;
  },

  getSubscriptions: async () => {
    const { data } = await instance.get("subscriptions");
    return data.data.subscriptions;
  },

  getMySubscriptions: async () => {
    const { data } = await instance.get("subscriptions/my");
    return data.data.subscriptions;
  },

  updateSubscriptionStatus: async (id, status) => {
    const { data } = await instance.put(`subscriptions/${id}/status`, { status });
    return data.data.subscription;
  },
};
