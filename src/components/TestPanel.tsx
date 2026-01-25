import { useState, useEffect } from 'react';
import { luckyBoostStore } from '../lucky-boost/store';
import { useLuckyBoost } from '../lucky-boost/useLuckyBoost';
import { MAX_PROGRESS, MILESTONES, getProgressPercentage } from '../lucky-boost/types';
import { gameStore } from '../game/store';
import { Button } from '../design-system/Button';
import './TestPanel.css';

interface TestPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TestPanel({ isOpen, onClose }: TestPanelProps) {
  const state = useLuckyBoost();
  const [progressValue, setProgressValue] = useState(0);
  const [testSettings, setTestSettings] = useState({
    boostMultiplier: 1.2,
    progressPerPull: 10,
  });

  useEffect(() => {
    if (isOpen) {
      const currentProgress = getProgressPercentage(state.currentProgress);
      setProgressValue(currentProgress);
    }
  }, [isOpen, state.currentProgress]);


  // Lucky Boost State Controls
  const handleSetProgress = (percentage: number) => {
    const progressDollars = (percentage / 100) * MAX_PROGRESS;
    luckyBoostStore.setTestProgress(progressDollars);
  };

  const handleAddUnluckyPulls = (count: number) => {
    // Simulate unlucky pulls (losses)
    for (let i = 0; i < count; i++) {
      const packPrice = 20;
      const cardValue = packPrice * 0.5; // 50% value = loss
      luckyBoostStore.addPackOpen(packPrice, cardValue);
    }
  };

  const handleResetLuckyBoost = () => {
    luckyBoostStore.reset();
  };

  const handleForceNearMiss = () => {
    // Force a high-value loss (near miss)
    const packPrice = 30;
    const cardValue = packPrice * 0.95; // 95% value = near miss
    luckyBoostStore.addPackOpen(packPrice, cardValue);
  };

  // Outcome Simulation
  const handleForceLose = () => {
    const packPrice = 25;
    const cardValue = packPrice * 0.6; // Loss
    gameStore.simulatePackOpen(packPrice, cardValue);
  };

  const handleForceWinCredits = () => {
    const packPrice = 25;
    const cardValue = packPrice * 1.5; // Win
    gameStore.simulatePackOpen(packPrice, cardValue);
  };

  const handleForceGuaranteedCard = () => {
    // Simulate a guaranteed pull win
    const packPrice = 25;
    const cardValue = 100; // High value win
    gameStore.simulatePackOpen(packPrice, cardValue);
  };

  const handleTriggerMilestoneReward = () => {
    // Set progress to just before milestone, then add one more pull
    const targetProgress = MAX_PROGRESS - 5; // $5 away from milestone
    luckyBoostStore.setTestProgress(targetProgress);
    // Use a small delay to ensure state updates, then trigger the pull
    setTimeout(() => {
      const packPrice = 25;
      const cardValue = packPrice * 0.5; // Loss that will cross milestone
      gameStore.simulatePackOpen(packPrice, cardValue);
    }, 100);
  };

  const handleTriggerBoostedPull = () => {
    // Set progress to high, then trigger a win
    luckyBoostStore.setTestProgress(MAX_PROGRESS * 0.9);
    setTimeout(() => {
      handleForceWinCredits();
    }, 100);
  };

  // Telemetry calculations (mocked)
  const estimatedPullsToFill = state.currentProgress > 0 
    ? Math.ceil((MAX_PROGRESS - state.currentProgress) / testSettings.progressPerPull)
    : Math.ceil(MAX_PROGRESS / testSettings.progressPerPull);
  
  const averageUnluckyPulls = Math.ceil(MAX_PROGRESS / testSettings.progressPerPull);
  const boostTriggerFrequency = `${(testSettings.boostMultiplier * 100).toFixed(0)}%`;

  if (!isOpen) return null;

