import { create } from "zustand";
import { handleRequest } from "../lib/request";
import api from "../lib/axios";
interface Agent {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  workStatus: string | null;
}
interface AgentState {
  loading: boolean;
  error: string | null;
  agents: Agent[];
}

interface ResponseData {
  success: boolean;
  message: string;
  data?: any;
}
interface AgentAction {
  fetchFreeAgents: () => Promise<void>;
  assignAgentsToStation: (
    stationId: string,
    agentIds: string[],
  ) => Promise<ResponseData>;
  getStationAgents: (stationId: string) => Promise<ResponseData>;
  getStationAvailableAgents: (stationId: string) => Promise<ResponseData>;
  removeAgentFromStation: (
    stationId: string,
    agentId: string,
  ) => Promise<ResponseData>;
}

const initialState: AgentState = {
  loading: false,
  error: null,
  agents: [],
};

export const useAgentStore = create<AgentState & AgentAction>((set) => ({
  ...initialState,
  fetchFreeAgents: async () => {
    set({ loading: true, error: null });
    return new Promise<void>((resolve) => {
      handleRequest({
        request: () => api.get(`/agents/free-agents`),
        onSuccess: (data) => {
          set({ loading: false, agents: data.data as AgentState["agents"] });
          resolve();
        },
        onError: (error) => {
          set({ loading: false, error: error.response?.data?.message });
          resolve();
        },
        showToast: false,
      });
    });
  },
  assignAgentsToStation: async (stationId: string, agentIds: string[]) => {
    return new Promise((resolve, reject) => {
      handleRequest({
        request: () =>
          api.post(`/agents/station/${stationId}/assign-agent`, { agentIds }),
        onSuccess: (data) => {
          resolve({
            success: true,
            message: data.message as string,
          });
        },
        onError: (error) => {
          reject({
            success: false,
            message: error.response?.data?.message,
          });
        },
        showToast: true,
      });
    });
  },
  getStationAgents: async (stationId: string) => {
    return new Promise((resolve, reject) => {
      handleRequest({
        request: () => api.get(`/agents/station/${stationId}/agents`),
        onSuccess: (data) => {
          resolve({
            success: true,
            message: data.message as string,
            data: data.data,
          });
        },
        onError: (error) => {
          reject({
            success: false,
            message: error.response?.data?.message,
          });
        },
        showToast: false,
      });
    });
  },
  getStationAvailableAgents: async (stationId: string) => {
    return new Promise((resolve, reject) => {
      handleRequest({
        request: () => api.get(`/agents/station/${stationId}/available-agents`),
        onSuccess: (data) => {
          resolve({
            success: true,
            message: data.message as string,
            data: data.data,
          });
        },
        onError: (error) => {
          reject({
            success: false,
            message: error.response?.data?.message,
          });
        },
        showToast: false,
      });
    });
  },
  removeAgentFromStation: async (stationId: string, agentId: string) => {
    return new Promise((resolve, reject) => {
      handleRequest({
        request: () => api.patch(`/agents/station/${stationId}/remove-agent/${agentId}`,),
        onSuccess: (data) => {
          resolve({
            success: true,
            message: data.message as string,
            data: data.data,
          });
        },
        onError: (error) => {
          reject({
            success: false,
            message: error.response?.data?.message,
          });
        },
        showToast: false,
      });
    });
  },
}));
