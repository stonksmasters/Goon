// src/components/Feed/Feed.jsx
import React, { useEffect, useState } from 'react';
import PostCard from './PostCard';
import axios from 'axios';
import Loader from '../common/Loader';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch posts from backend
    axios.get('/api/feed').then((response) => {
      setPosts(response.data);
      setLoading(false);
    }).catch((error) => {
      console.error('Error fetching feed:', error);
      setLoading(false);
    });
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Community Feed</h1>
      <div className="mt-6 space-y-4">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default Feed;
