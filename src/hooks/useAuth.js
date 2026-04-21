import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Context } from "../main";
import * as api from "../api";

export const useAuth = () => {
  const {
    isAuthorized, setIsAuthorized,
    user, setUser,
    authLoading, setAuthLoading,
    savedJobIds, setSavedJobIds,
  } = useContext(Context);
  const navigateTo = useNavigate();

  const login = async (payload) => {
    const { data } = await api.loginUser(payload);
    if (data.user) setUser(data.user);
    toast.success(data.message || "Logged in!");
    setIsAuthorized(true);
  };

  const register = async (payload) => {
    const { data } = await api.registerUser(payload);
    if (data.user) setUser(data.user);
    toast.success(data.message || "Registered!");
    setIsAuthorized(true);
  };

  const logout = async () => {
    try {
      const { data } = await api.logoutUser();
      toast.success(data.message || "Logged out");
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
    } finally {
      setIsAuthorized(false);
      setUser({});
      setSavedJobIds([]);
      navigateTo("/");
    }
  };

  const updateProfile = async (payload) => {
    const { data } = await api.updateProfile(payload);
    setUser(data.user);
    return data;
  };

  const changePassword = async (payload) => {
    const { data } = await api.changePassword(payload);
    return data;
  };

  return {
    isAuthorized,
    authLoading,
    user,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    savedJobIds,
    setSavedJobIds,
    setAuthLoading,
    setIsAuthorized,
    setUser,
  };
};
