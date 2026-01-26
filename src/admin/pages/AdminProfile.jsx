import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { FiEdit2, FiSave, FiX, FiEye, FiEyeOff, FiLogOut } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { getProfile, updateProfile, changePassword } from "../../api/profile.api";
import { useNavigate } from "react-router-dom";

export default function AdminProfile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
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
      console.log("[ADMIN PROFILE] Profile loaded:", res.data);
      setProfileData({
        fullName: res.data.fullName || "",
        email: res.data.email || "",
        phoneNumber: res.data.phoneNumber || "",
      });
    } catch (err) {
      console.error("[ADMIN PROFILE] Failed to load profile:", err);
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
      console.log("[ADMIN PROFILE] Updating profile...");
      await updateProfile(profileData);
      toast.success("Profile updated successfully!");
      setEditing(false);
    } catch (err) {
      console.error("[ADMIN PROFILE] Failed to update:", err);
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

    console.log("[ADMIN PROFILE] Password data:", {
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
      console.log("[ADMIN PROFILE] Changing password with:", {
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      });
      
      await changePassword(passwordData.oldPassword, passwordData.newPassword);
      console.log("[ADMIN PROFILE] Password changed successfully");
      
      toast.success("Password changed successfully! Please login again.");
      setShowChangePassword(false);
      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setTimeout(() => {
        logout();
        navigate("/");
      }, 2000);
    } catch (err) {
      console.error("[ADMIN PROFILE] Failed to change password:", err);
      console.error("[ADMIN PROFILE] Error response:", err.response);
      
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

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      logout();
      navigate("/");
      toast.success("Logged out successfully");
    }
  };

  if (loading && !profileData.fullName) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white/60">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ================= HEADER CARD ================= */}
      <div className="bg-gradient-to-r from-primary/20 to-primary/5 border border-primary/30 rounded-2xl p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Admin Profile
            </h1>
            <div className="flex gap-4">
              <div>
                <p className="text-sm text-white/60">Name</p>
                <p className="text-lg font-semibold text-white">
                  {profileData.fullName}
                </p>
              </div>
              <div>
                <p className="text-sm text-white/60">Email</p>
                <p className="text-lg font-semibold text-white">
                  {profileData.email}
                </p>
              </div>
              <div>
                <p className="text-sm text-white/60">Role</p>
                <p className="text-lg font-semibold text-primary">
                  {user?.role || "ADMIN"}
                </p>
              </div>
            </div>
          </div>
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary hover:bg-primary/90 transition font-semibold"
            >
              <FiEdit2 size={18} />
              Edit Profile
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ================= PROFILE FORM ================= */}
        <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
          <h2 className="text-xl font-bold text-white mb-6">Personal Information</h2>

          <div className="space-y-6">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-semibold text-white/80 mb-3">
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
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:border-primary focus:outline-none transition disabled:opacity-50"
                  placeholder="Enter your full name"
                />
              ) : (
                <div className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white">
                  {profileData.fullName}
                </div>
              )}
            </div>

            {/* Email (Read-only) */}
            <div>
              <label className="block text-sm font-semibold text-white/80 mb-3">
                Email Address
              </label>
              <div className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white/60">
                {profileData.email}
                <span className="text-xs text-white/40 ml-2">(Cannot be changed)</span>
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-semibold text-white/80 mb-3">
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
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:border-primary focus:outline-none transition disabled:opacity-50"
                  placeholder="Enter your phone number"
                />
              ) : (
                <div className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white">
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
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary hover:bg-primary/90 transition font-semibold disabled:opacity-50"
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
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition font-semibold disabled:opacity-50"
                >
                  <FiX size={18} />
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ================= SECURITY & ACTIONS ================= */}
        <div className="space-y-6">
          {/* Change Password */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
            <h3 className="text-lg font-bold text-white mb-4">Security</h3>

            {!showChangePassword ? (
              <button
                onClick={() => setShowChangePassword(true)}
                className="w-full px-6 py-3 rounded-xl bg-yellow-500/20 border border-yellow-500/30 text-yellow-200 hover:bg-yellow-500/30 transition font-semibold"
              >
                Change Password
              </button>
            ) : (
              <div className="space-y-4 bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-4 -m-4">
                {/* Old Password */}
                <div>
                  <label className="block text-xs font-semibold text-white/70 mb-2">
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
                      className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:border-primary focus:outline-none transition disabled:opacity-50 pr-8 text-sm"
                      placeholder="Current password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-white/60 hover:text-white text-sm"
                    >
                      {showPassword ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-xs font-semibold text-white/70 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, newPassword: e.target.value })
                    }
                    disabled={loading}
                    className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:border-primary focus:outline-none transition disabled:opacity-50 text-sm"
                    placeholder="New password"
                  />
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-xs font-semibold text-white/70 mb-2">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                    }
                    disabled={loading}
                    className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:border-primary focus:outline-none transition disabled:opacity-50 text-sm"
                    placeholder="Confirm password"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={handleChangePassword}
                    disabled={loading}
                    className="flex-1 px-4 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-600 transition font-semibold disabled:opacity-50 text-black text-sm"
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
                    className="flex-1 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition font-semibold disabled:opacity-50 text-sm"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Logout */}
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 backdrop-blur-sm">
            <h3 className="text-lg font-bold text-red-200 mb-4">Session</h3>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-200 transition font-semibold"
            >
              <FiLogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
