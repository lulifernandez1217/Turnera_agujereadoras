import React from "react";
import type { Student } from "../types";

interface Props {
  students: Student[];
}

const StudentList: React.FC<Props> = ({ students }) => (
  <div className="students-list card">
    <h3>Student</h3>
    <ul>
      {students.map((m) => (
        <li key={m.id} className="students-row">
          <div>
            <strong>{m.name}</strong>
            <div className="muted">ID: {m.id}</div>
          </div>
        </li>
      ))}
    </ul>
  </div>
);

export default StudentList;
