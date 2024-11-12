// src/components/Council/CouncilDashboard.jsx
import React, { useEffect, useState } from 'react';
import ProposalList from './ProposalList';
import ProposalForm from './ProposalForm';
import axios from 'axios';

const CouncilDashboard = () => {
  const [proposals, setProposals] = useState([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    // Fetch proposals from backend
    axios.get('/api/council').then((response) => {
      setProposals(response.data);
    });
  }, []);

  const handleNewProposal = (newProposal) => {
    setProposals([...proposals, newProposal]);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Goon Council</h1>
      <button
        onClick={() => setShowForm(!showForm)}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        {showForm ? 'Close' : 'Create New Proposal'}
      </button>
      {showForm && <ProposalForm onNewProposal={handleNewProposal} />}
      <ProposalList proposals={proposals} />
    </div>
  );
};

export default CouncilDashboard;
