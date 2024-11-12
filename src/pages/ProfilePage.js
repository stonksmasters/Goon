// src/pages/ProfilePage.js
import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useWallet } from '@solana/wallet-adapter-react';

/**
 * ProfilePage component that displays and allows editing of the user's profile.
 * It fetches user data from the backend and provides a form to update profile details.
 */
const ProfilePage = () => {
  const { user, login } = useAuth(); // Access user and login functions from AuthContext
  const { publicKey } = useWallet(); // Access wallet's public key
  const [profileData, setProfileData] = useState({
    username: '',
    bio: '',
    avatar: '',
  }); // Holds the user's profile data
  const [loading, setLoading] = useState(true); // Indicates if data is being loaded
  const [error, setError] = useState(null); // Holds any error that occurs during fetching
  const [success, setSuccess] = useState(null); // Indicates successful profile update

  /**
   * Fetch user profile data from the backend API.
   */
  const fetchProfileData = async () => {
    if (!publicKey) {
      setError('Wallet not connected.');
      setLoading(false);
      return;
    }
    try {
      const response = await API.get(`/profile/${publicKey.toBase58()}`); // Replace with your actual endpoint
      setProfileData({
        username: response.data.username,
        bio: response.data.bio,
        avatar: response.data.avatar,
      });
      setLoading(false);
    } catch (err) {
      console.error('Error fetching profile data:', err);
      setError('Failed to load profile data.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [publicKey]); // Re-fetch if publicKey changes

  /**
   * Handle input changes in the profile form.
   *
   * @param {object} e - The event object.
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  /**
   * Handle form submission to update profile data.
   *
   * @param {object} e - The event object.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const response = await API.put(`/profile/${publicKey.toBase58()}`, profileData); // Replace with your actual endpoint
      setSuccess('Profile updated successfully.');
      // Optionally, update AuthContext if username changed
      if (response.data.username) {
        login(user.id, response.data.username, user.signature);
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile.');
    }
  };

  if (loading) {
    return (
      <div className="mt-20 text-center">
        <p className="text-lg text-gray-700">Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-20 text-center">
        <p className="text-lg text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="mt-20 p-8">
      <h1 className="text-3xl font-bold text-center text-goonsBlue">Profile</h1>

      <div className="mt-8 max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
        {/* Success Message */}
        {success && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
            {success}
          </div>
        )}
        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              name="username"
              id="username"
              value={profileData.username}
              onChange={handleChange}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-goonsGreen"
            />
          </div>

          {/* Bio */}
          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
              Bio
            </label>
            <textarea
              name="bio"
              id="bio"
              rows="4"
              value={profileData.bio}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-goonsGreen"
              placeholder="Tell us about yourself..."
            ></textarea>
          </div>

          {/* Avatar URL */}
          <div>
            <label htmlFor="avatar" className="block text-sm font-medium text-gray-700">
              Avatar URL
            </label>
            <input
              type="url"
              name="avatar"
              id="avatar"
              value={profileData.avatar}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-goonsGreen"
              placeholder="https://example.com/avatar.jpg"
            />
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-goonsGreen text-white rounded hover:bg-green-600 transition-colors duration-200"
            >
              Update Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
