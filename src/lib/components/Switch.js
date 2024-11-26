"use client";
import React from 'react';

export function Switch({ state, onChange }) {
  return (
    <div className="form-check form-switch">
      <input
        className="form-check-input"
        type="checkbox"
        id="flexSwitchCheckChecked"
        checked={state}
        onChange={onChange}
      />
      <label className="form-check-label" htmlFor="flexSwitchCheckChecked">
        {/* {state ? 'Enabled' : 'Disabled'} */}
      </label>
    </div>
  );
}