  return (
    <>
      <div className="test-panel">
        <div className="test-panel-header">
          <h2>⚙ Test</h2>
          <button className="test-panel-close" onClick={onClose}>×</button>
        </div>

        <div className="test-panel-content">
          {/* Lucky Boost State */}
          <section className="test-section">
            <h3>Lucky Boost State</h3>
            
            <div className="test-control-group">
              <label>Progress: {progressValue.toFixed(1)}%</label>
              <input
                type="range"
                min="0"
                max="100"
                step="0.1"
                value={progressValue}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setProgressValue(val);
                  handleSetProgress(val);
                }}
                className="test-slider"
              />
            </div>

            <div className="test-button-group">
              <Button size="small" variant="secondary" onClick={() => handleAddUnluckyPulls(1)}>
                +1 Unlucky
              </Button>
              <Button size="small" variant="secondary" onClick={() => handleAddUnluckyPulls(5)}>
                +5 Unlucky
              </Button>
              <Button size="small" variant="secondary" onClick={() => handleAddUnluckyPulls(10)}>
                +10 Unlucky
              </Button>
            </div>

            <div className="test-button-group">
              <Button size="small" variant="secondary" onClick={handleForceNearMiss}>
                Force Near Miss
              </Button>
              <Button size="small" variant="destructive" onClick={handleResetLuckyBoost}>
                Reset
              </Button>
            </div>
          </section>

          {/* Reward & Outcome Simulation */}
          <section className="test-section">
            <h3>Outcome Simulation</h3>
            
            <div className="test-button-group">
              <Button size="small" variant="secondary" onClick={handleForceLose}>
                Force Lose
              </Button>
              <Button size="small" variant="secondary" onClick={handleForceWinCredits}>
                Force Win Credits
              </Button>
            </div>

            <div className="test-button-group">
              <Button size="small" variant="secondary" onClick={handleForceGuaranteedCard}>
                Force Guaranteed Card
              </Button>
            </div>

            <div className="test-button-group">
              <Button size="small" variant="secondary" onClick={handleTriggerMilestoneReward}>
                Trigger Milestone Reward
              </Button>
              <Button size="small" variant="secondary" onClick={handleTriggerBoostedPull}>
                Trigger Boosted Pull
              </Button>
            </div>
          </section>

          {/* Tuning (Simulation Only) */}
          <section className="test-section">
            <h3>Tuning (Simulation Only)</h3>
            
            <div className="test-control-group">
              <label>Boost Multiplier: {testSettings.boostMultiplier.toFixed(1)}x</label>
              <input
                type="range"
                min="1"
                max="3"
                step="0.1"
                value={testSettings.boostMultiplier}
                onChange={(e) => setTestSettings({ ...testSettings, boostMultiplier: parseFloat(e.target.value) })}
                className="test-slider"
              />
            </div>

            <div className="test-control-group">
              <label>Progress per Pull: ${testSettings.progressPerPull}</label>
              <input
                type="range"
                min="1"
                max="50"
                step="1"
                value={testSettings.progressPerPull}
                onChange={(e) => setTestSettings({ ...testSettings, progressPerPull: parseInt(e.target.value) })}
                className="test-slider"
              />
            </div>
          </section>

          {/* Telemetry Preview */}
          <section className="test-section">
            <h3>Telemetry Preview</h3>
            
            <div className="test-telemetry">
              <div className="test-telemetry-item">
                <span className="test-telemetry-label">Estimated pulls to fill:</span>
                <span className="test-telemetry-value">{estimatedPullsToFill}</span>
              </div>
              <div className="test-telemetry-item">
                <span className="test-telemetry-label">Avg unlucky pulls before reward:</span>
                <span className="test-telemetry-value">{averageUnluckyPulls}</span>
              </div>
              <div className="test-telemetry-item">
                <span className="test-telemetry-label">Boost trigger frequency:</span>
                <span className="test-telemetry-value">{boostTriggerFrequency}</span>
              </div>
              <div className="test-telemetry-item">
                <span className="test-telemetry-label">Current progress:</span>
                <span className="test-telemetry-value">${state.currentProgress.toFixed(2)} / ${MAX_PROGRESS}</span>
              </div>
              <div className="test-telemetry-item">
                <span className="test-telemetry-label">Current milestone:</span>
                <span className="test-telemetry-value">{state.currentMilestoneIndex + 1} / {MILESTONES.length}</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
