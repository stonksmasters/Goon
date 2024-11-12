// src/components/Council/ProposalForm.jsx
import React, { useState } from 'react';
import axios from 'axios';

const ProposalForm = ({ onNewProposal }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const proposal = { title, description };
    try {
      const response = await axios.post('/api/council', proposal);
      onNewProposal(response.data);
      setTitle('');
      setDescription('');
    } catch (error) {
      console.error('Error submitting proposal:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 p-4 border border-gray-300 rounded">
      <div className="mb-2">
        <label className="block text-gray-700">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full border border-gray-300 p-2 rounded"
        />
      </div>
      <div className="mb-2">
        <label className="block text-gray-700">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="w-full border border-gray-300 p-2 rounded"
        ></textarea>
      </div>
      <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded">
        Submit Proposal
      </button>
    </form>
  );
};

export default ProposalForm;
