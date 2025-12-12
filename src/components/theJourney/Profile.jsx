import { useState, useEffect } from 'react';
import useProfileStore from '../../stores/profileStore';
import useAuthStore from '../../stores/authStore';
import useProgressStore from '../../stores/progressStore';
import Navbar from '../common/Navbar';

export default function Profile() {
  const { profile, isLoading, error, getProfile, updateProfile, updateAvatar, uploadAvatar, points, streak } = useProfileStore();
  const { user } = useAuthStore();
  const { stats, getStats } = useProgressStore();
  
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    username: '',
    password: '',
    gender: '',
    grade_level_id: null,
    class_id: null,
    bio: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      await getStats();
      await getProfile();
    };
    loadData();
  }, [getProfile, getStats]);

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        email: user?.email || '',
        username: user?.username || '',
        password: '',
        gender: profile.gender || '',
        grade_level_id: profile.grade_level_id || null,
        class_id: profile.class_id || null,
        bio: profile.bio || '',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.id, profile?.full_name, profile?.gender, profile?.grade_level_id, profile?.class_id, profile?.bio, user?.email, user?.username]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setUpdateSuccess(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setUpdateSuccess(false);

    const updateData = {
      full_name: formData.full_name,
      gender: formData.gender,
      bio: formData.bio || '',
    };

    if (formData.grade_level_id !== null) {
      updateData.grade_level_id = formData.grade_level_id;
    }
    if (formData.class_id !== null) {
      updateData.class_id = formData.class_id;
    }

    const result = await updateProfile(updateData);
    
    if (result.success) {
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);
    }
  };

  const handleProfilePictureChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      return;
    }

    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);

      const result = await uploadAvatar(file);
      
      if (result.success) {
        setUpdateSuccess(true);
        setAvatarPreview(null);
        setTimeout(() => setUpdateSuccess(false), 3000);
      }
      
      e.target.value = '';
    } catch (error) {
      console.error('Avatar upload error:', error);
      setAvatarPreview(null);
    }
  };

  const handleRemoveAvatar = async () => {
    const result = await updateAvatar('');
    
    if (result.success) {
      setUpdateSuccess(true);
      setAvatarPreview(null);
      setTimeout(() => setUpdateSuccess(false), 3000);
    }
  };

  if (isLoading && !profile) {
    return (
      <div className="w-screen h-screen bg-gradient-to-r from-[#020c02] to-[#041d05] flex items-center justify-center">
        <div className="text-[#aaaaaa] font-['ZT_Nature'] text-lg">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="w-screen min-h-screen bg-gradient-to-r from-[#020c02] to-[#041d05] relative overflow-x-hidden overflow-y-auto">
      <Navbar stats={stats} activePage="profile" />

      <div className="flex flex-col items-center px-8 md:px-16 lg:px-20 py-8">
        <div className="w-full max-w-[896px] rounded-[16px] border border-[#aaaaaa] bg-[rgba(170,170,170,0.05)] p-8 relative">
          <div className="flex flex-col items-center mb-8">
            <div className="relative mb-4">
              <div className="w-[80px] h-[80px] bg-[rgba(238,238,238,0.1)] rounded-full flex items-center justify-center overflow-hidden relative">
                {isLoading && (
                  <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center z-10">
                    <div className="w-6 h-6 border-2 border-[#1fb622] border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
                {avatarPreview ? (
                  <img 
                    src={avatarPreview} 
                    alt="Profile Preview" 
                    className="w-full h-full object-cover"
                  />
                ) : profile?.avatar_url ? (
                  <img 
                    src={profile.avatar_url} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-[32px] h-[32px] bg-cover bg-center bg-no-repeat"
                    style={{backgroundImage: 'url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-12-12/U0jqWukkRS.png)'}}
                  ></div>
                )}
              </div>
              <label 
                htmlFor="profile-picture"
                className={`absolute bottom-0 right-0 w-[25px] h-[25px] bg-[rgba(31,182,34,0.8)] rounded-full flex items-center justify-center transition-colors ${
                  isLoading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-[rgba(31,182,34,1)]'
                }`}
              >
                {isLoading ? (
                  <div className="w-[13px] h-[13px] border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <svg className="w-[13px] h-[13px] text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                )}
                <input
                  id="profile-picture"
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePictureChange}
                  disabled={isLoading}
                  className="hidden"
                />
              </label>
            </div>
            <div className="flex items-center gap-4 flex-wrap">
              <span className="font-['ZT_Nature'] text-base font-medium text-white">Profile Picture</span>
              {profile?.avatar_url && (
                <button
                  type="button"
                  onClick={handleRemoveAvatar}
                  disabled={isLoading}
                  className="px-3 py-1 rounded-lg border border-red-500/50 text-red-400 hover:bg-red-500/10 transition-colors text-sm font-['ZT_Nature'] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Remove
                </button>
              )}
            </div>
          </div>

          {/* Stats Section - Points and Streak */}
          {(points || streak) && (
            <div className="mb-8 p-6 bg-[rgba(170,170,170,0.05)] rounded-[16px] border border-[#aaaaaa]">
              <h3 className="font-['ZT_Nature'] text-xl font-medium text-white mb-4">Statistics</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Points */}
                {points && (
                  <div className="p-4 bg-[rgba(31,182,34,0.1)] rounded-[12px] border border-[#1fb622]/30">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 bg-cover bg-center bg-no-repeat" style={{backgroundImage: 'url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-12-09/o5MNk0rnUL.png)'}}></div>
                      <span className="font-['ZT_Nature'] text-base font-medium text-white">Points</span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="font-['ZT_Nature'] text-sm text-[#aaaaaa]">Total</span>
                        <span className="font-['ZT_Nature'] text-base font-medium text-white">
                          {new Intl.NumberFormat('id-ID').format(points.total || 0)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-['ZT_Nature'] text-sm text-[#aaaaaa]">Weekly</span>
                        <span className="font-['ZT_Nature'] text-base font-medium text-white">
                          {new Intl.NumberFormat('id-ID').format(points.weekly || 0)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-['ZT_Nature'] text-sm text-[#aaaaaa]">Monthly</span>
                        <span className="font-['ZT_Nature'] text-base font-medium text-white">
                          {new Intl.NumberFormat('id-ID').format(points.monthly || 0)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Streak */}
                {streak && (
                  <div className="p-4 bg-[rgba(244,123,32,0.1)] rounded-[12px] border border-[#f47b20]/30">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">≡ƒöÑ</span>
                      <span className="font-['ZT_Nature'] text-base font-medium text-white">Streak</span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="font-['ZT_Nature'] text-sm text-[#aaaaaa]">Current</span>
                        <span className="font-['ZT_Nature'] text-base font-medium text-white">
                          {streak.current || 0} days
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-['ZT_Nature'] text-sm text-[#aaaaaa]">Longest</span>
                        <span className="font-['ZT_Nature'] text-base font-medium text-white">
                          {streak.longest || 0} days
                        </span>
                      </div>
                      {streak.last_active_date && (
                        <div className="flex justify-between items-center">
                          <span className="font-['ZT_Nature'] text-sm text-[#aaaaaa]">Last Active</span>
                          <span className="font-['ZT_Nature'] text-xs text-white/70">
                            {new Date(streak.last_active_date).toLocaleDateString('id-ID')}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSave}>
            {/* Full Name and Email Row */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <label className="block font-['ZT_Nature'] text-base font-medium text-white mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => handleInputChange('full_name', e.target.value)}
                  className="w-full h-[40px] rounded-[12px] border border-[#aaaaaa] bg-[rgba(170,170,170,0.05)] px-4 font-['ZT_Nature'] text-base text-white placeholder:text-[#aaaaaa] focus:outline-none focus:border-[#1fb622] transition-colors"
                  placeholder="Enter your full name"
                />
              </div>
              <div className="flex-1">
                <label className="block font-['ZT_Nature'] text-base font-medium text-white mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  disabled
                  className="w-full h-[40px] rounded-[12px] border border-[#aaaaaa] bg-[rgba(170,170,170,0.1)] px-4 font-['ZT_Nature'] text-base text-[#aaaaaa] cursor-not-allowed"
                />
              </div>
            </div>

            {/* Username and Password Row */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <label className="block font-['ZT_Nature'] text-base font-medium text-white mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={formData.username}
                  disabled
                  className="w-full h-[40px] rounded-[12px] border border-[#aaaaaa] bg-[rgba(170,170,170,0.1)] px-4 font-['ZT_Nature'] text-base text-[#aaaaaa] cursor-not-allowed"
                />
              </div>
              <div className="flex-1">
                <label className="block font-['ZT_Nature'] text-base font-medium text-white mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="w-full h-[40px] rounded-[12px] border border-[#aaaaaa] bg-[rgba(170,170,170,0.05)] px-4 font-['ZT_Nature'] text-base text-white placeholder:text-[#aaaaaa] focus:outline-none focus:border-[#1fb622] transition-colors"
                    placeholder="Leave empty to keep current"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#aaaaaa] hover:text-white transition-colors"
                  >
                    {showPassword ? '≡ƒæü∩╕Å' : '≡ƒæü∩╕ÅΓÇì≡ƒù¿∩╕Å'}
                  </button>
                </div>
              </div>
            </div>

            {/* Gender and School Level Row */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <label className="block font-['ZT_Nature'] text-base font-medium text-white mb-2">
                  Gender
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  className="w-full h-[40px] rounded-[12px] border border-[#aaaaaa] bg-[rgba(170,170,170,0.05)] px-4 font-['ZT_Nature'] text-base text-white focus:outline-none focus:border-[#1fb622] transition-colors"
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="block font-['ZT_Nature'] text-base font-medium text-white mb-2">
                  School Level
                </label>
                <select
                  value={formData.class_id || ''}
                  onChange={(e) => {
                    const classId = e.target.value ? parseInt(e.target.value) : null;
                    handleInputChange('class_id', classId);
                    if (classId !== formData.class_id) {
                      handleInputChange('grade_level_id', null);
                    }
                  }}
                  className="w-full h-[40px] rounded-[12px] border border-[#aaaaaa] bg-[rgba(170,170,170,0.05)] px-4 font-['ZT_Nature'] text-base text-white focus:outline-none focus:border-[#1fb622] transition-colors"
                >
                  <option value="">Select school level</option>
                  <option value="1">Elementary School (SD)</option>
                  <option value="2">Middle School (SMP)</option>
                  <option value="3">High School (SMA)</option>
                </select>
              </div>
            </div>

            {/* Grade Level Row */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <label className="block font-['ZT_Nature'] text-base font-medium text-white mb-2">
                  Grade
                </label>
                {!formData.class_id ? (
                  <div className="w-full h-[40px] rounded-[12px] border border-[#aaaaaa] bg-[rgba(170,170,170,0.1)] px-4 flex items-center">
                    <span className="font-['ZT_Nature'] text-base text-[#aaaaaa]">Please select school level first</span>
                  </div>
                ) : (
                  <div className="flex gap-3 flex-wrap">
                    {(formData.class_id === 1 ? [1, 2, 3, 4, 5, 6] : [1, 2, 3]).map((grade) => (
                      <button
                        key={grade}
                        type="button"
                        onClick={() => handleInputChange('grade_level_id', grade)}
                        className={`w-16 h-12 rounded-[16px] border-2 flex justify-center items-center transition-all ${
                          formData.grade_level_id === grade
                            ? 'border-[#1fb622] border-4 bg-[rgba(31,182,34,0.15)]'
                            : 'border-[#aaaaaa] bg-[rgba(170,170,170,0.05)] hover:border-[#1fb622] hover:bg-[rgba(31,182,34,0.1)]'
                        }`}
                      >
                        <span className={`font-['ZT_Nature'] text-lg font-medium ${
                          formData.grade_level_id === grade ? 'text-white' : 'text-[#eeeeee]'
                        }`}>
                          {grade}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex-1">
                <label className="block font-['ZT_Nature'] text-base font-medium text-white mb-2">
                  Bio
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  rows={3}
                  className="w-full rounded-[12px] border border-[#aaaaaa] bg-[rgba(170,170,170,0.05)] px-4 py-2 font-['ZT_Nature'] text-base text-white placeholder:text-[#aaaaaa] focus:outline-none focus:border-[#1fb622] transition-colors resize-none"
                  placeholder="Tell us about yourself..."
                />
              </div>
            </div>

            {/* Error and Success Messages */}
            {updateSuccess && (
              <div className="mb-4 p-3 bg-green-500/20 border border-green-500 rounded-lg">
                <p className="font-['ZT_Nature'] text-sm text-green-400">Profile updated successfully!</p>
              </div>
            )}
            {error && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg">
                <p className="font-['ZT_Nature'] text-sm text-red-400">{error}</p>
              </div>
            )}

            {/* Save Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className="px-8 py-4 bg-gradient-to-b from-[#ee2724] to-[#f15a45] rounded-[24px] shadow-[0_-2px_4px_0_rgba(255,255,255,0.5)_inset] hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="font-['ZT_Nature'] text-base font-medium text-[#eeeeee]">
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
