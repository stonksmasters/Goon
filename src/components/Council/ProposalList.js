// src/components/Council/ProposalList.jsx
import React from 'react';
import axios from 'axios';

const ProposalList = ({ proposals }) => {
  const handleVote = async (proposalId, voteType) => {
    try {
      await axios.post(`/api/council/${proposalId}/vote`, { voteType });
      // Optionally, refresh proposals or update state
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  return (
    <div className="mt-6">
      {proposals.map((proposal) => (
        <div key={proposal.id} className="p-4 border border-gray-300 rounded mb-4">
          <h2 className="text-xl font-semibold">{proposal.title}</h2>
          <p className="mt-2">{proposal.description}</p>
          <div className="mt-4 flex space-x-2">
            <button
              onClick={() => handleVote(proposal.id, 'yes')}
              className="px-3 py-1 bg-green-500 text-white rounded"
            >
              Yes
            </button>
            <button
              onClick={() => handleVote(proposal.id, 'no')}
              className="px-3 py-1 bg-red-500 text-white rounded"
            >
              No
            </button>
          </div>
          <div className="mt-2 text-sm text-gray-600">
            Votes: Yes ({proposal.votesYes}) | No ({proposal.votesNo})
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProposalList;
