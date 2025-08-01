import React from 'react';

export default function DraftTimer({ currentStep, draftFinished, draftSteps, timer }) {
  if (currentStep === -1) return null;

  return (
    <>
      <div className="middle-text text-2xl font-bold text-white">
        {draftFinished ? 'Draft Finished' : draftSteps[currentStep]?.type === 'ban' ? 'Ban' : draftSteps[currentStep]?.type === 'pick' ? 'Pick' : 'Ready'}
      </div>
      {!draftFinished && <div id="timer" className="text-lg text-white">{timer}</div>}
    </>
  );
} 