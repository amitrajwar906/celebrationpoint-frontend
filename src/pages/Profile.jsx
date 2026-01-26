import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { FiEdit2, FiSave, FiX, FiEye, FiEyeOff, FiUser, FiMail, FiPhone, FiLock } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { getProfile, updateProfile, changePassword } from "../api/profile.api";

export default function Profile() {
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);

  const [profileData, setProfileData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Load profile
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const res = await getProfile();
      console.log("[PROFILE] Profile loaded:", res.data);
      setProfileData({
        fullName: res.data.fullName || "",
        email: res.data.email || "",
        phoneNumber: res.data.phoneNumber || "",
      });
    } catch (err) {
      console.error("[PROFILE] Failed to load profile:", err);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    if (!profileData.fullName.trim()) {
      toast.error("Full name is required");
      return;
    }

    try {
      setLoading(true);
      console.log("[PROFILE] Updating profile...");
      await updateProfile(profileData);
      toast.success("Profile updated successfully!");
      setEditing(false);
    } catch (err) {
      console.error("[PROFILE] Failed to update:", err);
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    // Validation
    if (!passwordData.oldPassword) {
      toast.error("Current password is required");
      return;
    }

    if (!passwordData.newPassword) {
      toast.error("New password is required");
      return;
    }

    if (!passwordData.confirmPassword) {
      toast.error("Please confirm your new password");
      return;
    }

    console.log("[PROFILE] Password data:", {
      oldPasswordLength: passwordData.oldPassword.length,
      newPasswordLength: passwordData.newPassword.length,
      confirmPasswordLength: passwordData.confirmPassword.length,
      match: passwordData.newPassword === passwordData.confirmPassword,
    });

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);
      console.log("[PROFILE] Changing password with:", {
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      });
      
      await changePassword(passwordData.oldPassword, passwordData.newPassword);
      console.log("[PROFILE] Password changed successfully");
      
      toast.success("Password changed successfully!");
      setShowChangePassword(false);
      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      logout();
    } catch (err) {
      console.error("[PROFILE] Failed to change password:", err);
      console.error("[PROFILE] Error response:", err.response);
      
      let errorMsg = "Failed to change password";
      if (err.response?.data?.error) {
        errorMsg = err.response.data.error;
      } else if (err.response?.data?.message) {
        errorMsg = err.response.data.message;
      }
      
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !profileData.fullName) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        theme === "light" ? "bg-white" : "bg-gradient-to-br from-[#0a0e1a] via-[#0f1428] to-[#1a1f3a]"
      }`}>
        <div className={theme === "light" ? "text-gray-600" : "text-white/60"}>Loading profile...</div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen pt-20 pb-20 ${
      theme === "light"
        ? "bg-white"
        : "bg-gradient-to-br from-[#0a0e1a] via-[#0f1428] to-[#1a1f3a]"
    }`}>
      <div className="max-w-4xl mx-auto px-4 md:px-0">
        {/* ================= PREMIUM HEADER CARD ================= */}
        <div className="relative overflow-hidden rounded-3xl mb-10">
          {/* Gradient background */}
          <div className={`absolute inset-0 ${
            theme === "light"
              ? "bg-gradient-to-r from-blue-100 via-blue-50 to-transparent opacity-50"
              : "bg-gradient-to-r from-primary/30 via-primary/10 to-transparent opacity-50"
          }`}></div>
          <div className={`absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl ${
            theme === "light"
              ? "bg-blue-200/30"
              : "bg-primary/20"
          }`}></div>
          <div className={`absolute -bottom-20 -left-20 w-60 h-60 rounded-full blur-3xl ${
            theme === "light"
              ? "bg-blue-100/30"
              : "bg-blue-500/10"
          }`}></div>
          
          {/* Content */}
          <div className={`relative backdrop-blur-xl p-8 md:p-12 ${
            theme === "light"
              ? "bg-white/80 border border-gray-200"
              : "bg-white/5 border border-white/10"
          }`}>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-start gap-6">
                {/* Avatar */}
                <div className={`w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0 border-2 ${
                  theme === "light"
                    ? "bg-blue-100 border-blue-300"
                    : "bg-gradient-to-br from-primary/40 to-primary/20 border-primary/30"
                }`}>
                  <FiUser size={40} className={theme === "light" ? "text-blue-600" : "text-primary"} />
                </div>
                
                {/* Info */}
                <div className="flex-1">
                  <h1 className={`text-3xl md:text-4xl font-bold mb-2 ${
                    theme === "light"
                      ? "text-black"
                      : "bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent"
                  }`}>
                    {profileData.fullName || "User Profile"}
                  </h1>
                  <p className={`flex items-center gap-2 ${
                    theme === "light" ? "text-gray-600" : "text-white/60"
                  }`}>
                    <FiMail size={16} />
                    {profileData.email}
                  </p>
                </div>
              </div>
              
              {!editing && (
                <button
                  onClick={() => setEditing(true)}
                  className="px-8 py-4 rounded-2xl bg-gradient-to-r from-primary to-primary/80 hover:shadow-glow hover:shadow-primary/30 transition font-semibold flex items-center gap-3 whitespace-nowrap"
                >
                  <FiEdit2 size={20} />
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ================= MAIN PROFILE FORM ================= */}
          <div className="lg:col-span-2">
            <div className="relative overflow-hidden rounded-3xl">
              <div className={`absolute inset-0 opacity-30 ${
                theme === "light"
                  ? "bg-gradient-to-br from-blue-50 to-blue-100"
                  : "bg-gradient-to-br from-white/10 to-white/5"
              }`}></div>
              <div className={`relative backdrop-blur-xl p-8 ${
                theme === "light"
                  ? "bg-white/80 border border-gray-200"
                  : "bg-white/5 border border-white/10"
              }`}>
                <div className="flex items-center gap-3 mb-8">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    theme === "light"
                      ? "bg-blue-200"
                      : "bg-primary/20"
                  }`}>
                    <FiUser className={theme === "light" ? "text-blue-600" : "text-primary"} size={20} />
                  </div>
                  <h2 className={`text-2xl font-bold ${
                    theme === "light" ? "text-black" : "text-white"
                  }`}>Personal Information</h2>
                </div>

                <div className="space-y-6">
                  {/* Full Name */}
                  <div className="group">
                    <label className={`block text-sm font-semibold mb-3 ${
                      theme === "light" ? "text-black" : "text-white/80"
                    }`}>
                      Full Name
                    </label>
                    {editing ? (
                      <input
                        type="text"
                        value={profileData.fullName}
                        onChange={(e) =>
                          setProfileData({ ...profileData, fullName: e.target.value })
                        }
                        disabled={loading}
                        className={`w-full px-4 py-3 rounded-xl border transition focus:outline-none disabled:opacity-50 ${
                          theme === "light"
                            ? "bg-white border-gray-300 text-black placeholder-gray-500 focus:border-blue-600 focus:bg-white"
                            : "bg-white/10 border-white/20 text-white placeholder-white/40 focus:border-primary focus:bg-white/15"
                        }`}
                        placeholder="Enter your full name"
                      />
                    ) : (
                      <div className={`px-4 py-3 rounded-xl border group-hover:border-opacity-100 transition ${
                        theme === "light"
                          ? "bg-gray-50 border-gray-200 text-black"
                          : "bg-white/5 border-white/10 text-white"
                      }`}>
                        {profileData.fullName}
                      </div>
                    )}
                  </div>

                  {/* Email (Read-only) */}
                  <div className="group">
                    <label className={`block text-sm font-semibold mb-3 ${
                      theme === "light" ? "text-black" : "text-white/80"
                    }`}>
                      Email Address
                    </label>
                    <div className={`px-4 py-3 rounded-xl flex items-center gap-2 border group-hover:border-opacity-100 transition ${
                      theme === "light"
                        ? "bg-gray-50 border-gray-200 text-gray-700"
                        : "bg-white/5 border-white/10 text-white/70"
                    }`}>
                      <FiMail size={18} />
                      <span className="flex-1">{profileData.email}</span>
                      <span className={`text-xs ${
                        theme === "light" ? "text-gray-500" : "text-white/40"
                      }`}>(Read-only)</span>
                    </div>
                  </div>

                  {/* Phone Number */}
                  <div className="group">
                    <label className={`block text-sm font-semibold mb-3 ${
                      theme === "light" ? "text-black" : "text-white/80"
                    }`}>
                      Phone Number
                    </label>
                    {editing ? (
                      <input
                        type="tel"
                        value={profileData.phoneNumber}
                        onChange={(e) =>
                          setProfileData({ ...profileData, phoneNumber: e.target.value })
                        }
                        disabled={loading}
                        className={`w-full px-4 py-3 rounded-xl border transition focus:outline-none disabled:opacity-50 ${
                          theme === "light"
                            ? "bg-white border-gray-300 text-black placeholder-gray-500 focus:border-blue-600 focus:bg-white"
                            : "bg-white/10 border-white/20 text-white placeholder-white/40 focus:border-primary focus:bg-white/15"
                        }`}
                        placeholder="Enter your phone number"
                      />
                    ) : (
                      <div className={`px-4 py-3 rounded-xl flex items-center gap-2 border group-hover:border-opacity-100 transition ${
                        theme === "light"
                          ? "bg-gray-50 border-gray-200 text-black"
                          : "bg-white/5 border-white/10 text-white"
                      }`}>
                        <FiPhone size={18} />
                        {profileData.phoneNumber || "Not provided"}
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  {editing && (
                    <div className="flex gap-4 pt-4">
                      <button
                        onClick={handleUpdateProfile}
                        disabled={loading}
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-primary/80 hover:shadow-lg hover:shadow-primary/30 transition font-semibold disabled:opacity-50 text-black"
                      >
                        <FiSave size={18} />
                        {loading ? "Saving..." : "Save Changes"}
                      </button>
                      <button
                        onClick={() => {
                          setEditing(false);
                          loadProfile();
                        }}
                        disabled={loading}
                        className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl transition font-semibold disabled:opacity-50 ${
                          theme === "light"
                            ? "bg-gray-200 hover:bg-gray-300 text-black"
                            : "bg-white/10 hover:bg-white/15 text-white"
                        }`}
                      >
                        <FiX size={18} />
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ================= SECURITY SIDEBAR ================= */}
          <div className="relative overflow-hidden rounded-3xl h-fit">
            <div className={`absolute inset-0 opacity-30 ${
              theme === "light"
                ? "bg-gradient-to-br from-amber-100 to-orange-100"
                : "bg-gradient-to-br from-yellow-500/10 to-orange-500/5"
            }`}></div>
            <div className={`relative backdrop-blur-xl p-8 ${
              theme === "light"
                ? "bg-white/80 border border-gray-200"
                : "bg-white/5 border border-white/10"
            }`}>
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  theme === "light"
                    ? "bg-amber-200"
                    : "bg-yellow-500/20"
                }`}>
                  <FiLock className={theme === "light" ? "text-amber-700" : "text-yellow-200"} size={20} />
                </div>
                <h2 className={`text-xl font-bold ${
                  theme === "light" ? "text-black" : "text-white"
                }`}>Security</h2>
              </div>

              {!showChangePassword ? (
                <button
                  onClick={() => setShowChangePassword(true)}
                  className={`w-full px-6 py-3 rounded-xl border transition font-semibold ${
                    theme === "light"
                      ? "bg-amber-100 border-amber-300 text-amber-700 hover:bg-amber-200"
                      : "bg-gradient-to-r from-yellow-500/30 to-orange-500/20 border border-yellow-500/30 text-yellow-200 hover:from-yellow-500/40 hover:to-orange-500/30"
                  }`}
                >
                  Change Password
                </button>
              ) : (
                <div className="space-y-4">
                  {/* Old Password */}
                  <div>
                    <label className={`block text-sm font-semibold mb-2 ${
                      theme === "light" ? "text-black" : "text-white/80"
                    }`}>
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={passwordData.oldPassword}
                        onChange={(e) =>
                          setPasswordData({ ...passwordData, oldPassword: e.target.value })
                        }
                        disabled={loading}
                        className={`w-full px-4 py-2 rounded-lg border transition disabled:opacity-50 pr-10 focus:outline-none ${
                          theme === "light"
                            ? "bg-white border-gray-300 text-black placeholder-gray-500 focus:border-blue-600"
                            : "bg-white/10 border-white/20 text-white placeholder-white/40 focus:border-yellow-500"
                        }`}
                        placeholder="Current password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className={`absolute right-3 top-1/2 -translate-y-1/2 ${
                          theme === "light"
                            ? "text-gray-600 hover:text-black"
                            : "text-white/60 hover:text-white"
                        }`}
                      >
                        {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* New Password */}
                  <div>
                    <label className={`block text-sm font-semibold mb-2 ${
                      theme === "light" ? "text-black" : "text-white/80"
                    }`}>
                      New Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) =>
                        setPasswordData({ ...passwordData, newPassword: e.target.value })
                      }
                      disabled={loading}
                      className={`w-full px-4 py-2 rounded-lg border transition disabled:opacity-50 focus:outline-none ${
                        theme === "light"
                          ? "bg-white border-gray-300 text-black placeholder-gray-500 focus:border-blue-600"
                          : "bg-white/10 border-white/20 text-white placeholder-white/40 focus:border-yellow-500"
                      }`}
                      placeholder="New password"
                    />
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className={`block text-sm font-semibold mb-2 ${
                      theme === "light" ? "text-black" : "text-white/80"
                    }`}>
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) =>
                        setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                      }
                      disabled={loading}
                      className={`w-full px-4 py-2 rounded-lg border transition disabled:opacity-50 focus:outline-none ${
                        theme === "light"
                          ? "bg-white border-gray-300 text-black placeholder-gray-500 focus:border-blue-600"
                          : "bg-white/10 border-white/20 text-white placeholder-white/40 focus:border-yellow-500"
                      }`}
                      placeholder="Confirm password"
                    />
                  </div>

                  <p className="text-xs text-white/40">Minimum 6 characters</p>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-3 pt-2">
                    <button
                      onClick={handleChangePassword}
                      disabled={loading}
                      className={`w-full px-4 py-2 rounded-lg transition font-semibold disabled:opacity-50 ${
                        theme === "light"
                          ? "bg-amber-500 hover:bg-amber-600 text-white hover:shadow-lg hover:shadow-amber-500/30"
                          : "bg-gradient-to-r from-yellow-500 to-orange-500 hover:shadow-lg hover:shadow-yellow-500/30 text-black"
                      }`}
                    >
                      {loading ? "Updating..." : "Update"}
                    </button>
                    <button
                      onClick={() => {
                        setShowChangePassword(false);
                        setPasswordData({
                          oldPassword: "",
                          newPassword: "",
                          confirmPassword: "",
                        });
                      }}
                      disabled={loading}
                      className={`w-full px-4 py-2 rounded-lg transition font-semibold disabled:opacity-50 ${
                        theme === "light"
                          ? "bg-gray-200 hover:bg-gray-300 text-black"
                          : "bg-white/10 hover:bg-white/15 text-white"
                      }`}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
