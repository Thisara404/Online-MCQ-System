import React from 'react';
import ResultView from '../components/ResultView';

const Result = ({ user }) => {
  return (
    <div>
      <ResultView user={user} />
    </div>
  );
};

export default Result;