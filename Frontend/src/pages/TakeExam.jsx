import React from 'react';
import { useParams } from 'react-router-dom';
import MCQTest from '../components/MCQTest';

const TakeExam = ({ user }) => {
  const { id } = useParams();

  return (
    <div>
      <MCQTest user={user} />
    </div>
  );
};

export default TakeExam;