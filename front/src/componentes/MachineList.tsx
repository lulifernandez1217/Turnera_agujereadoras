import React from "react";
import type { Machine } from "../types";

interface Props {
  machines: Machine[];
}

const MachineList: React.FC<Props> = ({ machines }) => (
  <div className="machine-list card">
    <h3>Máquinas</h3>
    <ul>
      {machines.map((m) => (
        <li key={m.id} className="machine-row">
          <span className="swatch" style={{ background: m.color }} />
          <div>
            <strong>{m.name}</strong>
            <div className="muted">ID: {m.id}</div>
          </div>
        </li>
      ))}
    </ul>
  </div>
);

export default MachineList;
