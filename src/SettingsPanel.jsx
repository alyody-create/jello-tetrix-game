import React from 'react';

const SettingsPanel = ({ settings, updateSettings }) => {
  return (
    <div className="panel-section">
      <h3>Settings</h3>
      <div className="settings-section">
        <div className="setting-item">
          <label>Volume</label>
          <input
            type="range"
            min="0"
            max="100"
            value={settings.volume * 100}
            onChange={(e) => updateSettings({ volume: e.target.value / 100 })}
          />
        </div>
        <div className="setting-item">
          <label>Particles</label>
          <input
            type="checkbox"
            checked={settings.particles}
            onChange={(e) => updateSettings({ particles: e.target.checked })}
          />
        </div>
        <div className="setting-item">
          <label>Difficult Mode</label>
          <input
            type="checkbox"
            checked={settings.difficultMode}
            onChange={(e) => updateSettings({ difficultMode: e.target.checked })}
          />
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;